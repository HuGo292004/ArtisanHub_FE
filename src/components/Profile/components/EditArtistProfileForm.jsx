/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Camera, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateArtistProfile } from "@/services/artistService";
import { useToast } from "@/components/ui/Toast";

const validationSchema = Yup.object({
  ArtistName: Yup.string().required("Tên nghệ nhân không được để trống"),
  ShopName: Yup.string().required("Tên cửa hàng không được để trống"),
  Bio: Yup.string().nullable(),
  Location: Yup.string().nullable(),
  SocialLinks: Yup.string().nullable(),
  Specialty: Yup.string().nullable(),
  ExperienceYears: Yup.number()
    .nullable()
    .min(0, "Số năm kinh nghiệm phải >= 0")
    .integer("Số năm kinh nghiệm phải là số nguyên"),
  Achievements: Yup.array().nullable(),
});

const EditArtistProfileForm = ({ artistProfile, onSuccess, onCancel }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      ArtistName: artistProfile?.artistName || "",
      ShopName: artistProfile?.shopName || "",
      Bio: artistProfile?.bio || "",
      Location: artistProfile?.location || "",
      SocialLinks: artistProfile?.socialLinks || "",
      Specialty: artistProfile?.specialty || "",
      ExperienceYears: artistProfile?.experienceYears || "",
      Achievements: artistProfile?.achievements || [],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();

        // Required fields
        formData.append("ArtistName", values.ArtistName.trim());
        formData.append("ShopName", values.ShopName.trim());

        // Optional fields - chỉ gửi khi có giá trị
        if (values.Bio?.trim()) {
          formData.append("Bio", values.Bio.trim());
        }
        if (values.Location?.trim()) {
          formData.append("Location", values.Location.trim());
        }
        if (values.SocialLinks?.trim()) {
          formData.append("SocialLinks", values.SocialLinks.trim());
        }
        if (values.Specialty?.trim()) {
          formData.append("Specialty", values.Specialty.trim());
        }
        if (values.ExperienceYears) {
          formData.append("ExperienceYears", parseInt(values.ExperienceYears));
        }
        if (values.Achievements && values.Achievements.length > 0) {
          formData.append("Achievements", JSON.stringify(values.Achievements));
        }

        // ProfileImage - chỉ gửi nếu có file mới
        if (profileImage && profileImage instanceof File) {
          formData.append("ProfileImage", profileImage);
        }

        const response = await updateArtistProfile(formData);

        if (response?.isSuccess) {
          toast.success("Cập nhật thông tin cửa hàng thành công!");
          if (onSuccess) onSuccess();
        } else {
          throw new Error(response?.message || "Cập nhật thất bại");
        }
      } catch (err) {
        console.error("Update artist profile error:", err);
        console.error("Error status:", err?.status);
        console.error("Error data:", err?.data);
        
        let errorMessage = "Cập nhật thất bại";
        
        if (err?.status === 403) {
          errorMessage = "Bạn không có quyền cập nhật thông tin cửa hàng này";
        } else if (err?.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại";
        } else if (err?.message) {
          errorMessage = err.message;
        }
        
        toast.error(errorMessage);

        // Xử lý lỗi validation từ server
        if (err?.data?.errors) {
          const serverErrors = err.data.errors;
          Object.keys(serverErrors).forEach((key) => {
            const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
            const errorValue = Array.isArray(serverErrors[key])
              ? serverErrors[key][0]
              : serverErrors[key];
            setFieldError(fieldName, errorValue);
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (artistProfile?.profileImage) {
      setImagePreview(artistProfile.profileImage);
    }
  }, [artistProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(artistProfile?.profileImage || null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Chỉnh sửa thông tin cửa hàng
        </h2>
        <p className="text-artisan-brown-300 mb-6">
          Cập nhật thông tin cửa hàng và hồ sơ nghệ nhân của bạn.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
              Ảnh đại diện
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-artisan-brown-800 border-4 border-artisan-gold-500 overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-artisan-gold-400" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="profileImage"
                  className="inline-flex items-center px-4 py-2 bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white rounded-lg cursor-pointer transition-colors"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {imagePreview ? "Đổi ảnh" : "Chọn ảnh"}
                </label>
                {profileImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Required Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                Tên nghệ nhân <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="ArtistName"
                value={formik.values.ArtistName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                placeholder="Nhập tên nghệ nhân"
              />
              {formik.touched.ArtistName && formik.errors.ArtistName && (
                <p className="mt-1 text-xs text-red-300">
                  {formik.errors.ArtistName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                Tên cửa hàng <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="ShopName"
                value={formik.values.ShopName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                placeholder="Nhập tên cửa hàng"
              />
              {formik.touched.ShopName && formik.errors.ShopName && (
                <p className="mt-1 text-xs text-red-300">
                  {formik.errors.ShopName}
                </p>
              )}
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
              Giới thiệu
            </label>
            <textarea
              name="Bio"
              value={formik.values.Bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
              placeholder="Giới thiệu về bạn và cửa hàng"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                Địa điểm
              </label>
              <input
                type="text"
                name="Location"
                value={formik.values.Location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                placeholder="Thành phố, quốc gia"
              />
            </div>

            <div>
              <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                Chuyên môn
              </label>
              <input
                type="text"
                name="Specialty"
                value={formik.values.Specialty}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                placeholder="Ví dụ: Gốm sứ, Đan lát, Thêu may"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                Số năm kinh nghiệm
              </label>
              <input
                type="number"
                name="ExperienceYears"
                value={formik.values.ExperienceYears}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="0"
                className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                placeholder="0"
              />
              {formik.touched.ExperienceYears &&
                formik.errors.ExperienceYears && (
                  <p className="mt-1 text-xs text-red-300">
                    {formik.errors.ExperienceYears}
                  </p>
                )}
            </div>

            <div>
              <label className="block text-artisan-brown-300 text-sm font-medium mb-2">
                Liên kết mạng xã hội
              </label>
              <input
                type="text"
                name="SocialLinks"
                value={formik.values.SocialLinks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 bg-artisan-brown-800 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                placeholder="Facebook, Instagram, Website..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang cập nhật...
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
      </Card>
    </div>
  );
};

export default EditArtistProfileForm;

