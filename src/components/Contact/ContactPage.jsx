import ContactHero from "./ContactHero";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <ContactHero />

      {/* Main Content */}
      <section className="py-20 bg-artisan-brown-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Form and Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="order-2 lg:order-1">
              <ContactForm />
            </div>
            <div className="order-1 lg:order-2">
              <ContactInfo />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-artisan-gold-200/50">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-white/80 text-lg">
                Những câu hỏi phổ biến mà khách hàng thường hỏi chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-l-4 border-artisan-gold-500 pl-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Thời gian phản hồi là bao lâu?
                  </h3>
                  <p className="text-white/80">
                    Chúng tôi thường phản hồi trong vòng 24 giờ làm việc. Đối
                    với các yêu cầu khẩn cấp, vui lòng gọi trực tiếp.
                  </p>
                </div>

                <div className="border-l-4 border-artisan-gold-500 pl-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Có thể đặt hàng qua điện thoại không?
                  </h3>
                  <p className="text-white/80">
                    Tất nhiên! Bạn có thể gọi trực tiếp để đặt hàng hoặc tư vấn
                    về sản phẩm. Chúng tôi sẽ hỗ trợ tận tình.
                  </p>
                </div>

                <div className="border-l-4 border-artisan-gold-500 pl-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Có chính sách đổi trả không?
                  </h3>
                  <p className="text-white/80">
                    Chúng tôi có chính sách đổi trả trong 7 ngày nếu sản phẩm
                    không đúng như mô tả hoặc có lỗi từ nhà sản xuất.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-artisan-gold-500 pl-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Có giao hàng toàn quốc không?
                  </h3>
                  <p className="text-white/80">
                    Có, chúng tôi giao hàng toàn quốc. Phí vận chuyển sẽ được
                    tính theo khoảng cách và trọng lượng sản phẩm.
                  </p>
                </div>

                <div className="border-l-4 border-artisan-gold-500 pl-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Có thể xem sản phẩm trực tiếp không?
                  </h3>
                  <p className="text-white/80">
                    Bạn có thể đến showroom của chúng tôi để xem và trải nghiệm
                    sản phẩm trực tiếp. Chúng tôi luôn chào đón khách hàng.
                  </p>
                </div>

                <div className="border-l-4 border-artisan-gold-500 pl-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Có chương trình khuyến mãi không?
                  </h3>
                  <p className="text-white/80">
                    Chúng tôi thường xuyên có các chương trình khuyến mãi và
                    giảm giá đặc biệt. Theo dõi fanpage để cập nhật thông tin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-artisan-brown-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-6">
            Sẵn sàng bắt đầu hành trình nghệ thuật?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và khám
            phá những sản phẩm nghệ thuật độc đáo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-artisan-gold-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-artisan-gold-600 transition-colors duration-300 hover:shadow-lg">
              Gọi ngay: +84 123 456 789
            </button>
            <button className="bg-artisan-gold-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-artisan-gold-600 transition-colors duration-300 hover:shadow-lg">
              Email: info@artisanhub.com
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
