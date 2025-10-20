// Dark mode removed: ThemeProvider no longer used
import { ToastProvider } from "@/components/ui/Toast";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Artisans from "@/components/Artisans";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { LayoutLogin } from "@/components/Login/LayoutLogin";
import { LayoutRegister } from "./components/Register/LayoutRegister";
import AboutPage from "@/components/About/AboutPage";
import ContactPage from "@/components/Contact/ContactPage";
import { ArtistLayout } from "./components/Artist/ArtistLayout";
import { ProductLayout } from "./components/Product/ProductLayout";
import CartPage from "@/components/Cart/CartPage";

function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-artisan-brown-950 text-artisan-brown-900 dark:text-artisan-brown-50">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <Products />
      <Artisans />
      <Testimonials />
    </main>
  );
}

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductLayout />} />
              <Route path="/artisans" element={<ArtistLayout />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>
            <Route path="/login" element={<LayoutLogin />} />
            <Route path="/register" element={<LayoutRegister />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
