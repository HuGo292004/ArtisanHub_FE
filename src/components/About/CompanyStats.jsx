import { TrendingUp, Users, Package, Star, Award, Globe } from "lucide-react";

export default function CompanyStats() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Khách hàng hài lòng",
      description:
        "Số lượng khách hàng tin tưởng và sử dụng dịch vụ của chúng tôi",
      color: "text-blue-500",
    },
    {
      icon: Package,
      value: "5,000+",
      label: "Sản phẩm chất lượng",
      description:
        "Các sản phẩm thủ công được kiểm duyệt và đảm bảo chất lượng",
      color: "text-green-500",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Đánh giá trung bình",
      description:
        "Điểm đánh giá từ khách hàng về chất lượng sản phẩm và dịch vụ",
      color: "text-yellow-500",
    },
    {
      icon: Award,
      value: "100+",
      label: "Giải thưởng",
      description: "Các giải thưởng và chứng nhận về chất lượng và uy tín",
      color: "text-purple-500",
    },
    {
      icon: Globe,
      value: "25+",
      label: "Quốc gia",
      description: "Số quốc gia mà sản phẩm của chúng tôi được xuất khẩu",
      color: "text-indigo-500",
    },
    {
      icon: TrendingUp,
      value: "300%",
      label: "Tăng trưởng",
      description: "Tỷ lệ tăng trưởng doanh thu trong 3 năm qua",
      color: "text-red-500",
    },
  ];

  return (
    <section
      className="py-20 bg-artisan-brown-50 dark:bg-artisan-brown-950/50"
      id="stats"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Thành tựu của chúng tôi
          </h2>
          <p className="text-lg text-artisan-brown-600 max-w-2xl mx-auto">
            Những con số ấn tượng phản ánh sự tin tưởng và ủng hộ của cộng đồng
            dành cho ArtisanHub
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-artisan-brown-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-artisan-brown-600 dark:text-artisan-brown-300 font-medium mb-2">
                {stat.label}
              </div>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 flex justify-center">
          <div
            className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-2xl p-8 shadow-lg max-w-4xl w-full text-center"
            style={{ boxShadow: "none" }}
          >
            <h3 className="text-2xl font-display font-bold text-artisan-brown-900 dark:text-white mb-4">
              Cam kết của chúng tôi
            </h3>
            <p className="text-lg text-artisan-brown-600 dark:text-artisan-brown-300 leading-relaxed mb-6">
              Với những thành tựu đã đạt được, chúng tôi cam kết tiếp tục nỗ lực
              để mang đến những giá trị tốt nhất cho cộng đồng nghệ thuật thủ
              công Việt Nam.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-artisan-gold-600 mb-2">
                  100%
                </div>
                <p className="text-artisan-brown-600 dark:text-artisan-brown-300">
                  Sản phẩm chính hãng
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-artisan-gold-600 mb-2">
                  24/7
                </div>
                <p className="text-artisan-brown-600 dark:text-artisan-brown-300">
                  Hỗ trợ khách hàng
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-artisan-gold-600 mb-2">
                  30 ngày
                </div>
                <p className="text-artisan-brown-600 dark:text-artisan-brown-300">
                  Đổi trả miễn phí
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
