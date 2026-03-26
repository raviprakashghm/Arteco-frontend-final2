import { Link } from "react-router-dom";
import { Mail, Instagram, Twitter, Linkedin } from "lucide-react";
import artecoLogo from "@/assets/arteco-logo.png";

const Footer = () => {
  return (
    <footer className="bg-accent border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={artecoLogo} alt="Arteco" className="h-10 w-10" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              BUILT BY ARCHITECTS FOR ARCHITECTURAL STUDENTS
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm tracking-wider mb-4">COMPANY</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Offerings */}
          <div>
            <h4 className="font-bold text-sm tracking-wider mb-4">OFFERINGS</h4>
            <ul className="space-y-3">
              <li><Link to="/offerings/vending-machine" className="text-sm text-muted-foreground hover:text-primary transition-colors">Vending Machine</Link></li>
              <li><Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">Online Stationery Shop</Link></li>
              <li><Link to="/offerings/software-courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">Software Courses</Link></li>
              <li><Link to="/offerings/ar-vr" className="text-sm text-muted-foreground hover:text-primary transition-colors">A/V/R Solutions</Link></li>
              <li><Link to="/offerings/workshops" className="text-sm text-muted-foreground hover:text-primary transition-colors">Workshops & Events</Link></li>
              <li><Link to="/offerings/educational-tours" className="text-sm text-muted-foreground hover:text-primary transition-colors">Educational Tours</Link></li>
            </ul>
          </div>

          {/* Follow + Contact */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-sm tracking-wider mb-4">FOLLOW US</h4>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ARTECO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
