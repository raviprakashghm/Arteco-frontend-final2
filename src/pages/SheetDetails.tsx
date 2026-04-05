import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import SizeSelector from "@/components/SizeSelector";
import QuantityPicker from "@/components/QuantityPicker";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const SheetDetails = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [size, setSize] = useState("A1");
  const [quantity, setQuantity] = useState(2);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API}/api/admin/products`)
      .then(res => res.json())
      .then(data => {
        const p = data.find((item: any) => item.id === sheetId);
        setProduct(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sheetId]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ 
      id: `${product.id}-${size}`, 
      name: product.name, 
      size, 
      quantity, 
      price: product.price, 
      image: product.image || "/placeholder.svg", 
      category: "drawing-sheets" 
    });
    toast.success("Added to cart!");
    navigate("/cart");
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="text-center py-20">Product not found.</div>
    </div>
  );

  const { name, price, image } = product;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <StepIndicator currentStep={0} />
        <div className="container mx-auto px-6 pb-12">
          <Link to="/shop/drawing-sheets" className="inline-flex items-center gap-2 text-lg font-semibold mb-6 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" /> Enter sheet details
          </Link>
          <AnimatedSection>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/2 bg-card rounded-2xl p-6 flex items-center justify-center border border-border">
                <img src={image || "/placeholder.svg"} alt={name} width={400} height={400} className="max-h-[400px] object-contain rounded-lg" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <h1 className="text-2xl font-bold">{name}</h1>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Select the size</p>
                  <SizeSelector sizes={["A1", "A2", "A4"]} selected={size} onSelect={setSize} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Select the quantity</p>
                  <QuantityPicker quantity={quantity} onChangeQuantity={setQuantity} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-3xl font-bold">₹{price}</p>
                </div>
                <button onClick={handleAddToCart} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors">
                  Add to cart
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
};

export default SheetDetails;
