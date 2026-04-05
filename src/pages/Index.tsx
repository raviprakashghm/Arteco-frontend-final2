import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OfferingCard from "@/components/OfferingCard";
import ReviewsSection from "@/components/ReviewsSection";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

import vendingMachineImg from "@/assets/vending-machine.jpg";
import onlineStationeryImg from "@/assets/online-stationery.jpg";
import softwareCoursesImg from "@/assets/software-courses.jpg";
import arVrImg from "@/assets/ar-vr.jpg";
import educationalToursImg from "@/assets/educational-tours.jpg";
import workshopsImg from "@/assets/workshops.jpg";

const offerings = [
  { title: "Vending Machine", description: "Get any architectural sheets vended instantly", image: vendingMachineImg, href: "/offerings/vending-machine" },
  { title: "Online Stationery", description: "Get any architectural stationery delivered to your address", image: onlineStationeryImg, href: "/shop" },
  { title: "Software Courses", description: "Learn any architectural softwares", image: softwareCoursesImg, href: "/offerings/software-courses" },
  { title: "AR VR Solutions", description: "Experience architecture in immersive reality", image: arVrImg, href: "/offerings/ar-vr" },
  { title: "Educational Tours", description: "Explore iconic architectural landmarks", image: educationalToursImg, href: "/offerings/educational-tours" },
  { title: "Workshop & Events", description: "Hands-on architectural learning experiences", image: workshopsImg, href: "/offerings/workshops" },
];

const Index = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cms, setCms] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${API}/api/content`)
      .then(r => r.ok ? r.json() : {})
      .then(d => setCms(d))
      .catch(() => {});
  }, []);

  const trust1 = cms.trust_1 || "Trusted by architecture schools nationwide";
  const trust2 = cms.trust_2 || "Over 500+ premium architectural tools";
  const trust3 = cms.trust_3 || "24/7 Support for students";
  const heroTagline = cms.hero_tagline || "From sheets to software courses, we have what you need.";

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="hero-bg flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 relative overflow-hidden">
          {/* Floating particles */}
          <span className="particle absolute top-12 left-[14%] w-1.5 h-1.5 rounded-full bg-primary/40 hidden md:block" style={{ animationDelay: '0s' }} />
          <span className="particle absolute top-28 right-[18%] w-1 h-1 rounded-full bg-primary/30 hidden md:block" style={{ animationDelay: '2.5s' }} />
          <span className="particle absolute bottom-24 left-[28%] w-2 h-2 rounded-full bg-primary/20 hidden md:block" style={{ animationDelay: '1.2s' }} />
          <span className="particle absolute bottom-16 right-[30%] w-1 h-1 rounded-full bg-primary/25 hidden md:block" style={{ animationDelay: '3.5s' }} />

          <AnimatedSection>
            <p className="font-script text-2xl md:text-3xl lg:text-4xl text-primary font-medium tracking-wide mb-2 opacity-90 drop-shadow-md">
              Introducing
            </p>
            <h1 className="arteco-watermark mb-1" aria-label="ARTECO">
              ARTECO
            </h1>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider mt-3 leading-tight">
              A HUB FOR{" "}<span className="text-primary text-glow">ALL ARCHITECTURAL</span>
            </h2>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider leading-tight">
              ACADEMIC NEEDS.
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-5 tracking-[0.18em] uppercase">
              {heroTagline}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Link to="/contact" className="btn-primary">
                Contact Us
              </Link>
              <Link to="/offerings" className="btn-outline">
                Explore offerings
              </Link>
            </div>
          </AnimatedSection>
        </section>

        <div className="section-divider" />

        {/* Offerings Carousel */}
        <section className="py-16 px-6" id="offerings">
          <div className="container mx-auto">
            <AnimatedSection>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-wider uppercase">Our Offerings</h2>
                <div className="flex gap-2">
                  <button onClick={scrollLeft} className="arrow-btn" aria-label="Scroll left">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={scrollRight} className="arrow-btn" aria-label="Scroll right">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </AnimatedSection>
            <div 
              ref={scrollRef} 
              className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            >
              {offerings.map((offering, i) => (
                <div key={offering.title} className="snap-start shrink-0">
                  <AnimatedSection delay={i * 0.08}>
                    <OfferingCard {...offering} />
                  </AnimatedSection>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Trusted By */}
        <AnimatedSection>
          <section className="py-16 px-6">
            <div className="container mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-wider uppercase">Trusted By</h2>
              <div className="flex justify-center gap-6 flex-wrap">
                {[trust1, trust2, trust3].map((t) => (
                  <div key={t} className="trusted-logo">{t}</div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        <div className="section-divider" />

        {/* Reviews */}
        <ReviewsSection />

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
