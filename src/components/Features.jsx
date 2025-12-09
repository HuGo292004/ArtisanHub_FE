import { Shield, Truck, Heart, Award, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Features() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem("access_token");
    if (token) {
      // Nếu đã đăng nhập, chuyển đến profile với form đăng ký artist
      navigate("/profile?register=artist");
    } else {
      // Nếu chưa đăng nhập, chuyển đến trang đăng ký
      navigate("/register");
    }
  };
  const features = [
    {
      icon: Shield,
      title: "Chất lượng đảm bảo",
      description:
        "Mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng",
      color: "text-green-500",
    },
    {
      icon: Truck,
      title: "Giao hàng nhanh chóng",
      description:
        "Hệ thống logistics hiện đại, giao hàng toàn quốc trong 1-3 ngày",
      color: "text-blue-500",
    },
    {
      icon: Heart,
      title: "Làm từ tâm huyết",
      description:
        "Sản phẩm được chế tác bởi những nghệ nhân có kinh nghiệm và tâm huyết",
      color: "text-red-500",
    },
    {
      icon: Award,
      title: "Nghệ nhân uy tín",
      description:
        "Hợp tác với các nghệ nhân được công nhận và có tiếng tăm trong ngành",
      color: "text-artisan-gold-500",
    },
    {
      icon: Users,
      title: "Cộng đồng sôi động",
      description: "Kết nối với hàng nghìn người yêu thích nghệ thuật thủ công",
      color: "text-purple-500",
    },
    {
      icon: Sparkles,
      title: "Độc đáo & sáng tạo",
      description: "Những thiết kế độc quyền không thể tìm thấy ở nơi khác",
      color: "text-artisan-brown-500",
    },
  ];

  return (
    <section
      className="py-20 bg-artisan-brown-50 dark:bg-artisan-brown-950/50"
      id="features"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-artisan-gold-100 dark:bg-artisan-gold-900/30 text-artisan-gold-700 dark:text-artisan-gold-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Tại sao chọn ArtisanHub?
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-artisan-brown-900 dark:text-artisan-brown-50 mb-4">
            Trải nghiệm mua sắm
            <span className="text-gradient-gold"> khác biệt</span>
          </h2>
          <p className="text-lg text-artisan-brown-600 dark:text-artisan-brown-400 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến những giá trị tốt nhất cho khách hàng
            thông qua chất lượng sản phẩm và dịch vụ hoàn hảo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="card-hover bg-white dark:bg-artisan-brown-900 border-artisan-brown-200 dark:border-artisan-brown-800 group"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-artisan-gold-100 to-artisan-brown-100 dark:from-artisan-gold-900/30 dark:to-artisan-brown-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-display text-artisan-brown-900 dark:text-artisan-brown-50">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-artisan-brown-600 dark:text-artisan-brown-400 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-artisan-gold-500 to-artisan-brown-500 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-display font-bold mb-4">
              Sẵn sàng khám phá những tác phẩm nghệ thuật?
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Tham gia cộng đồng ArtisanHub ngay hôm nay và trải nghiệm thế giới
              thủ công mỹ nghệ phong phú
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRegisterClick}
                className="bg-white text-artisan-gold-600 px-8 py-3 rounded-lg font-semibold hover:bg-artisan-gold-50 transition-colors duration-200"
              >
                Đăng ký ngay
              </button>
              <button
                onClick={() => navigate("/about")}
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-artisan-gold-600 transition-colors duration-200"
              >
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
