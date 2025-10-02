// Dark mode removed: ThemeProvider no longer used
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
import AboutPage from "@/components/About/AboutPage";

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
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
          <Route path="/login" element={<LayoutLogin />} />
          <Route path="/register" element={<LayoutRegister />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
