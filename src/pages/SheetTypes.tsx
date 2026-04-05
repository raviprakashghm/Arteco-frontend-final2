import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import cartridgeSheetImg from "@/assets/cartridge-sheet.jpg";

const SheetTypes = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const legacySheets = [
    { title: "Cartridge", id: "cartridge", image: cartridgeSheetImg, price: 24, category: "Drawing sheets" },
    { title: "Butter Paper", id: "butter", image: cartridgeSheetImg, price: 18, category: "Drawing sheets" },
    { title: "Mill Board", id: "mill-board", image: cartridgeSheetImg, price: 45, category: "Drawing sheets" },
  ];

  useEffect(() => {
    fetch(`${API}/api/admin/products`)
      .then(res => res.json())
      .then(data => {
        const dbSheets = data.filter((p: any) => 
          p.category?.toLowerCase() === "drawing sheets" || 
          p.category?.toLowerCase() === "drawing-sheets"
        );
        
        // Merge - give database items priority if they share an ID/Name
        const merged = [...legacySheets];
        dbSheets.forEach((db: any) => {
          const existsIdx = merged.findIndex(m => m.id === db.id || m.title === db.name);
          if (existsIdx > -1) {
            merged[existsIdx] = { ...merged[existsIdx], ...db, title: db.name };
          } else {
            merged.push({ ...db, title: db.name });
          }
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
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {products.map((sheet, i) => (
                <AnimatedSection key={sheet.id || i} delay={i * 0.1}>
                  <Link to={`/shop/drawing-sheets/details/${sheet.id}`} className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all block">
                    <div className="overflow-hidden rounded-xl m-2 bg-secondary aspect-video flex items-center justify-center">
                      <img src={sheet.image} alt={sheet.title} loading="lazy"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="px-4 pb-4 pt-2 text-lg font-medium text-center">{sheet.title}</p>
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
