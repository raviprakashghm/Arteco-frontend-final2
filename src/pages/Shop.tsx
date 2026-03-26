import { Link } from "react-router-dom";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

import drawingSheetsImg from "@/assets/drawing-sheets.jpg";
import stationeryImg from "@/assets/stationery.jpg";
import softwareTutorialsImg from "@/assets/software-tutorials.jpg";

const categories = [
  { title: "Drawing sheets", image: drawingSheetsImg, href: "/shop/drawing-sheets" },
  { title: "Stationery", image: stationeryImg, href: "/shop/stationery" },
  { title: "Software tutorials", image: softwareTutorialsImg, href: "/offerings/software-courses" },
];

const Shop = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <StepIndicator currentStep={0} />
        <div className="container mx-auto px-6 pb-12">
          <AnimatedSection>
            <h1 className="text-2xl font-bold mb-6">Select Item</h1>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <AnimatedSection key={cat.title} delay={i * 0.1}>
                <Link to={cat.href} className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <div className="overflow-hidden rounded-xl m-2">
                    <img src={cat.image} alt={cat.title} loading="lazy" width={400} height={400}
                      className="w-full h-[280px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <p className="px-4 pb-4 pt-2 text-lg font-medium">{cat.title}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Shop;
