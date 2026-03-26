import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import QuantityPicker from "@/components/QuantityPicker";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

import tScaleImg from "@/assets/t-scale.jpg";
import triangularScaleImg from "@/assets/triangular-scale.jpg";
import setSquareImg from "@/assets/set-square.jpg";
import microPensImg from "@/assets/micro-pens.jpg";
import cuttingMatImg from "@/assets/cutting-mat.jpg";
import thermocolImg from "@/assets/thermocol-sheet.jpg";

const items: Record<string, { name: string; price: number; image: string }> = {
  "t-scale": { name: "T Scale", price: 350, image: tScaleImg },
  "triangular-scale": { name: "Triangular Scale", price: 280, image: triangularScaleImg },
  "set-square": { name: "Set Square", price: 320, image: setSquareImg },
  "micro-pens": { name: "Micro Pens", price: 224, image: microPensImg },
  "cutting-mat": { name: "Cutting Mat", price: 450, image: cuttingMatImg },
  "thermocol-sheet": { name: "Thermocol Sheet", price: 180, image: thermocolImg },
};

const StationeryDetails = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const item = items[itemId || ""];
  if (!item) return null;

  const handleAddToCart = () => {
    addItem({
      id: `stationery-${itemId}`,
      name: item.name,
      quantity,
      price: item.price,
      image: item.image,
      category: "stationery",
    });
    toast.success("Added to cart!");
    navigate("/cart");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <StepIndicator currentStep={0} />
        <div className="container mx-auto px-6 pb-12">
          <Link to="/shop/stationery" className="inline-flex items-center gap-2 text-lg font-semibold mb-6 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" /> Enter stationery details
          </Link>
          <AnimatedSection>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/2 bg-card rounded-2xl p-6 flex items-center justify-center border border-border">
                <img src={item.image} alt={item.name} width={400} height={400} className="max-h-[400px] object-contain" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <h1 className="text-2xl font-bold">{item.name}</h1>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Select the quantity</p>
                  <QuantityPicker quantity={quantity} onChangeQuantity={setQuantity} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-3xl font-bold">₹{item.price}</p>
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

export default StationeryDetails;
