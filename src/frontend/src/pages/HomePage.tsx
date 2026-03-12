import AboutSection from "../components/home/AboutSection";
import BestSellersSection from "../components/home/BestSellersSection";
import CTABanner from "../components/home/CTABanner";
import HeroSection from "../components/home/HeroSection";
import { useSEO } from "../hooks/useSEO";

export default function HomePage() {
  useSEO({
    title: "Handmade Crochet Products",
    description:
      "Shop premium handmade crochet products by Knotankey. Soft luxury keychains, bags, plushies, and more — crafted stitch by stitch with love.",
    url: "/",
  });

  return (
    <div className="pt-0">
      <HeroSection />
      <BestSellersSection />
      <AboutSection />
      <CTABanner />
    </div>
  );
}
