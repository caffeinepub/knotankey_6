import HeroSection from '../components/home/HeroSection';
import BestSellersSection from '../components/home/BestSellersSection';
import AboutSection from '../components/home/AboutSection';
import CTABanner from '../components/home/CTABanner';

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
