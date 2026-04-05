import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";
import { Package, Truck, FileEdit, Plus, Trash2 } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<any[]>([]);
  
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
    fetchDeletedUsers();
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      if(res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        // Fallback or mock data if server is down
        const mockOrders = Object.keys(localStorage).filter(k => k.startsWith("orders_")).map(k => JSON.parse(localStorage.getItem(k) || "[]")).flat();
        setOrders(mockOrders);
      }
    } catch(err) {
      const mockOrders = Object.keys(localStorage).filter(k => k.startsWith("orders_")).map(k => JSON.parse(localStorage.getItem(k) || "[]")).flat();
      setOrders(mockOrders);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products`);
      if(res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch(err) {
      console.log('Failed to fetch products');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`);
      if(res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch(err) {}
  };

  const fetchDeletedUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/deleted-users`);
      if(res.ok) {
        const data = await res.json();
        setDeletedUsers(data);
      }
    } catch(err) {}
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if(res.ok) {
        toast.success("Order status updated!");
        fetchOrders();
      } else {
        toast.success("Mock: Order status updated (Backend Sync Missing)");
      }
    } catch(err) {
      toast.success("Mock: Order status updated");
    }
  };

  const handleProductAction = (action: string) => {
    toast.success(`Action "${action}" processed via Admin hook. (Add to Supabase table)`);
  };

  if (user?.email !== "admin@arteco.com") {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="mt-4 text-muted-foreground">You do not have administrative privileges.</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="flex flex-wrap gap-4 mb-8 border-b border-border pb-4">
            <button 
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-primary text-black font-bold' : 'bg-card text-muted-foreground hover:bg-white/5'}`}
            >
              <Package size={18} /> Products
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-primary text-black font-bold' : 'bg-card text-muted-foreground hover:bg-white/5'}`}
            >
              <Truck size={18} /> Orders
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-primary text-black font-bold' : 'bg-card text-muted-foreground hover:bg-white/5'}`}
            >
              <Truck size={18} /> Users List
            </button>
            <button 
              onClick={() => setActiveTab("deleted_users")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${activeTab === 'deleted_users' ? 'bg-red-500 text-white font-bold' : 'bg-card text-muted-foreground hover:bg-red-500/20 hover:text-red-500'}`}
            >
              <Trash2 size={18} /> Deleted Accounts
            </button>
          </div>

          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Products</h2>
                <button onClick={() => handleProductAction('Add Product')} className="bg-primary text-black font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90">
                  <Plus size={16} /> Add Product
                </button>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                {products.length === 0 ? (
                  <p className="text-muted-foreground">No products found in database yet. Add items to see them here.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p, i) => (
                      <div key={i} className="border border-border p-4 rounded-xl space-y-3">
                        <h3 className="font-bold">{p.name}</h3>
                        <p className="text-sm text-primary font-semibold">₹{p.price}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleProductAction('Edit Product')} className="p-2 bg-white/10 rounded hover:bg-white/20"><FileEdit size={16} /></button>
                          <button onClick={() => handleProductAction('Delete Product')} className="p-2 bg-destructive/10 text-destructive rounded hover:bg-destructive/20"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Registered Users</h2>
              <div className="bg-card border border-border rounded-xl p-6">
                {usersList.length === 0 ? (
                  <p className="text-muted-foreground">No registered users synced with Supabase yet. Users created today will automatically sync.</p>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                          <td className="py-4 font-semibold">{u.email}</td>
                          <td className="py-4 text-muted-foreground">{u.phone || 'N/A'}</td>
                          <td className="py-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === "deleted_users" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-red-500 flex items-center gap-2"><Trash2 /> Deleted Accounts</h2>
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                {deletedUsers.length === 0 ? (
                  <p className="text-muted-foreground">No users have deleted their accounts yet.</p>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-destructive/20 text-muted-foreground uppercase text-xs tracking-wider">
                        <th className="pb-3 text-red-400">User ID</th>
                        <th className="pb-3 text-red-400">Email</th>
                        <th className="pb-3 text-red-400">Deletion Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletedUsers.map((du, i) => (
                        <tr key={i} className="border-b border-destructive/10">
                          <td className="py-4 text-muted-foreground">{du.user_id}</td>
                          <td className="py-4 font-semibold text-red-300">{du.email}</td>
                          <td className="py-4 text-muted-foreground">{new Date(du.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Track & Update Orders</h2>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-muted-foreground">No active orders found.</p>
                ) : (
                  orders.map((o, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-lg">{o.id}</h3>
                        <p className="text-sm text-muted-foreground">User: {o.user_email || o.deliveryDetails?.phone}</p>
                        <p className="text-sm">Total: <span className="text-primary font-semibold">₹{o.total || o.amount}</span></p>
                        <p className="text-sm text-yellow-500 mt-1">Expected Delivery: {o.expected_delivery_date || 'Calculated automatically on backend (+6 days)'}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase text-muted-foreground font-semibold">Status</label>
                        <select 
                          className="bg-black border border-border px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary"
                          value={o.status || 'Processing'}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
