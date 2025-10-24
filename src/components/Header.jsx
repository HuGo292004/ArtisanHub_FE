import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { cartItemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("access_token");
        setIsLoggedIn(Boolean(token));
        if (!token) setIsProfileOpen(false);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
    const onStorage = (e) => {
      if (e.key === "access_token") checkAuth();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isProfileOpen]);

  const handleCartClick = () => {
    navigate("/cart");
    setIsProfileOpen(false); // Close profile if open
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } catch {
      // ignore storage errors
    }
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    navigate("/", { replace: true });
  };

  const navItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Cửa hàng", href: "/stores" },
    { name: "Về chúng tôi", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-artisan-gold-500 border-b border-artisan-gold-600 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="font-display text-xl lg:text-2xl font-bold text-artisan-brown-900">
                  ArtisanHub
                </h1>
                <p className="text-xs text-white hidden sm:block">
                  Nghệ thuật thủ công
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-artisan-brown-900 hover:text-artisan-brown-950 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-artisan-brown-900 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={handleCartClick}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Button>
            )}
            {isLoggedIn && (
              <div className="relative" ref={profileRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsProfileOpen((v) => !v)}
                >
                  <User className="h-5 w-5" />
                </Button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-artisan-gold-200 bg-white shadow-lg py-1 z-[60]">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-artisan-brown-800 hover:bg-artisan-brown-50"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/profile");
                      }}
                    >
                      Thông tin cá nhân
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Dark mode toggle removed */}
            {!isLoggedIn && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Đăng nhập
                </Button>
                <Button variant="ghost" onClick={() => navigate("/register")}>
                  Đăng ký
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Dark mode toggle removed */}
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
          <div className="lg:hidden border-t border-artisan-gold-200 bg-white absolute left-0 right-0 top-full shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-artisan-brown-700 hover:text-artisan-gold-600 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center space-x-4 pt-4 border-t border-artisan-gold-200">
                {isLoggedIn && (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                      onClick={() => {
                        navigate("/cart");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemCount > 99 ? "99+" : cartItemCount}
                        </span>
                      )}
                    </Button>
                  </div>
                )}
                {isLoggedIn ? (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Hồ sơ
                  </Button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <Button
                      className="flex-1"
                      variant="ghost"
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => {
                        navigate("/register");
                        setIsMenuOpen(false);
                      }}
                    >
                      Đăng ký
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
