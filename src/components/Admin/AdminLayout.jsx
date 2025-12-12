/* eslint-disable no-unused-vars */
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
  Bell,
  Search,
  Wallet,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/services/authService";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      title: "Tổng quan",
      icon: Home,
      href: "/admin",
      isActive: location.pathname === "/admin",
    },
    {
      title: "Quản Lý Sản Phẩm",
      icon: Package,
      href: "/admin/products",
      isActive: location.pathname.startsWith("/admin/products"),
    },
    {
      title: "Quản Lý Đơn Hàng",
      icon: ShoppingCart,
      href: "/admin/orders",
      isActive: location.pathname.startsWith("/admin/orders"),
    },
    {
      title: "Quản Lý Giao Dịch",
      icon: Wallet,
      href: "/admin/transactions",
      isActive: location.pathname.startsWith("/admin/transactions"),
    },
    {
      title: "Yêu Cầu Rút Tiền",
      icon: Banknote,
      href: "/admin/withdraw-requests",
      isActive: location.pathname.startsWith("/admin/withdraw-requests"),
    },
    {
      title: "Quản Lý Tài Khoản",
      icon: UserCheck,
      href: "/admin/accounts",
      isActive: location.pathname.startsWith("/admin/accounts"),
    },
  ];

  if (!isLoggedIn || userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col ${
          sidebarCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">ArtisanHub</h1>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mx-auto">
              <Palette className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <p className="px-3 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menu chính
            </p>
          )}
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  item.isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                title={sidebarCollapsed ? item.title : ""}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    item.isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.title}</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* User Info & Collapse Button */}
        <div className="border-t border-slate-800 p-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800/50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userInfo?.username || "Admin"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {userInfo?.email || "admin@example.com"}
                </p>
              </div>
            </div>
          )}
          <div
            className={`flex ${sidebarCollapsed ? "flex-col gap-2" : "gap-2"}`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`text-slate-400 hover:text-white hover:bg-slate-800 ${
                sidebarCollapsed ? "w-full justify-center" : ""
              }`}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Thu gọn
                </>
              )}
            </Button>
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Đăng xuất
              </Button>
            )}
            {sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 w-full justify-center"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {menuItems.find((item) => item.isActive)?.title || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-slate-700"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {userInfo?.username || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
