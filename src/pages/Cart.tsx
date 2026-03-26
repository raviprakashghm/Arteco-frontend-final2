import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import SizeSelector from "@/components/SizeSelector";
import QuantityPicker from "@/components/QuantityPicker";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, removeItem, updateQuantity, updateSize } = useCart();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <StepIndicator currentStep={0} />
        <div className="container mx-auto px-6 pb-12">
          <div className="flex items-center justify-between mb-6">
            <Link to="/shop" className="inline-flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" /> Cart
            </Link>
            <Trash2 className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-destructive" />
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
              <Link to="/shop" className="text-primary font-semibold">Start shopping</Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-border bg-card">
                    <div className="w-32 h-32 rounded-xl bg-secondary flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <div className="flex flex-wrap gap-6">
                        {item.size && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Size</p>
                            <SizeSelector sizes={["A1", "A2", "A4"]} selected={item.size} onSelect={(size) => updateSize(item.id, size)} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                          <QuantityPicker quantity={item.quantity} onChangeQuantity={(qty) => updateQuantity(item.id, qty)} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="text-2xl font-bold">₹{item.price * item.quantity}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-2 rounded-lg border border-border hover:border-destructive transition-colors">
                          <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <Link to="/shop" className="flex-1 text-center py-4 rounded-xl border-2 border-border font-semibold text-lg hover:bg-secondary transition-colors">
                  Add More item
                </Link>
                <button onClick={() => navigate("/checkout")} className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors">
                  Proceed to buy
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
