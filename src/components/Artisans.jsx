import { MapPin, Award, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Artisans() {
  const artisans = [
    {
      id: 1,
      name: "Nghệ nhân Minh Châu",
      specialty: "Gốm sứ Bát Tràng",
      location: "Bát Tràng, Hà Nội",
      experience: "25 năm",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      description:
        "Thạo nghề gốm sứ truyền thống, chuyên tạo ra những tác phẩm tinh xảo với họa tiết độc đáo.",
      achievements: [
        "Nghệ nhân ưu tú 2020",
        "Huy chương vàng Festival nghề truyền thống",
      ],
      products: 45,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Cô Hương",
      specialty: "Thêu tay truyền thống",
      location: "Quất Động, Hà Nội",
      experience: "30 năm",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      description:
        "Bậc thầy về nghề thêu, giữ gìn và phát triển các mẫu thêu cung đình Huế.",
      achievements: ["Nghệ nhân nhân dân 2019", "Giải thưởng Di sản văn hóa"],
      products: 32,
      rating: 5.0,
    },
    {
      id: 3,
      name: "Thầy Đức",
      specialty: "Sơn mài Hà Nội",
      location: "Hà Nội",
      experience: "20 năm",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      description:
        "Chuyên gia sơn mài với kỹ thuật độc đáo, tạo ra những bức tranh sơn mài hiện đại.",
      achievements: [
        "Triển lãm cá nhân 2021",
        "Giải A cuộc thi Mỹ thuật ứng dụng",
      ],
      products: 28,
      rating: 4.8,
    },
    {
      id: 4,
      name: "Làng nghề Đông Ky",
      specialty: "Mộc mỹ nghệ",
      location: "Đông Ky, Bắc Ninh",
      experience: "100+ năm",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      description:
        "Làng nghề truyền thống với lịch sử hàng trăm năm, chuyên chế tác đồ gỗ mỹ nghệ cao cấp.",
      achievements: ["Làng nghề tiêu biểu quốc gia", "Sản phẩm OCOP 5 sao"],
      products: 67,
      rating: 4.9,
    },
  ];

  return (
    <section className="py-20" id="artisans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-artisan-gold-100 dark:bg-artisan-gold-900/30 text-artisan-gold-700 dark:text-artisan-gold-300 text-sm font-medium mb-4">
            <Award className="w-4 h-4 mr-2" />
            Nghệ nhân đối tác
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-artisan-brown-900 dark:text-artisan-brown-50 mb-4">
            Gặp gỡ những
            <span className="text-gradient-gold"> bậc thầy</span>
          </h2>
          <p className="text-lg text-artisan-brown-600 dark:text-artisan-brown-400 max-w-2xl mx-auto">
            Những nghệ nhân tài năng với nhiều năm kinh nghiệm, đã tạo ra hàng
            nghìn tác phẩm nghệ thuật độc đáo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {artisans.map((artisan) => (
            <Card
              key={artisan.id}
              className="card-hover bg-white dark:bg-artisan-brown-900 border-artisan-brown-200 dark:border-artisan-brown-800 overflow-hidden"
            >
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-artisan-gold-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold text-artisan-brown-900 dark:text-artisan-brown-50 mb-1">
                  {artisan.name}
                </h3>
                <p className="text-artisan-gold-600 dark:text-artisan-gold-400 font-medium text-sm">
                  {artisan.specialty}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-artisan-brown-600 dark:text-artisan-brown-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {artisan.location}
                </div>

                <div className="flex items-center text-sm text-artisan-brown-600 dark:text-artisan-brown-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  Kinh nghiệm: {artisan.experience}
                </div>

                <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-400 leading-relaxed">
                  {artisan.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-artisan-brown-900 dark:text-artisan-brown-50">
                    Thành tích nổi bật:
                  </h4>
                  <ul className="space-y-1">
                    {artisan.achievements.map((achievement, index) => (
                      <li
                        key={index}
                        className="text-xs text-artisan-brown-600 dark:text-artisan-brown-400 flex items-center"
                      >
                        <div className="w-1.5 h-1.5 bg-artisan-gold-500 rounded-full mr-2"></div>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-artisan-brown-200 dark:border-artisan-brown-800">
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-1 text-artisan-gold-500" />
                    <span className="text-artisan-brown-600 dark:text-artisan-brown-400">
                      {artisan.products} sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-artisan-gold-600 dark:text-artisan-gold-400 font-semibold">
                      ★ {artisan.rating}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Xem sản phẩm
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-artisan-gold-50 to-artisan-brown-50 dark:from-artisan-gold-950/20 dark:to-artisan-brown-950/20 rounded-2xl p-8 lg:p-12 border border-artisan-gold-200 dark:border-artisan-gold-800">
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-artisan-brown-900 dark:text-artisan-brown-50 mb-4">
              Bạn cũng là một nghệ nhân?
            </h3>
            <p className="text-lg text-artisan-brown-600 dark:text-artisan-brown-400 mb-6 max-w-2xl mx-auto">
              Tham gia cộng đồng ArtisanHub để chia sẻ tác phẩm của bạn với hàng
              nghìn khách hàng yêu thích nghệ thuật thủ công
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Đăng ký bán hàng
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
