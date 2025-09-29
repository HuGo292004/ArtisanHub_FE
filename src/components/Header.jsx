import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, ShoppingBag, User, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navItems = [
    { name: "Trang chủ", href: "#" },
    { name: "Sản phẩm", href: "#products" },
    { name: "Nghệ nhân", href: "#artisans" },
    { name: "Về chúng tôi", href: "#about" },
    { name: "Liên hệ", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-artisan-brown-950/95 backdrop-blur-md shadow-lg border-b border-artisan-brown-200 dark:border-artisan-brown-800"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="font-display text-xl lg:text-2xl font-bold text-artisan-brown-900 dark:text-artisan-brown-50">
                ArtisanHub
              </h1>
              <p className="text-xs text-artisan-brown-600 dark:text-artisan-brown-400 hidden sm:block">
                Nghệ thuật thủ công
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-artisan-brown-700 dark:text-artisan-brown-300 hover:text-artisan-gold-600 dark:hover:text-artisan-gold-400 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-artisan-gold-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-artisan-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button className="ml-4" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-artisan-brown-200 dark:border-artisan-brown-800 bg-white dark:bg-artisan-brown-950 absolute left-0 right-0 top-full shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-artisan-brown-700 dark:text-artisan-brown-300 hover:text-artisan-gold-600 dark:hover:text-artisan-gold-400 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center space-x-4 pt-4 border-t border-artisan-brown-200 dark:border-artisan-brown-800">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-artisan-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
