import { useState, useEffect, useRef } from "react";
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
const TabBtn = ({ id, label, icon: Icon, active, onClick, danger = false }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
      active
        ? danger ? "bg-red-500 text-white" : "bg-primary text-black font-bold"
        : danger ? "bg-card text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
               : "bg-card text-muted-foreground hover:bg-white/5 border border-transparent hover:border-border"
    }`}
  >
    <Icon size={15} /> {label}
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
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-primary">{product ? "Edit Product" : "Add New Product"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-bold">Product Name</label>
            <input type="text" className="auth-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-bold">Price (₹)</label>
              <input type="number" className="auth-input" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-bold">Select Category</label>
              <select 
                className="auth-input appearance-none bg-black cursor-pointer" 
                value={form.category} 
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-bold">Product Description</label>
            <textarea className="auth-input min-h-[80px] resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Details..." />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-bold">Product Image</label>
            <div className="flex items-center gap-4">
              {form.image && <img src={form.image} className="w-16 h-16 rounded-lg object-cover border border-border" alt="Preview" />}
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border/50">
          <button onClick={() => onSave(form)} className="flex-1 bg-primary text-black font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            <Check size={18} /> {product ? "Update Product" : "Save Product"}
          </button>
          <button onClick={onClose} className="px-6 border border-border rounded-xl text-muted-foreground hover:bg-white/5 transition-colors">Cancel</button>
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
    try { const res = await fetch(`${API}/api/admin/products`); if (res.ok) setProducts(await res.json()); } catch { }
  };

  const fetchUsers = async () => {
    try { 
      const res = await fetch(`${API}/api/admin/users`); 
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      } 
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  const syncUsersManual = async () => {
    setLoading(true);
    try {
      if (user?.email) {
        await fetch(`${API}/api/users/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id || user.email, email: user.email, name: user.name, phone: user.phone })
        });
        toast.success("Users database synced successfully!");
        fetchUsers();
      }
    } catch {
      toast.error("Failed to sync users manually.");
    } finally {
      setLoading(false);
    }
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

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API}/api/orders/${id}/status`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Order #${id} status changed to ${status}`);
        fetchOrders(); // refresh view
      } else {
        toast.error("Failed to update status on server.");
      }
    } catch { 
      toast.error("Network error updating status.");
    }
  };

  const overrideOrderAmount = async (id: string, amount: number) => {
    try {
      await fetch(`${API}/api/orders/${id}/amount`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount })
      });
      toast.success(`Order #${id} cart total overridden to ₹${amount}`);
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
    const method = p.id ? "PUT" : "POST";
    const url = p.id ? `${API}/api/admin/products/${p.id}` : `${API}/api/admin/products`;
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      toast.success(p.id ? "Product updated!" : "Product added!");
      fetchProducts();
    } catch { toast.error("Failed to save product"); }
    setShowProductModal(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = async (id?: string) => {
    if (!id || !window.confirm("Delete this product?")) return;
    try {
      await fetch(`${API}/api/admin/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted");
      fetchProducts();
    } catch { toast.error("Error deleting product"); }
  };

  const filteredLogs = activityLogs.filter(l =>
    !logFilter || l.user_email?.includes(logFilter) || l.action?.includes(logFilter) || l.details?.includes(logFilter)
  );

  const totalRevenue = orders.reduce((s, o) => s + (o.amount || o.total || 0), 0);
  const activeOrders = orders.filter(o => !["Delivered", "Cancelled"].includes(o.status)).length;

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
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img src={artecoLogo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12 pointer-events-none" />
              <div>
                <p className="text-xs text-primary uppercase tracking-[0.2em] font-semibold mb-1">Arteco</p>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={syncUsersManual}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary text-sm hover:bg-primary/20 transition-all font-bold"
              >
                <Users size={15} /> Sync Users
              </button>
              <button
                onClick={fetchAll}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm hover:bg-white/5 transition-colors"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh All
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Orders" value={orders.length} icon={Package} color="bg-blue-500/15 text-blue-400" />
            <StatCard label="Active Orders" value={activeOrders} icon={Truck} color="bg-yellow-500/15 text-yellow-400" />
            <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={BarChart2} color="bg-primary/15 text-primary" />
            <StatCard label="Users" value={usersList.length} icon={Users} color="bg-green-500/15 text-green-400" />
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border/50 pb-5">
            <TabBtn id="overview"   label="Overview"          icon={BarChart2}   active={activeTab === "overview"}       onClick={setActiveTab} />
            <TabBtn id="orders"     label="Orders"            icon={Truck}       active={activeTab === "orders"}         onClick={setActiveTab} />
            <TabBtn id="products"   label="Products"          icon={Package}     active={activeTab === "products"}       onClick={setActiveTab} />
            <TabBtn id="users"      label="Users"             icon={Users}       active={activeTab === "users"}          onClick={setActiveTab} />
            <TabBtn id="logs"       label="Activity Logs"     icon={Activity}    active={activeTab === "logs"}           onClick={setActiveTab} />
            <TabBtn id="content"    label="Site CMS"          icon={Globe}       active={activeTab === "content"}        onClick={setActiveTab} />
            <TabBtn id="deleted"    label="Deleted Accounts"  icon={ShieldAlert} active={activeTab === "deleted"}        onClick={setActiveTab} danger />
          </div>

          {/* ─── OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="text-left p-4">Order ID</th>
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 7).map((o, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                        <td className="p-4 font-mono text-xs text-muted-foreground">{o.order_id || o.id}</td>
                        <td className="p-4 font-medium">{o.user_email || "—"}</td>
                        <td className="p-4 text-primary font-bold">₹{o.amount || o.total}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            o.status === "Delivered" ? "bg-green-500/20 text-green-400" :
                            o.status === "Cancelled" ? "bg-red-500/20 text-red-400" :
                            "bg-yellow-500/20 text-yellow-400"
                          }`}>{o.status || "Processing"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="p-6 text-muted-foreground text-center">No orders yet.</p>}
              </div>

              <h2 className="text-xl font-semibold mt-8">Recent Signups</h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Phone</th>
                      <th className="text-left p-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.slice(0, 7).map((u, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                        <td className="p-4 font-semibold">{u.email}</td>
                        <td className="p-4 text-muted-foreground">{u.phone || "—"}</td>
                        <td className="p-4 text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {usersList.length === 0 && <p className="p-6 text-muted-foreground text-center">No users synced yet.</p>}
              </div>
            </div>
          )}

          {/* ─── ORDERS ─── */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Manage Orders</h2>
              {orders.length === 0 && <p className="text-muted-foreground">No orders found.</p>}
              {orders.map((o, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-start">
                  <div className="flex-1 space-y-2">
                    <p className="font-bold">{o.order_id || o.id}</p>
                    <p className="text-xs text-muted-foreground">User: <span className="text-foreground">{o.user_email || "—"}</span></p>
                    <p className="text-xs text-muted-foreground">Address: <span className="text-foreground">{o.shipping_address || "—"}</span></p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Override Amount ₹</span>
                      <input
                        type="number"
                        className="bg-black/60 border border-border text-primary font-bold text-xs px-2 py-1 rounded w-24 focus:border-primary focus:outline-none"
                        defaultValue={o.amount || o.total}
                        onBlur={(e) => overrideOrderAmount(o.order_id || o.id, Number(e.target.value))}
                      />
                    </div>
                    <p className="text-xs text-yellow-500 mt-1">📦 Expected: {o.expected_delivery_date || "Auto (+6 days)"}</p>
                    {o.items && Array.isArray(o.items) && o.items.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Items</p>
                        {o.items.map((item: any, j: number) => (
                          <p key={j} className="text-xs text-foreground">• {item.name} × {item.quantity} — ₹{item.price}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <label className="text-xs uppercase text-muted-foreground font-semibold">Order Status</label>
                    <select
                      className="bg-black border border-border px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary"
                      value={o.status || "Processing"}
                      onChange={(e) => updateOrderStatus(o.order_id || o.id, e.target.value)}
                    >
                      {["Placed", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── PRODUCTS ─── */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Manage Products</h2>
                <button
                  onClick={() => { setEditingProduct(undefined); setShowProductModal(true); }}
                  className="bg-primary text-black font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary/90"
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>
              {products.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-2xl">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-40" />
                  <p className="text-muted-foreground">No products in database yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((p, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:border-primary/40 transition-colors">
                      {p.image && <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded-xl bg-secondary" />}
                      <p className="font-bold">{p.name}</p>
                      <p className="text-sm text-primary font-bold">₹{p.price}</p>
                      {p.category && <span className="text-xs bg-secondary px-2 py-0.5 rounded-full border border-border">{p.category}</span>}
                      {p.description && <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => { setEditingProduct(p); setShowProductModal(true); }}
                          className="flex-1 text-xs flex items-center justify-center gap-1 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <FileEdit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="flex-1 text-xs flex items-center justify-center gap-1 py-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── USERS ─── */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">All Registered Users</h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Phone</th>
                      <th className="text-left p-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                        <td className="p-4 font-semibold">{u.name || "—"}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4 text-muted-foreground">{u.phone || "—"}</td>
                        <td className="p-4 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {usersList.length === 0 && (
                  <div className="py-16 text-center">
                    <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-40" />
                    <p className="text-muted-foreground">No registered users yet. New sign-ups auto-sync here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── ACTIVITY LOGS ─── */}
          {activeTab === "logs" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Activity Logs</h2>
                <input
                  className="ml-auto bg-card border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none w-64"
                  placeholder="Filter by user / action…"
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                />
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-auto max-h-[70vh]">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="text-left p-4 text-primary">Time</th>
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4">Action</th>
                      <th className="text-left p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, i) => (
                      <tr key={i} className="border-b border-border/20 hover:bg-white/3 transition-colors">
                        <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-4 font-semibold text-sm">{log.user_email}</td>
                        <td className="p-4">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold border border-primary/20">{log.action}</span>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLogs.length === 0 && (
                  <div className="py-16 text-center">
                    <Activity className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-40" />
                    <p className="text-muted-foreground">No activity logs found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── SITE CMS ─── */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Site Content Manager</h2>
              <div className="bg-card border border-border rounded-2xl p-6 space-y-8">
                {[
                  { key: "footer_bio", label: "Company Bio (Footer)", placeholder: "BUILT BY ARCHITECTS FOR ARCHITECTURAL STUDENTS", multiline: true },
                  { key: "trust_1", label: "Trust Badge 1 (Homepage)", placeholder: "Trusted by architecture schools nationwide" },
                  { key: "trust_2", label: "Trust Badge 2 (Homepage)", placeholder: "Over 500+ premium architectural tools" },
                  { key: "trust_3", label: "Trust Badge 3 (Homepage)", placeholder: "24/7 Support for students" },
                  { key: "hero_tagline", label: "Hero Tagline (Homepage)", placeholder: "From sheets to software courses, we have what you need." },
                  { key: "contact_email", label: "Contact Email", placeholder: "contact@arteco.com" },
                  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/arteco" },
                  { key: "twitter_url", label: "Twitter / X URL", placeholder: "https://twitter.com/arteco" },
                  { key: "linkedin_url", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/arteco" },
                ].map(({ key, label, placeholder, multiline }) => (
                  <div key={key} className="border-b border-border/30 pb-6 last:border-0 last:pb-0">
                    <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                      <Settings2 size={14} className="text-primary" /> {label}
                    </label>
                    {multiline ? (
                      <textarea
                        className="w-full bg-black border border-border rounded-lg p-3 text-sm focus:border-primary focus:outline-none resize-none"
                        rows={3}
                        placeholder={placeholder}
                        value={siteContent[key] || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, [key]: e.target.value })}
                      />
                    ) : (
                      <input
                        className="w-full bg-black border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                        placeholder={placeholder}
                        value={siteContent[key] || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, [key]: e.target.value })}
                      />
                    )}
                    <button
                      onClick={() => handleSaveContent(key)}
                      className="mt-2 text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <Check size={12} /> Save & Push Live
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── DELETED ACCOUNTS ─── */}
          {activeTab === "deleted" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2">
                <ShieldAlert size={20} /> Deleted Accounts Archive
              </h2>
              <div className="bg-destructive/5 border border-destructive/20 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-destructive/20 text-red-400 text-xs uppercase tracking-wider">
                      <th className="text-left p-4">User ID</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Deleted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedUsers.map((du, i) => (
                      <tr key={i} className="border-b border-destructive/10 hover:bg-destructive/5 transition-colors">
                        <td className="p-4 text-xs text-muted-foreground font-mono">{du.user_id}</td>
                        <td className="p-4 font-semibold text-red-300">{du.email}</td>
                        <td className="p-4 text-xs text-muted-foreground">{new Date(du.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {deletedUsers.length === 0 && (
                  <div className="py-16 text-center">
                    <ShieldAlert className="w-10 h-10 mx-auto text-red-500/40 mb-3" />
                    <p className="text-muted-foreground">No accounts have been deleted yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
