import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import { BookOpen, Monitor, Cpu, Palette, Box, Layers } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const tiers = [
  {
    name: "BASIC",
    price: "₹2,999",
    duration: "4 weeks",
    features: ["AutoCAD 2D Fundamentals", "SketchUp Basics", "Photoshop for Architecture", "Basic Rendering Techniques"],
  },
  {
    name: "INTERMEDIATE",
    price: "₹5,999",
    duration: "8 weeks",
    features: ["Revit Architecture", "3ds Max Modeling", "Lumion Rendering", "V-Ray for SketchUp", "Advanced AutoCAD"],
  },
  {
    name: "ADVANCED",
    price: "₹9,999",
    duration: "12 weeks",
    features: ["Rhino + Grasshopper", "Blender for Architecture", "Unreal Engine Visualization", "BIM Management", "Portfolio Design"],
  },
];

const exclusiveTechniques = [
  { icon: Layers, title: "Sheet Composition Techniques", desc: "Master the art of creating compelling architectural presentation sheets." },
  { icon: Box, title: "Blender", desc: "3D modeling and photorealistic rendering for architectural visualization." },
  { icon: Cpu, title: "Unreal", desc: "Real-time architectural visualization with Unreal Engine." },
  { icon: Monitor, title: "Grasshopper & Rhino", desc: "Parametric design and computational architecture." },
  { icon: Palette, title: "Realistic Rendering Techniques", desc: "Create stunning photorealistic renders of your designs." },
  { icon: BookOpen, title: "All Adobe Softwares Techniques", desc: "Photoshop, Illustrator, InDesign for architectural presentations." },
];

const specialPlan = [
  "Sheet Composition Techniques",
  "Blender",
  "Grasshopper & Rhino",
  "Realistic Rendering Techniques",
  "All Adobe Softwares Techniques",
];

const SoftwareCourses = () => {
  const [extraCourses, setExtraCourses] = useState<any[]>([]);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`${API}/api/admin/products`)
      .then(res => res.json())
      .then(data => {
        let apiData = Array.isArray(data) ? data : [];
        const localItems = JSON.parse(localStorage.getItem("admin_products_mock") || "[]");
        localItems.forEach((localData: any) => {
           if (!apiData.some(i => i.id === localData.id)) {
              apiData.push(localData);
           }
        });

        const filtered = apiData.filter((p: any) => p.category?.toLowerCase() === "software courses");
        setExtraCourses(filtered);
      })
      .catch(() => {});
  }, []);
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <AnimatedSection>
            <h1 className="text-3xl font-bold mb-4">SOFTWARE COURSES</h1>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Master architectural software from industry experts. Choose from structured tiers or explore exclusive techniques to elevate your design skills.
            </p>
          </AnimatedSection>

          {/* Course Tiers */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {tiers.map((tier, i) => (
              <AnimatedSection key={tier.name} delay={i * 0.1}>
                <div className="rounded-2xl border border-border bg-card p-6 h-full flex flex-col">
                  <h3 className="text-lg font-bold tracking-wider mb-1">{tier.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">{tier.price}</p>
                  <p className="text-xs text-muted-foreground mb-6">{tier.duration}</p>
                  <ul className="space-y-3 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => {
                        addItem({ id: `tier-${tier.name.toLowerCase()}`, name: `${tier.name} Software Course`, price: parseInt(tier.price.replace(/\D/g, '')), quantity: 1, category: "course", image: `https://placehold.co/400x400/1e1e1e/c9a14a?text=${tier.name}+Course` });
                        toast.success(`Added ${tier.name} Course to cart!`);
                        navigate("/cart");
                    }} 
                    className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Enroll Now
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Exclusive Techniques */}
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-8">SOFTWARES EXCLUSIVE TECHNIQUES</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {exclusiveTechniques.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.08}>
                <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors">
                  <item.icon className="h-6 w-6 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Extra Courses from Admin */}
          {extraCourses.length > 0 && (
            <div className="space-y-8 mb-16">
              <AnimatedSection>
                <h2 className="text-2xl font-bold">ADDITIONAL COURSE MODULES</h2>
              </AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {extraCourses.map((p, i) => (
                  <AnimatedSection key={p.id || i} delay={i * 0.08}>
                    <div className="rounded-xl border border-border bg-card p-6 flex flex-col h-full">
                      {p.image && <img src={p.image} className="w-full h-32 object-cover rounded-lg mb-4" alt={p.name} />}
                      <h4 className="font-bold text-lg mb-1">{p.name}</h4>
                      <p className="text-primary font-bold mb-3">₹{p.price}</p>
                      <p className="text-sm text-muted-foreground flex-1 mb-4">{p.description}</p>
                      <button 
                        onClick={() => {
                          addItem({ id: p.id || p.name, name: p.name, price: p.price, quantity: 1, category: "course", image: p.image });
                          toast.success(`Enrolling in ${p.name}...`);
                          navigate("/cart");
                        }} 
                        className="btn-primary py-2 text-xs"
                      >
                        Enroll Online
                      </button>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {/* Special Plan */}
          <AnimatedSection>
            <div className="rounded-2xl border border-primary/30 bg-card p-8">
              <h2 className="text-2xl font-bold mb-2">SPECIAL PLAN</h2>
              <p className="text-muted-foreground text-sm mb-6">Get access to all exclusive techniques at a discounted price</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {specialPlan.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <span className="text-primary">✓</span> {item}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-primary">₹14,999</p>
                <button onClick={() => {
                  addItem({ id: "special-plan", name: "Special Plan Full Course", price: 14999, quantity: 1, category: "course", image: "https://placehold.co/400x400/1e1e1e/c9a14a?text=Special+Plan" });
                  toast.success("Special Plan Added to Cart!");
                  navigate("/cart");
                }} className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default SoftwareCourses;
