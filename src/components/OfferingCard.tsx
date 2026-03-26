import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface OfferingCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

const OfferingCard = ({ title, description, image, href }: OfferingCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <Link to={href} className="offering-card card-shine block">
        <div className="p-4 pb-2">
          <h3 className="font-bold text-sm tracking-widest uppercase text-foreground">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>
        <div
          className="rounded-xl m-3 mt-2 overflow-hidden"
          style={{ background: "hsl(0 0% 11%)" }}
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            width={260}
            height={220}
            className="w-full h-[210px] object-cover rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default OfferingCard;
