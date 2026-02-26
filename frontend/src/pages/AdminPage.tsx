import { useState } from 'react';
import { Shield, LogOut, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminProductsManagement from '../components/admin/AdminProductsManagement';
import AdminOrdersManagement from '../components/admin/AdminOrdersManagement';
import AdminCustomOrdersViewer from '../components/admin/AdminCustomOrdersViewer';
import AdminReturnRequestsViewer from '../components/admin/AdminReturnRequestsViewer';

const ADMIN_PASSCODE = 'knotankey_admin_2026';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [storedPasscode, setStoredPasscode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setTimeout(() => {
      if (passcode === ADMIN_PASSCODE) {
        setAuthenticated(true);
        setStoredPasscode(passcode);
        setError('');
      } else {
        setError('Incorrect passcode. Please try again.');
      }
      setChecking(false);
    }, 400);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setStoredPasscode('');
    setPasscode('');
  };

  if (!authenticated) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Shield className="w-8 h-8 text-warm-brown" />
            </div>
            <h1 className="font-serif text-3xl text-warm-brown mb-1">Admin Access</h1>
            <p className="font-sans text-sm text-warm-tan">Enter your passcode to continue</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-card rounded-3xl shadow-soft border border-cream-300 p-8 space-y-5"
          >
            <div>
              <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
                Admin Passcode
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={e => { setPasscode(e.target.value); setError(''); }}
                  placeholder="Enter passcode"
                  className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown pr-10 ${
                    error ? 'border-destructive' : ''
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-tan hover:text-warm-brown transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="font-sans text-xs text-destructive mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={checking || !passcode}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-cream-200 py-10 px-4 border-b border-cream-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warm-tan mb-1">Protected Area</p>
            <h1 className="font-serif text-3xl text-warm-brown">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-sans text-sm text-warm-tan hover:text-warm-brown transition-colors border border-cream-300 px-4 py-2 rounded-full hover:bg-cream-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Tabs defaultValue="products">
          <TabsList className="bg-cream-200 border border-cream-300 rounded-2xl p-1 mb-8 flex flex-wrap gap-1 h-auto">
            <TabsTrigger
              value="products"
              className="font-sans text-sm rounded-xl data-[state=active]:bg-warm-brown data-[state=active]:text-cream-50 text-warm-tan"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="font-sans text-sm rounded-xl data-[state=active]:bg-warm-brown data-[state=active]:text-cream-50 text-warm-tan"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="custom-orders"
              className="font-sans text-sm rounded-xl data-[state=active]:bg-warm-brown data-[state=active]:text-cream-50 text-warm-tan"
            >
              Custom Orders
            </TabsTrigger>
            <TabsTrigger
              value="returns"
              className="font-sans text-sm rounded-xl data-[state=active]:bg-warm-brown data-[state=active]:text-cream-50 text-warm-tan"
            >
              Return Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <AdminProductsManagement passcode={storedPasscode} />
          </TabsContent>
          <TabsContent value="orders">
            <AdminOrdersManagement passcode={storedPasscode} />
          </TabsContent>
          <TabsContent value="custom-orders">
            <AdminCustomOrdersViewer passcode={storedPasscode} />
          </TabsContent>
          <TabsContent value="returns">
            <AdminReturnRequestsViewer passcode={storedPasscode} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
