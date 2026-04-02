import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, HelpCircle, CreditCard, Wallet, Truck } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DELIVERY_FEE = 8;
type PaymentMethod = "UPI" | "CARD" | "COD";

const Checkout = () => {
  const { items, totalPrice, removeItem, clearCart } = useCart();
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to continue checkout");
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) return null;

  const orderTotal = items.length > 0 ? totalPrice + DELIVERY_FEE : 0;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!address || !phone || !pincode) {
      toast.error("Please fill all delivery details");
      return;
    }

    setIsProcessing(true);
    
    if (paymentMethod === "COD") {
      // Direct placement without Razorpay
      await processLocalOrderAndNavigate("Processing");
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      // 1. Create order on Backend
      const res = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: orderTotal, receipt: `receipt_${Date.now()}` })
      });
      const order = await res.json();
      
      if (!order.id) throw new Error("Could not create Razorpay order.");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder", // Typically loaded from env in frontend too or just use placeholder for demo
        amount: order.amount,
        currency: order.currency,
        name: "Arteco",
        description: "A Hub For All Architectural Needs",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  email: user?.email,
                  items,
                  amount: orderTotal,
                  address: `${address}, ${pincode}`,
                  phone
                }
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              toast.success("Payment successful! Auto-downloading receipt...");
              await processLocalOrderAndNavigate("Placed");
            } else {
              toast.error("Payment verification failed.");
              setIsProcessing(false);
            }
          } catch (err) {
            console.error(err);
            toast.error("Error verifying payment.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "",
          contact: phone
        },
        theme: {
          color: "#ffcc00"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed: " + response.error.description);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to initialize payment");
      setIsProcessing(false);
    }
  };

  const processLocalOrderAndNavigate = async (status: string) => {
    const orderId = `ART${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...items],
      total: orderTotal,
      status: status,
      deliveryDetails: { address, phone, pincode },
      paymentMethod
    };

    // Save to Local Storage mockup DB
    const existingOrders = JSON.parse(localStorage.getItem(`orders_${user?.email}`) || "[]");
    localStorage.setItem(`orders_${user?.email}`, JSON.stringify([newOrder, ...existingOrders]));

    // Generate PDF Bill Local Demo
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("ARTECO", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("A Hub For All Architectural Needs", 14, 28);
    
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text("INVOICE / BILL", 14, 40);
    
    doc.setFontSize(10);
    doc.text(`Order ID: ${orderId}`, 14, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 55);
    doc.text(`Customer Name: ${user?.name || 'Guest'}`, 14, 60);
    doc.text(`Phone: ${phone}`, 14, 65);
    doc.text(`Delivery Address: ${address}, ${pincode}`, 14, 70);
    doc.text(`Payment Method: ${paymentMethod}`, 14, 75);

    const tableCols = ["Item", "Size", "Quantity", "Price (INR)"];
    const tableData = items.map(item => [
      item.name,
      item.size || "N/A",
      item.quantity,
      `Rs ${item.price * item.quantity}`
    ]);

    autoTable(doc, {
      startY: 85,
      head: [tableCols],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [255, 204, 0], textColor: [0, 0, 0] }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 85;
    doc.text(`Delivery Fee: Rs ${DELIVERY_FEE}`, 14, finalY + 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: Rs ${orderTotal}`, 14, finalY + 18);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Thank you for shopping with Arteco!", 14, finalY + 30);
    
    doc.save(`Arteco_Bill_${orderId}.pdf`);

    toast.success(`Automated notification sent to ${phone} and email behind the scenes!`);

    clearCart();
    navigate("/order-confirmation", { state: { orderId, amount: orderTotal, itemsCount: items.length, paymentMethod } });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <StepIndicator currentStep={1} />
        
        <div className="container mx-auto px-6 pb-12 flex-1">
          <div className="flex items-center justify-between mb-6">
            <Link to="/cart" className="inline-flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" /> Checkout
            </Link>
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="grid lg:grid-cols-[1fr_420px] gap-8">
            <div className="space-y-6">
              {/* Delivery Form */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold uppercase tracking-wider text-sm mb-5">Delivery Details</h3>
                <form id="checkout-form" onSubmit={handlePay} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">Full Address</label>
                    <textarea 
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="auth-input min-h-[80px] resize-none"
                      placeholder="Room No, Hostel/Building, Street..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">Phone Number</label>
                      <input 
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="auth-input"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">Pincode</label>
                      <input 
                        required
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="auth-input"
                        placeholder="110001"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Cart Items */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-6 lg:mb-0">
                <h3 className="font-bold uppercase tracking-wider text-sm mb-4">Order Items ({items.length})</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Your cart is empty.</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-secondary/20">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-secondary" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ""}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm font-bold text-primary">₹{item.price * item.quantity}</p>
                            <button type="button" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Payment & Summary Container */}
            <div className="space-y-6 lg:sticky lg:top-24 h-fit">
              {/* Payment Methods */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold uppercase tracking-wider text-sm mb-5">Payment Method</h3>
                
                <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === "UPI" ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:border-white/30 text-muted-foreground'}`}
                  >
                    <Wallet className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">UPI / QR</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod("CARD")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === "CARD" ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:border-white/30 text-muted-foreground'}`}
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">Card</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === "COD" ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:border-white/30 text-muted-foreground'}`}
                  >
                    <Truck className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">C.O.D.</span>
                  </button>
                </div>

                {/* Dynamic Payment Body */}
                <div className="bg-black/50 p-5 rounded-xl border border-white/5 min-h-[220px] flex flex-col items-center justify-center text-center">
                  {paymentMethod === "UPI" && (
                    <div className="w-full flex flex-col items-center">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-4">Scan PhonePe QR to Pay Securely</p>
                      <div className="w-48 h-48 bg-white rounded-lg p-2 shadow-xl shrink-0">
                        {/* We use the image from User artifact if available, else generic placeholder */}
                        <img 
                          src="/media__1774532048567.jpg" 
                          alt="UPI QR Code" 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg";
                          }}
                        />
                      </div>
                      
                      {/* Mobile Deep Link Button */}
                      <a 
                        href={`upi://pay?pa=arteco@upi&pn=Arteco&cu=INR&am=${orderTotal.toFixed(2)}`}
                        className="mt-5 bg-gradient-to-r from-[#6739B7] to-[#8C52FF] text-white px-6 py-3 rounded-xl font-bold tracking-wide w-48 text-center hover:scale-[1.03] transition-transform shadow-[0_0_15px_rgba(103,57,183,0.4)]"
                      >
                        PAY NOW 
                        <span className="block text-[10px] font-medium opacity-80 tracking-normal mt-0.5">via GPay, PhonePe, Paytm (Mobile)</span>
                      </a>
                      
                      <p className="text-[10px] text-yellow-500 mt-4">*Click 'Confirm Payment' below after transaction completes.</p>
                    </div>
                  )}

                  {paymentMethod === "CARD" && (
                    <div className="w-full space-y-3">
                      <input type="text" placeholder="Card Number" className="auth-input" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="auth-input" />
                        <input type="text" placeholder="CVV" className="auth-input" />
                      </div>
                      <input type="text" placeholder="Cardholder Name" className="auth-input" />
                    </div>
                  )}

                  {paymentMethod === "COD" && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                      <Truck className="h-10 w-10 text-primary mb-3 opacity-80" />
                      <p className="font-semibold text-sm">Pay seamlessly upon delivery.</p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Ensure you have the exact amount of ₹{orderTotal.toFixed(2)} ready. You can still pay with UPI to the delivery executive!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary & Pay Button */}
              <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-border">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items Price:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee:</span>
                    <span>₹{DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4 mt-2">
                    <span>Order Total</span>
                    <span className="text-primary tracking-wide">₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={items.length === 0 || isProcessing} 
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    isProcessing 
                    ? "bg-primary/50 text-white/50 cursor-not-allowed" 
                    : "bg-primary text-black hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,204,0,0.3)]"
                  }`}
                >
                  {isProcessing ? "Processing Securely..." : `Confirm Payment: ₹${orderTotal.toFixed(2)}`}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;
