import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

import tScaleImg from "@/assets/t-scale.jpg";
import triangularScaleImg from "@/assets/triangular-scale.jpg";
import setSquareImg from "@/assets/set-square.jpg";
import microPensImg from "@/assets/micro-pens.jpg";
import cuttingMatImg from "@/assets/cutting-mat.jpg";
import thermocolImg from "@/assets/thermocol-sheet.jpg";

const StationeryList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const legacyStationery = [
    { title: "T Scale", image: tScaleImg, id: "t-scale", category: "stationery", price: 350 },
    { title: "Triangular Scale", image: triangularScaleImg, id: "triangular-scale", category: "stationery", price: 280 },
    { title: "Set Square", image: setSquareImg, id: "set-square", category: "stationery", price: 320 },
    { title: "Micro Pens", image: microPensImg, id: "micro-pens", category: "stationery", price: 224 },
    { title: "Cutting Mat", image: cuttingMatImg, id: "cutting-mat", category: "stationery", price: 450 },
    { title: "Thermocol Sheet", image: thermocolImg, id: "thermocol-sheet", category: "stationery", price: 180 },
  ];

  const fetchMerged = async () => {
    try {
      const res = await fetch(`${API}/api/admin/products`);
      let dbItems: any[] = [];
      if (res.ok) {
        const data = await res.json();
        dbItems = Array.isArray(data) ? data : [];
      }
      
      // Also grab local items just in case the DB is lagging or unreachable
      const localItems = JSON.parse(localStorage.getItem("admin_products_mock") || "[]");
      
      // Merge unique
      const allDbItems = [...dbItems];
      localItems.forEach((localData: any) => {
         if (!allDbItems.some(i => i.id === localData.id)) {
            allDbItems.push(localData);
         }
      });

      const stationeryDb = allDbItems.filter((p: any) => p.category?.toLowerCase() === "stationery");
      
      // Smart Merge
      const merged = [...legacyStationery];
      stationeryDb.forEach((db: any) => {
        const existsIdx = merged.findIndex(m => m.title?.toLowerCase() === db.name?.toLowerCase());
        if (existsIdx > -1) {
          merged[existsIdx] = { ...merged[existsIdx], ...db, title: db.name };
        } else {
          merged.unshift({ ...db, title: db.name, id: db.id || `db_${db.name}` });
        }
      });
      
      setProducts(merged);
    } catch (err) {
      // Emergency Local Sync
      const dbItems = JSON.parse(localStorage.getItem("admin_products_mock") || "[]");
      const stationeryDb = dbItems.filter((p: any) => p.category?.toLowerCase() === "stationery");
      const merged = [...legacyStationery, ...stationeryDb.map((d: any) => ({ ...d, title: d.name }))];
      setProducts(merged);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMerged(); }, []);

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
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item, i) => (
                <AnimatedSection key={item.title || i} delay={i * 0.08}>
                  <Link
                    to={`/shop/stationery/details/${item.id || item.title}`}
                    className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all block h-full bg-card"
                  >
                    <div className="overflow-hidden rounded-xl m-2 bg-secondary aspect-square flex items-center justify-center">
                      <img
                        src={item.image || "https://placehold.co/400x400?text=Stationery"}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 pt-1 text-center">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">{item.title}</p>
                      <p className="text-xs text-primary font-black mt-1 uppercase tracking-wider">₹{item.price}</p>
                    </div>
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
