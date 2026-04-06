import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import arVrImg from "@/assets/ar-vr.jpg";
import educationalToursImg from "@/assets/educational-tours.jpg";
import workshopsImg from "@/assets/workshops.jpg";
import { Glasses, MapPin, Calendar, Users, Star, BookOpen, Camera, Award } from "lucide-react";

const offeringData: Record<string, {
  title: string;
  description: string;
  image: string;
  longDescription: string;
  features: { icon: any; title: string; desc: string }[];
  highlights: string[];
  pricing?: string;
}> = {
  "ar-vr": {
    title: "AR VR SOLUTIONS",
    description: "Experience architecture in immersive reality.",
    image: arVrImg,
    longDescription: "Walk through your designs before they're built using cutting-edge augmented and virtual reality solutions. Our AR/VR services let architecture students and professionals visualize spaces at full scale, identify design issues early, and present projects with stunning immersive walkthroughs.",
    features: [
      { icon: Glasses, title: "VR Walkthroughs", desc: "Full-scale immersive tours of your architectural designs" },
      { icon: Camera, title: "AR Overlays", desc: "Overlay digital models onto real-world sites using AR" },
      { icon: Star, title: "Client Presentations", desc: "Impress juries and clients with interactive 3D experiences" },
      { icon: Users, title: "Collaborative Reviews", desc: "Multi-user sessions for team-based design reviews" },
    ],
    highlights: ["Meta Quest 3 & Apple Vision Pro support", "Real-time lighting simulation", "Material and texture swapping", "Annotate and measure in VR", "Export 360° panoramas"],
    pricing: "Starting from ₹5,000 per project",
  },
  "educational-tours": {
    title: "EDUCATIONAL TOURS",
    description: "Explore iconic architectural landmarks.",
    image: educationalToursImg,
    longDescription: "Our curated educational tours take architecture students to iconic structures and contemporary marvels across India and beyond. Learn from real-world buildings, meet practicing architects, and gain hands-on exposure to construction techniques, materials, and spatial design.",
    features: [
      { icon: MapPin, title: "Curated Destinations", desc: "Hand-picked architectural landmarks and modern marvels" },
      { icon: BookOpen, title: "Expert Guides", desc: "Led by practicing architects and professors" },
      { icon: Camera, title: "Documentation", desc: "Photography and sketching workshops during tours" },
      { icon: Award, title: "Certificates", desc: "Participation certificates for academic credit" },
    ],
    highlights: ["Weekend and semester-break tours", "Heritage site visits", "Modern construction site walkthroughs", "Interaction with local architects", "Group discounts for colleges"],
    pricing: "₹3,000 – ₹15,000 per tour",
  },
  workshops: {
    title: "WORKSHOP & EVENTS",
    description: "Hands-on architectural learning experiences.",
    image: workshopsImg,
    longDescription: "Join our workshops to build models, learn new techniques, and connect with fellow architecture enthusiasts. From model-making to digital fabrication, our events provide practical skills that complement your academic curriculum.",
    features: [
      { icon: Users, title: "Hands-on Learning", desc: "Build physical and digital models in guided sessions" },
      { icon: Calendar, title: "Regular Events", desc: "Monthly workshops and seasonal architecture festivals" },
      { icon: Award, title: "Competitions", desc: "Design competitions with prizes and recognition" },
      { icon: Star, title: "Networking", desc: "Connect with peers, mentors, and industry professionals" },
    ],
    highlights: ["Model-making workshops", "Digital fabrication (laser cutting, 3D printing)", "Sketching and rendering bootcamps", "Guest lectures by renowned architects", "Annual Architecture Festival"],
    pricing: "₹500 – ₹5,000 per workshop",
  },
};

const OfferingDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const offering = offeringData[slug || ""];

  if (!offering) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Offering not found</h1>
          <Link to="/offerings" className="text-primary font-semibold">Back to offerings</Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>&gt;</span>
            <Link to="/offerings" className="hover:text-primary transition-colors">Offerings</Link>
            <span>&gt;</span>
            <span className="text-foreground">{offering.title}</span>
          </div>
        </div>

        {/* Hero */}
        <div className="container mx-auto px-6 py-8">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <img src={offering.image} alt={offering.title} width={800} height={800} className="w-full rounded-2xl object-cover" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{offering.title}</h1>
                <p className="text-muted-foreground leading-relaxed mb-6">{offering.longDescription}</p>
                {offering.pricing && (
                  <p className="text-xl font-bold text-primary mb-6">{offering.pricing}</p>
                )}
                <Link to="/contact" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors inline-block">
                  Get in Touch
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-12">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-4">
            {offering.features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border">
                  <f.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{f.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section className="container mx-auto px-6 py-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-6">Highlights</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {offering.highlights.map((h) => (
                <div key={h} className="flex items-center gap-2 text-sm">
                  <span className="text-primary">✓</span> {h}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-12">
          <AnimatedSection>
            <div className="rounded-2xl bg-card border border-border p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Book this Offering</h2>
              <p className="text-muted-foreground mb-6">You can reserve and book this offering entirely online.</p>
              <button 
                onClick={() => {
                   const defaultPrices: Record<string, number> = { "ar-vr": 5000, "educational-tours": 3000, "workshops": 500 };
                   addItem({ id: slug || 'offering', name: offering.title, quantity: 1, price: defaultPrices[slug || ""] || 1000, image: offering.image, category: slug || 'event' });
                   toast.success(`Added ${offering.title} booking to cart!`);
                   navigate("/cart");
                }}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
              >
                Book Now to Cart
              </button>
            </div>
          </AnimatedSection>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default OfferingDetail;
