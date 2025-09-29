import BackgroundSlideshow from "./components/BackgroundSlideshow";

export const LayoutLogin = () => {
  const images = [
    "/images/maytre_bg.jpg",
    "/images/huong_bg.jpg",
    "/images/nonla_bg.jpg",
    "/images/gom_bg.jpg",
    "/images/detlua_bg.jpg",
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent">
      <BackgroundSlideshow images={images} intervalMs={8000} />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-stretch px-4 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-stretch gap-8 py-10 lg:grid-cols-2 lg:gap-12">
          {/* Left: Quotes / Story with Glassmorphism */}
          <section className="hidden lg:flex items-center">
            <div className="max-w-xl rounded-2xl border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur-lg text-white">
              <h1 className="font-display text-5xl lg:text-6xl font-semibold leading-tight tracking-wide drop-shadow-lg">
                ArtisanHub - Nơi gắn kết nghệ nhân và người yêu cái đẹp chân
                phương.
              </h1>
              <p className="mt-6 text-xl text-white/90 leading-relaxed italic drop-shadow-sm">
                “Giữ nghề là giữ hồn làng; nâng nghề là nâng tầm văn hóa.”
              </p>
              <div className="mt-8 space-y-4 text-white/85">
                <p className="text-lg leading-relaxed drop-shadow-sm">
                  • Gìn giữ giá trị xưa bằng sự sáng tạo hôm nay.
                </p>
                <p className="text-lg leading-relaxed drop-shadow-sm">
                  • Mộc mạc, bền bỉ, và tinh tế trong từng chi tiết.
                </p>
                <p className="text-lg leading-relaxed drop-shadow-sm">
                  • Nghệ thuật không chỉ là sự tạo hình, mà còn là sự thể hiện
                  của tâm hồn.
                </p>
              </div>
            </div>
          </section>

          {/* Right: Glassmorphism Login Form */}
          <section className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-10 shadow-2xl backdrop-blur-lg">
              <h2 className="text-center text-3xl lg:text-4xl font-bold tracking-wide text-white">
                Đăng nhập
              </h2>
              <p className="mt-3 text-center text-base text-white/85">
                Chào mừng bạn đến với ArtisanHub
              </p>

              <form className="mt-8 space-y-5">
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
                    {/* <a
                      href="/forgot-password"
                      className="text-xs font-medium text-white/90 underline hover:text-white"
                    >
                      Quên mật khẩu?
                    </a> */}
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-2 w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-white placeholder-white/70 outline-none backdrop-blur-md transition focus:border-white/50 focus:ring-2 focus:ring-white/40 focus:ring-offset-0"
                    placeholder="********"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-white/90 px-5 py-3 font-semibold text-artisan-brown-900 shadow-md transition hover:bg-white hover:shadow-lg active:scale-[0.99]"
                >
                  Đăng nhập
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
        </div>
      </div>
    </div>
  );
};
