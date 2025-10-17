import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { forgotPasswordService } from "@/services/forgotPasswordService";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("email"); // "email" hoặc "reset"

  // Kiểm tra route và token để xác định step
  useEffect(() => {
    const currentPath = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    // Nếu có token trong URL, lưu vào localStorage và chuyển sang step reset
    if (token) {
      localStorage.setItem("reset_token", token);
      setStep("reset");
      // Xóa token khỏi URL để URL sạch
      window.history.replaceState({}, document.title, "/reset-password");
    }
    // Nếu đang ở route /reset-password, kiểm tra token trong localStorage
    else if (currentPath === "/reset-password") {
      const savedToken = localStorage.getItem("reset_token");
      if (savedToken) {
        setStep("reset");
      } else {
        setStep("email");
      }
    } else {
      setStep("email");
    }
  }, []);

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await forgotPasswordService.sendResetEmail(email);

      if (response) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi gửi email reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("reset_token");

      if (!token) {
        throw new Error("Token không hợp lệ");
      }
      const response = await forgotPasswordService.resetPassword(
        token,
        password,
        confirmPassword
      );

      if (response) {
        setSuccess(true);
        // Xóa token khỏi localStorage sau khi reset thành công
        localStorage.removeItem("reset_token");
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi reset password");
    } finally {
      setLoading(false);
    }
  };

  if (step === "email") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-artisan-brown-50 to-artisan-brown-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-artisan-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-artisan-brown-900 mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-artisan-brown-600">
              Nhập email của bạn để nhận link reset mật khẩu
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-600">✅</span>
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                Email đã được gửi!
              </h2>
              <p className="text-artisan-brown-600 mb-6">
                Chúng tôi đã gửi link reset mật khẩu đến email{" "}
                <span className="font-medium text-artisan-brown-800">
                  {email}
                </span>
              </p>
              <p className="text-sm text-artisan-brown-500 mb-6">
                Vui lòng kiểm tra hộp thư và nhấn vào link để reset mật khẩu.
                Nếu không thấy email, hãy kiểm tra thư mục spam.
              </p>
              <Button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                variant="outline"
                className="w-full"
              >
                Gửi lại email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSendResetEmail} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-artisan-brown-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full px-4 py-3 border border-artisan-brown-300 rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-artisan-gold-600 hover:bg-artisan-gold-700 text-white"
              >
                {loading ? "Đang gửi..." : "Gửi link reset"}
              </Button>

              <div className="text-center">
                <a
                  href="/login"
                  className="text-artisan-gold-600 hover:text-artisan-gold-700 text-sm"
                >
                  ← Quay lại đăng nhập
                </a>
              </div>
            </form>
          )}
        </Card>
      </div>
    );
  }

  // Component cho reset password (khi user click vào link từ email)
  const token = localStorage.getItem("reset_token");

  // Nếu không có token, hiển thị thông báo lỗi
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-artisan-brown-50 to-artisan-brown-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-red-600">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">
              Link không hợp lệ
            </h1>
            <p className="text-artisan-brown-600 mb-6">
              Link reset mật khẩu không hợp lệ hoặc đã hết hạn.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => (window.location.href = "/forgot-password")}
                className="w-full bg-artisan-gold-600 hover:bg-artisan-gold-700 text-white"
              >
                Gửi lại email reset
              </Button>
              <Button
                onClick={() => (window.location.href = "/login")}
                variant="outline"
                className="w-full"
              >
                Quay lại đăng nhập
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-artisan-brown-50 to-artisan-brown-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-artisan-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-artisan-brown-900 mb-2">
            Đặt lại mật khẩu
          </h1>
          <p className="text-artisan-brown-600">Nhập mật khẩu mới của bạn</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-green-600">✅</span>
            </div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Mật khẩu đã được đặt lại!
            </h2>
            <p className="text-artisan-brown-600 mb-6">
              Bạn có thể đăng nhập với mật khẩu mới.
            </p>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-artisan-gold-600 hover:bg-artisan-gold-700 text-white"
            >
              Đăng nhập ngay
            </Button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-artisan-brown-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full px-4 py-3 border border-artisan-brown-300 rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-artisan-brown-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-3 border border-artisan-brown-300 rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || password !== confirmPassword}
              className="w-full bg-artisan-gold-600 hover:bg-artisan-gold-700 text-white"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>

            <div className="text-center">
              <a
                href="/login"
                className="text-artisan-gold-600 hover:text-artisan-gold-700 text-sm"
              >
                ← Quay lại đăng nhập
              </a>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
