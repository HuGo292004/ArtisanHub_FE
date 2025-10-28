import { useState, useEffect } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsers: 0,
    newProducts: 0,
    pendingOrders: 0,
    revenueGrowth: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Mock data - thay thế bằng API calls thực tế
    setStats({
      totalUsers: 1247,
      totalProducts: 89,
      totalOrders: 342,
      totalRevenue: 125000000,
      newUsers: 23,
      newProducts: 5,
      pendingOrders: 12,
      revenueGrowth: 12.5,
    });

    setRecentProducts([
      {
        id: 1,
        name: "Tranh Thêu Tay Hoa Sen",
        category: "Tranh Thêu",
        price: 2500000,
        status: "active",
        image: "/images/detlua_bg.jpg",
      },
      {
        id: 2,
        name: "Gốm Sứ Bát Tràng",
        category: "Gốm Sứ",
        price: 1800000,
        status: "active",
        image: "/images/gom_bg.jpg",
      },
      {
        id: 3,
        name: "Nón Lá Huế",
        category: "Nón Lá",
        price: 450000,
        status: "active",
        image: "/images/nonla_bg.jpg",
      },
      {
        id: 4,
        name: "Mây Tre Đan",
        category: "Mây Tre",
        price: 320000,
        status: "active",
        image: "/images/maytre_bg.jpg",
      },
    ]);

    setRecentOrders([
      {
        id: "ORD001",
        customer: "Nguyễn Văn A",
        product: "Tranh Thêu Tay Hoa Sen",
        amount: 2500000,
        status: "pending",
        date: "2024-01-15",
      },
      {
        id: "ORD002",
        customer: "Trần Thị B",
        product: "Gốm Sứ Bát Tràng",
        amount: 1800000,
        status: "completed",
        date: "2024-01-14",
      },
      {
        id: "ORD003",
        customer: "Lê Văn C",
        product: "Nón Lá Huế",
        amount: 450000,
        status: "shipped",
        date: "2024-01-13",
      },
    ]);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "pending":
        return "Chờ xử lý";
      case "completed":
        return "Hoàn thành";
      case "shipped":
        return "Đã giao";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tổng Quan Hệ Thống
        </h1>
        <p className="text-gray-600">
          Chào mừng bạn đến với bảng điều khiển quản lý ArtisanHub
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng Người Dùng
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />+{stats.newUsers} mới
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng Sản Phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProducts}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />+{stats.newProducts} mới
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng Đơn Hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
              <p className="text-sm text-yellow-600 flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" />
                {stats.pendingOrders} chờ xử lý
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng Doanh Thu
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />+{stats.revenueGrowth}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Sản Phẩm Mới Nhất
              </h2>
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-sm font-semibold text-artisan-gold-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Đơn Hàng Gần Đây
              </h2>
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {order.id}
                    </p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.product}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.amount)}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thao Tác Nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex items-center justify-center space-x-2 h-12">
            <Plus className="h-5 w-5" />
            <span>Thêm Sản Phẩm Mới</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
          >
            <Users className="h-5 w-5" />
            <span>Quản Lý Người Dùng</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Xem Đơn Hàng</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
