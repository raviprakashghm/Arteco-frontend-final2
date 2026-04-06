import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, LogOut, Package, Settings, Edit3, Mail, Trash2, AlertCircle, Check } from "lucide-react";
import { updateEmail, deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface OrderRecord {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
  payment_method?: string;
  otp?: string;
  deliveryDetails: { address: string; phone: string; pincode: string };
  expectedDelivery?: string;
}

const Profile = () => {
  const { user, logout, updateProfile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const [whatsappEnabled, setWhatsappEnabled] = useState(() =>
    localStorage.getItem("arteco_whatsapp_notif") !== "false"
  );
  const [emailEnabled, setEmailEnabled] = useState(() =>
    localStorage.getItem("arteco_email_notif") !== "false"
  );
  const [newEmail, setNewEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    setActiveTab(searchParams.get("tab") || "orders");
  }, [searchParams]);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    college: user?.college || "",
  });

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
      // THE "INSTANT SYNC": Poll status every 4 seconds for a fast, responsive experience
      const statusPoll = setInterval(fetchOrders, 4000);
      return () => clearInterval(statusPoll);
    }
  }, [user]);

  const handleToggleWhatsapp = (val: boolean) => {
    setWhatsappEnabled(val);
    localStorage.setItem("arteco_whatsapp_notif", String(val));
    toast.success(val ? "WhatsApp alerts enabled" : "WhatsApp alerts disabled");
  };

  const handleToggleEmail = (val: boolean) => {
    setEmailEnabled(val);
    localStorage.setItem("arteco_email_notif", String(val));
    toast.success(val ? "Email notifications enabled" : "Email notifications disabled");
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders?email=${user?.email}`);
        if (res.ok) {
          const data = await res.json();
          // Status updates from admin are primary, so we use data first
          const formattedData = await Promise.all(data.map(async (o: any) => {
            // Add back the master bridge! If DB exists but is lagging OR if Admin locked it locally:
            const adminLocks = JSON.parse(localStorage.getItem("admin_status_locks") || "{}");
            const currentStatus = adminLocks[o.order_id || o.id] || o.status;
            
            let deliveryOtpText = null;
            if (currentStatus?.toLowerCase() === 'out for delivery') {
              try {
                const otpRes = await fetch(`${API_BASE_URL}/api/orders/${o.order_id || o.id}/delivery-otp`);
                const otpData = await otpRes.json();
                if (otpData.otp) deliveryOtpText = otpData.otp;
              } catch (e) {}
              if (!deliveryOtpText && typeof window !== "undefined") {
                deliveryOtpText = localStorage.getItem(`delivery_otp_${o.order_id || o.id}`);
              }
            }

            return {
              id: o.order_id || o.id,
              date: o.created_at || o.date,
              total: o.amount,
              status: currentStatus, // 💡 FORCE OVERRIDE
              payment_method: o.razorpay_payment_id === 'COD' ? 'COD' : 'Online',
              otp: deliveryOtpText,
              items: o.items || [],
              deliveryDetails: o.shipping_address ? { address: o.shipping_address, phone: o.phone || '', pincode: '' } : o.deliveryDetails,
              expectedDelivery: o.expected_delivery_date
            };
          }));
          
          setOrders(formattedData);
        } else {
          const savedOrders = JSON.parse(localStorage.getItem(`orders_${user?.email}`) || "[]");
          const adminLocks = JSON.parse(localStorage.getItem("admin_status_locks") || "{}");
          
          const formattedFallback = savedOrders.map((o: any) => ({
             ...o,
             status: adminLocks[o.id] || o.status,
             otp: adminLocks[o.id] === 'Out for Delivery' || o.status === 'Out for Delivery' ? localStorage.getItem(`delivery_otp_${o.id}`) : o.otp,
             payment_method: o.payment_method || o.paymentMethod || 'Online'
          }));
          setOrders(formattedFallback);
        }
    } catch (err) {
      const savedOrders = JSON.parse(localStorage.getItem(`orders_${user?.email}`) || "[]");
      const adminLocks = JSON.parse(localStorage.getItem("admin_status_locks") || "{}");
      
      const formattedFallback = savedOrders.map((o: any) => ({
         ...o,
         status: adminLocks[o.id] || o.status,
         otp: adminLocks[o.id] === 'Out for Delivery' || o.status === 'Out for Delivery' ? localStorage.getItem(`delivery_otp_${o.id}`) : o.otp,
         payment_method: o.payment_method || o.paymentMethod || 'Online'
      }));
      setOrders(formattedFallback);
    }
  };

  const getOrderStatusProgress = (status: string) => {
    if (!status) return 0;
    const s = status.toLowerCase().trim();
    // 💡 THE "MASTERCARD" STAGES MAPPING:
    if (s === 'placed') return 0;
    if (s === 'processing') return 1;
    if (s === 'dispatched') return 2;
    if (s === 'shipped') return 3; // 🎯 FORCED STAGE 4
    if (s === 'out for delivery') return 4;
    if (s === 'delivered') return 5;
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Profile updated!");
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you strictly sure you want to delete your account? This cannot be undone.")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/users/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user?.email, email: user?.email })
        });
        if(auth.currentUser) await deleteUser(auth.currentUser);
        await logout();
        toast.success("Account securely deleted");
        navigate("/");
      } catch (e: any) {
        toast.error("Error deleting account. Re-authenticate and try again.");
      }
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setEmailLoading(true);
    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, newEmail);
        toast.success("Email successfully updated to " + newEmail);
        setIsEditingEmail(false);
        setNewEmail("");
      }
    } catch (e: any) {
      if (e.code === "auth/requires-recent-login") {
        toast.error("For security, please log out and log back in, then try changing your email.");
      } else {
        toast.error(e.message || "Failed to update email.");
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handleCancelOrder = async (id: string, paymentMethod: string, status: string) => {
    const isCOD = paymentMethod === "COD" || paymentMethod === "Cash on Delivery";

    if (status?.toLowerCase() === 'delivered') {
      let upiId = "";
      if (isCOD) {
        const input = window.prompt("To process a return for a COD order, please enter your UPI ID for the refund:");
        if (!input) {
           toast.error("Return cancelled. UPI ID is required for COD refunds.");
           return;
        }
        upiId = input;
      }
      
      const msg = isCOD 
        ? `Request return and refund to UPI ID: ${upiId}? (Time limit: 3 Days)` 
        : `Request return and refund to your original online payment method? (Time limit: 3 Days)`;

      if (window.confirm(msg)) {
        try {
          await fetch(`${API_BASE_URL}/api/orders/${id}/request-return`, { 
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ upiId: isCOD ? upiId : 'Original Source' })
          });
        } catch(e) {}
        
        toast.success("Return requested! Admin will review it.");
        const locks = JSON.parse(localStorage.getItem("admin_status_locks") || "{}");
        locks[id] = "Return Requested";
        localStorage.setItem("admin_status_locks", JSON.stringify(locks));
        
        fetchOrders();
      }
      return;
    }

    const cancelMsg = isCOD ? "Are you sure you want to cancel this order?" : "Are you sure you want to cancel this order and request a refund to your original payment method?";

    if (window.confirm(cancelMsg)) {
      try {
        if (!isCOD) {
          toast.info("Requesting Refund from Admin...");
          try { await fetch(`${API_BASE_URL}/api/orders/${id}/request-refund`, { method: "POST" }); } catch(err){}
          toast.success("Refund Requested! It will be paid within 5 days.");
          
          const locks = JSON.parse(localStorage.getItem("admin_status_locks") || "{}");
          locks[id] = "Refund Requested";
          localStorage.setItem("admin_status_locks", JSON.stringify(locks));
        } else {
            try {
              await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
                  method: "PUT", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: "Cancelled" })
              });
            } catch(e) {}
            toast.success("Order cancelled!");
            
            const locks = JSON.parse(localStorage.getItem("admin_status_locks") || "{}");
            locks[id] = "Cancelled";
            localStorage.setItem("admin_status_locks", JSON.stringify(locks));
        }
        fetchOrders();
      } catch (err) {
        toast.error("Error cancelling order");
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
          <AnimatedSection>
            {/* Header Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-12 bg-card border border-border p-6 rounded-2xl">
              <div className="flex items-center gap-5">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold uppercase tracking-wider">{user?.name}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive text-sm font-semibold rounded-lg hover:bg-destructive shadow-sm hover:text-white transition-all">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/50 mb-8 overflow-x-auto scrollbar-hide">
              {[
                { id: "orders", label: "Your Orders", icon: Package },
                { id: "profile", label: "Profile Info", icon: User },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchParams({ tab: tab.id });
                  }}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/30 rounded-2xl border border-border/50">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">Explore our offerings and place your first order.</p>
                      <button onClick={() => navigate("/shop")} className="btn-primary px-8">Browse Shop</button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="bg-secondary/40 px-6 py-4 flex flex-wrap justify-between gap-4 border-b border-border">
                          <div className="flex-1 min-w-[120px]">
                            <p className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">Order ID</p>
                            <p className="text-sm font-bold mt-1">#{order.id}</p>
                          </div>
                          <div className="flex-1 min-w-[120px]">
                            <p className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">Date</p>
                            <p className="text-sm font-bold mt-1">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">Total</p>
                            <p className="text-sm font-bold mt-1 text-primary">₹{order.total}</p>
                          </div>
                          <div className="flex-1 min-w-[120px]">
                            <p className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">Status</p>
                            <div className="flex flex-col gap-2 mt-1">
                              <span className={`inline-flex items-center justify-center px-1 md:px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-semibold border w-fit whitespace-nowrap ${
                                order.status === 'Cancelled' ? 'bg-destructive/10 text-destructive border-destructive/20' 
                                : order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : order.status === 'Refunded' || order.status === 'Refund Complete' ? 'bg-blue-500/10 text-blue-400 border-blue-400/20'
                                : order.status === 'Return Requested' || order.status === 'Refund Requested' || order.status === 'Return Approved' || order.status === 'Refund Initiated' ? 'bg-orange-500/10 text-orange-400 border-orange-400/20'
                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                              }`}>
                                {order.status === 'Refund Requested' ? 'Cancelled & Refund Requested' : order.status}
                              </span>
                              
                              <div className="flex flex-wrap gap-2">
                                {["Placed", "Processing", "Dispatched", "Shipped"].includes(order.status) && (
                                  <button onClick={() => handleCancelOrder(order.id, order.payment_method || "Online", order.status)} className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 px-2 py-1 rounded transition-colors">
                                    {(order.payment_method === "COD" || order.payment_method === "Cash on Delivery") ? "Cancel Order" : "Cancel & Refund"}
                                  </button>
                                )}
                                
                                {order.status === "Delivered" && (
                                  <button onClick={() => handleCancelOrder(order.id, order.payment_method || "Online", order.status)} className="text-[10px] font-bold tracking-wider uppercase text-primary border border-primary/30 hover:bg-primary/10 px-2 py-1 rounded transition-colors">
                                    Return & Refund
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                            
                            {order.status === 'Cancelled' ? (
                                <div className="py-8 text-center bg-destructive/10 border border-destructive/20 rounded-xl mb-6">
                                  <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2 opacity-80 animate-pulse" />
                                  <p className="text-destructive font-bold text-lg uppercase tracking-widest">Order Cancelled</p>
                                  <p className="text-muted-foreground text-sm mt-1">This order has been terminated.</p>
                                </div>
                            ) : (
                              <div className="mb-8 mt-4 relative">
                                <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-secondary rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all duration-1000" 
                                    style={{ width: `${(getOrderStatusProgress(order.status) / 5) * 100}%` }}
                                  />
                                </div>
                                <div className="relative flex justify-between z-10 w-full text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground gap-1">
                                  {['Placed', 'Processing', 'Dispatched', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                                    const isActive = getOrderStatusProgress(order.status) >= idx;
                                    return (
                                      <div key={idx} className="flex flex-col items-center gap-2 flex-1 text-center min-w-0 relative">
                                        <div className={`w-6 h-6 z-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${isActive ? 'bg-primary text-black ring-4 ring-primary/20' : 'bg-secondary text-muted-foreground'}`}>
                                          {isActive ? '✓' : idx + 1}
                                        </div>
                                        <span className={`hidden md:block ${isActive ? 'text-primary font-bold' : ''}`}>{step}</span>
                                        <span className={`md:hidden ${isActive ? 'text-primary font-bold' : ''}`}>{step.split(' ')[0]}</span>
                                        
                                        {/* OTP Display when out for delivery */}
                                        {step === 'Out for Delivery' && isActive && order.otp && (
                                            <div className="absolute top-10 whitespace-nowrap bg-zinc-900 border border-primary/50 text-white text-xs px-2 py-1 rounded-md mt-2 shadow-xl animate-pulse z-20">
                                              OTP: <span className="font-bold text-primary tracking-widest text-sm">{order.otp}</span>
                                            </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}


                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Ordered Items</h4>
                              <div className="space-y-4">
                                {order.items.map((item: any, i: number) => (
                                  <div key={i} className="flex gap-4">
                                    <img src={item.image || "https://placehold.co/100x100?text=Item"} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-secondary" />
                                    <div>
                                      <p className="font-semibold text-sm">{item.name}</p>
                                      <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ""}</p>
                                      <p className="text-sm font-bold mt-1 text-primary">₹{item.price}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex-1 bg-secondary/20 p-4 rounded-xl border border-border h-fit">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Delivery Information</h4>
                              {order.deliveryDetails ? (
                                <>
                                  <p className="text-sm font-medium">{order.deliveryDetails.address}</p>
                                  {order.deliveryDetails.phone && <p className="text-xs text-muted-foreground mt-1">Ph: {order.deliveryDetails.phone} | Pin: {order.deliveryDetails.pincode}</p>}
                                </>
                              ) : (
                                <p className="text-sm font-medium">N/A</p>
                              )}
                              {order.expectedDelivery && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  <p className="text-xs font-bold text-yellow-500 flex items-center gap-1">⌚ Expected by: {new Date(order.expectedDelivery).toLocaleDateString()}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="max-w-xl">
                  {editing ? (
                    <div className="space-y-5 bg-card border border-border p-6 rounded-2xl">
                      <h3 className="text-lg font-bold mb-4">Edit Information</h3>
                      <div>
                        <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">Full Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="auth-input" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">Phone Number</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="auth-input" placeholder="+91 XXXXX XXXXX" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">College/University</label>
                        <input type="text" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })}
                          className="auth-input" placeholder="Your college name" />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button onClick={handleSave} className="flex-1 btn-primary py-3">Save Changes</button>
                        <button onClick={() => setEditing(false)} className="flex-1 border-2 border-border py-3 rounded-xl font-semibold hover:bg-secondary transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-xl bg-card border border-border p-5 flex items-start justify-between">
                        <div>
                          <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 flex items-center gap-2">
                            Email Address 
                            <Edit3 className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => setIsEditingEmail(!isEditingEmail)} />
                          </p>
                          {isEditingEmail ? (
                            <div className="flex items-center gap-2 mt-1">
                              <input 
                                type="email" 
                                className="auth-input py-1 px-2 text-sm max-w-[200px]" 
                                value={newEmail}
                                placeholder="New Email"
                                onChange={e => setNewEmail(e.target.value)}
                              />
                              <button onClick={handleUpdateEmail} className="text-primary font-bold text-xs hover:underline">Save</button>
                            </div>
                          ) : (
                            <p className="text-base font-medium">{user?.email}</p>
                          )}
                          <p className="text-xs text-primary mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Verified
                          </p>
                        </div>
                      </div>
                      <div className="rounded-xl bg-card border border-border p-5">
                        <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">Phone Number</p>
                        <p className="text-base font-medium">{user?.phone || <span className="text-muted-foreground italic text-sm">Not provided</span>}</p>
                      </div>
                      <div className="rounded-xl bg-card border border-border p-5">
                        <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">College/Institution</p>
                        <p className="text-base font-medium">{user?.college || <span className="text-muted-foreground italic text-sm">Not provided</span>}</p>
                      </div>
                      <div className="pt-2">
                        <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-secondary text-foreground px-6 py-3 rounded-xl font-semibold hover:bg-secondary/80 transition-colors border border-border">
                          <Edit3 className="h-4 w-4" /> Edit Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="max-w-xl space-y-6">

                  {/* Change Email */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Change Email Address</h3>
                    {isEditingEmail ? (
                      <div className="space-y-3">
                        <p className="text-xs text-muted-foreground">Current: <span className="text-foreground font-medium">{user?.email}</span></p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            className="auth-input flex-1"
                            placeholder="Enter new email address"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                          />
                          <button
                            onClick={handleUpdateEmail}
                            disabled={emailLoading}
                            className="px-4 py-2 bg-primary text-black font-bold rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            {emailLoading ? "Saving…" : "Save"}
                          </button>
                        </div>
                        <button onClick={() => { setIsEditingEmail(false); setNewEmail(""); }} className="text-xs text-muted-foreground hover:underline">
                          Cancel
                        </button>
                        <p className="text-xs text-yellow-500 mt-1">⚠️ For security, you may need to re-login before changing email.</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{user?.email}</p>
                          <p className="text-xs text-primary mt-1">✓ Verified</p>
                        </div>
                        <button
                          onClick={() => setIsEditingEmail(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary border border-border rounded-lg hover:bg-white/10 transition-colors font-medium"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Change Email
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Notification Toggles */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Email Notifications</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Receive order receipts and updates via Email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={emailEnabled} onChange={(e) => handleToggleEmail(e.target.checked)} />
                          <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/40 pt-4">
                        <div>
                          <p className="font-semibold text-sm">WhatsApp Alerts</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Receive shipment tracking via WhatsApp message</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={whatsappEnabled} onChange={(e) => handleToggleWhatsapp(e.target.checked)} />
                          <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Danger Zone */}
                  <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-destructive mb-1">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                    </div>
                    <button onClick={handleDeleteAccount} className="bg-destructive text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20 flex items-center gap-2">
                       <Trash2 className="w-4 h-4"/> Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </AnimatedSection>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Profile;
