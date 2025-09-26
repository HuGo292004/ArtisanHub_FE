import { ArrowRight, Play, Star, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const stats = [
    { icon: Users, value: "10,000+", label: "Khách hàng" },
    { icon: Package, value: "5,000+", label: "Sản phẩm" },
    { icon: Star, value: "4.9", label: "Đánh giá" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-pattern">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-artisan-gold-400/20 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-32 h-32 bg-artisan-brown-400/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-artisan-gold-500/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
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
              <Button
                size="lg"
                className="text-lg px-8 py-4 h-auto animate-glow"
              >
                Khám phá ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
              {/* Main product showcase */}
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-artisan-gold-100 to-artisan-brown-100 dark:from-artisan-gold-900/30 dark:to-artisan-brown-900/30 p-8 shadow-2xl">
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-artisan-brown-900 shadow-inner flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-full gradient-gold flex items-center justify-center">
                        <Package className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-xl font-display font-semibold text-artisan-brown-900 dark:text-artisan-brown-50">
                        Sản phẩm thủ công
                      </h3>
                      <p className="text-artisan-brown-600 dark:text-artisan-brown-400">
                        Độc đáo & chất lượng
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-artisan-brown-900 rounded-xl p-4 shadow-lg animate-float">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-artisan-brown-900 dark:text-artisan-brown-50">
                      Chất lượng cao
                    </span>
                  </div>
                </div>

                <div
                  className="absolute -bottom-4 -right-4 bg-white dark:bg-artisan-brown-900 rounded-xl p-4 shadow-lg animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-artisan-gold-500 fill-current" />
                    <span className="text-sm font-medium text-artisan-brown-900 dark:text-artisan-brown-50">
                      Đánh giá 5*
                    </span>
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
