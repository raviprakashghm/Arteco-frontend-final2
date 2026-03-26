import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OfferingCard from "@/components/OfferingCard";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

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

const Offerings = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <AnimatedSection>
            <h1 className="text-3xl font-bold mb-8 text-center">OUR OFFERINGS</h1>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {offerings.map((o, i) => (
              <AnimatedSection key={o.title} delay={i * 0.1}>
                <OfferingCard {...o} />
              </AnimatedSection>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Offerings;
