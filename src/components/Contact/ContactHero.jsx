import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactHero() {
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
            <Mail className="w-4 h-4 mr-2" />
            Liên hệ với chúng tôi
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
            <span className="text-white">Kết nối với </span>
            <br />
            <span className="text-gradient-gold">ArtisanHub</span>
          </h1>

          <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với
            chúng tôi để được tư vấn về sản phẩm, đặt hàng hoặc bất kỳ thắc mắc
            nào khác.
          </p>

          {/* Contact info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div
              className="text-center p-6 rounded-xl card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 transition-all duration-300"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Phone className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="font-semibold text-artisan-brown-900 dark:text-white mb-2">
                Điện thoại
              </h3>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300">
                +84 123 456 789
              </p>
            </div>

            <div
              className="text-center p-6 rounded-xl card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 transition-all duration-300"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Mail className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="font-semibold text-artisan-brown-900 dark:text-white mb-2">
                Email
              </h3>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300">
                info@artisanhub.com
              </p>
            </div>

            <div
              className="text-center p-6 rounded-xl card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 transition-all duration-300"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <MapPin className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="font-semibold text-artisan-brown-900 dark:text-white mb-2">
                Địa chỉ
              </h3>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300">
                Hà Nội, Việt Nam
              </p>
            </div>

            <div
              className="text-center p-6 rounded-xl card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 transition-all duration-300"
              style={{ boxShadow: "none" }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
                <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
                <Clock className="w-8 h-8 text-artisan-gold-600" />
              </div>
              <h3 className="font-semibold text-artisan-brown-900 dark:text-white mb-2">
                Giờ làm việc
              </h3>
              <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-300">
                8:00 - 18:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
