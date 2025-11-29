import { Target, Eye, Lightbulb, Globe } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="py-20 bg-artisan-brown-950" id="about">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Sứ mệnh & Tầm nhìn
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến những giá trị tốt nhất cho cộng đồng nghệ
            thuật thủ công Việt Nam
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mission */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-artisan-gold-100 to-artisan-brown-100 flex items-center justify-center">
                <Target className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Sứ mệnh
              </h3>
            </div>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              Chúng tôi cam kết bảo tồn và phát triển các giá trị văn hóa truyền
              thống Việt Nam thông qua việc kết nối những nghệ nhân tài năng với
              cộng đồng yêu thích nghệ thuật thủ công.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-artisan-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">
                  Tôn vinh tài năng và sự sáng tạo của nghệ nhân
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-artisan-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">
                  Mang đến trải nghiệm mua sắm chất lượng cao
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-artisan-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">
                  Góp phần phát triển kinh tế địa phương
                </span>
              </li>
            </ul>
          </div>

          {/* Vision */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-artisan-gold-100 to-artisan-brown-100 flex items-center justify-center">
                <Eye className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Tầm nhìn
              </h3>
            </div>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              Trở thành nền tảng hàng đầu Việt Nam trong việc kết nối và phát
              triển cộng đồng nghệ thuật thủ công, góp phần quảng bá văn hóa
              Việt Nam ra thế giới.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-artisan-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">
                  Mở rộng mạng lưới nghệ nhân trên toàn quốc
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-artisan-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">
                  Phát triển thị trường quốc tế
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-artisan-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">
                  Ứng dụng công nghệ hiện đại
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-artisan-gold-100 to-artisan-brown-100 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Giá trị cốt lõi
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div
              className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Globe className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h4 className="font-semibold text-lg text-artisan-brown-900 dark:text-white mb-2">
                Tôn trọng văn hóa
              </h4>
              <p className="text-base text-artisan-brown-600 dark:text-artisan-brown-300">
                Chúng tôi tôn trọng và bảo tồn các giá trị văn hóa truyền thống
              </p>
            </div>
            {/* Card 2 */}
            <div
              className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Target className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h4 className="font-semibold text-lg text-artisan-brown-900 dark:text-white mb-2">
                Chất lượng cao
              </h4>
              <p className="text-base text-artisan-brown-600 dark:text-artisan-brown-300">
                Cam kết mang đến những sản phẩm chất lượng tốt nhất
              </p>
            </div>
            {/* Card 3 */}
            <div
              className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Lightbulb className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h4 className="font-semibold text-lg text-artisan-brown-900 dark:text-white mb-2">
                Đổi mới sáng tạo
              </h4>
              <p className="text-base text-artisan-brown-600 dark:text-artisan-brown-300">
                Khuyến khích sự sáng tạo và đổi mới trong nghệ thuật
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
