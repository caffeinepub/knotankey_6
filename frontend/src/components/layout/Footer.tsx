import React from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Instagram } from "lucide-react";
import { SiPinterest } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
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
