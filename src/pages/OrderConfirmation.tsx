import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

const OrderConfirmation = () => {
  const location = useLocation();
  const itemsCount = location.state?.itemsCount || 2;

  // The design specifically shows:
  // "List of items purchased" -> "Cartridge Sheets 2"
  // "Confirmation" -> "Receipt has been shared to your WhatsApp"
  // "Delivery Info" -> "Please collect purchased items with receipt at stationery room"

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white flex flex-col items-center">
        <Header />

        <div className="w-full max-w-4xl px-6 py-20 md:py-32 flex-1 flex flex-col items-center justify-center">
          <AnimatedSection className="w-full text-center mb-10">
            <p className="text-gray-400 text-sm tracking-wider uppercase mb-5">Payment Status</p>
            <h1 className="text-3xl md:text-5xl font-medium tracking-wide">
              Payment Successful
            </h1>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-5 w-full max-w-2xl mx-auto mb-16">
            {/* Left box */}
            <AnimatedSection delay={0.1} className="w-full h-full">
              <div className="bg-[#1C1C1E] rounded-2xl p-8 h-full">
                <p className="text-xs text-gray-400 mb-6 font-medium">List of items purchased</p>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-200">Cartridge Sheets</span>
                  <span className="text-gray-200">{itemsCount}</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Right boxes (flex column) */}
            <div className="flex flex-col gap-5 w-full">
              <AnimatedSection delay={0.2}>
                <div className="bg-[#1C1C1E] rounded-2xl p-6">
                  <p className="text-xs text-gray-400 mb-3 font-medium">Confirmation</p>
                  <p className="text-gray-200 text-sm leading-relaxed pr-8">
                    Receipt has been shared to your WhatsApp
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={0.3}>
                <div className="bg-[#1C1C1E] rounded-2xl p-6">
                  <p className="text-xs text-gray-400 mb-3 font-medium">Delivery Info</p>
                  <p className="text-gray-200 text-sm leading-relaxed pr-4">
                    Please collect purchased items with receipt at stationery room
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>

          <AnimatedSection delay={0.4} className="text-center">
            <h2 className="text-xl md:text-2xl font-medium mb-3">
              Thank you for shopping with us!
            </h2>
            <p className="text-gray-300 text-lg mb-8">Need more</p>

            <div className="flex gap-4 justify-center">
              <Link
                to="/"
                className="bg-[#FFCC00] text-black px-8 py-2.5 rounded-xl font-medium hover:bg-[#E6B800] transition-colors"
              >
                Back to Home
              </Link>
              <Link
                to="/shop"
                className="bg-transparent border border-gray-600 text-gray-300 px-8 py-2.5 rounded-xl font-medium hover:bg-[#1C1C1E] hover:text-white transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrderConfirmation;
