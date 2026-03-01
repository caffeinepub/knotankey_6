import React from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Instagram, Heart, Loader2 } from "lucide-react";
import { SiPinterest } from "react-icons/si";
import { toast } from "sonner";
import { useSubscribeToNewsletter } from "../../hooks/useQueries";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || "knotankey");

  return (
    <>
      {/* Thin divider line above footer */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "rgba(120,90,60,0.2)",
          marginTop: "80px",
          marginBottom: "40px",
        }}
      />

      <footer
        style={{
          background: "linear-gradient(180deg, #f7f3ee 0%, #f3eee8 100%)",
        }}
        className="text-footer-foreground pt-16 pb-8"
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <h3 className="font-display text-2xl font-bold text-footer-heading mb-3 tracking-wide">
                knotankey
              </h3>
              <p className="text-sm text-footer-muted leading-relaxed mb-2">
                Handcrafted crochet pieces made with love, one stitch at a time.
              </p>
              {/* Handmade with care signature */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#8b7355",
                  marginTop: "10px",
                  marginBottom: "20px",
                  lineHeight: "1.6",
                }}
              >
                Handmade with care.
                <br />
                Soft luxury crochet pieces crafted stitch by stitch.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/knotankey/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-footer-icon flex items-center justify-center hover:bg-footer-icon-hover transition-colors"
                  aria-label="Instagram"
                  style={{
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                    (e.currentTarget as HTMLElement).style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                >
                  <Instagram size={16} className="text-footer-foreground" />
                </a>
                <a
                  href="https://pin.it/2D3Yz0vWS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-footer-icon flex items-center justify-center hover:bg-footer-icon-hover transition-colors"
                  aria-label="Pinterest"
                  style={{
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                    (e.currentTarget as HTMLElement).style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                >
                  <SiPinterest size={16} className="text-footer-foreground" />
                </a>
                <a
                  href="mailto:knotankey@gmail.com"
                  className="w-9 h-9 rounded-full bg-footer-icon flex items-center justify-center hover:bg-footer-icon-hover transition-colors"
                  aria-label="Email"
                >
                  <Mail size={16} className="text-footer-foreground" />
                </a>
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h4 className="font-semibold text-footer-heading text-sm uppercase tracking-widest mb-4">
                Shop
              </h4>
              <ul className="space-y-2 text-sm text-footer-muted">
                <li>
                  <Link to="/products" className="hover:text-footer-heading transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <a href="/products?category=accessories" className="hover:text-footer-heading transition-colors">
                    Accessories
                  </a>
                </li>
                <li>
                  <a href="/products?category=home" className="hover:text-footer-heading transition-colors">
                    Home Décor
                  </a>
                </li>
                <li>
                  <a href="/products?category=wearables" className="hover:text-footer-heading transition-colors">
                    Wearables
                  </a>
                </li>
                <li>
                  <Link to="/custom-order" className="hover:text-footer-heading transition-colors">
                    Custom Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies Column */}
            <div>
              <h4 className="font-semibold text-footer-heading text-sm uppercase tracking-widest mb-4">
                Policies & Info
              </h4>
              <ul className="space-y-2 text-sm text-footer-muted">
                <li>
                  <Link to="/returns" className="hover:text-footer-heading transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <span className="text-footer-muted">Shipping: 5–10 business days</span>
                </li>
                <li>
                  <span className="text-footer-muted">Handmade — slight variations are natural</span>
                </li>
                <li>
                  <a
                    href="mailto:knotankey@gmail.com"
                    className="hover:text-footer-heading transition-colors"
                  >
                    knotankey@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h4 className="font-semibold text-footer-heading text-sm uppercase tracking-widest mb-4">
                Stay Connected
              </h4>
              <p className="text-sm text-footer-muted mb-4">
                New drops, behind-the-scenes, and unboxing videos (only when available) — straight to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Caffeine attribution divider */}
          <div className="border-t border-footer-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-footer-muted">
            <span className="flex items-center gap-1">
              Built with <Heart size={12} className="text-rose-400 fill-rose-400" /> using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-footer-heading transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </div>

          {/* Copyright line */}
          <p
            style={{
              fontSize: "13px",
              color: "#8b7355",
              textAlign: "center",
              marginTop: "40px",
              opacity: 0.8,
            }}
          >
            © {currentYear} knotankey — Handmade Crochet Luxury
          </p>
        </div>
      </footer>
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const subscribe = useSubscribeToNewsletter();

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      await subscribe.mutateAsync(email);
      setSubscribed(true);
      setEmail("");
      toast.success("You're subscribed! Welcome to the knotankey family 🎉");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="px-3 py-2 rounded-lg bg-footer-input border border-footer-border text-footer-foreground placeholder:text-footer-muted text-sm focus:outline-none focus:ring-2 focus:ring-footer-ring"
        disabled={subscribe.isPending || subscribed}
      />
      <button
        type="submit"
        disabled={subscribe.isPending || subscribed}
        className="px-4 py-2 rounded-lg bg-footer-btn text-footer-btn-text text-sm font-semibold hover:bg-footer-btn-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {subscribe.isPending ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Subscribing…
          </>
        ) : subscribed ? (
          "Subscribed! 🎉"
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}
