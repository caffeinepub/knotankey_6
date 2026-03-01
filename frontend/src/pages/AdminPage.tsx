import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminProductsManagement from "@/components/admin/AdminProductsManagement";
import AdminOrdersManagement from "@/components/admin/AdminOrdersManagement";
import AdminCustomOrdersViewer from "@/components/admin/AdminCustomOrdersViewer";
import AdminReturnRequestsViewer from "@/components/admin/AdminReturnRequestsViewer";
import { Lock, ShieldCheck } from "lucide-react";

const ADMIN_PASSCODE = "knotankey_admin_2026";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-serif">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your passcode to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode">Passcode</Label>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Access Dashboard
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground font-serif">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your knotankey store
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAuthenticated(false);
              setPasscode("");
            }}
          >
            Sign Out
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="custom-orders">Custom Orders</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <AdminProductsManagement passcode={ADMIN_PASSCODE} />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrdersManagement passcode={ADMIN_PASSCODE} />
          </TabsContent>

          <TabsContent value="custom-orders">
            <AdminCustomOrdersViewer passcode={ADMIN_PASSCODE} />
          </TabsContent>

          <TabsContent value="returns">
            <AdminReturnRequestsViewer passcode={ADMIN_PASSCODE} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
