import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  Package,
  ShoppingCart,
  UserCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Palette,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/services/authService";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("user_role");

        setIsLoggedIn(Boolean(token));
        setUserRole(role || "");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        if (role?.toLowerCase() !== "admin") {
          navigate("/login", { replace: true });
          return;
        }

        // Lấy thông tin user
        fetchUserInfo();
      } catch (error) {
        setIsLoggedIn(false);
        navigate("/login", { replace: true });
      }
    };

    const fetchUserInfo = async () => {
      try {
        const profileRes = await getProfile();
        setUserInfo(profileRes?.data);
      } catch (error) {
        // Fallback: tạo user info từ localStorage nếu có
        const email = localStorage.getItem("user_email") || "admin@example.com";
        setUserInfo({ username: null, email, role: "Admin" });
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      title: "Hệ Thống Quản Lý",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin",
      isHeader: true,
    },
    {
      title: "Tổng quan",
      icon: <Home className="h-5 w-5" />,
      href: "/admin",
      isActive: location.pathname === "/admin",
    },
    {
      title: "DANH MỤC QUẢN LÝ",
      isHeader: true,
    },
    {
      title: "Quản Lý Sản Phẩm",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
      isActive: location.pathname.startsWith("/admin/products"),
      subItems: [
        {
          title: "Danh sách sản phẩm",
          href: "/admin/products",
        },
        {
          title: "Danh mục sản phẩm",
          href: "/admin/products/categories",
        },
      ],
    },
    {
      title: "Quản Lý Nghệ Nhân",
      icon: <Palette className="h-5 w-5" />,
      href: "/admin/artists",
      isActive: location.pathname.startsWith("/admin/artists"),
    },
    {
      title: "Quản Lý Đơn Hàng",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/admin/orders",
      isActive: location.pathname.startsWith("/admin/orders"),
    },
    {
      title: "Quản Lý Khách Hàng",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
      isActive: location.pathname.startsWith("/admin/users"),
    },
    {
      title: "Quản Lý Tài Khoản",
      icon: <UserCheck className="h-5 w-5" />,
      href: "/admin/accounts",
      isActive: location.pathname.startsWith("/admin/accounts"),
    },
    {
      title: "Cài Đặt Hệ Thống",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      isActive: location.pathname.startsWith("/admin/settings"),
    },
  ];

  if (!isLoggedIn || userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-artisan-brown-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-artisan-gold-500 text-artisan-brown-900 shadow-lg">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-artisan-brown-900 hover:bg-artisan-gold-400"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Hệ Thống Quản Lý ArtisanHub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-artisan-brown-700" />
              <span className="text-sm font-medium text-artisan-brown-800">
                {userInfo?.email || "admin@example.com"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-artisan-brown-900 hover:bg-artisan-gold-400"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-artisan-brown-800 text-white transition-all duration-300 z-40 overflow-y-auto ${
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.isHeader ? (
                    <div className="px-3 py-2 text-xs font-semibold text-artisan-gold-300 uppercase tracking-wider">
                      {item.title}
                    </div>
                  ) : (
                    <div>
                      <a
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                          item.isActive
                            ? "bg-artisan-gold-600 text-white"
                            : "text-artisan-gold-200 hover:bg-artisan-brown-700 hover:text-white"
                        }`}
                      >
                        {item.icon}
                        {sidebarOpen && (
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        )}
                      </a>
                      {item.subItems && sidebarOpen && item.isActive && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <a
                              key={subIndex}
                              href={subItem.href}
                              className={`block px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                                location.pathname === subItem.href
                                  ? "bg-artisan-gold-500 text-white"
                                  : "text-artisan-gold-300 hover:bg-artisan-brown-700 hover:text-white"
                              }`}
                            >
                              {subItem.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 pt-16 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
