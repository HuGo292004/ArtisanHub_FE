import {
  ArrowRight,
  Play,
  Star,
  Users,
  Package,
  Sparkles,
  Award,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const stats = [
    { icon: Users, value: "10,000+", label: "Khách hàng" },
    { icon: Package, value: "5,000+", label: "Sản phẩm" },
    { icon: Star, value: "4.9", label: "Đánh giá" },
  ];

  // Danh sách các video
  const videos = [
    "/videos/datset.mp4",
    "/videos/nonla.mp4",
    "/videos/dan_chieu.mp4",
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
        setIsTransitioning(false);
      }, 400); // Thời gian transition
    }, 9000); // Đổi video mỗi 8 giây

    return () => clearInterval(interval);
  }, [videos.length]);

  // Reset video khi chuyển
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentVideoIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-artisan-brown-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-artisan-gold-400/30 to-artisan-gold-600/20 rounded-full blur-2xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-br from-artisan-brown-400/30 to-artisan-gold-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-br from-artisan-gold-500/30 to-artisan-brown-500/20 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-28 h-28 bg-gradient-to-br from-artisan-gold-300/20 to-artisan-brown-300/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-artisan-gold-500/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-artisan-gold-500/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-artisan-gold-100 dark:bg-artisan-gold-900/30 text-artisan-gold-700 dark:text-artisan-gold-300 text-sm font-medium">
                <Star className="w-4 h-4 mr-2 fill-current" />
                Nền tảng thủ công #1 Việt Nam
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
                <span className="text-artisan-brown-900 dark:text-artisan-brown-50">
                  Khám phá
                </span>
                <br />
                <span className="text-gradient-gold">Nghệ thuật thủ công</span>
                <br />
                <span className="text-artisan-brown-900 dark:text-artisan-brown-50">
                  Việt Nam
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-artisan-brown-600 dark:text-artisan-brown-400 max-w-2xl mx-auto lg:mx-0">
                Nơi hội tụ những sản phẩm thủ công mỹ nghệ độc đáo từ các nghệ
                nhân tài năng khắp Việt Nam. Mỗi sản phẩm đều mang trong mình
                câu chuyện và tâm huyết của người làm ra nó.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/products">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 h-auto animate-glow"
                >
                  Khám phá ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 h-auto group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Xem video giới thiệu
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-artisan-brown-200 dark:border-artisan-brown-800">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-2">
                    <stat.icon className="w-6 h-6 text-artisan-gold-500 mr-2" />
                    <span className="text-2xl lg:text-3xl font-bold text-artisan-brown-900 dark:text-artisan-brown-50">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image/Visual */}
          <div className="relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-br from-artisan-gold-500/10 to-artisan-brown-500/10 blur-3xl"></div>
              </div>

              {/* Video background card with overlay */}
              <div className="relative">
                {/* Gradient border wrapper */}
                <div className="relative p-1 rounded-3xl bg-gradient-to-br from-artisan-gold-400 via-artisan-gold-300 to-artisan-brown-400 shadow-2xl animate-glow">
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-artisan-brown-950">
                    {/* Video element with transition */}
                    <video
                      ref={videoRef}
                      key={currentVideoIndex}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${
                        isTransitioning ? "opacity-0" : "opacity-100"
                      }`}
                      src={videos[currentVideoIndex]}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />

                    {/* Subtle overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-artisan-brown-950/20 via-transparent to-transparent pointer-events-none"></div>

                    {/* Video indicators (dots) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {videos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setIsTransitioning(true);
                            setTimeout(() => {
                              setCurrentVideoIndex(index);
                              setIsTransitioning(false);
                            }, 500);
                          }}
                          className={`transition-all duration-300 rounded-full ${
                            index === currentVideoIndex
                              ? "w-8 h-2 bg-artisan-gold-500"
                              : "w-2 h-2 bg-white/50 hover:bg-white/80"
                          }`}
                          aria-label={`Video ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating badges */}
                <div className="absolute top-4 -left-4 group animate-float">
                  <div className="relative bg-gradient-to-br from-white to-artisan-gold-50 dark:from-artisan-brown-900 dark:to-artisan-brown-800 rounded-2xl p-4 shadow-xl border border-artisan-gold-200/50 dark:border-artisan-gold-700/30 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-50"></div>
                        <div className="relative w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-artisan-brown-900"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-artisan-brown-900 dark:text-artisan-brown-50">
                          Chất lượng cao
                        </p>
                        <p className="text-xs text-artisan-brown-600 dark:text-artisan-brown-400">
                          100% handmade
                        </p>
                      </div>
                    </div>
                    {/* Decorative corner */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-artisan-gold-400 rounded-full"></div>
                  </div>
                </div>

                <div
                  className="absolute -bottom-4 -right-4 group animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="relative bg-gradient-to-br from-artisan-gold-50 to-white dark:from-artisan-gold-900/40 dark:to-artisan-brown-900 rounded-2xl p-4 shadow-xl border border-artisan-gold-300/50 dark:border-artisan-gold-600/30 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-artisan-gold-500 rounded-full blur-sm opacity-50"></div>
                        <Star className="relative w-5 h-5 text-artisan-gold-500 fill-artisan-gold-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-artisan-brown-900 dark:text-artisan-brown-50">
                          Đánh giá 5 sao
                        </p>
                        <p className="text-xs text-artisan-brown-600 dark:text-artisan-brown-400">
                          2,500+ reviews
                        </p>
                      </div>
                    </div>
                    {/* Decorative sparkle */}
                    <div className="absolute -top-1 -left-1">
                      <Sparkles className="w-4 h-4 text-artisan-gold-400" />
                    </div>
                  </div>
                </div>

                {/* Additional small floating badges */}
                <div
                  className="absolute top-1/3 -right-6 animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="bg-white dark:bg-artisan-brown-900 rounded-xl p-3 shadow-lg border border-artisan-gold-200/50 dark:border-artisan-gold-700/30">
                    <Shield className="w-5 h-5 text-artisan-gold-500" />
                  </div>
                </div>

                <div
                  className="absolute bottom-1/3 -left-6 animate-float"
                  style={{ animationDelay: "1.5s" }}
                >
                  <div className="bg-gradient-to-br from-artisan-gold-100 to-white dark:from-artisan-gold-900/40 dark:to-artisan-brown-900 rounded-xl p-3 shadow-lg border border-artisan-gold-300/50 dark:border-artisan-gold-600/30">
                    <Award className="w-5 h-5 text-artisan-gold-600 dark:text-artisan-gold-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-artisan-gold-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-artisan-gold-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
