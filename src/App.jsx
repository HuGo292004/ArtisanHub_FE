import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Artisans from "@/components/Artisans";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="artisan-ui-theme">
      <div className="min-h-screen bg-white dark:bg-artisan-brown-950 text-artisan-brown-900 dark:text-artisan-brown-50">
        <Header />
        <main>
          <Hero />
          <Features />
          <Products />
          <Artisans />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
