import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

export default function CTABanner() {
  const ref = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 linen-bg">
      <div
        className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="font-serif text-4xl md:text-5xl text-warm-brown mb-6 leading-tight">
          Wrap Yourself in
          <br />
          Handmade Luxury
        </h2>
        <p className="font-sans text-warm-tan mb-10 text-lg">
          Discover our full collection of handcrafted crochet pieces.
        </p>
        <Link
          to="/products"
          className="inline-block bg-warm-brown text-cream-50 font-sans text-sm tracking-[0.2em] uppercase px-12 py-4 rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300"
        >
          Explore All Products
        </Link>
      </div>
    </section>
  );
}
