import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const reviews = [
  {
    name: "Priya S.",
    college: "SPA Delhi",
    rating: 5,
    text: "ARTECO saved me during my thesis submission. Got cartridge sheets from the vending machine at 2 AM! Incredible service and dedication.",
    initials: "PS",
  },
  {
    name: "Rahul M.",
    college: "CEPT Ahmedabad",
    rating: 5,
    text: "The software courses are incredibly well-structured. Learned Rhino + Grasshopper in just 3 weeks. Worth every rupee!",
    initials: "RM",
  },
  {
    name: "Ananya K.",
    college: "JJ School of Art",
    rating: 4,
    text: "Online stationery delivery is super fast. The micro pens quality is excellent for drafting. Highly recommended.",
    initials: "AK",
  },
  {
    name: "Vikram P.",
    college: "IIT Kharagpur",
    rating: 5,
    text: "The AR/VR walkthrough of my design project impressed my jury. Highly recommend ARTECO to all architecture students!",
    initials: "VP",
  },
  {
    name: "Sneha R.",
    college: "NIT Trichy",
    rating: 5,
    text: "Educational tours organized by ARTECO gave us real exposure to architectural marvels you just can't get in classroom.",
    initials: "SR",
  },
  {
    name: "Arjun D.",
    college: "BIT Mesra",
    rating: 4,
    text: "The vending machine on campus is a lifesaver. No more running to stationery shops at the last minute before studio!",
    initials: "AD",
  },
];

const PAGE_SIZE = 3;
const TOTAL_PAGES = Math.ceil(reviews.length / PAGE_SIZE);

const ReviewsSection = () => {
  const [page, setPage] = useState(0);
  const visible = reviews.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        {/* Header row */}
        <AnimatedSection>
          <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-wider uppercase">
                Reviews
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                Read the success stories and heartfelt testimonials from our valued students.
                Discover why they chose Arteco for their academic needs.
              </p>
            </div>
            <button className="shrink-0 px-5 py-2.5 bg-foreground text-background text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
              View All Testimonials
            </button>
          </div>
        </AnimatedSection>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visible.map((review, i) => (
            <AnimatedSection key={review.name} delay={i * 0.1}>
              <div className="review-card flex flex-col justify-between h-full min-h-[220px]">
                {/* Stars */}
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${
                          j < review.rating
                            ? "text-primary fill-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-sm mb-2">{
                    review.rating === 5 ? "Exceptional Service!" :
                    i === 1 ? "Efficient and Reliable" : "Trusted Advisors"
                  }</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "{review.text}"
                  </p>
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: "hsl(0 0% 20%)",
                      color: "hsl(0 0% 80%)",
                    }}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.college}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <span className="text-xs text-muted-foreground">
            {page + 1} of {TOTAL_PAGES * PAGE_SIZE}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="arrow-btn disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(TOTAL_PAGES - 1, p + 1))}
              disabled={page === TOTAL_PAGES - 1}
              className="arrow-btn disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

