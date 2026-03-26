import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import SizeSelector from "@/components/SizeSelector";
import QuantityPicker from "@/components/QuantityPicker";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import cartridgeSheetImg from "@/assets/cartridge-sheet.jpg";

const sheetNames: Record<string, string> = {
  cartridge: "Cartridge Sheet",
  butter: "Butter Paper",
  "mill-board": "Mill Board",
};

const SheetDetails = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [size, setSize] = useState("A1");
  const [quantity, setQuantity] = useState(2);

  const name = sheetNames[sheetId || ""] || "Sheet";
  const price = 24;

  const handleAddToCart = () => {
    addItem({ id: `sheet-${sheetId}-${size}`, name, size, quantity, price, image: cartridgeSheetImg, category: "drawing-sheets" });
    toast.success("Added to cart!");
    navigate("/cart");
  };

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
                <img src={cartridgeSheetImg} alt={name} width={400} height={400} className="max-h-[400px] object-contain" />
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
