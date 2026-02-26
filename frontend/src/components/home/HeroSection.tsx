import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import FloatingYarnAnimation from './FloatingYarnAnimation';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    const timer = setTimeout(() => setVisible(true), 300);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/hero-bg.dim_1920x1080.png')`,
          transform: `translateY(${offsetY * 0.4}px)`,
          willChange: 'transform',
        }}
      />

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-100/60 via-cream-100/30 to-cream-100/80" />

      {/* Floating yarn animation */}
      <FloatingYarnAnimation />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-warm-tan mb-4">
            Handcrafted with love
          </p>
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl text-warm-brown mb-6 leading-none tracking-widest">
            knotankey
          </h1>
          <p
            className={`font-sans text-lg sm:text-xl text-warm-tan mb-10 tracking-wide transition-all duration-1000 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Soft Luxury, Handcrafted With Love
          </p>
          <div
            className={`transition-all duration-1000 delay-400 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Link
              to="/products"
              className="inline-block bg-warm-brown text-cream-50 font-sans text-sm tracking-[0.2em] uppercase px-10 py-4 rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-warm-tan/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-warm-tan/50" />
      </div>
    </section>
  );
}
