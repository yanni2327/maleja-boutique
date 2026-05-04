import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout        from "./components/Layout";
import Index         from "./pages/Index";
import Shop          from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart          from "./pages/Cart";
import Admin         from "./pages/Admin";
import OrderResponse from "./pages/OrderResponse";
import AuthCallback  from "./pages/AuthCallback";
import AdminGuard    from "./components/AdminGuard";
import NotFound      from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"               element={<Index />} />
            <Route path="/shop"           element={<Shop />} />
            <Route path="/product/:id"    element={<ProductDetail />} />
            <Route path="/cart"           element={<Cart />} />
            <Route path="/order-response" element={<OrderResponse />} />
            <Route path="/admin"          element={
              <AdminGuard>
                <Admin />
              </AdminGuard>
            } />
          </Route>
          <Route path="/auth-callback"    element={<AuthCallback />} />
          <Route path="*"                 element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
