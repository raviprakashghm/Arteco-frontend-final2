import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import { Plane, Headphones, Home, Coffee, BookOpen, Layers, Laptop, PenTool } from "lucide-react";
import educationalToursImg from "@/assets/educational-tours.jpg";

export default function About() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white selection:bg-primary/30">
        <Header />

        {/* Global Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none opacity-50"></div>

        <div className="container mx-auto px-6 py-6 pb-24 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-16">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white">About Us</span>
          </div>

          {/* Hero Header - Arteco General */}
          <AnimatedSection className="text-center mb-24 max-w-4xl mx-auto">
            <h3 className="text-primary tracking-widest uppercase text-sm font-semibold mb-6 drop-shadow-[0_0_15px_rgba(255,204,0,0.5)]">
              Welcome To Arteco
            </h3>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-xl mb-6 leading-tight">
              A Hub For All <br className="hidden md:block"/> Architectural Needs
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              From drawing sheets and stationery to software courses, and immersive AR/VR solutions, we empower architecture students and professionals with everything they need to succeed.
            </p>
          </AnimatedSection>

          {/* Our Core Offerings - Overall Website */}
          <section className="mb-32">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">What Makes Arteco Unique?</h2>
              <p className="text-gray-400 text-sm mb-12 text-center">We bring automation, education, and inspiration to architecture.</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedSection delay={0.1}>
                <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-white/5 hover:border-primary/50 transition-colors h-full">
                  <Layers className="h-10 w-10 text-primary mb-5" />
                  <h3 className="text-lg font-bold mb-3">Campus Vending</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">Smart vending machines bringing instant access to A1/A2 cartridge sheets right to campus doorsteps. No more running to the store at 2 AM.</p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-white/5 hover:border-primary/50 transition-colors h-full">
                  <PenTool className="h-10 w-10 text-primary mb-5" />
                  <h3 className="text-lg font-bold mb-3">Online Stationery</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">A comprehensive online store for premium architectural tools, scales, and materials delivered directly to your dorm or residence.</p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.3}>
                <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-white/5 hover:border-primary/50 transition-colors h-full">
                  <Laptop className="h-10 w-10 text-primary mb-5" />
                  <h3 className="text-lg font-bold mb-3">Software Courses</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">Expert-led courses covering AutoCAD, SketchUp, Revit, Lumion, and Blender. From absolute beginners to advanced rendering techniques.</p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.4}>
                <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-white/5 hover:border-primary/50 transition-colors h-full">
                  <BookOpen className="h-10 w-10 text-primary mb-5" />
                  <h3 className="text-lg font-bold mb-3">AR/VR Visualization</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">Cutting-edge immersive reality solutions allowing you to walk through and experience your own designs before they are ever built.</p>
                </div>
              </AnimatedSection>
            </div>
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-32"></div>

          {/* Educational Expeditions Header */}
          <AnimatedSection className="text-center mb-16 max-w-4xl mx-auto">
            <h3 className="text-primary tracking-widest uppercase text-sm font-semibold mb-6 drop-shadow-[0_0_15px_rgba(255,204,0,0.5)]">
              Arteco Educational Expeditions
            </h3>
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-xl mb-6">
              Learning Beyond The Classroom
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto">
              Travel Isn't Just About Seeing The World. At Arteco, It's About Understanding It.
            </p>
          </AnimatedSection>

          {/* What We Do - Expeditions */}
          <AnimatedSection className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] relative">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
                <img 
                  src={educationalToursImg} 
                  alt="Students on educational tour" 
                  className="w-full h-full object-cover select-none filter brightness-90 saturate-150"
                  loading="lazy"
                />
              </div>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-light">
                <p>
                  We Turn Academic Concepts Into Unforgettable<br />
                  Real-World Experiences Through Immersive,<br />
                  Curriculum-Aligned Educational Tours.
                </p>
                <p>
                  Whether You're A School, University, Or<br />
                  Independent Learning Group—Arteco Connects<br />
                  Students With The Places, People, And Practices<br />
                  That Bring Textbooks To Life.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Why Choose Arteco */}
          <section className="mb-32">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose Arteco Tours?</h2>
              <p className="text-gray-400 text-sm mb-12">We ensure each expedition is designed to meet students' academic needs.</p>
            </AnimatedSection>

            {/* Grid 1 */}
            <div className="mb-12">
              <h3 className="text-sm font-semibold tracking-wider text-gray-300 mb-6">Cover Key Topics:</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatedSection delay={0.1} className="group">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden aspect-square relative">
                    <img src="https://images.unsplash.com/photo-1541888081692-067da0ee4dd5?auto=format&fit=crop&q=80&w=600" alt="Site Visits" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                      <p className="font-semibold text-lg text-white">Site Visits</p>
                    </div>
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.2} className="group">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden aspect-square relative">
                    <img src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&q=80&w=600" alt="Expert-Led Sessions" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                      <p className="font-semibold text-lg text-white">Expert-Led Sessions</p>
                    </div>
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.3} className="group">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden aspect-square relative">
                    <img src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&q=80&w=600" alt="Live Demonstrations" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                      <p className="font-semibold text-lg text-white">Live Demonstrations</p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>

            {/* Grid 2 */}
            <div className="mb-12">
              <h3 className="text-sm font-semibold tracking-wider text-gray-300 mb-6">Encourage Practical Learning By Engaging In:</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatedSection delay={0.1} className="group">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden aspect-square relative">
                    <img src="https://images.unsplash.com/photo-1548625361-ec884d5df620?auto=format&fit=crop&q=80&w=600" alt="Heritage Structures" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                      <p className="font-semibold text-lg text-white">Heritage Structures</p>
                    </div>
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.2} className="group">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden aspect-square relative">
                    <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=600" alt="Sustainable Projects" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                      <p className="font-semibold text-lg text-white">Sustainable Projects</p>
                    </div>
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.3} className="group">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden aspect-square relative">
                    <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600" alt="Real World Challenges" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                      <p className="font-semibold text-lg text-white">Real World Challenges</p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>

            {/* Grid 3 */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-300 mb-6">Explore Materials & Methods:</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatedSection delay={0.1} className="group">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden aspect-square relative">
                    <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600" alt="Local Artisans" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                      <p className="font-semibold text-lg text-white">Local Artisans</p>
                    </div>
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.2} className="group">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden aspect-square relative">
                    <img src="https://images.unsplash.com/photo-1550858599-2a9d6fc57fb0?auto=format&fit=crop&q=80&w=600" alt="Materials" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                      <p className="font-semibold text-lg text-white">Materials</p>
                    </div>
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.3} className="group">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden aspect-square relative">
                    <img src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=600" alt="Site Analysis" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                      <p className="font-semibold text-lg text-white">Site Analysis</p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>

          {/* We Handle The Rest */}
          <AnimatedSection className="mb-32">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">We Handle The Rest</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/30 transition-colors cursor-default">
                <Plane className="w-8 h-8 text-primary" />
                <span className="font-semibold text-sm tracking-wider uppercase">Transportation</span>
              </div>
              <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/30 transition-colors cursor-default">
                <Headphones className="w-8 h-8 text-primary" />
                <span className="font-semibold text-sm tracking-wider uppercase">On Ground Support</span>
              </div>
              <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/30 transition-colors cursor-default">
                <Home className="w-8 h-8 text-primary" />
                <span className="font-semibold text-sm tracking-wider uppercase">Accommodation</span>
              </div>
              <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/30 transition-colors cursor-default">
                <Coffee className="w-8 h-8 text-primary" />
                <span className="font-semibold text-sm tracking-wider uppercase">Food</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Explore Tours By Location */}
          <AnimatedSection className="max-w-xl mb-32">
            <h2 className="text-2xl font-bold mb-8">Explore Tours By Location</h2>
            <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed">
              <p className="font-bold text-white">Interactive Global Map Experience</p>
              <div className="space-y-4">
                <p>Tap On A Country Or Region To:</p>
                <ul className="space-y-2 list-none font-light">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary relative shadow-[0_0_5px_rgba(255,204,0,1)]"></span> Watch An Immersive Animation Unfold</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary relative shadow-[0_0_5px_rgba(255,204,0,1)]"></span> Discover Academic Tour Itineraries</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary relative shadow-[0_0_5px_rgba(255,204,0,1)]"></span> See Key Learning Objectives</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary relative shadow-[0_0_5px_rgba(255,204,0,1)]"></span> Preview Landmark Site Visits</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary relative shadow-[0_0_5px_rgba(255,204,0,1)]"></span> Learn About Cultural Activities & Workshops</li>
                </ul>
              </div>
              <p className="text-gray-500 pt-4 italic">(Coming Soon - Stay Tuned)</p>
            </div>
          </AnimatedSection>

          {/* Footer Statement */}
          <AnimatedSection className="text-center mb-32 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold shadow-xl text-white tracking-widest leading-tight">
              Arteco = Education + Experience
            </h2>
            <div className="space-y-2 text-gray-400 font-light text-lg">
              <p>We Don't Just Organize Tours.</p>
              <p>We Design Learning Journeys.</p>
            </div>
            <p className="text-gray-300">
              Let us help your students experience the world as their classroom.
            </p>
          </AnimatedSection>

          {/* Contact Form */}
          <section className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto bg-[#0a0a0a] p-8 md:p-12 border border-white/5 rounded-[2rem]">
            <AnimatedSection>
              <h2 className="text-2xl font-bold mb-4">Let's Plan Your Academic Future</h2>
              <h3 className="text-5xl font-bold mb-6 text-white leading-tight">Contact Us</h3>
              <p className="text-gray-400 text-sm">
                Do you have any questions or feedback? Feel<br />
                free to send us a message!
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Message sent! Our team will get back to you soon.'); }}>
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-2 block">Name</label>
                  <input type="text" placeholder="Eg. John Doe" 
                    className="w-full bg-transparent border-b border-gray-700 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors hover:border-gray-500" required />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-2 block">Email</label>
                  <input type="email" placeholder="Eg. john@email.com" 
                    className="w-full bg-transparent border-b border-gray-700 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors hover:border-gray-500" required />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-2 block">Message</label>
                  <textarea placeholder="Hello, I would like to get in touch with you concerning my upcoming workshop... Please call me back during the half of my lunch. Thank you!" 
                    className="w-full bg-transparent border-b border-gray-700 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors min-h-[100px] resize-none hover:border-gray-500" required />
                </div>
                <button type="submit" className="bg-primary text-black font-semibold rounded-lg px-8 py-3 flex items-center gap-2 hover:bg-primary/90 transition-colors mt-8">
                  Send <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </form>
            </AnimatedSection>
          </section>

        </div>
      </div>
    </PageTransition>
  );
}
