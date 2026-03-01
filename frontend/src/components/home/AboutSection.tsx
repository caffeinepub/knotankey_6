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
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/generated/crochet-about-bg.dim_1920x1080.jpg')` }}
      />

      {/* Dark gradient overlay — sits between image and text */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45), rgba(0,0,0,0.55))',
        }}
      />

      {/* Hero content — above overlay */}
      <div
        className={`relative z-20 max-w-3xl mx-auto px-4 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* "OUR STORY" label */}
        <p
          className="font-sans text-xs tracking-[0.3em] uppercase mb-4"
          style={{
            color: '#F8F5F0',
            textShadow: '0px 2px 10px rgba(0,0,0,0.35)',
          }}
        >
          Our Story
        </p>

        {/* Headline */}
        <h2
          className="font-serif text-4xl md:text-5xl mb-8 leading-tight"
          style={{
            color: '#F8F5F0',
            textShadow: '0px 2px 10px rgba(0,0,0,0.35)',
          }}
        >
          Crafted with intention,<br />worn with love
        </h2>

        {/* Divider */}
        <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: '#F8F5F0', opacity: 0.6 }} />

        {/* Primary paragraph */}
        <p
          className="font-sans text-lg leading-relaxed"
          style={{
            color: '#EDE7E0',
            opacity: 0.95,
            textShadow: '0px 2px 10px rgba(0,0,0,0.35)',
          }}
        >
          knotankey creates soft luxury crocheted pieces designed to bring warmth, comfort, and elegance into everyday life.
        </p>

        {/* Secondary paragraph */}
        <p
          className="font-sans text-base leading-relaxed mt-4"
          style={{
            color: '#EDE7E0',
            opacity: 0.95,
            textShadow: '0px 2px 10px rgba(0,0,0,0.35)',
          }}
        >
          Every stitch is placed with care, every piece made to last — because true luxury is in the details.
        </p>
      </div>
    </section>
  );
}
