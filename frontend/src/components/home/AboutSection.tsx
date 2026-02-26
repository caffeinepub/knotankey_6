import { useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/generated/about-bg.dim_1200x600.png')` }}
      />
      <div className="absolute inset-0 bg-cream-100/80" />

      <div
        className={`relative z-10 max-w-3xl mx-auto px-4 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-warm-tan mb-4">Our Story</p>
        <h2 className="font-serif text-4xl md:text-5xl text-warm-brown mb-8 leading-tight">
          Crafted with intention,<br />worn with love
        </h2>
        <div className="w-16 h-px bg-warm-tan mx-auto mb-8" />
        <p className="font-sans text-lg text-warm-tan leading-relaxed">
          knotankey creates soft luxury crocheted pieces designed to bring warmth, comfort, and elegance into everyday life.
        </p>
        <p className="font-sans text-base text-warm-tan/80 leading-relaxed mt-4">
          Every stitch is placed with care, every piece made to last — because true luxury is in the details.
        </p>
      </div>
    </section>
  );
}
