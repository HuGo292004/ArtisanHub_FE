import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "@/services/authService";
import { useToast } from "@/components/ui/Toast";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "Artist",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    gender: "Other",
    dob: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const toast = useToast();
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onAvatarFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((p) => ({ ...p, avatar: String(reader.result) }));
    reader.readAsDataURL(file);
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
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg("");
            setSuccessMsg("");
            setIsSubmitting(true);
            // client-side required validation
            const nextErrors = {};
            if (!form.username?.trim())
              nextErrors.username = "Không được để trống";
            if (!form.password?.trim())
              nextErrors.password = "Không được để trống";
            if (!form.phone?.trim()) nextErrors.phone = "Không được để trống";
            if (!form.address?.trim())
              nextErrors.address = "Không được để trống";
            if (!form.dob?.trim()) nextErrors.dob = "Không được để trống";
            if (!form.role?.trim()) nextErrors.role = "Không được để trống";
            if (Object.keys(nextErrors).length > 0) {
              setErrors(nextErrors);
              setIsSubmitting(false);
              return;
            }
            try {
              const res = await registerApi({ ...form });
              if (res?.isSuccess) {
                setSuccessMsg("Đăng ký thành công. Vui lòng đăng nhập.");
                toast.success("Đăng ký thành công.");
                setTimeout(() => navigate("/login", { replace: true }), 800);
              } else {
                throw new Error(res?.message || "Đăng ký thất bại");
              }
            } catch (err) {
              setErrorMsg(err?.message || "Đăng ký thất bại");
              toast.error(err?.message || "Đăng ký thất bại");
            } finally {
              setIsSubmitting(false);
            }
          }}
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
              value={form.username}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="nghedanh_01"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-300">{errors.username}</p>
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
              value={form.password}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="********"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-300">{errors.password}</p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="email"
            >
              Email{" "}
              <span className="text-white/70 text-xs align-middle">
                (không bắt buộc)
              </span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="phone"
            >
              Số điện thoại <span className="text-red-400">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="0901234567"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-300">{errors.phone}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="address"
            >
              Địa chỉ <span className="text-red-400">*</span>
            </label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-300">{errors.address}</p>
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
            {form.avatar && (
              <div className="mt-2">
                <img
                  src={form.avatar}
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
              Ngày sinh <span className="text-red-400">*</span>
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={form.dob}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
            />
            {errors.dob && (
              <p className="mt-1 text-xs text-red-300">{errors.dob}</p>
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
              value={form.gender}
              onChange={onChange}
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
          </div>
          <div>
            <label
              className="block text-sm font-semibold tracking-wide text-white/95"
              htmlFor="role"
            >
              Vai trò <span className="text-red-400">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white outline-none backdrop-blur-md focus:border-white/50 focus:ring-2 focus:ring-white/30"
            >
              <option className="bg-artisan-brown-900" value="Artist">
                Artist
              </option>
              <option className="bg-artisan-brown-900" value="Customer">
                Customer
              </option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-300">{errors.role}</p>
            )}
          </div>

          {/* Thông báo đã chuyển lên góc trên bên phải */}

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-xl bg-white/90 px-5 py-3 font-semibold text-artisan-brown-900 shadow-md transition hover:bg-yellow-500 hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
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
