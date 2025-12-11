import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Award,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import adminService from "@/services/adminService";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0,
    processingOrders: 0,
    shippingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0, // Tổng giá trị tất cả đơn hàng
    totalPlatformCommission: 0,
    totalArtistEarnings: 0,
    totalShippingFees: 0,
    paidCommissions: 0,
    unpaidCommissions: 0,
  });

  // Doanh thu thực từ đơn đã thanh toán (từ dashboard-statistics API)
  const [actualRevenue, setActualRevenue] = useState(0);

  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Tạo date range cho order statistics (từ đầu năm đến cuối năm)
      const currentYear = new Date().getFullYear();
      const fromDate = `${currentYear}-01-01T00:00:00Z`;
      const toDate = `${currentYear}-12-31T23:59:59Z`;

      const [
        dashboardResponse,
        productsResponse,
        artistsResponse,
        ordersResponse,
        allOrdersResponse,
        orderStatsResponse, // Thống kê đơn hàng
      ] = await Promise.allSettled([
        adminService.getDashboardStatistics(),
        adminService.getAllProducts({ page: 1, size: 10 }),
        adminService.getAllArtists(),
        adminService.getAllOrders({ page: 1, size: 5 }),
        adminService.getAllOrders({ page: 1, size: 100 }),
        adminService.getOrderStatistics({ fromDate, toDate }),
      ]);

      // Debug log để kiểm tra response
      console.log("=== Dashboard API Responses ===");
      console.log("1. Dashboard Statistics:", dashboardResponse);
      console.log("2. Products:", productsResponse);
      console.log("3. Artists:", artistsResponse);
      console.log("4. Orders:", ordersResponse);
      console.log("5. All Orders:", allOrdersResponse);
      console.log("6. Order Stats:", orderStatsResponse);

      // Xử lý dashboard statistics response
      let dashboardRevenue = 0; // Doanh thu từ đơn đã thanh toán
      let bestSelling = [];
      let revTrend = [];

      if (dashboardResponse.status === "fulfilled" && dashboardResponse.value) {
        const dashRes = dashboardResponse.value;
        console.log("Dashboard Data:", dashRes);

        // API /api/admin/dashboard-statistics trả về trực tiếp object (không wrap trong isSuccess)
        // Ví dụ: { totalRevenue: 36000, totalPlatformCommission: 24700, bestSellingProducts: [...], revenueTrend: [...] }
        dashboardRevenue = dashRes.totalRevenue || 0;
        bestSelling = dashRes.bestSellingProducts || [];
        revTrend = dashRes.revenueTrend || [];

        console.log(
          "Parsed Dashboard - Revenue (đã thanh toán):",
          dashboardRevenue
        );
        console.log("Parsed Dashboard - Best Selling:", bestSelling);
        console.log("Parsed Dashboard - Revenue Trend:", revTrend);
      }

      // Lưu doanh thu thực từ đơn đã thanh toán
      setActualRevenue(dashboardRevenue);

      // Xử lý products response
      let recentProductsList = [];
      if (productsResponse.status === "fulfilled" && productsResponse.value) {
        const prodRes = productsResponse.value;
        if (prodRes.isSuccess && prodRes.data) {
          recentProductsList = (prodRes.data.items || [])
            .slice(0, 5)
            .map((item) => ({
              id: item.productId,
              name: item.name,
              category: item.categoryName,
              price: item.price,
              image: parseProductImage(item.images),
              artist: item.artistName,
            }));
        }
      }

      // Xử lý orders response (5 đơn gần nhất)
      let recentOrdersList = [];
      if (ordersResponse.status === "fulfilled" && ordersResponse.value) {
        const orderRes = ordersResponse.value;
        if (orderRes.isSuccess && orderRes.data) {
          const items = orderRes.data.items || [];
          recentOrdersList = items.slice(0, 5).map((order) => ({
            id: order.orderId,
            orderCode: order.orderCode,
            customer: order.accountUsername || "N/A",
            amount: order.totalAmount || 0,
            status: order.status || "pending",
            date: order.orderDate
              ? new Date(order.orderDate).toLocaleDateString("vi-VN")
              : "N/A",
          }));
        }
      }

      // Xử lý allOrdersResponse để đếm số đơn chờ thanh toán chính xác
      let waitingForPaymentCount = 0;
      if (allOrdersResponse.status === "fulfilled" && allOrdersResponse.value) {
        const allOrderRes = allOrdersResponse.value;
        if (allOrderRes.isSuccess && allOrderRes.data) {
          const allItems = allOrderRes.data.items || [];
          waitingForPaymentCount = allItems.filter((o) =>
            o.status?.toLowerCase().includes("waiting")
          ).length;
          console.log(
            "Đơn 'Waiting for payment' từ danh sách:",
            waitingForPaymentCount
          );
          console.log("Tổng đơn trong danh sách:", allOrderRes.data.total);
        }
      }

      // Xử lý order statistics response
      let orderStatsData = {
        totalOrders: 0,
        pendingOrders: 0,
        paidOrders: 0,
        processingOrders: 0,
        shippingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        waitingForPayment: 0, // Thêm trường này
        totalRevenue: 0,
        totalPlatformCommission: 0,
        totalArtistEarnings: 0,
        totalShippingFees: 0,
        paidCommissions: 0,
        unpaidCommissions: 0,
      };
      if (
        orderStatsResponse.status === "fulfilled" &&
        orderStatsResponse.value
      ) {
        const statsRes = orderStatsResponse.value;
        console.log("Order Stats Raw Response:", statsRes);

        if (statsRes.isSuccess && statsRes.data) {
          console.log("Order Stats Data:", statsRes.data);
          orderStatsData = {
            totalOrders: statsRes.data.totalOrders || 0,
            pendingOrders: statsRes.data.pendingOrders || 0,
            paidOrders: statsRes.data.paidOrders || 0,
            processingOrders: statsRes.data.processingOrders || 0,
            shippingOrders: statsRes.data.shippingOrders || 0,
            deliveredOrders: statsRes.data.deliveredOrders || 0,
            cancelledOrders: statsRes.data.cancelledOrders || 0,
            totalRevenue: statsRes.data.totalRevenue || 0,
            totalPlatformCommission: statsRes.data.totalPlatformCommission || 0,
            totalArtistEarnings: statsRes.data.totalArtistEarnings || 0,
            totalShippingFees: statsRes.data.totalShippingFees || 0,
            paidCommissions: statsRes.data.paidCommissions || 0,
            unpaidCommissions: statsRes.data.unpaidCommissions || 0,
          };
          console.log("Parsed Order Stats:", orderStatsData);
        } else {
          console.warn(
            "Order Stats response không có isSuccess hoặc data:",
            statsRes
          );
        }
      } else {
        console.warn("Order Stats API failed:", orderStatsResponse);
      }

      setOrderStats(orderStatsData);

      setBestSellingProducts(bestSelling);
      setRevenueTrend(revTrend);
      setRecentProducts(recentProductsList);
      setRecentOrders(recentOrdersList);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);
      setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  const parseProductImage = (images) => {
    if (!images) return "/images/placeholder.jpg";
    if (typeof images === "string" && images.startsWith("{")) {
      const parsed = images.slice(1, -1).split(",")[0];
      return parsed.replace(/"/g, "") || "/images/placeholder.jpg";
    }
    if (typeof images === "string") return images;
    if (Array.isArray(images) && images.length > 0) return images[0];
    return "/images/placeholder.jpg";
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border border-amber-200",
      completed: "bg-sky-100 text-sky-700 border border-sky-200",
      shipped: "bg-violet-100 text-violet-700 border border-violet-200",
      delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      cancelled: "bg-rose-100 text-rose-700 border border-rose-200",
    };
    return (
      colors[status] || "bg-slate-100 text-slate-700 border border-slate-200"
    );
  };

  const getStatusText = (status) => {
    const texts = {
      active: "Hoạt động",
      pending: "Chờ xử lý",
      completed: "Hoàn thành",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-amber-600 animate-spin absolute top-0 left-3" />
          </div>
          <p className="text-slate-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            Đã xảy ra lỗi
          </h3>
          <p className="text-slate-600">{error}</p>
          <Button
            onClick={fetchDashboardData}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Tính max value cho chart
  const maxSold =
    bestSellingProducts.length > 0
      ? Math.max(...bestSellingProducts.map((p) => p.totalSold))
      : 100;

  const statsCards = [
    {
      title: "Doanh Thu Thực",
      value: formatCurrency(actualRevenue),
      change: `Từ ${orderStats.paidOrders} đơn đã thanh toán`,
      changeType: "positive",
      icon: BarChart3,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Tổng Giá Trị Đơn Hàng",
      value: formatCurrency(orderStats.totalRevenue),
      change: `Tổng ${orderStats.totalOrders} đơn (bao gồm chưa thanh toán)`,
      changeType: "neutral",
      icon: ShoppingCart,
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Hoa Hồng Nền Tảng",
      value: formatCurrency(orderStats.totalPlatformCommission),
      change: `Chưa thanh toán: ${formatCurrency(
        orderStats.unpaidCommissions
      )}`,
      changeType: "positive",
      icon: Percent,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Nghệ Nhân Nhận",
      value: formatCurrency(orderStats.totalArtistEarnings),
      change: "Tổng tiền nghệ nhân nhận",
      changeType: "neutral",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tổng Quan Hệ Thống</h1>
            <p className="text-amber-100 text-lg">
              Chào mừng bạn đến với bảng điều khiển quản lý ArtisanHub
            </p>
          </div>
          <Button
            onClick={fetchDashboardData}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1">
                  {stat.changeType === "positive" && (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  )}
                  {stat.changeType === "warning" && (
                    <TrendingDown className="w-4 h-4 text-amber-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-emerald-600"
                        : stat.changeType === "warning"
                        ? "text-amber-600"
                        : "text-slate-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Statistics Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl shadow-lg shadow-violet-200">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    📊 Thống Kê Đơn Hàng
                  </h2>
                  <p className="text-sm text-slate-500">
                    Phân bổ trạng thái đơn hàng năm {new Date().getFullYear()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-violet-600">
                  {orderStats.totalOrders.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Tổng đơn hàng</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {orderStats.totalOrders > 0 ? (
              <div className="space-y-4">
                {/* Donut Chart Visual */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    {/* SVG Donut Chart */}
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {(() => {
                        const total = orderStats.totalOrders || 1;
                        const segments = [
                          {
                            value: orderStats.pendingOrders,
                            color: "#f59e0b",
                            label: "Chờ xử lý",
                          },
                          {
                            value: orderStats.paidOrders,
                            color: "#10b981",
                            label: "Đã thanh toán",
                          },
                          {
                            value: orderStats.processingOrders,
                            color: "#3b82f6",
                            label: "Đang xử lý",
                          },
                          {
                            value: orderStats.shippingOrders,
                            color: "#8b5cf6",
                            label: "Đang giao",
                          },
                          {
                            value: orderStats.deliveredOrders,
                            color: "#06b6d4",
                            label: "Đã giao",
                          },
                          {
                            value: orderStats.cancelledOrders,
                            color: "#ef4444",
                            label: "Đã hủy",
                          },
                        ].filter((s) => s.value > 0);

                        let currentOffset = 0;
                        const radius = 35;
                        const circumference = 2 * Math.PI * radius;

                        return segments.map((segment, idx) => {
                          const percentage = (segment.value / total) * 100;
                          const strokeLength =
                            (percentage / 100) * circumference;
                          const offset = currentOffset;
                          currentOffset += strokeLength;

                          return (
                            <circle
                              key={idx}
                              cx="50"
                              cy="50"
                              r={radius}
                              fill="none"
                              stroke={segment.color}
                              strokeWidth="12"
                              strokeDasharray={`${strokeLength} ${
                                circumference - strokeLength
                              }`}
                              strokeDashoffset={-offset}
                              className="transition-all duration-500"
                            />
                          );
                        });
                      })()}
                      {/* Center circle */}
                      <circle cx="50" cy="50" r="25" fill="white" />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800">
                        {orderStats.totalOrders}
                      </span>
                      <span className="text-xs text-slate-500">đơn hàng</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Chờ xử lý",
                      value: orderStats.pendingOrders,
                      color: "bg-amber-500",
                      icon: Clock,
                    },
                    {
                      label: "Đã thanh toán",
                      value: orderStats.paidOrders,
                      color: "bg-emerald-500",
                      icon: CheckCircle,
                    },
                    {
                      label: "Đang xử lý",
                      value: orderStats.processingOrders,
                      color: "bg-blue-500",
                      icon: Package,
                    },
                    {
                      label: "Đang giao",
                      value: orderStats.shippingOrders,
                      color: "bg-violet-500",
                      icon: Truck,
                    },
                    {
                      label: "Đã giao",
                      value: orderStats.deliveredOrders,
                      color: "bg-cyan-500",
                      icon: CheckCircle,
                    },
                    {
                      label: "Đã hủy",
                      value: orderStats.cancelledOrders,
                      color: "bg-rose-500",
                      icon: XCircle,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center shadow-sm`}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className="text-lg font-bold text-slate-800">
                          {item.value.toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-xs font-medium text-slate-500">
                          {orderStats.totalOrders > 0
                            ? (
                                (item.value / orderStats.totalOrders) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">Chưa có đơn hàng</p>
              </div>
            )}
          </div>
        </div>

        {/* Commission & Revenue Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-200">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    💰 Thống Kê Tài Chính
                  </h2>
                  <p className="text-sm text-slate-500">
                    Doanh thu và hoa hồng năm {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Revenue Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Tổng Doanh Thu</p>
                  <p className="text-3xl font-bold mt-1">
                    {formatCurrency(orderStats.totalRevenue)}
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-amber-700 font-medium">
                    Hoa hồng nền tảng
                  </span>
                </div>
                <p className="text-2xl font-bold text-amber-800">
                  {formatCurrency(orderStats.totalPlatformCommission)}
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    Nghệ nhân nhận
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(orderStats.totalArtistEarnings)}
                </p>
              </div>

              <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-violet-600" />
                  <span className="text-sm text-violet-700 font-medium">
                    Phí vận chuyển
                  </span>
                </div>
                <p className="text-2xl font-bold text-violet-800">
                  {formatCurrency(orderStats.totalShippingFees)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  <span className="text-sm text-slate-700 font-medium">
                    HH chưa thanh toán
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {formatCurrency(orderStats.unpaidCommissions)}
                </p>
              </div>
            </div>

            {/* Commission Progress */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">
                  Tiến độ thanh toán hoa hồng
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {orderStats.totalPlatformCommission > 0
                    ? (
                        (orderStats.paidCommissions /
                          orderStats.totalPlatformCommission) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      orderStats.totalPlatformCommission > 0
                        ? (orderStats.paidCommissions /
                            orderStats.totalPlatformCommission) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>
                  Đã thanh toán: {formatCurrency(orderStats.paidCommissions)}
                </span>
                <span>
                  Còn lại: {formatCurrency(orderStats.unpaidCommissions)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Products Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-200">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  🏆 Top Sản Phẩm Bán Chạy
                </h2>
                <p className="text-sm text-slate-500">
                  Xếp hạng {bestSellingProducts.length} sản phẩm được mua nhiều
                  nhất
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-600">
                {bestSellingProducts
                  .reduce((sum, p) => sum + p.totalSold, 0)
                  .toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">Tổng đã bán</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {bestSellingProducts.length > 0 ? (
            <div className="space-y-5">
              {bestSellingProducts.map((product, index) => {
                const percentage = (
                  (product.totalSold / maxSold) *
                  100
                ).toFixed(1);
                const medalColors = [
                  {
                    bg: "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500",
                    text: "text-yellow-900",
                    shadow: "shadow-yellow-300",
                    icon: "🥇",
                  },
                  {
                    bg: "bg-gradient-to-r from-slate-300 via-gray-300 to-slate-400",
                    text: "text-slate-700",
                    shadow: "shadow-slate-300",
                    icon: "🥈",
                  },
                  {
                    bg: "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700",
                    text: "text-amber-100",
                    shadow: "shadow-amber-400",
                    icon: "🥉",
                  },
                ];
                const medal = medalColors[index] || null;

                return (
                  <div
                    key={index}
                    className={`group relative p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                      index < 3
                        ? "bg-gradient-to-r from-slate-50 to-white border-2 border-slate-100 hover:border-amber-200 hover:shadow-lg"
                        : "bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        {medal ? (
                          <div
                            className={`w-12 h-12 rounded-xl ${medal.bg} ${medal.text} shadow-lg ${medal.shadow} flex items-center justify-center`}
                          >
                            <span className="text-2xl">{medal.icon}</span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg">
                            #{index + 1}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors truncate">
                            {product.name}
                          </h3>
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                              Best Seller
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div
                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out ${
                              index === 0
                                ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500"
                                : index === 1
                                ? "bg-gradient-to-r from-slate-400 to-slate-500"
                                : index === 2
                                ? "bg-gradient-to-r from-amber-600 to-orange-600"
                                : "bg-gradient-to-r from-slate-400 to-slate-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                          {/* Percentage inside bar */}
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-sm">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Sales Count */}
                      <div className="flex-shrink-0 text-right">
                        <p
                          className={`text-2xl font-bold ${
                            index < 3 ? "text-amber-600" : "text-slate-700"
                          }`}
                        >
                          {product.totalSold.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">đã bán</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                Chưa có dữ liệu bán hàng
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Dữ liệu sẽ hiển thị khi có đơn hàng
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Trend Chart */}
      {revenueTrend.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-200">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    📈 Xu Hướng Doanh Thu
                  </h2>
                  <p className="text-sm text-slate-500">
                    Biểu đồ doanh thu theo thời gian ({revenueTrend.length}{" "}
                    ngày)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(
                    revenueTrend.reduce((sum, r) => sum + r.revenue, 0)
                  )}
                </p>
                <p className="text-xs text-slate-500">Tổng doanh thu</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Y-axis labels */}
            <div className="flex">
              <div className="w-20 flex flex-col justify-between h-64 pr-3 text-right">
                {[100, 75, 50, 25, 0].map((percent) => {
                  const maxRevenue = Math.max(
                    ...revenueTrend.map((r) => r.revenue)
                  );
                  const value = (maxRevenue * percent) / 100;
                  return (
                    <span
                      key={percent}
                      className="text-xs text-slate-400 font-medium"
                    >
                      {value >= 1000000
                        ? `${(value / 1000000).toFixed(1)}M`
                        : value >= 1000
                        ? `${(value / 1000).toFixed(0)}K`
                        : value.toLocaleString()}
                    </span>
                  );
                })}
              </div>

              {/* Chart area */}
              <div className="flex-1 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="border-t border-slate-100 border-dashed"
                    />
                  ))}
                </div>

                {/* Bars */}
                <div className="relative flex items-end justify-around gap-3 h-64 pt-4">
                  {revenueTrend.map((item, index) => {
                    const maxRevenue = Math.max(
                      ...revenueTrend.map((r) => r.revenue)
                    );
                    const height =
                      maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-2 bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-xl z-10 whitespace-nowrap">
                          <p className="text-emerald-300 font-bold">
                            {formatCurrency(item.revenue)}
                          </p>
                          <p className="text-slate-300">
                            {new Date(item.date).toLocaleDateString("vi-VN", {
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800" />
                        </div>

                        {/* Value label */}
                        <span className="text-xs font-bold text-emerald-600 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.revenue >= 1000000
                            ? `${(item.revenue / 1000000).toFixed(1)}M`
                            : item.revenue >= 1000
                            ? `${(item.revenue / 1000).toFixed(0)}K`
                            : item.revenue.toLocaleString()}
                        </span>

                        {/* Bar */}
                        <div
                          className="w-full max-w-16 rounded-t-xl transition-all duration-500 ease-out group-hover:scale-105 relative overflow-hidden"
                          style={{
                            height: `${Math.max(height, 5)}%`,
                            background: `linear-gradient(to top, #059669, #10b981, #34d399)`,
                          }}
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shine" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex mt-3 ml-20">
              {revenueTrend.map((item, index) => (
                <div key={index} className="flex-1 text-center">
                  <span className="text-xs font-medium text-slate-600">
                    {new Date(item.date).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Products and Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Sản Phẩm Mới Nhất
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/products")}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="px-6 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {product.category} • {product.artist}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-600">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Chưa có sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Đơn Hàng Gần Đây
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/orders")}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-6 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-800">
                        Đơn #{order.id}
                      </p>
                      <p className="text-sm text-slate-500">{order.customer}</p>
                      <p className="text-xs text-slate-400">{order.date}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-semibold text-slate-800">
                        {formatCurrency(order.amount)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
