import BackgroundSlideshow from "./components/BackgroundSlideshow";
import LeftQuotes from "./components/LeftQuotes";
import LoginForm from "./components/LoginForm";

export const LayoutLogin = () => {
  const images = [
    "/images/maytre_bg.jpg",
    "/images/huong_bg.jpg",
    "/images/nonla_bg.jpg",
    "/images/gom_bg.jpg",
    "/images/detlua_bg.jpg",
    "/images/gom2_bg.jpg",
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent">
      <BackgroundSlideshow images={images} intervalMs={8000} />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-stretch px-4 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-stretch gap-8 py-10 lg:grid-cols-2 lg:gap-12">
          {/* Left: Quotes / Story */}
          <LeftQuotes />
          {/* Right: Login Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
