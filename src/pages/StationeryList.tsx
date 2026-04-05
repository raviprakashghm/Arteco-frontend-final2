import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

const StationeryList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const legacyStationery = [
    { id: "t-scale", name: "T Scale", price: 350, image: "/placeholder.svg" },
    { id: "triangular-scale", name: "Triangular Scale", price: 280, image: "/placeholder.svg" },
    { id: "set-square", name: "Set Square", price: 320, image: "/placeholder.svg" },
    { id: "micro-pens", name: "Micro Pens", price: 224, image: "/placeholder.svg" },
    { id: "cutting-mat", name: "Cutting Mat", price: 450, image: "/placeholder.svg" },
    { id: "thermocol-sheet", name: "Thermocol Sheet", price: 180, image: "/placeholder.svg" },
  ];

  useEffect(() => {
    fetch(`${API}/api/admin/products`)
      .then(res => res.json())
      .then(data => {
        const dbItems = data.filter((p: any) => p.category?.toLowerCase() === "stationery");
        const merged = [...legacyStationery];
        // Ensure no duplicates by matching names or IDs
        dbItems.forEach((ps: any) => {
          if (!merged.find(m => m.id === ps.id || m.name === ps.name)) merged.push(ps);
        });
        setProducts(merged);
        setLoading(false);
      })
      .catch(() => {
        setProducts(legacyStationery);
        setLoading(false);
      });
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <StepIndicator currentStep={0} />

        <div className="container mx-auto px-6 pb-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>&gt;</span>
            <Link to="/offerings" className="hover:text-primary transition-colors font-medium text-foreground">Offerings</Link>
            <span>&gt;</span>
            <span>Stationery</span>
          </div>

          <AnimatedSection>
            <h1 className="text-2xl font-bold mb-8">Commonly bought stationery</h1>
          </AnimatedSection>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground italic border border-dashed border-border rounded-2xl">
              No stationery items available in store yet. Admin needs to add them.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item, i) => (
                <AnimatedSection key={item.id || i} delay={i * 0.08}>
                  <Link
                    to={`/shop/stationery/details/${item.id}`}
                    className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all"
                  >
                    <div className="overflow-hidden rounded-xl m-2 bg-secondary aspect-square flex items-center justify-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="px-4 pb-4 pt-2 text-sm font-medium text-center">{item.name}</p>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default StationeryList;
