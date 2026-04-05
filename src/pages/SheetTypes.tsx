import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import cartridgeSheetImg from "@/assets/cartridge-sheet.jpg";

const sheetTypes = [
  { title: "Cartridge", id: "cartridge" },
  { title: "Butter Paper", id: "butter" },
  { title: "Mill Board", id: "mill-board" },
];

const SheetTypes = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <StepIndicator currentStep={0} />
        <div className="container mx-auto px-6 pb-12">
          <Link to="/shop" className="inline-flex items-center gap-2 text-lg font-semibold mb-6 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" /> Select drawing sheets
          </Link>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {sheetTypes.map((sheet, i) => (
              <AnimatedSection key={sheet.id} delay={i * 0.1}>
                <Link to={`/shop/drawing-sheets/details/${sheet.id}`} className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all block">
                  <div className="overflow-hidden rounded-xl m-2 bg-secondary aspect-video flex items-center justify-center">
                    <img src={cartridgeSheetImg} alt={sheet.title} loading="lazy"
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <p className="px-4 pb-4 pt-2 text-lg font-medium text-center">{sheet.title}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SheetTypes;
