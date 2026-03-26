import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, LogOut, Package, Settings, Edit3 } from "lucide-react";

export interface OrderRecord {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
  deliveryDetails: { address: string; phone: string; pincode: string };
}

const Profile = () => {
  const { user, logout, updateProfile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);

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
      const savedOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || "[]");
      setOrders(savedOrders);
    }
  }, [user]);

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

  const handleCancelOrder = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      const existingOrders = JSON.parse(localStorage.getItem(`orders_${user?.email}`) || "[]");
      const updated = existingOrders.map((o: OrderRecord) => 
        o.id === id ? { ...o, status: "Cancelled" } : o
      );
      localStorage.setItem(`orders_${user?.email}`, JSON.stringify(updated));
      setOrders(updated);
      toast.success("Order has been cancelled successfully!");
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
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                order.status === 'Cancelled' ? 'bg-destructive/10 text-destructive border-destructive/20' 
                                : 'bg-green-500/10 text-green-500 border-green-500/20'
                              }`}>
                                {order.status}
                              </span>
                              {order.status === "Processing" && (
                                <button 
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="text-[10px] font-bold tracking-wider uppercase bg-transparent text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 px-2 py-1 rounded transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Ordered Items</h4>
                          <div className="space-y-4">
                            {order.items.map((item: any, i: number) => (
                              <div key={i} className="flex gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-secondary" />
                                <div>
                                  <p className="font-semibold text-sm">{item.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ""}</p>
                                  <p className="text-sm font-bold mt-1 text-primary">₹{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 pt-4 border-t border-border">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Delivery Informtion</h4>
                            <p className="text-sm font-medium">{order.deliveryDetails.address}</p>
                            <p className="text-xs text-muted-foreground mt-1">Ph: {order.deliveryDetails.phone} | Pin: {order.deliveryDetails.pincode}</p>
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
                          <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">Email Address</p>
                          <p className="text-base font-medium">{user?.email}</p>
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
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border/50 pb-4">
                        <div>
                          <p className="font-semibold text-sm">Email Notifications</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Receive order updates via email</p>
                        </div>
                        <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                          <div className="w-4 h-4 bg-black rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">WhatsApp Alerts</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Receive receipts on WhatsApp</p>
                        </div>
                        <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                          <div className="w-4 h-4 bg-black rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-destructive mb-2">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data.</p>
                    <button className="bg-destructive text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20">
                      Delete Account
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
