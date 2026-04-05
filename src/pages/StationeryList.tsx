import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

const stationeryItems = [
  { title: "T Scale", image: tScaleImg, id: "t-scale" },
  { title: "Triangular Scale", image: triangularScaleImg, id: "triangular-scale" },
  { title: "Set Square", image: setSquareImg, id: "set-square" },
  { title: "Micro Pens", image: microPensImg, id: "micro-pens" },
  { title: "Cutting Mat", image: cuttingMatImg, id: "cutting-mat" },
  { title: "Thermocol Sheet", image: thermocolImg, id: "thermocol-sheet" },
];

const StationeryList = () => {
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {stationeryItems.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.08}>
                <Link
                  to={`/shop/stationery/details/${item.id}`}
                  className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="overflow-hidden rounded-xl m-2 bg-secondary aspect-square flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="px-4 pb-4 pt-2 text-sm font-medium text-center">{item.title}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default StationeryList;
