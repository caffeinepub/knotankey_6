import { createRouter, RouterProvider, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Toaster } from '@/components/ui/sonner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/LoadingScreen';
import CartDrawer from './components/cart/CartDrawer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import CustomOrderPage from './pages/CustomOrderPage';
import ReturnsPage from './pages/ReturnsPage';
import AdminPage from './pages/AdminPage';

function Layout() {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar onCartClick={() => setCartDrawerOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
        <Toaster position="top-right" />
      </div>
    </CartProvider>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const productsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/products', component: ProductsPage });
const productDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/products/$id', component: ProductDetailPage });
const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/cart', component: CartPage });
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout', component: CheckoutPage });
const thankYouRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout/thank-you', component: ThankYouPage });
const customOrderRoute = createRoute({ getParentRoute: () => rootRoute, path: '/custom-order', component: CustomOrderPage });
const returnsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/returns', component: ReturnsPage });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminPage });

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  thankYouRoute,
  customOrderRoute,
  returnsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return <RouterProvider router={router} />;
}
