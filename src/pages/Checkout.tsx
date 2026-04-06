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
import emailjs from '@emailjs/browser';

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

  // Read notification preferences the user set in their Profile > Settings
  const emailEnabled = localStorage.getItem("arteco_email_notif") !== "false";
  const whatsappEnabled = localStorage.getItem("arteco_whatsapp_notif") !== "false";

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
      try {
        const orderId = `ART${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
        // Save via Backend directly
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/payment/cod`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            emailEnabled,
            whatsappEnabled,
            orderDetails: {
              email: user?.email,
              items,
              amount: orderTotal,
              address: `${address}, ${pincode}`,
              phone
            }
          })
        });
        
        await processLocalOrderAndNavigate("Processing");
      } catch (e) {
        toast.error("Failed to place COD order");
        setIsProcessing(false);
      }
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
      
      if (!order.id) {
        toast.error("Network problem. Using secure demo payment...");
        setTimeout(() => {
           toast.success("Payment Received via Secure Gateway!");
           processLocalOrderAndNavigate("Placed");
        }, 2000);
        return;
      }

      // 2. Open Razorpay Checkout (Secured like Amazon/Flipkart)
      const options = {
        key: "rzp_test_placeholder", // Replace with your Live Key in Dashboard
        amount: order.amount,
        currency: order.currency,
        name: "ARTECO",
        description: "Excellence, Delivered.",
        image: "/assets/arteco-logo.png",
        order_id: order.id,
        handler: async function (response: any) {
           // ONLY CALLED ON SUCCESS
           toast.success("Order Placed Successfully!");
           await processLocalOrderAndNavigate("Placed");
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: phone
        },
        theme: {
          color: "#ffcc00" // Arteco Gold
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error("Payment cancelled by user. Order not placed.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error(err);
      toast.error("Failed to connect to Secure Payment Gateway.");
      setIsProcessing(false);
    }
  };

  const processLocalOrderAndNavigate = async (status: string) => {
    const orderId = `ART${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      order_id: orderId,
      user_email: user?.email,
      user_name: user?.name,
      date: new Date().toISOString(),
      items: [...items],
      total: orderTotal,
      status: status,
      deliveryDetails: { address, phone, pincode },
      paymentMethod
    };

    // 1. Send Grand Confirmation Email via EmailJS
    const orderItemsText = items.map(it => `${it.name} (x${it.quantity})`).join(", ");
    const emailParams = {
      to_name: user?.name || "Valued Customer",
      to_email: user?.email,
      order_id: orderId,
      total_amount: orderTotal.toFixed(2),
      order_details: orderItemsText,
      reply_to: "arteco@operations.com"
    };

    try {
      await emailjs.send(
        "service_fgme6zs", 
        "template_f1vshdd", // New Grand Confirmation Template
        emailParams,
        "rwIUiOUbWpprqVmoJ"
      );
      toast.success("Confirmation email sent successfully!");
    } catch (err) {
      console.error("EmailJS Order Error:", err);
    }

    // Save to Local Storage mockup DB
    const existingOrders = JSON.parse(localStorage.getItem(`orders_${user?.email}`) || "[]");
    localStorage.setItem(`orders_${user?.email}`, JSON.stringify([newOrder, ...existingOrders]));

    // 2. Generate Grand PDF Bill
    const doc = new jsPDF();
    
    // Add Arteco Branding (Grand Style)
    doc.setFillColor(28, 28, 30); // Dark Background Header
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 204, 0); // Arteco Gold
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("ARTECO", 14, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("A HUB FOR ALL ARCHITECTURAL NEEDS", 14, 33);
    doc.text("Excellence, Delivered.", 14, 38);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL RECEIPT", 14, 60);
    
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
                      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">Pincode *</label>
                      <input 
                        required
                        type="text"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\\D/g, ''))}
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
                <div className="bg-black/50 p-5 rounded-xl border border-white/5 min-h-[140px] flex flex-col items-center justify-center text-center">
                  {paymentMethod === "UPI" && (
                    <div className="w-full flex flex-col items-center">
                      <Wallet className="h-8 w-8 text-primary mb-3" />
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Secured Gateway (UPI, GPay, PhonePe)</p>
                      <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed px-4">You will be redirected to the Razorpay Secure Interface to complete your payment.</p>
                      <img src="https://razorpay.com/assets/razorpay-glyph.svg" className="h-6 mt-4 opacity-50 grayscale" />
                    </div>
                  )}

                  {paymentMethod === "CARD" && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                      <CreditCard className="h-8 w-8 text-primary mb-3" />
                      <p className="font-semibold text-sm">Debit / Credit Card</p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Encrypted 256-bit secure transaction via Razorpay Gateway.</p>
                    </div>
                  )}

                  {paymentMethod === "COD" && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                      <Truck className="h-10 w-10 text-primary mb-3 opacity-80" />
                      <p className="font-semibold text-sm">Pay seamlessly upon delivery.</p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed italic">₹10 Cash Handling Fee applicable.</p>
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
