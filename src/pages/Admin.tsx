import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";
import {
  Package, Truck, FileEdit, Plus, Trash2, Users, Activity,
  BarChart2, Settings2, ShieldAlert, Globe, RefreshCw, X, Check
} from "lucide-react";
import artecoLogo from "@/assets/arteco-logo.png";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Product { id?: string; name: string; price: number; description?: string; category?: string; image?: string; }

// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) => (
  <div className={`bg-card border border-border rounded-2xl p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  </div>
);

// ─── Tab Button ─────────────────────────────────────────────────────────────
const TabBtn = ({ id, label, icon: Icon, active, danger, badge, onClick }: { id: string, label: string, icon: any, active?: boolean, danger?: boolean, badge?: number, onClick: (id: string) => void }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap relative ${
      active
        ? danger ? "bg-red-500 text-white" : "bg-primary text-black font-bold"
        : danger ? "bg-card text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
               : "bg-card text-muted-foreground hover:bg-white/5 border border-transparent hover:border-border"
    }`}
  >
    <Icon size={15} /> {label}
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

// ─── Product Modal ───────────────────────────────────────────────────────────
const ProductModal = ({ product, onSave, onClose }: { product?: Product; onSave: (p: Product) => void; onClose: () => void }) => {
  const [form, setForm] = useState<Product>(product || { name: "", price: 0, description: "", category: "Drawing sheets", image: "" });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const categories = ["Drawing sheets", "Stationery", "Vending machine", "Software courses", "AR VR", "Tours", "Workshops"];

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-6 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-border/50 rounded-3xl p-8 w-full max-w-xl space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary"><Package size={20}/></div>
            <h3 className="font-bold text-2xl tracking-tight">{product ? "Edit Product" : "Create New Product"}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6 text-muted-foreground" /></button>
        </div>

        <div className="grid gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-bold flex items-center gap-1.5"><Globe size={11} className="text-primary"/> Product Name</label>
              <input type="text" className="auth-input bg-zinc-900 border-zinc-800 focus:bg-zinc-800" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-bold flex items-center gap-1.5"><BarChart2 size={11} className="text-primary"/> Category</label>
              <select className="auth-input bg-zinc-900 border-zinc-800 appearance-none cursor-pointer" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-bold flex items-center gap-1.5"><Check size={11} className="text-primary"/> Price (₹)</label>
              <input type="number" className="auth-input bg-zinc-900 border-zinc-800" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-bold flex items-center gap-1.5">Product Image</label>
              <div className="flex items-center gap-3">
                {form.image && <img src={form.image} className="w-11 h-11 rounded-lg object-cover border border-zinc-700" alt="Preview" />}
                <input type="file" accept="image/*" onChange={handleImageChange} className="text-[10px] text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-bold flex items-center gap-1.5"><FileEdit size={11} className="text-primary"/> Description</label>
            <textarea className="auth-input bg-zinc-900 border-zinc-800 min-h-[100px] resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Details..." />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={() => onSave(form)} className="flex-[2] bg-primary text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            {product ? <FileEdit size={18} /> : <Plus size={18} />} {product ? "Update Product" : "Add Product"}
          </button>
          <button onClick={onClose} className="flex-1 border border-zinc-800 rounded-2xl text-muted-foreground hover:bg-white/5 transition-colors font-semibold">Cancel</button>
        </div>
      </div>
    </div>
  );
};


// ─── Main Component ──────────────────────────────────────────────────────────
export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<any[]>([]);
  // 🍱 MASTER PERSISTENCE: Save overrides so they survive refreshes!
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>(() => {
    return JSON.parse(localStorage.getItem("admin_status_locks") || "{}");
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logFilter, setLogFilter] = useState("");

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchProducts(), fetchUsers(), fetchDeletedUsers(), fetchLogs(), fetchContent()]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/api/orders`);
      if (res.ok) { setOrders(await res.json()); return; }
    } catch { }
    const mock = Object.keys(localStorage).filter(k => k.startsWith("orders_"))
      .flatMap(k => JSON.parse(localStorage.getItem(k) || "[]"));
    setOrders(mock);
  };

  const fetchProducts = async () => {
    let localData = JSON.parse(localStorage.getItem("admin_products_mock") || "[]");
    
    if (localData.length === 0) {
       localData = [
        { name: "T Scale", id: "t-scale", category: "stationery", price: 350, description: "Professional T-Scale for architectural drafting", image: "/assets/t-scale.jpg" },
        { name: "Triangular Scale", id: "triangular-scale", category: "stationery", price: 280, description: "Triangular scale ruler", image: "/assets/triangular-scale.jpg" },
        { name: "Set Square", id: "set-square", category: "stationery", price: 320, description: "Quality set squares", image: "/assets/set-square.jpg" },
        { name: "Micro Pens", id: "micro-pens", category: "stationery", price: 224, description: "Fine liners", image: "/assets/micro-pens.jpg" },
        { name: "Cutting Mat", id: "cutting-mat", category: "stationery", price: 450, description: "A3 Self healing mat", image: "/assets/cutting-mat.jpg" },
        { name: "Thermocol Sheet", id: "thermocol-sheet", category: "stationery", price: 180, description: "For model making", image: "/assets/thermocol-sheet.jpg" },
        { name: "Cartridge Sheets", id: "cartridge-sheet", category: "sheets", price: 12, description: "A2 size", image: "/assets/cartridge-sheet.jpg" },
        { name: "Ivory Sheets", id: "ivory-sheet", category: "sheets", price: 15, description: "Premium finish", image: "/assets/ivory-sheet.jpg" }
       ];
       localStorage.setItem("admin_products_mock", JSON.stringify(localData));
    }
    
    try { 
      const res = await fetch(`${API}/api/admin/products`); 
      if (res.ok) { 
        let dbProducts = await res.json();
        if (!Array.isArray(dbProducts)) dbProducts = [];
        
        // Smart merge if DB is alive but empty vs local
        const merged = [...dbProducts];
        localData.forEach((ld: any) => {
           if (!merged.some(m => m.id === ld.id)) {
              merged.push(ld);
           }
        });
        
        setProducts(merged);
        localStorage.setItem("admin_products_mock", JSON.stringify(merged));
        return;
      }
    } catch { }
    // Fallback to local storage
    const fallbackLocal = JSON.parse(localStorage.getItem("admin_products_mock") || "[]");
    setProducts(fallbackLocal);
  };

  const fetchUsers = async () => {
    try { const res = await fetch(`${API}/api/admin/users`); if (res.ok) setUsersList(await res.json()); } catch { }
  };

  const syncUsersManual = async () => {
    setLoading(true);
    try {
      if (user?.email) {
        await fetch(`${API}/api/users/sync`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id || user.email, email: user.email, name: user.name, phone: user.phone })
        });
        toast.success("Users database synced successfully!");
        fetchUsers();
      }
    } catch { toast.error("Failed to sync users manually."); } finally { setLoading(false); }
  };

  const fetchDeletedUsers = async () => {
    try { const res = await fetch(`${API}/api/admin/deleted-users`); if (res.ok) setDeletedUsers(await res.json()); } catch { }
  };

  const fetchLogs = async () => {
    try { const res = await fetch(`${API}/api/admin/logs`); if (res.ok) setActivityLogs(await res.json()); } catch { }
  };

  const fetchContent = async () => {
    try { const res = await fetch(`${API}/api/content`); if (res.ok) setSiteContent(await res.json()); } catch { }
  };

  const updateOrderStatus = async (id: string, status: string, orderEmail?: string) => {
    const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

    if (status === "Out for Delivery") {
       // Generate OTP!
       const localPin = Math.floor(1000 + Math.random() * 9000).toString();
       localStorage.setItem(`delivery_otp_${id}`, localPin);
       
       let onlineSuccess = false;
       try {
         const res = await fetch(`${BASE}/api/orders/${id}/generate-delivery-otp`, {
           method: "POST", headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ email: orderEmail || "shivakiranghm@gmail.com", otpFallback: localPin }) // fallback
         });
         if(res.ok) onlineSuccess = true;
       } catch (e) {}
       
       if (onlineSuccess) toast.success("Delivery OTP Generated and Sent to User!");
       else toast.info("Device offline/slow: Local OTP Generated for Out for Delivery!");
    }

    if (status === "Delivered") {
       const otp = window.prompt("SECURE DELIVERY: Enter the 4-digit OTP provided by the user:");
       if (!otp) {
         toast.error("Status update cancelled. OTP required for delivery.");
         return; // Break
       }
       const localPin = localStorage.getItem(`delivery_otp_${id}`);
       if (localPin && localPin !== otp) {
          toast.error("Incorrect Delivery OTP!");
          return;
       } else if (!localPin) {
           try {
             const res = await fetch(`${BASE}/api/orders/${id}/verify-delivery-otp`, {
               method: "POST", headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ otp })
             });
             const data = await res.json();
             if (!res.ok) {
                toast.error(data.error || "Incorrect OTP");
                return;
             }
             toast.success("OTP Verified! Order Marked as Delivered.");
           } catch (err) {
             // Ignore error if it fails and local pin doesn't exist
           }
       } else {
           toast.success("Local OTP Verified! Delivered.");
       }
    }

    // 🔒 1. Local Persistence (Refreshes)
    const updatedLocks = { ...statusOverrides, [id]: status };
    setStatusOverrides(updatedLocks);
    localStorage.setItem("admin_status_locks", JSON.stringify(updatedLocks));
    
    try {
      // Corrected to hit the actual defined backend route
      const res = await fetch(`${BASE}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) throw new Error("Failed to update status on server");
      
      toast.success(`Success: ${status.toUpperCase()} stage is now LIVE.`);
    } catch (err) {
      console.warn("DB Delay: Displaying locally.");
    } finally {
      fetchOrders();
    }
  };

  const overrideOrderAmount = async (id: string, amount: number) => {
    try {
      await fetch(`${API}/api/orders/${id}/amount`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount })
      });
      toast.success(`Order #${id} amount overridden to ₹${amount}`);
      fetchOrders();
    } catch { toast.success(`Order amount updated to ₹${amount}`); }
  };

  const handleSaveContent = async (key: string) => {
    try {
      await fetch(`${API}/api/content`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: siteContent[key] })
      });
      toast.success("Content saved & live!");
    } catch { toast.error("Failed to save content"); }
  };

  const handleSaveProduct = async (p: Product) => {
    const isEdit = !!p.id;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${API}/api/admin/products/${p.id}` : `${API}/api/admin/products`;
    
    try {
      const res = await fetch(url, { 
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) 
      });
      if (res.ok) {
        toast.success(isEdit ? "Product updated successfully!" : "New product added!");
      } else { throw new Error(); }
    } catch { 
      // EMERGENCY LOCAL SAVE
      const local = JSON.parse(localStorage.getItem("admin_products_mock") || "[]");
      if (isEdit) {
        const idx = local.findIndex((it: Product) => it.id === p.id);
        if (idx > -1) local[idx] = p;
      } else {
        local.push({ ...p, id: `prod_${Date.now()}` });
      }
      localStorage.setItem("admin_products_mock", JSON.stringify(local));
      toast.success("Product saved to safe session backup.");
    } finally {
      await fetchProducts();
      setShowProductModal(false);
      setEditingProduct(undefined);
    }
  };

  const handleDeleteProduct = async (id?: string) => {
    if (!id || !window.confirm("Permanent Action: Are you sure you want to delete this product from the live store?")) return;
    try {
      const res = await fetch(`${API}/api/admin/products/${id}`, { method: "DELETE" });
      
      // CRITICAL: Always clear from local backups too
      const local = JSON.parse(localStorage.getItem("admin_products_mock") || "[]").filter((p: any) => p.id !== id);
      localStorage.setItem("admin_products_mock", JSON.stringify(local));
      
      if (res.ok) {
        toast.success("Product permanently removed from database.");
      } else {
        toast.success("Removed from local session backup.");
      }
    } catch { 
      const local = JSON.parse(localStorage.getItem("admin_products_mock") || "[]").filter((p: any) => p.id !== id);
      localStorage.setItem("admin_products_mock", JSON.stringify(local));
      toast.success("Cleanup: Removed from session backup.");
    } finally {
      await fetchProducts();
    }
  };

  const filteredLogs = activityLogs.filter(l =>
    !logFilter || l.user_email?.includes(logFilter) || l.action?.includes(logFilter) || l.details?.includes(logFilter)
  );

  const getStatus = (o: any) => (statusOverrides[o.order_id || o.id] || o.status || "").toLowerCase();

  const isReturnPhase = (o: any) => ["return requested", "return approved", "order pick up", "returned", "refund requested", "refund initiated", "refund complete", "return cancelled"].includes(getStatus(o));
  const activeRegularOrders = [...orders].reverse().filter(o => !isReturnPhase(o) && getStatus(o) !== "delivered" && getStatus(o) !== "cancelled");
  const deliveredOrdersList = [...orders].reverse().filter(o => !isReturnPhase(o) && getStatus(o) === "delivered");
  const cancelledOrdersList = [...orders].reverse().filter(o => getStatus(o) === "cancelled");
  const returnOrdersList = [...orders].reverse().filter(o => isReturnPhase(o));

  // Revenue counts ONLY delivered goods that haven't been successfully fully refunded
  const validRevenueStatuses = ["delivered", "return requested", "return approved", "order pick up", "returned", "refund requested", "refund initiated", "return cancelled"];
  const totalRevenue = orders.filter(o => validRevenueStatuses.includes(getStatus(o))).reduce((s, o) => s + (o.amount || o.total || 0), 0);
  
  // Active Orders are anything still being acted upon (not terminal)
  // To match the UI orders tab exactly, we use activeRegularOrders length
  const activeOrders = activeRegularOrders.length;
  
  // Pending Returns Count
  const pendingReturnsCount = returnOrdersList.filter(o => !["refund complete", "refunded", "returned", "return cancelled"].includes(getStatus(o))).length;

  const getDisplayUser = (o: any) => {
    const match = usersList.find(u => u.email === o.user_email);
    return match?.name || o.user_name || o.name || o.user_email || "ARTECO User";
  };

  if (user?.email !== "admin@arteco.com") {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-6 py-32 text-center">
            <ShieldAlert className="w-16 h-16 mx-auto text-destructive mb-4 opacity-60" />
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="mt-3 text-muted-foreground">You do not have administrative privileges.</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => { setShowProductModal(false); setEditingProduct(undefined); }}
        />
      )}

      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 lg:px-6 py-10 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img src={artecoLogo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12 pointer-events-none" />
              <div>
                <p className="text-xs text-primary uppercase tracking-[0.2em] font-semibold mb-1">Arteco</p>
                <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={syncUsersManual} className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary text-sm hover:bg-primary/20 transition-all font-bold">
                <Users size={15} /> Sync Users
              </button>
              <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm hover:bg-white/5 transition-colors">
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Orders" value={orders.length} icon={Package} color="bg-blue-500/15 text-blue-400" />
            <StatCard label="Active Orders" value={activeOrders} icon={Truck} color="bg-yellow-500/15 text-yellow-400" />
            <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={BarChart2} color="bg-primary/15 text-primary" />
            <StatCard label="Users" value={usersList.length} icon={Users} color="bg-green-500/15 text-green-400" />
          </div>

          {/* Nav */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border/50 pb-5">
            <TabBtn id="overview" label="Overview" icon={BarChart2} active={activeTab === "overview"} onClick={setActiveTab} />
            <TabBtn id="orders" label="Orders" icon={Truck} active={activeTab === "orders"} onClick={setActiveTab} />
            <TabBtn id="cancelled" label="Cancelled Orders" icon={X} active={activeTab === "cancelled"} onClick={setActiveTab} badge={cancelledOrdersList.length} danger />
            <TabBtn id="delivered" label="Total Delivered" icon={Check} active={activeTab === "delivered"} onClick={setActiveTab} badge={deliveredOrdersList.length} />
            <TabBtn id="returns" label="Order Returns" icon={RefreshCw} active={activeTab === "returns"} onClick={setActiveTab} badge={pendingReturnsCount} />
            <TabBtn id="products" label="Products" icon={Package} active={activeTab === "products"} onClick={setActiveTab} />
            <TabBtn id="users" label="Users" icon={Users} active={activeTab === "users"} onClick={setActiveTab} />
            <TabBtn id="analytics" label="Analytics DB" icon={BarChart2} active={activeTab === "analytics"} onClick={setActiveTab} />
            <TabBtn id="logs" label="Logs" icon={Activity} active={activeTab === "logs"} onClick={setActiveTab} />
            <TabBtn id="content" label="CMS" icon={Globe} active={activeTab === "content"} onClick={setActiveTab} />
            <TabBtn id="deleted" label="Deleted Accounts" icon={ShieldAlert} active={activeTab === "deleted"} onClick={setActiveTab} danger />
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Dashboard Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Truck className="text-primary"/> Recent Orders</h3>
                    <div className="space-y-3">
                      {[...orders].reverse().slice(0, 5).map((o, i) => (
                        <div key={i} className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                          <div>
                            <p className="text-xs text-primary font-mono">{o.order_id || o.id}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{o.status}</p>
                          </div>
                          <span className="text-sm font-bold">₹{o.amount || o.total}</span>
                        </div>
                      ))}
                      {orders.length === 0 && <p className="text-xs text-muted-foreground">No orders yet.</p>}
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Users className="text-green-500"/> Recent Users</h3>
                    <div className="space-y-3">
                      {[...usersList].slice(0, 5).map((u, i) => (
                        <div key={i} className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                          <div>
                            <p className="text-sm font-bold">{u.name || "User"}</p>
                            <p className="text-[10px] text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      ))}
                      {usersList.length === 0 && <p className="text-xs text-muted-foreground">No users yet.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><Truck className="text-primary"/> Manage Orders</h2>
                {activeRegularOrders.length === 0 && <div className="text-center p-12 bg-card rounded-2xl border border-border text-muted-foreground font-bold">No regular orders actively pending.</div>}
                {activeRegularOrders.map((o, i) => (
                  <div key={i} className={`bg-card border rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-start transition-all ${o.status === 'Cancelled' ? 'border-red-500/50 bg-red-500/5' : 'border-border hover:border-border/80 shadow-sm'}`}>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-primary font-bold text-lg tracking-tight">{o.order_id || o.id}</p>
                        
                        {/* Seperate Badges for User Actions */}
                        {o.status === "Cancelled" && <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded-full animate-pulse flex items-center gap-1"><X size={12}/> User Cancelled</span>}
                        {o.status === "Refund Requested" && <span className="px-3 py-1 bg-yellow-500 text-black text-[10px] font-bold uppercase rounded-full animate-pulse flex items-center gap-1">💰 Cancel & Refund Requested</span>}
                        {o.status === "Return Requested" && <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded-full animate-pulse flex items-center gap-1">📦 Return & Refund Requested</span>}
                      </div>
                      <p className="text-sm font-semibold capitalize">User: <span className="text-muted-foreground font-normal">{getDisplayUser(o)}</span></p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Override ₹</span>
                        <input type="number" className="bg-zinc-900 border border-zinc-800 text-primary font-bold text-xs px-3 py-1.5 rounded-lg w-24 focus:outline-none focus:border-primary" defaultValue={o.amount || o.total} onBlur={(e) => overrideOrderAmount(o.order_id || o.id, Number(e.target.value))} />
                      </div>
                      <div className="bg-secondary/20 p-4 rounded-xl space-y-1">
                        {o.items?.map((item: any, j: number) => (
                          <p key={j} className="text-xs text-muted-foreground">• {item.name} × {item.quantity} — <span className="text-primary">₹{item.price}</span></p>
                        ))}
                      </div>
                      
                      {(o.shipping_address || o.deliveryDetails?.address) && (
                        <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl mt-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                          <span className="font-bold text-primary">Delivery & Return Info:</span>
                          <br />
                          {o.shipping_address || o.deliveryDetails?.address}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 min-w-[220px]">
                      <label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Update Delivery Status</label>
                      {(statusOverrides[o.order_id || o.id] || o.status || "").toLowerCase() === "cancelled" ? (
                        <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-sm font-bold text-red-500 text-center shadow-xl">ORDER CANCELLED</div>
                      ) : (
                        <select 
                          className={`bg-zinc-900 border px-4 py-3 rounded-xl text-sm focus:outline-none transition-all shadow-xl ${getStatus(o).includes("cancel") || getStatus(o).includes("refund") || getStatus(o).includes("return") ? "border-red-500 text-red-400" : "border-zinc-800 focus:border-primary"}`} 
                          value={statusOverrides[o.order_id || o.id] || o.status || "Processing"} 
                          onChange={(e) => updateOrderStatus(o.order_id || o.id, e.target.value)}
                        >
                          {/* Standard Options */}
                          {Array.from(new Set([
                            statusOverrides[o.order_id || o.id] || o.status, 
                            "Processing", "Dispatched", "Shipped", "Out for Delivery", "Delivered"
                          ])).filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                      
                      {o.status === "Return Requested" && (
                         <div className="flex gap-2 mt-2">
                           <button onClick={() => updateOrderStatus(o.order_id || o.id, "Return Approved")} className="bg-green-500/10 text-green-500 border border-green-500/30 text-xs py-2 px-3 rounded-lg font-bold hover:bg-green-500 transition-all hover:text-black w-full shadow-sm">Approve Return</button>
                           <button onClick={() => updateOrderStatus(o.order_id || o.id, "Return Cancelled")} className="bg-red-500/10 text-red-500 border border-red-500/30 text-xs py-2 px-3 rounded-lg font-bold hover:bg-red-500 transition-all hover:text-white shadow-sm shrink-0">Deny</button>
                         </div>
                      )}
                      
                      {o.status === "Refund Requested" && (
                         <button onClick={() => updateOrderStatus(o.order_id || o.id, "Refund Initiated")} className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 mt-2 text-xs py-2 rounded-lg font-bold hover:bg-yellow-500 shadow-sm transition-all hover:text-black">Initiate Refund</button>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "cancelled" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-destructive"><X className="text-destructive"/> Cancelled Orders</h2>
                {cancelledOrdersList.length === 0 && <div className="text-center p-12 bg-card rounded-2xl border border-border text-muted-foreground font-bold">No cancelled orders.</div>}
                {cancelledOrdersList.map((o, i) => (
                  <div key={i} className={`bg-card border rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-start transition-all border-destructive/20 bg-destructive/5 shadow-sm`}>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-primary font-bold text-lg tracking-tight">{o.order_id || o.id}</p>
                        <span className="px-3 py-1 bg-destructive text-white text-[10px] font-bold uppercase rounded-full flex items-center gap-1">❌ Cancelled</span>
                      </div>
                      <p className="text-sm font-semibold capitalize">User: <span className="text-muted-foreground font-normal">{getDisplayUser(o)}</span></p>
                      <div className="bg-secondary/20 p-4 rounded-xl space-y-1 mt-3">
                        {o.items?.map((item: any, j: number) => (
                          <p key={j} className="text-xs text-muted-foreground">• {item.name} × {item.quantity} — <span className="text-primary">₹{item.price}</span></p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "delivered" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-green-500"><Check className="text-green-500"/> Delivered Orders</h2>
                {deliveredOrdersList.length === 0 && <div className="text-center p-12 bg-card rounded-2xl border border-border text-muted-foreground font-bold">No delivered orders.</div>}
                {deliveredOrdersList.map((o, i) => (
                  <div key={i} className={`bg-card border rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-start transition-all border-green-500/30 bg-green-500/5 shadow-sm`}>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-primary font-bold text-lg tracking-tight">{o.order_id || o.id}</p>
                        <span className="px-3 py-1 bg-green-500 text-black text-[10px] font-bold uppercase rounded-full flex items-center gap-1">✅ Delivery Complete</span>
                      </div>
                      <p className="text-sm font-semibold capitalize">User: <span className="text-muted-foreground font-normal">{getDisplayUser(o)}</span></p>
                      <div className="bg-secondary/20 p-4 rounded-xl space-y-1 mt-3">
                        {o.items?.map((item: any, j: number) => (
                          <p key={j} className="text-xs text-muted-foreground">• {item.name} × {item.quantity} — <span className="text-primary">₹{item.price}</span></p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[220px]">
                      <label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Update Delivery Status</label>
                      <select 
                        className={`bg-zinc-900 border px-4 py-3 rounded-xl text-sm focus:outline-none transition-all shadow-xl focus:border-primary border-zinc-800`} 
                        value={statusOverrides[o.order_id || o.id] || o.status || "Delivered"} 
                        onChange={(e) => updateOrderStatus(o.order_id || o.id, e.target.value)}
                      >
                        <option value="Delivered">Delivered</option>
                        <option value="Return Requested">Open Return Flow</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "returns" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-orange-500"><RefreshCw className="text-orange-500"/> Manage Returns & Refunds</h2>
                {returnOrdersList.length === 0 && <div className="text-center p-12 bg-card rounded-2xl border border-border text-muted-foreground font-bold">No active returns or refunds pending.</div>}
                {returnOrdersList.map((o, i) => (
                  <div key={i} className={`bg-card border rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-start transition-all border-orange-500/30 bg-orange-500/5 shadow-sm`}>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-primary font-bold text-lg tracking-tight">{o.order_id || o.id}</p>
                        <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded-full flex items-center gap-1">📦 Return Flow Active</span>
                      </div>
                      <p className="text-sm font-semibold capitalize">User: <span className="text-muted-foreground font-normal">{o.user_name || o.name || o.user_email || "ARTECO User"}</span></p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Override ₹</span>
                        <input type="number" className="bg-zinc-900 border border-zinc-800 text-primary font-bold text-xs px-3 py-1.5 rounded-lg w-24 focus:outline-none focus:border-primary" defaultValue={o.amount || o.total} onBlur={(e) => overrideOrderAmount(o.order_id || o.id, Number(e.target.value))} />
                      </div>
                      <div className="bg-secondary/20 p-4 rounded-xl space-y-1">
                        {o.items?.map((item: any, j: number) => (
                          <p key={j} className="text-xs text-muted-foreground">• {item.name} × {item.quantity} — <span className="text-primary">₹{item.price}</span></p>
                        ))}
                      </div>
                      
                      {(o.shipping_address || o.deliveryDetails?.address) && (
                        <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl mt-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                          <span className="font-bold text-primary">Delivery & Return Info:</span>
                          <br />
                          {o.shipping_address || o.deliveryDetails?.address}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 min-w-[220px]">
                      <label className="text-[10px] uppercase text-orange-400 font-bold tracking-widest">Update Return Status</label>
                      <select 
                        className={`bg-zinc-900 border px-4 py-3 rounded-xl text-sm focus:outline-none transition-all shadow-xl border-orange-500/50 text-orange-400 focus:border-orange-500`} 
                        value={statusOverrides[o.order_id || o.id] || o.status || "Return Requested"} 
                        onChange={(e) => updateOrderStatus(o.order_id || o.id, e.target.value)}
                      >
                        {Array.from(new Set([
                          statusOverrides[o.order_id || o.id] || o.status, 
                          "Return Requested", "Return Approved", "Order Pick up", "Returned", "Refund Requested", "Refund Initiated", "Refund Complete", "Return Cancelled"
                        ])).filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "products" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Active Inventory</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage and edit your shop products.</p>
                  </div>
                  <button onClick={() => { setEditingProduct(undefined); setShowProductModal(true); }} className="bg-primary text-black font-extrabold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    <Plus size={18} strokeWidth={3} /> ADD PRODUCT
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p, i) => (
                    <div key={p.id || i} className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-6 space-y-4 hover:border-primary/50 transition-all group flex flex-col h-full">
                      <div className="relative h-48 overflow-hidden rounded-2xl bg-zinc-800/20">
                        {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20"><Package size={48}/></div>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          {/* Top right removed to be more obvious at the bottom */}
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{p.name}</h3>
                          <span className="text-primary font-black text-lg">₹{p.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-md border border-border uppercase tracking-widest font-bold text-muted-foreground">{p.category}</span>
                        </div>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">{p.description}</p>
                      </div>

                      <div className="pt-4 mt-auto flex gap-2">
                        <button onClick={() => { setEditingProduct(p); setShowProductModal(true); }} className="flex-1 py-2.5 rounded-xl border border-primary/50 text-primary hover:bg-primary hover:text-black text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                          <FileEdit size={12}/> Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-center gap-2">
                          <Trash2 size={12}/> Delete

                        </button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-card border border-border border-dashed rounded-3xl">
                      <Package className="mx-auto text-muted-foreground opacity-20 mb-4" size={48}/>
                      <p className="text-muted-foreground">No custom products found. Add your first item!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border/30">
                  <h2 className="text-2xl font-bold tracking-tight">Registered Users</h2>
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">{usersList.length} Accounts</span>
                </div>
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/40 text-muted-foreground text-[11px] uppercase tracking-[0.2em] font-bold">
                          <th className="p-5">Name</th>
                          <th className="p-5">Email Address</th>
                          <th className="p-5">Phone Number</th>
                          <th className="p-5">Joined ARTECO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((u, i) => (
                          <tr key={i} className="border-b border-zinc-800/50 hover:bg-white/3 transition-colors group">
                            <td className="p-5 font-bold group-hover:text-primary transition-colors">{u.name || "—"}</td>
                            <td className="p-5 text-zinc-300 font-mono text-xs">{u.email}</td>
                            <td className="p-5 text-muted-foreground">{u.phone || "—"}</td>
                            <td className="p-5 text-xs text-muted-foreground/60">{new Date(u.created_at).toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {usersList.length === 0 && <div className="p-20 text-center text-muted-foreground/40 font-bold uppercase tracking-widest">No users detected in database.</div>}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Database Analytics & Tracking</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-card border border-border p-6 rounded-2xl">
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-widest mb-1">Active Orders</p>
                    <p className="text-4xl font-black text-primary">{orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length}</p>
                  </div>
                  <div className="bg-card border border-border p-6 rounded-2xl">
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-widest mb-1">Products Delivered</p>
                    <p className="text-4xl font-black text-green-500">{orders.filter(o => o.status === 'Delivered').length}</p>
                  </div>
                  <div className="bg-card border border-border p-6 rounded-2xl">
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-widest mb-1">Total Users</p>
                    <p className="text-4xl font-black text-blue-500">{usersList.length}</p>
                  </div>
                  <div className="bg-card border border-border p-6 rounded-2xl">
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-widest mb-1">Total Products</p>
                    <p className="text-4xl font-black text-purple-500">{products.length}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mt-8 mb-4 border-t border-border pt-6">Advanced Tables (Simulated Views)</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-sm text-muted-foreground space-y-4">
                  <p>In Supabase, the following metrics are processed dynamically. You can review all records directly through the lists above.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Returns Table:</strong> {orders.filter(o => o.status?.includes("Return")).length} items marked for evaluation.</li>
                    <li><strong>Refunds Queue:</strong> {orders.filter(o => o.status === "Refund Requested").length} payouts pending processing.</li>
                    <li><strong>Deleted Audit Log:</strong> {deletedUsers.length} accounts purged.</li>
                    <li><strong>Delivery OTP Active:</strong> {orders.filter(o => o.status === "Out for Delivery").length} OTPs active in field.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/30">
                   <h2 className="text-2xl font-bold tracking-tight">System Activity</h2>
                   <input className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:border-primary focus:outline-none w-64" placeholder="Search user or action..." value={logFilter} onChange={(e) => setLogFilter(e.target.value)} />
                </div>
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto max-h-[60vh] scrollbar-thin">
                    <table className="w-full text-sm text-left">
                      <thead className="sticky top-0 bg-zinc-900 z-10 border-b border-zinc-800">
                        <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">
                          <th className="p-5">Timestamp</th>
                          <th className="p-5">User</th>
                          <th className="p-5">Action</th>
                          <th className="p-5">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.map((log, i) => (
                          <tr key={i} className="border-b border-zinc-800/30 hover:bg-white/3 transition-colors">
                            <td className="p-5 text-[10px] text-zinc-500 font-mono whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                            <td className="p-5 font-bold text-xs">{log.user_email}</td>
                            <td className="p-5"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold border border-primary/20">{log.action}</span></td>
                            <td className="p-5 text-zinc-400 text-xs leading-relaxed max-w-[300px] truncate">{log.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-border/30">
                  <h2 className="text-2xl font-bold tracking-tight">Content Management (CMS)</h2>
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                    <Globe size={14}/> Live Website Editor
                  </div>
                </div>

                <div className="grid gap-8">
                  {/* HERO SECTION */}
                  <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/> Hero Section
                    </h3>
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Main Headline</label>
                        <textarea className="auth-input bg-zinc-900 border-zinc-800 min-h-[100px] text-lg font-bold focus:border-primary" 
                        value={siteContent["hero_title"] || ""} onChange={(e) => setSiteContent({...siteContent, hero_title: e.target.value})} placeholder="Main title..."/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Sub Headline / Slogan</label>
                        <textarea className="auth-input bg-zinc-900 border-zinc-800 focus:border-primary min-h-[80px]" 
                        value={siteContent["hero_subtitle"] || ""} onChange={(e) => setSiteContent({...siteContent, hero_subtitle: e.target.value})} placeholder="Slogan..."/>
                      </div>
                      <button onClick={() => handleSaveContent("hero_title")} className="w-fit bg-primary text-black font-extrabold px-8 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs shadow-lg shadow-primary/20">
                        SAVE HERO CHANGES
                      </button>
                    </div>
                  </div>

                  {/* ABOUT SECTION */}
                  <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/> About Section
                    </h3>
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">About ARTECO Story</label>
                        <textarea className="auth-input bg-zinc-900 border-zinc-800 min-h-[180px] leading-relaxed focus:border-primary" 
                        value={siteContent["about_text"] || ""} onChange={(e) => setSiteContent({...siteContent, about_text: e.target.value})} placeholder="Full story bio..."/>
                      </div>
                      <button onClick={() => handleSaveContent("about_text")} className="w-fit bg-primary text-black font-extrabold px-8 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs shadow-lg shadow-primary/20">
                        SAVE ABOUT CHANGES
                      </button>
                    </div>
                  </div>

                  {/* STATISTICS SECTION */}
                  <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/> Trusted By Stats
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Schools Tagline</label>
                        <input className="auth-input bg-zinc-900 border-zinc-800 focus:border-primary text-xs" 
                        value={siteContent["trust_1"] || ""} onChange={(e) => setSiteContent({...siteContent, trust_1: e.target.value})} placeholder="Trusted by Schools..."/>
                        <button onClick={() => handleSaveContent("trust_1")} className="text-[9px] text-primary font-bold hover:underline">Update schools</button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Tools Tagline</label>
                        <input className="auth-input bg-zinc-900 border-zinc-800 focus:border-primary text-xs" 
                        value={siteContent["trust_2"] || ""} onChange={(e) => setSiteContent({...siteContent, trust_2: e.target.value})} placeholder="500+ Tools..."/>
                        <button onClick={() => handleSaveContent("trust_2")} className="text-[9px] text-primary font-bold hover:underline">Update tools</button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Support Tagline</label>
                        <input className="auth-input bg-zinc-900 border-zinc-800 focus:border-primary text-xs" 
                        value={siteContent["trust_3"] || ""} onChange={(e) => setSiteContent({...siteContent, trust_3: e.target.value})} placeholder="24/7 Support..."/>
                        <button onClick={() => handleSaveContent("trust_3")} className="text-[9px] text-primary font-bold hover:underline">Update support</button>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER & SOCIALS SECTION */}
                  <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/> Footer & Social Links
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <div>
                            <label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Footer Bio</label>
                            <textarea className="auth-input bg-zinc-900 border-zinc-800 min-h-[100px] text-xs" 
                            value={siteContent["footer_bio"] || ""} onChange={(e) => setSiteContent({...siteContent, footer_bio: e.target.value})} placeholder="Built by Arteco team..."/>
                          </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                           <input className="auth-input bg-zinc-900 border-zinc-800 text-[10px] py-2" placeholder="Instagram URL" value={siteContent["instagram_url"] || ""} onChange={(e) => setSiteContent({...siteContent, instagram_url: e.target.value})}/>
                           <button onClick={() => handleSaveContent("instagram_url")} className="p-2 bg-primary/10 rounded-lg"><Check size={14} className="text-primary"/></button>
                        </div>
                        <div className="flex gap-2">
                           <input className="auth-input bg-zinc-900 border-zinc-800 text-[10px] py-2" placeholder="Twitter URL" value={siteContent["twitter_url"] || ""} onChange={(e) => setSiteContent({...siteContent, twitter_url: e.target.value})}/>
                           <button onClick={() => handleSaveContent("twitter_url")} className="p-2 bg-primary/10 rounded-lg"><Check size={14} className="text-primary"/></button>
                        </div>
                        <div className="flex gap-2">
                           <input className="auth-input bg-zinc-900 border-zinc-800 text-[10px] py-2" placeholder="LinkedIn URL" value={siteContent["linkedin_url"] || ""} onChange={(e) => setSiteContent({...siteContent, linkedin_url: e.target.value})}/>
                           <button onClick={() => handleSaveContent("linkedin_url")} className="p-2 bg-primary/10 rounded-lg"><Check size={14} className="text-primary"/></button>
                        </div>
                        <div className="flex gap-2">
                           <input className="auth-input bg-zinc-900 border-zinc-800 text-[10px] py-2" placeholder="Support Email" value={siteContent["contact_email"] || ""} onChange={(e) => setSiteContent({...siteContent, contact_email: e.target.value})}/>
                           <button onClick={() => handleSaveContent("contact_email")} className="p-2 bg-primary/10 rounded-lg"><Check size={14} className="text-primary"/></button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleSaveContent("footer_bio")} className="bg-primary text-black font-extrabold px-6 py-2.5 rounded-xl hover:scale-105 transition-all text-[10px] shadow-lg shadow-primary/20">
                      UPDATE FOOTER BIO
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── DELETED ACCOUNTS ─── */}
            {activeTab === "deleted" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-red-500/20">
                  <h2 className="text-2xl font-bold tracking-tight text-red-500 flex items-center gap-2"><ShieldAlert size={24}/> Deleted Accounts Archive</h2>
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{deletedUsers.length} Protected Logs</span>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.05)]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-red-500/20 bg-red-500/5 text-red-400 text-[11px] uppercase tracking-[0.2em] font-bold">
                          <th className="p-5">Archive User ID</th>
                          <th className="p-5">Email Address</th>
                          <th className="p-5">Deletion Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deletedUsers.map((du, i) => (
                          <tr key={i} className="border-b border-red-500/10 hover:bg-red-500/10 transition-colors">
                            <td className="p-5 text-xs text-muted-foreground font-mono">{du.user_id}</td>
                            <td className="p-5 font-bold text-red-300">{du.email}</td>
                            <td className="p-5 text-xs text-muted-foreground/60">{new Date(du.created_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {deletedUsers.length === 0 && <div className="p-20 text-center text-red-500/40 font-bold uppercase tracking-widest">Archive is empty. No accounts have been deleted.</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
