import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Lan",
      role: "Khách hàng thân thiết",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      content:
        "Tôi đã mua rất nhiều sản phẩm từ ArtisanHub và luôn hài lòng với chất lượng. Những món đồ thủ công ở đây thực sự độc đáo và tinh xảo.",
      product: "Bình gốm sứ thủ công",
    },
    {
      id: 2,
      name: "Trần Văn Minh",
      role: "Collector nghệ thuật",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      content:
        "Là một người sưu tập đồ mỹ nghệ, tôi rất ấn tượng với sự đa dạng và chất lượng sản phẩm tại ArtisanHub. Dịch vụ khách hàng cũng rất tuyệt vời.",
      product: "Tranh sơn mài",
    },
    {
      id: 3,
      name: "Lê Thị Hương",
      role: "Chủ cửa hàng decor",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      content:
        "ArtisanHub đã giúp tôi tìm được những sản phẩm độc đáo cho cửa hàng. Khách hàng của tôi rất thích những món đồ thủ công từ đây.",
      product: "Đèn lồng tre",
    },
    {
      id: 4,
      name: "Phạm Đức Thành",
      role: "Kiến trúc sư nội thất",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      content:
        "Trong công việc thiết kế nội thất, tôi thường tìm đến ArtisanHub để chọn những món đồ trang trí đặc biệt. Chất lượng luôn vượt mong đợi.",
      product: "Tượng gỗ thủ công",
    },
  ];

  return (
    <section
      className="py-20 bg-artisan-brown-50 dark:bg-artisan-brown-950/50"
      id="testimonials"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-artisan-gold-100 dark:bg-artisan-gold-900/30 text-artisan-gold-700 dark:text-artisan-gold-300 text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Khách hàng nói gì về chúng tôi
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-artisan-brown-900 dark:text-artisan-brown-50 mb-4">
            Hơn 10,000+ khách hàng
            <span className="text-gradient-gold"> tin tưởng</span>
          </h2>
          <p className="text-lg text-artisan-brown-600 dark:text-artisan-brown-400 max-w-2xl mx-auto">
            Những phản hồi chân thực từ khách hàng đã trải nghiệm sản phẩm và
            dịch vụ của ArtisanHub
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="card-hover bg-white dark:bg-artisan-brown-900 border-artisan-brown-200 dark:border-artisan-brown-800 relative"
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <div className="absolute -top-3 left-6">
                  <div className="w-8 h-8 bg-artisan-gold-500 rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-artisan-gold-500 fill-current"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-artisan-brown-600 dark:text-artisan-brown-400 mb-6 leading-relaxed text-sm">
                  "{testimonial.content}"
                </p>

                {/* Product */}
                <div className="text-xs text-artisan-gold-600 dark:text-artisan-gold-400 font-medium mb-4">
                  Sản phẩm: {testimonial.product}
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-artisan-brown-900 dark:text-artisan-brown-50">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-bold text-artisan-gold-600 dark:text-artisan-gold-400">
              4.9
            </div>
            <p className="text-artisan-brown-600 dark:text-artisan-brown-400">
              Đánh giá trung bình
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-bold text-artisan-gold-600 dark:text-artisan-gold-400">
              10,000+
            </div>
            <p className="text-artisan-brown-600 dark:text-artisan-brown-400">
              Khách hàng hài lòng
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-bold text-artisan-gold-600 dark:text-artisan-gold-400">
              98%
            </div>
            <p className="text-artisan-brown-600 dark:text-artisan-brown-400">
              Tỷ lệ hài lòng
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-bold text-artisan-gold-600 dark:text-artisan-gold-400">
              24/7
            </div>
            <p className="text-artisan-brown-600 dark:text-artisan-brown-400">
              Hỗ trợ khách hàng
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
