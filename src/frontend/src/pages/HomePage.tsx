import AboutSection from "../components/home/AboutSection";
import BestSellersSection from "../components/home/BestSellersSection";
import CTABanner from "../components/home/CTABanner";
import HeroSection from "../components/home/HeroSection";

export default function HomePage() {
  return (
    <div className="pt-0">
      <HeroSection />
      <BestSellersSection />
      <AboutSection />
      <CTABanner />
    </div>
  );
}
