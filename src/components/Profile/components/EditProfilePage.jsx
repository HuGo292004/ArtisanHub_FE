import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Camera,
  Save,
  X,
  Phone,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile, updateProfile } from "@/services/authService";
import PageLoader from "@/components/ui/PageLoader";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Phone: "",
    Address: "",
    Gender: "",
    Dob: "",
    Password: "", // Thêm Password field
    AvatarFile: null,
  });

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProfile();

      if (response && response.isSuccess && response.data) {
        const userData = response.data;
        setUser(userData);
        // Map gender từ tiếng Anh sang tiếng Việt nếu cần
        const genderMap = {
          Male: "Nam",
          Female: "Nữ",
          Other: "Khác",
        };
        const gender = userData.gender || "";
        const mappedGender = genderMap[gender] || gender;

        setFormData({
          Username: userData.username || "",
          Email: userData.email || "",
          Phone:
            userData.phone && userData.phone !== "string" ? userData.phone : "",
          Address:
            userData.address && userData.address !== "string"
              ? userData.address
              : "",
          Gender: mappedGender,
          Dob: userData.dob ? userData.dob.split("T")[0] : "",
          Password: "", // Không hiển thị password cũ
          AvatarFile: null,
        });
      } else {
        setError("Không thể tải thông tin người dùng");
      }
    } catch {
      setError("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);
    setFormData((prev) => ({
      ...prev,
      AvatarFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Theo API spec: Username, Password, Email là required và PHẢI có giá trị
      // Các field khác (Phone, Address, Gender, Dob, AvatarFile) là optional

      // Validate required fields
      if (!formData.Username?.trim()) {
        setError("Tên người dùng không được để trống");
        setSaving(false);
        return;
      }

      if (!formData.Email?.trim()) {
        setError("Email không được để trống");
        setSaving(false);
        return;
      }

      if (!formData.Password?.trim()) {
        setError("Mật khẩu không được để trống");
        setSaving(false);
        return;
      }

      // Required fields - gửi với giá trị đã validate
      formDataToSend.append("Username", formData.Username.trim());
      formDataToSend.append("Email", formData.Email.trim());
      formDataToSend.append("Password", formData.Password.trim());

      // Optional fields - chỉ gửi khi có giá trị thực (không phải "string" placeholder)
      if (
        formData.Phone &&
        formData.Phone.trim() &&
        formData.Phone !== "string"
      ) {
        formDataToSend.append("Phone", formData.Phone.trim());
      }

      if (
        formData.Address &&
        formData.Address.trim() &&
        formData.Address !== "string"
      ) {
        formDataToSend.append("Address", formData.Address.trim());
      }

      if (formData.Gender && formData.Gender.trim()) {
        formDataToSend.append("Gender", formData.Gender.trim());
      }

      if (formData.Dob && formData.Dob.trim()) {
        formDataToSend.append("Dob", formData.Dob.trim());
      }

      // AvatarFile: chỉ gửi khi có file mới được chọn
      // Nếu không có file mới, không gửi field này (hoặc có thể gửi empty string tùy API)
      if (formData.AvatarFile && formData.AvatarFile instanceof File) {
        formDataToSend.append("AvatarFile", formData.AvatarFile);
      }

      // Debug: Log form data
      console.log("Form data being sent:");
      for (let [key, value] of formDataToSend.entries()) {
        if (key === "AvatarFile") {
          console.log(
            `${key}:`,
            value instanceof File ? `File: ${value.name}` : value || "(empty)"
          );
        } else {
          console.log(`${key}:`, value || "(empty)");
        }
      }

      const response = await updateProfile(user.accountId, formDataToSend);

      // Debug: Log API response
      console.log("API Response:", response);

      if (response && response.isSuccess) {
        setSuccess(true);
        // Navigate back to profile with refresh flag
        setTimeout(() => {
          navigate("/profile?refresh=true", { replace: true });
        }, 1500);
      } else {
        const errorMsg = response?.message || "Cập nhật thông tin thất bại";
        setError(errorMsg);
        console.error("Update failed:", response);
      }
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage =
        err?.message || err?.data?.message || "Cập nhật thông tin thất bại";
      setError(errorMessage);

      // Log chi tiết lỗi từ server
      if (err?.data) {
        console.error("Error details:", err.data);
      }
      if (err?.status) {
        console.error("Error status:", err.status);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    fetchProfile();
  };

  return (
    <PageLoader
      loading={loading}
      error={error && !user ? error : null}
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
                onClick={() => navigate("/profile")}
                className="text-artisan-gold-400 hover:text-artisan-gold-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>

              <h1 className="text-xl font-semibold text-white">
                Chỉnh sửa thông tin
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-artisan-gold-400" />
                  Ảnh đại diện
                </h3>

                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-artisan-brown-800 border-4 border-artisan-gold-500 overflow-hidden">
                      {user?.avatar && !formData.AvatarFile ? (
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : formData.AvatarFile ? (
                        <img
                          src={URL.createObjectURL(formData.AvatarFile)}
                          alt="New Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-artisan-gold-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="inline-flex items-center px-4 py-2 bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white rounded-lg cursor-pointer transition-colors"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Chọn ảnh mới
                    </label>
                    <p className="text-artisan-brown-300 text-sm mt-2">
                      JPG, PNG tối đa 5MB
                    </p>

                    {formData.AvatarFile && (
                      <div className="mt-4">
                        <p className="text-artisan-brown-300 text-sm mb-2">
                          Ảnh đã chọn:
                        </p>
                        <div className="relative inline-block">
                          <div className="w-32 h-32 rounded-lg overflow-hidden bg-artisan-brown-800 border border-artisan-brown-600">
                            <img
                              src={URL.createObjectURL(formData.AvatarFile)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                AvatarFile: null,
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 w-6 h-6 p-0 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-artisan-brown-300 text-xs mt-1">
                          {formData.AvatarFile.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Basic Information */}
              <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-artisan-gold-400" />
                  Thông tin cơ bản
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                      Tên người dùng *
                    </label>
                    <input
                      type="text"
                      name="Username"
                      value={formData.Username}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                      placeholder="Nhập tên người dùng"
                    />
                  </div>

                  <div>
                    <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      name="Password"
                      value={formData.Password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu"
                    />
                    <p className="text-artisan-brown-400 text-xs mt-1">
                      Mật khẩu là bắt buộc để cập nhật thông tin
                    </p>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-artisan-gold-400" />
                  Thông tin liên hệ
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="Phone"
                      value={formData.Phone === "string" ? "" : formData.Phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                      placeholder="0901234567"
                    />
                  </div>

                  <div>
                    <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      name="Address"
                      value={
                        formData.Address === "string" ? "" : formData.Address
                      }
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    />
                  </div>
                </div>
              </Card>

              {/* Personal Information */}
              <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-artisan-gold-400" />
                  Thông tin cá nhân
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                      Giới tính
                    </label>
                    <select
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="Dob"
                      value={formData.Dob}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </Card>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
                  Cập nhật thông tin thành công! Đang chuyển hướng...
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLoader>
  );
};

export default EditProfilePage;
