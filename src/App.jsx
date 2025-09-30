import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";
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
    <ThemeProvider defaultTheme="light" storageKey="artisan-ui-theme">
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/login" element={<LayoutLogin />} />
            <Route path="/register" element={<LayoutRegister />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
