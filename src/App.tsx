import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Offerings from "./pages/Offerings";
import VendingMachine from "./pages/VendingMachine";
import SoftwareCourses from "./pages/SoftwareCourses";
import OfferingDetail from "./pages/OfferingDetail";
import Shop from "./pages/Shop";
import SheetTypes from "./pages/SheetTypes";
import SheetDetails from "./pages/SheetDetails";
import StationeryList from "./pages/StationeryList";
import StationeryDetails from "./pages/StationeryDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/offerings" element={<Offerings />} />
        <Route path="/offerings/vending-machine" element={<VendingMachine />} />
        <Route path="/offerings/software-courses" element={<SoftwareCourses />} />
        <Route path="/offerings/:slug" element={<OfferingDetail />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/drawing-sheets" element={<SheetTypes />} />
        <Route path="/shop/drawing-sheets/:sheetId" element={<SheetDetails />} />
        <Route path="/shop/stationery" element={<StationeryList />} />
        <Route path="/shop/stationery/:itemId" element={<StationeryDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
