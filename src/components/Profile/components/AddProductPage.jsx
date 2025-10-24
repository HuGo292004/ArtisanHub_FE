import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Save,
  X,
  Upload,
  DollarSign,
  Hash,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createProduct } from "@/services/authService";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Story: "",
    Price: "",
    DiscountPrice: "",
    StockQuantity: "",
    Weight: "",
    Status: "Available",
    CategoryId: "",
    Images: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    console.log("Files selected:", files);
    setFormData((prev) => ({
      ...prev,
      Images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "Images") {
          // Handle file upload specially
          if (formData[key] && formData[key].length > 0) {
            for (let i = 0; i < formData[key].length; i++) {
              formDataToSend.append("Images", formData[key][i]);
            }
          }
        } else {
          // Handle other fields
          if (formData[key] !== null && formData[key] !== "") {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Debug: Log form data
      console.log("Form data being sent:");
      for (let [key, value] of formDataToSend.entries()) {
        if (key === "Images") {
          console.log(
            `${key}:`,
            value instanceof File ? `File: ${value.name}` : value
          );
        } else {
          console.log(`${key}:`, value);
        }
      }

      const response = await createProduct(formDataToSend);

      // Debug: Log API response
      console.log("API Response:", response);

      if (response && response.isSuccess) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setError(response?.message || "Tạo sản phẩm thất bại");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Tạo sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
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
              Thêm sản phẩm mới
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-artisan-gold-400" />
                Thông tin cơ bản
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div>
                  <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                    Danh mục *
                  </label>
                  <select
                    name="CategoryId"
                    value={formData.CategoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="1">Gốm sứ</option>
                    <option value="2">Đồ gỗ</option>
                    <option value="3">Thêu may</option>
                    <option value="4">Đồng</option>
                    <option value="5">Khác</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                  Mô tả sản phẩm *
                </label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                  placeholder="Mô tả chi tiết về sản phẩm"
                />
              </div>

              <div className="mt-4">
                <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                  Câu chuyện sản phẩm
                </label>
                <textarea
                  name="Story"
                  value={formData.Story}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                  placeholder="Câu chuyện đằng sau sản phẩm"
                />
              </div>
            </Card>

            {/* Pricing Information */}
            <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-artisan-gold-400" />
                Thông tin giá cả
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                    Giá gốc (VNĐ) *
                  </label>
                  <input
                    type="number"
                    name="Price"
                    value={formData.Price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                    placeholder="Nhập giá gốc"
                  />
                </div>

                <div>
                  <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                    Giá khuyến mãi (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="DiscountPrice"
                    value={formData.DiscountPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                    placeholder="Nhập giá khuyến mãi"
                  />
                </div>
              </div>
            </Card>

            {/* Inventory Information */}
            <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-artisan-gold-400" />
                Thông tin kho hàng
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                    Số lượng tồn kho *
                  </label>
                  <input
                    type="number"
                    name="StockQuantity"
                    value={formData.StockQuantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                    placeholder="Số lượng"
                  />
                </div>

                <div>
                  <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                    Trọng lượng (kg)
                  </label>
                  <input
                    type="number"
                    name="Weight"
                    value={formData.Weight}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                    placeholder="Trọng lượng"
                  />
                </div>

                <div>
                  <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                    Trạng thái *
                  </label>
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                  >
                    <option value="Available">Có sẵn</option>
                    <option value="OutOfStock">Hết hàng</option>
                    <option value="Discontinued">Ngừng sản xuất</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Images Section */}
            <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2 text-artisan-gold-400" />
                Hình ảnh sản phẩm
              </h3>

              <div>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="inline-flex items-center px-4 py-2 bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white rounded-lg cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Chọn hình ảnh
                </label>
                <p className="text-artisan-brown-300 text-sm mt-2">
                  JPG, PNG tối đa 5MB mỗi ảnh. Có thể chọn nhiều ảnh.
                </p>

                {formData.Images && formData.Images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-artisan-brown-300 text-sm mb-4">
                      Đã chọn {formData.Images.length} ảnh:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from(formData.Images).map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-artisan-brown-800 border border-artisan-brown-600">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newFiles = Array.from(formData.Images);
                                newFiles.splice(index, 1);
                                setFormData((prev) => ({
                                  ...prev,
                                  Images: newFiles.length > 0 ? newFiles : null,
                                }));
                              }}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-artisan-brown-300 text-xs mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                Tạo sản phẩm thành công! Đang chuyển hướng...
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
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Tạo sản phẩm
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
