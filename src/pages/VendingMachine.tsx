import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Clock, Shield, CreditCard, Settings, DollarSign, Package, Headphones, Wrench, Box } from "lucide-react";
import vendingMachineImg from "@/assets/vending-machine.jpg";

const VendingMachine = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const handleAddToCart = () => {
    addItem({
      id: "vending-machine",
      name: "ARTECO Smart Vending Machine",
      quantity: 1,
      price: 120000,
      image: vendingMachineImg,
      category: "vending-machine",
    });
    toast.success("Added to cart!");
    navigate("/cart");
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const keyFeatures = [
    { icon: Clock, title: "24/7 availability", desc: "Uninterrupted access." },
    { icon: Shield, title: "Anti-theft technology", desc: "Secure dispensing" },
    { icon: CreditCard, title: "UPI Payment", desc: "Get Directly paid to UPI Account" },
    { icon: Settings, title: "Customizable slots", desc: "Customize according to your college academic needs" },
  ];

  const orderDetails = [
    { icon: DollarSign, title: "Pricing", desc: "Starting at ₹1,500 price varies by configuration. Financing available—contact us for details." },
    { icon: Package, title: "Availability", desc: "In stock for standard models. 3-4 week lead time for custom orders." },
    { icon: Headphones, title: "Support & Warranty", desc: "2-year parts warranty. Lifetime technical support via Vendnet." },
  ];

  const addOns = [
    { icon: Box, title: "Stationery Refills", desc: "Stationery Refills: Keep your machine stocked with sheets and tools (₹2000/month)." },
    { icon: Wrench, title: "Installation Support", desc: "2 year parts warranty. Lifetime technical support via Vendnet." },
  ];

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
            <span className="text-foreground">Online Stationery Shop</span>
          </div>
        </div>

        {/* Hero */}
        <section className="container mx-auto px-6 pb-12">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="rounded-2xl overflow-hidden bg-card">
                <img src={vendingMachineImg} alt="ARTECO Smart Vending Machine" width={800} height={800} className="w-full h-auto object-cover rounded-2xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">ARTECO Smart Vending Machine - Campus Edition</h1>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Designed for campus environments, this smart vending machine dispenses architectural sheets anytime. No more delays — ideal for students needing instant access to sheets for projects.
                </p>
                <h3 className="font-bold mb-3">Key Features</h3>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground mb-6 text-sm">
                  <li>24/7 Access for anytime availability.</li>
                  <li>Secure dispensing with anti-theft locks.</li>
                  <li>Accepts UPI and card payments.</li>
                  <li>Customizable slots for college needs.</li>
                </ol>
                <h3 className="font-bold mb-1">Price</h3>
                <p className="text-3xl font-bold mb-6">₹ 1,20,000</p>
                <div className="flex gap-4">
                  <Link to="/contact" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Contact Us
                  </Link>
                  <button onClick={handleAddToCart} className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Key Features Grid */}
        <section className="container mx-auto px-6 py-12">
          <AnimatedSection>
            <h2 className="text-xl font-bold mb-6">Key features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {keyFeatures.map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border">
                  <f.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{f.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Specifications */}
        <section className="container mx-auto px-6 py-8">
          <AnimatedSection>
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Dimensions: H: 1946mm, W: 1293mm, D: 870mm</p>
              <p>Capacity:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Sheets: 50-60 sheets</li>
                <li>Slots: 4</li>
              </ul>
              <p>Power: 55W</p>
              <p>Weight: 340kg</p>
              <p>Material: Durable steel construction</p>
            </div>
          </AnimatedSection>
        </section>

        {/* Order Details */}
        <section className="container mx-auto px-6 py-8">
          <AnimatedSection>
            <h2 className="text-xl font-bold mb-6">Order Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {orderDetails.map((d) => (
                <div key={d.title} className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <d.icon className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">{d.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Add-ons */}
        <section className="container mx-auto px-6 py-8">
          <AnimatedSection>
            <h2 className="text-xl font-bold mb-6">Add-ons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addOns.map((a) => (
                <div key={a.title} className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <a.icon className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">{a.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Contact Form */}
        <section className="container mx-auto px-6 py-12">
          <AnimatedSection>
            <div className="max-w-lg mx-auto md:mx-0">
              <h2 className="text-xl font-bold mb-2">Contact Us</h2>
              <p className="text-sm text-muted-foreground mb-6">Do you have any questions or feedback? Feel free to send us a message!</p>
              <form onSubmit={handleContact} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Eg. Narendar" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Eg. keertand@gmail.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Message</label>
                  <textarea required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} rows={4}
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Hello, I would like to get in touch with your company for partnership possibilities. Please let me know the best way to reach you. Thank you." />
                </div>
                <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                  Send ✈
                </button>
              </form>
            </div>
          </AnimatedSection>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default VendingMachine;
