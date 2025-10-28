import { useState } from "react";
import { login, getProfile } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/Toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const toast = useToast();

  return (
    <section className="flex items-center justify-center">
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
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-10 shadow-2xl backdrop-blur-lg">
        <h2 className="text-center text-3xl lg:text-4xl font-bold tracking-wide text-white">
          Đăng nhập
        </h2>
        <p className="mt-3 text-center text-base text-white/85">
          Chào mừng bạn đến với ArtisanHub
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg("");
            setSuccessMsg("");
            setIsSubmitting(true);
            try {
              const res = await login({ email, password });
              const token = res?.data?.token;

              if (token) {
                localStorage.setItem("access_token", token);

                // Lấy thông tin user để xác định role
                let userRole = "customer";

                try {
                  const profileRes = await getProfile();
                  userRole = profileRes?.data?.role || "customer";
                  console.log("Profile API success, role:", userRole);
                } catch (profileError) {
                  console.log(
                    "Profile API failed, using login response:",
                    profileError
                  );
                  // Fallback: lấy role từ login response
                  userRole = res?.data?.role || "customer";
                  console.log("Using login response role:", userRole);
                }

                // Normalize role to lowercase for consistent checking
                userRole = userRole?.toLowerCase() || "customer";
                console.log("Normalized role:", userRole);

                localStorage.setItem("user_role", userRole);
                setSuccessMsg("Đăng nhập thành công.");
                toast.success("Đăng nhập thành công.");

                // Chuyển hướng dựa trên role
                const redirectPath = userRole === "admin" ? "/admin" : "/";
                console.log("Redirecting to:", redirectPath, "Role:", userRole);
                setTimeout(
                  () => navigate(redirectPath, { replace: true }),
                  800
                );
              } else {
                throw new Error("Token không hợp lệ");
              }
            } catch (err) {
              setErrorMsg(err?.message || "Đăng nhập thất bại");
              toast.error(err?.message || "Đăng nhập thất bại");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold tracking-wide text-white/95"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md transition focus:border-white/50 focus:ring-2 focus:ring-white/40 focus:ring-offset-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold tracking-wide text-white/95"
              >
                Mật khẩu
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md transition focus:border-white/50 focus:ring-2 focus:ring-white/40 focus:ring-offset-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          {/* Thông báo đã chuyển lên góc trên bên phải */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-xl bg-white/90 px-5 py-3 font-semibold text-artisan-brown-900 shadow-md transition hover:bg-white hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <p className="text-center text-sm text-white/90">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="font-semibold text-white underline decoration-white/70 underline-offset-4 hover:decoration-white"
            >
              Đăng ký
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
