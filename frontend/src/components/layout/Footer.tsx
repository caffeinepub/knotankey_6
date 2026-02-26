import { Link } from '@tanstack/react-router';
import { SiInstagram, SiPinterest } from 'react-icons/si';
import { Mail, Heart } from 'lucide-react';
import NewsletterSignup from './NewsletterSignup';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'knotankey');

  return (
    <footer className="bg-cream-200 border-t border-cream-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl text-warm-brown tracking-widest mb-3">knotankey</h3>
            <p className="font-sans text-sm text-warm-tan leading-relaxed">
              Soft luxury crocheted pieces, handcrafted with love and intention.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-tan hover:text-warm-brown transition-colors duration-300"
                aria-label="Instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-tan hover:text-warm-brown transition-colors duration-300"
                aria-label="Pinterest"
              >
                <SiPinterest className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base text-warm-brown mb-4 tracking-wide">Shop</h4>
            <ul className="space-y-2">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/custom-order', label: 'Custom Order' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-warm-tan hover:text-warm-brown transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-serif text-base text-warm-brown mb-4 tracking-wide">Policies</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/returns"
                  className="font-sans text-sm text-warm-tan hover:text-warm-brown transition-colors duration-300"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@knotankey.com"
                  className="font-sans text-sm text-warm-tan hover:text-warm-brown transition-colors duration-300 flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  hello@knotankey.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-base text-warm-brown mb-4 tracking-wide">Stay in Touch</h4>
            <p className="font-sans text-sm text-warm-tan mb-3">
              Subscribe for new arrivals and exclusive offers.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-warm-tan">
            © {year} knotankey. All rights reserved.
          </p>
          <p className="font-sans text-xs text-warm-tan flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-warm-brown fill-warm-brown" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-warm-brown transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
