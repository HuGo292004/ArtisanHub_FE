import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Điện thoại",
      details: ["+84 123 456 789", "+84 987 654 321"],
      description: "Gọi cho chúng tôi để được tư vấn trực tiếp",
      action: "tel:+84123456789",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@artisanhub.com", "support@artisanhub.com"],
      description: "Gửi email cho chúng tôi bất cứ lúc nào",
      action: "mailto:info@artisanhub.com",
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      details: ["123 Đường Láng, Đống Đa", "Hà Nội, Việt Nam"],
      description: "Thăm quan showroom của chúng tôi",
      action: "#",
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      details: [
        "Thứ 2 - Thứ 6: 8:00 - 18:00",
        "Thứ 7 - Chủ nhật: 9:00 - 17:00",
      ],
      description: "Chúng tôi luôn sẵn sàng phục vụ bạn",
      action: null,
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      name: "Facebook",
      url: "https://facebook.com/artisanhub",
      color: "hover:text-blue-600",
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "https://instagram.com/artisanhub",
      color: "hover:text-pink-600",
    },
    {
      icon: Youtube,
      name: "YouTube",
      url: "https://youtube.com/artisanhub",
      color: "hover:text-red-600",
    },
    {
      icon: MessageCircle,
      name: "Zalo",
      url: "https://zalo.me/artisanhub",
      color: "hover:text-blue-500",
    },
  ];

  return (
    <div className="bg-artisan-brown-950 rounded-3xl p-8 lg:p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
          Thông tin liên hệ
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Chúng tôi có nhiều cách để bạn có thể liên hệ và kết nối với
          ArtisanHub
        </p>
      </div>

      {/* Contact methods grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {contactMethods.map((method, index) => (
          <div
            key={index}
            className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center"
            style={{ boxShadow: "none" }}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
              <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
              <method.icon className="w-8 h-8 text-artisan-gold-600" />
            </div>
            <h3 className="font-semibold text-lg text-artisan-brown-900 dark:text-white mb-2">
              {method.title}
            </h3>
            <p className="text-base text-artisan-brown-600 dark:text-artisan-brown-300 mb-3">
              {method.description}
            </p>
            <div className="space-y-1">
              {method.details.map((detail, detailIndex) => (
                <p
                  key={detailIndex}
                  className={`text-artisan-brown-900 dark:text-white font-medium ${
                    method.action
                      ? "hover:text-artisan-gold-400 cursor-pointer transition-colors"
                      : ""
                  }`}
                  onClick={
                    method.action ? () => window.open(method.action) : undefined
                  }
                >
                  {detail}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Social media section */}
      <div
        className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center"
        style={{ boxShadow: "none" }}
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
          <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
          {/* You can use a generic icon for social, or a custom one */}
          <svg
            className="w-8 h-8 text-artisan-gold-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h.01M12 12h.01M16 12h.01" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg text-artisan-brown-900 dark:text-white mb-2">
          Kết nối với chúng tôi
        </h3>
        <p className="text-base text-artisan-brown-600 dark:text-artisan-brown-300 mb-3">
          Theo dõi chúng tôi trên các mạng xã hội để cập nhật những sản phẩm mới
          nhất
        </p>
        <div className="flex justify-center space-x-6 mt-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center p-4 rounded-xl transition-all duration-300 hover:bg-artisan-gold-50 ${social.color}`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-artisan-gold-100 to-artisan-brown-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <social.icon className="w-6 h-6 text-artisan-gold-600" />
              </div>
              <span className="text-sm font-medium text-artisan-brown-900 dark:text-white group-hover:text-artisan-brown-700 transition-colors duration-300">
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Additional info */}
      <div
        className="card-hover bg-white dark:bg-artisan-brown-950 border border-artisan-brown-300 dark:border-artisan-brown-700 rounded-xl p-8 text-center mt-8"
        style={{ boxShadow: "none" }}
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-transparent flex items-center justify-center mb-4 relative">
          <span className="absolute inset-0 rounded-full border-2 border-artisan-brown-700 dark:border-artisan-brown-400 opacity-60 pointer-events-none"></span>
          <svg
            className="w-8 h-8 text-artisan-gold-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 4v16M4 12h16" />
          </svg>
        </div>
        <h4 className="font-semibold text-lg text-artisan-brown-900 dark:text-white mb-2">
          Hỗ trợ khách hàng 24/7
        </h4>
        <p className="text-base text-artisan-brown-600 dark:text-artisan-brown-300">
          Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn mọi
          lúc, mọi nơi. Liên hệ ngay để được tư vấn miễn phí!
        </p>
      </div>
    </div>
  );
}
