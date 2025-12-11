import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Camera,
  Store,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile } from "@/services/authService";
import { getArtistProfile } from "@/services/artistService";
import MyStore from "./components/MyStore";
import RegisterArtistForm from "./components/RegisterArtistForm";
import ArtistOrdersContent from "./components/ArtistOrdersContent";
import CustomerOrdersContent from "./components/CustomerOrdersContent";
import PageLoader from "@/components/ui/PageLoader";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [hasArtistProfile, setHasArtistProfile] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProfile();

      if (response && response.isSuccess && response.data) {
        setUser(response.data);
        // Update avatar version để force reload ảnh
        if (response.data.avatar) {
          setAvatarVersion((prev) => prev + 1);
        }

        // Kiểm tra xem user có artist profile không
        try {
          const artistResponse = await getArtistProfile();
          if (
            artistResponse &&
            artistResponse.isSuccess &&
            artistResponse.data
          ) {
            setHasArtistProfile(true);
          } else {
            setHasArtistProfile(false);
          }
        } catch {
          // Nếu không có artist profile, set false
          setHasArtistProfile(false);
        }
      } else {
        setError("Không thể tải thông tin người dùng");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    // Kiểm tra query param để tự động hiển thị form đăng ký
    const registerParam = searchParams.get("register");
    if (registerParam === "artist") {
      setShowRegisterForm(true);
      setActiveTab("register");
    }

    // Kiểm tra query param để refresh profile sau khi edit
    const refreshParam = searchParams.get("refresh");
    if (refreshParam === "true") {
      fetchProfile();
      // Remove refresh param from URL sau khi refresh
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("refresh");
      const newSearch = newSearchParams.toString();
      navigate(`/profile${newSearch ? `?${newSearch}` : ""}`, {
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Format role
  const formatRole = (role) => {
    const roleMap = {
      Customer: "Khách hàng",
      Artist: "Nghệ nhân",
      Admin: "Quản trị viên",
    };
    return roleMap[role] || role;
  };

  const handleRetry = () => {
    fetchProfile();
  };

  return (
    <PageLoader
      loading={loading}
      error={
        error ||
        (!user && !loading ? "Không tìm thấy thông tin người dùng" : null)
      }
      onRetry={handleRetry}
      loadingText="Đang tải thông tin người dùng..."
      errorTitle="Không thể tải thông tin"
      className="min-h-screen bg-artisan-brown-950"
    >
      <div className="min-h-screen bg-artisan-brown-950">
        {/* Header */}
        <div className="bg-artisan-brown-900 border-b border-artisan-brown-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-artisan-gold-400 hover:text-artisan-gold-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại trang chủ
              </Button>

              <div className="flex items-center gap-4">
                {activeTab === "profile" && !showRegisterForm && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/profile/edit")}
                    className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex">
          <div className="w-64 bg-artisan-brown-900 border-r border-artisan-brown-700 min-h-screen">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Menu</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setShowRegisterForm(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "profile" && !showRegisterForm
                      ? "bg-artisan-gold-500 text-white"
                      : "text-artisan-brown-300 hover:text-white hover:bg-artisan-brown-800"
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Thông tin cá nhân
                </button>
                {/* Đơn hàng của tôi - Chỉ hiển thị cho Customer (không phải Artist) */}
                {user?.role !== "Artist" && !hasArtistProfile && (
                  <button
                    onClick={() => {
                      setActiveTab("my-orders");
                      setShowRegisterForm(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "my-orders" && !showRegisterForm
                        ? "bg-artisan-gold-500 text-white"
                        : "text-artisan-brown-300 hover:text-white hover:bg-artisan-brown-800"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 mr-3" />
                    Đơn hàng của tôi
                  </button>
                )}
                {(user?.role === "Artist" || hasArtistProfile) && (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab("store");
                        setShowRegisterForm(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === "store" && !showRegisterForm
                          ? "bg-artisan-gold-500 text-white"
                          : "text-artisan-brown-300 hover:text-white hover:bg-artisan-brown-800"
                      }`}
                    >
                      <Store className="w-5 h-5 mr-3" />
                      Cửa hàng của tôi
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("shop-orders");
                        setShowRegisterForm(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === "shop-orders" && !showRegisterForm
                          ? "bg-artisan-gold-500 text-white"
                          : "text-artisan-brown-300 hover:text-white hover:bg-artisan-brown-800"
                      }`}
                    >
                      <Package className="w-5 h-5 mr-3" />
                      Đơn hàng của Shop
                    </button>
                  </>
                )}
                {!hasArtistProfile && user?.role === "Customer" && (
                  <button
                    onClick={() => {
                      setShowRegisterForm(true);
                      setActiveTab("register");
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      showRegisterForm
                        ? "bg-artisan-gold-500 text-white"
                        : "text-artisan-gold-400 hover:text-white hover:bg-artisan-gold-500 border border-artisan-gold-500"
                    }`}
                  >
                    <Store className="w-5 h-5 mr-3" />
                    Đăng ký bán hàng
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          {showRegisterForm ? (
            <div className="flex-1 p-8">
              <RegisterArtistForm
                onSuccess={() => {
                  setShowRegisterForm(false);
                  setHasArtistProfile(true);
                  setActiveTab("store");
                  fetchProfile(); // Refresh để lấy role mới
                }}
                onCancel={() => setShowRegisterForm(false)}
              />
            </div>
          ) : (
            <div className="flex-1 bg-artisan-brown-950">
              {activeTab === "store" ? (
                <MyStore />
              ) : activeTab === "shop-orders" ? (
                <ArtistOrdersContent />
              ) : activeTab === "my-orders" ? (
                <CustomerOrdersContent />
              ) : (
                <div className="container mx-auto px-4 py-8">
                  <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="text-center mb-8">
                      <div className="relative inline-block">
                        <div className="w-32 h-32 rounded-full bg-artisan-brown-800 border-4 border-artisan-gold-500 overflow-hidden mx-auto mb-4">
                          {user?.avatar ? (
                            <img
                              key={`${user.avatar}-${avatarVersion}`}
                              src={`${
                                user.avatar
                              }?v=${avatarVersion}&t=${Date.now()}`}
                              alt={user?.username || "User"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full flex items-center justify-center ${
                              user?.avatar ? "hidden" : "flex"
                            }`}
                          >
                            <User className="w-16 h-16 text-artisan-gold-400" />
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="absolute bottom-0 right-0 bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white rounded-full w-8 h-8 p-0"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>

                      <h1 className="text-3xl font-bold text-white mb-2">
                        {user?.username || "Người dùng"}
                      </h1>
                      <div className="flex items-center justify-center gap-2 text-artisan-gold-400">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">
                          {formatRole(user?.role)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-artisan-gold-400" />
                        Thông tin cá nhân
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-artisan-gold-400 mr-3" />
                          <div>
                            <p className="text-artisan-brown-300 text-sm">
                              Email
                            </p>
                            <p className="text-white font-medium">
                              {user?.email || "Chưa cập nhật"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-artisan-gold-400 mr-3" />
                          <div>
                            <p className="text-artisan-brown-300 text-sm">
                              Số điện thoại
                            </p>
                            <p className="text-white font-medium">
                              {user?.phone || "Chưa cập nhật"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-artisan-gold-400 mr-3" />
                          <div>
                            <p className="text-artisan-brown-300 text-sm">
                              Địa chỉ
                            </p>
                            <p className="text-white font-medium">
                              {user?.address || "Chưa cập nhật"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-artisan-gold-400 mr-3" />
                          <div>
                            <p className="text-artisan-brown-300 text-sm">
                              Ngày sinh
                            </p>
                            <p className="text-white font-medium">
                              {formatDate(user?.dob)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Account Information */}
                    <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-artisan-gold-400" />
                        Thông tin tài khoản
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <p className="text-artisan-brown-300 text-sm">
                            ID tài khoản
                          </p>
                          <p className="text-white font-medium">
                            #{user?.accountId || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-artisan-brown-300 text-sm">
                            Vai trò
                          </p>
                          <p className="text-artisan-gold-400 font-medium">
                            {formatRole(user?.role)}
                          </p>
                        </div>

                        <div>
                          <p className="text-artisan-brown-300 text-sm">
                            Trạng thái
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user?.status === "Active"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {user?.status === "Active"
                              ? "Hoạt động"
                              : "Không hoạt động"}
                          </span>
                        </div>

                        <div>
                          <p className="text-artisan-brown-300 text-sm">
                            Giới tính
                          </p>
                          <p className="text-white font-medium">
                            {user?.gender || "Chưa cập nhật"}
                          </p>
                        </div>

                        <div>
                          <p className="text-artisan-brown-300 text-sm">
                            Ngày tạo tài khoản
                          </p>
                          <p className="text-white font-medium">
                            {formatDate(user?.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white px-8 py-3"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Quay lại trang chủ
                    </Button>

                    <Button
                      onClick={() => navigate("/profile/edit")}
                      className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white px-8 py-3"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa thông tin
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLoader>
  );
};

export default ProfilePage;
