import { useState, useEffect } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import MusicToggle from './MusicToggle';

interface NavbarProps {
  onCartClick: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/custom-order', label: 'Custom Order' },
    { to: '/returns', label: 'Returns' },
  ];

  const currentPath = router.state.location.pathname;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/95 backdrop-blur-md shadow-soft border-b border-cream-300'
          : 'bg-cream-100/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/assets/generated/logo.dim_400x120.png"
              alt="knotankey"
              className="h-8 md:h-10 w-auto object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const sibling = target.nextElementSibling as HTMLElement;
                if (sibling) sibling.style.display = 'block';
              }}
            />
            <span
              className="font-serif text-2xl md:text-3xl text-warm-brown tracking-widest hidden"
              style={{ display: 'none' }}
            >
              knotankey
            </span>
            <span className="font-serif text-2xl md:text-3xl text-warm-brown tracking-widest ml-1">
              knotankey
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-sans text-sm tracking-wider uppercase transition-colors duration-300 relative group ${
                  currentPath === link.to
                    ? 'text-warm-brown'
                    : 'text-warm-tan hover:text-warm-brown'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-warm-brown transition-all duration-300 ${
                  currentPath === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <MusicToggle />

            <button
              onClick={onCartClick}
              className="relative p-2 text-warm-tan hover:text-warm-brown transition-colors duration-300"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-warm-brown text-cream-50 text-xs font-sans font-medium rounded-full flex items-center justify-center animate-cart-bounce">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-warm-tan hover:text-warm-brown transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream-100/98 backdrop-blur-md border-t border-cream-300 animate-fade-in">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`font-sans text-sm tracking-wider uppercase py-2 border-b border-cream-300 transition-colors ${
                  currentPath === link.to ? 'text-warm-brown' : 'text-warm-tan'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
