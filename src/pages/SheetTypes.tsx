import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

const SheetTypes = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const legacySheets = [
    { id: "cartridge", name: "Cartridge Sheet", image: "/placeholder.svg", category: "Drawing sheets", price: 24 },
    { id: "butter", name: "Butter Paper", image: "/placeholder.svg", category: "Drawing sheets", price: 18 },
    { id: "mill-board", name: "Mill Board", image: "/placeholder.svg", category: "Drawing sheets", price: 45 }
  ];

  useEffect(() => {
    fetch(`${API}/api/admin/products`)
      .then(res => res.json())
      .then(data => {
        const dbSheets = data.filter((p: any) => 
          p.category?.toLowerCase().includes("sheet") || 
          p.category?.toLowerCase().includes("drawing")
        );
        // Merge legacy with DB (avoid duplicates by ID)
        const merged = [...legacySheets];
        dbSheets.forEach((ps: any) => {
          if (!merged.find(m => m.id === ps.id)) merged.push(ps);
        });
        setProducts(merged);
        setLoading(false);
      })
      .catch(() => {
        setProducts(legacySheets);
        setLoading(false);
      });
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <StepIndicator currentStep={0} />
        <div className="container mx-auto px-6 pb-12">
          <Link to="/shop" className="inline-flex items-center gap-2 text-lg font-semibold mb-6 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" /> Select drawing sheets
          </Link>
          
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground italic border border-dashed border-border rounded-2xl">
              No sheets available in store yet. Admin needs to add them.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((sheet, i) => (
                <AnimatedSection key={sheet.id || i} delay={i * 0.1}>
                  <Link to={`/shop/drawing-sheets/details/${sheet.id}`} className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all block">
                    <div className="overflow-hidden rounded-xl m-2 bg-secondary aspect-video">
                      <img src={sheet.image || "/placeholder.svg"} alt={sheet.name} loading="lazy"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="px-4 pb-4 pt-2 text-lg font-medium">{sheet.name}</p>
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

export default SheetTypes;
