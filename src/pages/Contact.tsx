import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import { toast } from "sonner";
import { Send } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-16 max-w-xl">
          <AnimatedSection>
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-muted-foreground mb-8">Do you have any questions or feedback? Feel free to send us a message!</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Eg. Narendar" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Eg. keertand@gmail.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                  className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Hello, I would like to get in touch with your company for partnership possibilities. Please let me know the best way to reach you. Thank you." />
              </div>
              <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                Send <Send className="h-4 w-4" />
              </button>
            </form>
          </AnimatedSection>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contact;
