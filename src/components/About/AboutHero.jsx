import { Star, Heart, Users, Award } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-artisan-brown-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-artisan-gold-200/30 rounded-full blur-2xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-40 h-40 bg-artisan-brown-200/30 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-36 h-36 bg-artisan-gold-300/30 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-artisan-gold-100 text-artisan-gold-700 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Về chúng tôi
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
            <span className="text-artisan-brown-900 dark:text-artisan-brown-50">
              Câu chuyện của{" "}
            </span>
            <br />
            <span className="text-gradient-gold">ArtisanHub</span>
          </h1>

          <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Chúng tôi là cầu nối giữa những nghệ nhân tài năng và những người
            yêu thích nghệ thuật thủ công. Với sứ mệnh bảo tồn và phát triển các
            giá trị văn hóa truyền thống Việt Nam, chúng tôi cam kết mang đến
            những sản phẩm chất lượng cao và trải nghiệm mua sắm tuyệt vời.
          </p>

          {/* Key values */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Card 1 */}
            <div
              className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center transition-all duration-300"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Heart className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="font-semibold text-artisan-brown-900 dark:text-white mb-2">
                Tâm huyết
              </h3>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300">
                Với nghệ thuật truyền thống
              </p>
            </div>
            {/* Card 2 */}
            <div
              className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center transition-all duration-300"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Users className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="font-semibold text-artisan-brown-900 dark:text-white mb-2">
                Cộng đồng
              </h3>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300">
                Kết nối nghệ nhân
              </p>
            </div>
            {/* Card 3 */}
            <div
              className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center transition-all duration-300"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Award className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="font-semibold text-artisan-brown-900 dark:text-white mb-2">
                Chất lượng
              </h3>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300">
                Sản phẩm tinh xảo
              </p>
            </div>
            {/* Card 4 */}
            <div
              className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center transition-all duration-300"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Star className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="font-semibold text-artisan-brown-900 dark:text-white mb-2">
                Uy tín
              </h3>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300">
                Được tin tưởng
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
