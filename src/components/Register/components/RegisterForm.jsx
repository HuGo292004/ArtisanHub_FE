import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register as registerApi } from "@/services/authService";
import { useToast } from "@/components/ui/Toast";

// Validation schema với Yup
const validationSchema = Yup.object({
  username: Yup.string()
    .required("Không được để trống")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
    ),
  password: Yup.string()
    .required("Không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  email: Yup.string()
    .required("Không được để trống")
    .email("Email không đúng định dạng"),
  phone: Yup.string()
    .nullable()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải có đúng 10 chữ số")
    .transform((value) => (value === "" ? null : value)),
  address: Yup.string().nullable(),
  gender: Yup.string().nullable(),
  dob: Yup.string().nullable(),
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      phone: "",
      address: "",
      gender: "Other",
      dob: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      setErrorMsg("");
      setSuccessMsg("");
      setSubmitting(true);

      try {
        // Create FormData for multipart/form-data
        const formData = new FormData();
        formData.append("Username", values.username);
        formData.append("Password", values.password);
        formData.append("Email", values.email);
        if (values.phone?.trim()) formData.append("Phone", values.phone);
        if (values.address?.trim()) formData.append("Address", values.address);
        if (values.gender?.trim()) formData.append("Gender", values.gender);
        if (values.dob?.trim()) formData.append("Dob", values.dob);
        if (avatarFile) formData.append("AvatarFile", avatarFile);

        const res = await registerApi(formData);
        if (res?.isSuccess) {
          setSuccessMsg("Đăng ký thành công. Vui lòng đăng nhập.");
          toast.success("Đăng ký thành công.");
          setTimeout(() => navigate("/login", { replace: true }), 800);
        } else {
          throw new Error(res?.message || "Đăng ký thất bại");
        }
      } catch (err) {
        const status = err?.status;
        const errorData = err?.data;
        let errorMessage = err?.message || "Đăng ký thất bại";

        // Xử lý lỗi 409 Conflict (thường là email/username đã tồn tại)
        if (status === 409) {
          errorMessage = "Thông tin đã tồn tại trong hệ thống";

          // Kiểm tra thông báo lỗi từ server để xác định trường nào bị trùng
          const serverMessage = (
            errorData?.message ||
            err?.message ||
            ""
          ).toLowerCase();

          if (
            serverMessage.includes("username") ||
            serverMessage.includes("tên đăng nhập") ||
            serverMessage.includes("tài khoản")
          ) {
            setFieldError("username", "Tên đăng nhập đã được sử dụng");
            errorMessage =
              "Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác.";
          } else if (
            serverMessage.includes("email") ||
            serverMessage.includes("thư điện tử") ||
            serverMessage.includes("e-mail")
          ) {
            setFieldError("email", "Email đã được sử dụng");
            errorMessage =
              "Email đã được sử dụng. Vui lòng sử dụng email khác.";
          } else if (
            serverMessage.includes("phone") ||
            serverMessage.includes("số điện thoại") ||
            serverMessage.includes("điện thoại")
          ) {
            setFieldError("phone", "Số điện thoại đã được sử dụng");
            errorMessage =
              "Số điện thoại đã được sử dụng. Vui lòng sử dụng số khác.";
          } else {
            // Nếu không xác định được trường cụ thể, hiển thị thông báo chung
            errorMessage =
              errorData?.message ||
              "Thông tin đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.";
          }
        } else if (status === 400) {
          // Xử lý lỗi validation từ server
          errorMessage = "Thông tin không hợp lệ";

          if (errorData?.errors) {
            const serverErrors = errorData.errors;
            Object.keys(serverErrors).forEach((key) => {
              const fieldName = key.toLowerCase();
              const errorValue = Array.isArray(serverErrors[key])
                ? serverErrors[key][0]
                : serverErrors[key];

              if (fieldName.includes("username") || fieldName === "username") {
                setFieldError(
                  "username",
                  errorValue || "Tên đăng nhập không hợp lệ"
                );
              } else if (fieldName.includes("email") || fieldName === "email") {
                setFieldError("email", errorValue || "Email không hợp lệ");
              } else if (
                fieldName.includes("password") ||
                fieldName === "password"
              ) {
                setFieldError(
                  "password",
                  errorValue || "Mật khẩu không hợp lệ"
                );
              } else if (fieldName.includes("phone") || fieldName === "phone") {
                setFieldError(
                  "phone",
                  errorValue || "Số điện thoại không hợp lệ"
                );
              } else if (
                fieldName.includes("address") ||
                fieldName === "address"
              ) {
                setFieldError("address", errorValue || "Địa chỉ không hợp lệ");
              } else if (fieldName.includes("dob") || fieldName === "dob") {
                setFieldError("dob", errorValue || "Ngày sinh không hợp lệ");
              } else if (
                fieldName.includes("gender") ||
                fieldName === "gender"
              ) {
                setFieldError("gender", errorValue || "Giới tính không hợp lệ");
              }
            });

            // Nếu có lỗi validation, cập nhật thông báo chung
            if (Object.keys(errorData.errors).length > 0) {
              errorMessage = "Vui lòng kiểm tra lại thông tin đã nhập";
            }
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } else if (status === 422) {
          // Unprocessable Entity - thường là lỗi validation
          errorMessage = errorData?.message || "Dữ liệu không hợp lệ";
          if (errorData?.errors) {
            const serverErrors = errorData.errors;
            Object.keys(serverErrors).forEach((key) => {
              const fieldName = key.toLowerCase();
              const errorValue = Array.isArray(serverErrors[key])
                ? serverErrors[key][0]
                : serverErrors[key];

              if (fieldName.includes("username"))
                setFieldError("username", errorValue);
              else if (fieldName.includes("email"))
                setFieldError("email", errorValue);
              else if (fieldName.includes("password"))
                setFieldError("password", errorValue);
              else if (fieldName.includes("phone"))
                setFieldError("phone", errorValue);
            });
          }
        }

        setErrorMsg(errorMessage);
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const onAvatarFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
  };

  return (
    <>
      {successMsg && (
        <div className="fixed top-4 right-4 z-[100] rounded-lg border border-green-400/40 bg-green-600/90 px-4 py-3 text-sm text-white shadow-lg">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-4 right-4 mt-12 z-[100] rounded-lg border border-red-400/40 bg-red-600/90 px-4 py-3 text-sm text-white shadow-lg">
          {errorMsg}
        </div>
      )}
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur-lg text-white">
        <h2 className="text-center text-3xl lg:text-4xl font-bold tracking-wide">
          Đăng ký
        </h2>
        <p className="mt-2 text-center text-white/85">
          Tạo tài khoản để tham gia ArtisanHub
        </p>

        <form
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5"
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="username"
            >
              Username <span className="text-red-400">*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="nghedanh_01"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-xs text-red-300">
                {formik.errors.username}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="password"
            >
              Mật khẩu <span className="text-red-400">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="********"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-red-300">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="email"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="user@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-300">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="phone"
            >
              Số điện thoại{" "}
              <span className="text-white/70 text-xs align-middle">
                (không bắt buộc)
              </span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="0901234567"
              maxLength={10}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-1 text-xs text-red-300">{formik.errors.phone}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="address"
            >
              Địa chỉ{" "}
              <span className="text-white/70 text-xs align-middle">
                (không bắt buộc)
              </span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            />
            {formik.touched.address && formik.errors.address && (
              <p className="mt-1 text-xs text-red-300">
                {formik.errors.address}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="avatarFile"
            >
              Ảnh đại diện{" "}
              <span className="text-white/70 text-xs align-middle">
                (không bắt buộc)
              </span>
            </label>
            <input
              id="avatarFile"
              name="avatarFile"
              type="file"
              accept="image/*"
              onChange={onAvatarFileChange}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 file:mr-4 file:rounded-lg file:border-0 file:bg-white/80 file:text-artisan-brown-900 file:px-4 file:py-2 text-white outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
            />
            {avatarFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(avatarFile)}
                  alt="avatar preview"
                  className="h-16 w-16 rounded-full object-cover border border-white/20"
                />
              </div>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="dob"
            >
              Ngày sinh{" "}
              <span className="text-white/70 text-xs align-middle">
                (không bắt buộc)
              </span>
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
            />
            {formik.touched.dob && formik.errors.dob && (
              <p className="mt-1 text-xs text-red-300">{formik.errors.dob}</p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="gender"
            >
              Giới tính{" "}
              <span className="text-white/70 text-xs align-middle">
                (không bắt buộc)
              </span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
            >
              <option className="bg-artisan-brown-900" value="Male">
                Nam
              </option>
              <option className="bg-artisan-brown-900" value="Female">
                Nữ
              </option>
              <option className="bg-artisan-brown-900" value="Other">
                Khác
              </option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="mt-1 text-xs text-red-300">
                {formik.errors.gender}
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-2">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full sm:w-auto rounded-xl bg-white/90 px-5 py-3 font-semibold text-artisan-brown-900 shadow-md transition hover:bg-yellow-500 hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </button>
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-white/10 active:scale-95"
            >
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
