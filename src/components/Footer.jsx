import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Về ArtisanHub",
      links: [
        {
          name: "Câu chuyện của chúng tôi",
          href: "#",
          className: "text-white",
        },
        {
          name: "Sứ mệnh & Tầm nhìn",
          href: "#",
          className: "text-white",
        },
        {
          name: "Nghệ nhân đối tác",
          href: "#",
          className: "text-white",
        },
        { name: "Tuyển dụng", href: "#", className: "text-white" },
      ],
    },
    {
      title: "Danh mục sản phẩm",
      links: [
        { name: "Gốm sứ thủ công", href: "#", className: "text-white" },
        { name: "Đồ gỗ mỹ nghệ", href: "#", className: "text-white" },
        { name: "Thêu & Dệt may", href: "#", className: "text-white" },
        { name: "Tranh sơn mài", href: "#", className: "text-white" },
        { name: "Đồ tre nứa", href: "#", className: "text-white" },
        { name: "Trang sức handmade", href: "#", className: "text-white" },
      ],
    },
    {
      title: "Hỗ trợ khách hàng",
      links: [
        { name: "Hướng dẫn mua hàng", href: "#", className: "text-white" },
        { name: "Chính sách đổi trả", href: "#", className: "text-white" },
        { name: "Chính sách bảo hành", href: "#", className: "text-white" },
        { name: "Phương thức thanh toán", href: "#", className: "text-white" },
        { name: "Giao hàng & Vận chuyển", href: "#", className: "text-white" },
      ],
    },
    {
      title: "Kết nối với chúng tôi",
      links: [
        { name: "Blog nghệ thuật", href: "#", className: "text-white" },
        { name: "Sự kiện & Workshop", href: "#", className: "text-white" },
        { name: "Cộng đồng nghệ nhân", href: "#", className: "text-white" },
        { name: "Chương trình đối tác", href: "#", className: "text-white" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { icon: Youtube, href: "#", color: "hover:text-red-500" },
  ];

  return (
    <footer className="bg-artisan-gold-500 text-artisan-brown-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid lg:grid-cols-6 gap-8 ">
          {/* Brand section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-artisan-brown-900">
                  ArtisanHub
                </h3>
                <p className="text-white text-sm">
                  Nghệ thuật thủ công Việt Nam
                </p>
              </div>
            </div>

            <p className="text-white leading-relaxed max-w-md">
              Nền tảng kết nối những nghệ nhân tài năng với khách hàng yêu thích
              nghệ thuật thủ công. Chúng tôi tự hào bảo tồn và phát triển các
              giá trị văn hóa truyền thống Việt Nam.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-artisan-brown-900" />
                <span className="text-white">
                  123 Phố Hàng Gai, Hoàn Kiếm, Hà Nội
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-artisan-brown-900" />
                <span className="text-white">+84 24 3826 1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-artisan-brown-900" />
                <span className="text-white">hello@artisanhub.vn</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-full bg-artisan-gold-600 flex items-center justify-center text-artisan-brown-900 transition-colors duration-200 ${social.color}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-display font-semibold text-lg text-artisan-brown-900">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className={`${
                        link.className || "text-white"
                      } hover:text-artisan-gold-400 transition-colors duration-200 text-sm`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter subscription */}
        <div className="py-8 border-t border-artisan-brown-800">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-display text-xl font-semibold text-white mb-2">
                Đăng ký nhận tin tức
              </h4>
              <p className="text-white">
                Cập nhật những sản phẩm mới nhất và ưu đãi đặc biệt từ
                ArtisanHub
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg bg-artisan-gold-600 border border-artisan-gold-500 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <button className="gradient-gold text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow duration-200">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="py-6 border-t border-artisan-brown-800">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6 text-sm text-white">
              <p>© 2025 ArtisanHub. Tất cả quyền được bảo lưu.</p>
              <div className="flex space-x-6 text-white">
                <a
                  href="#"
                  className="hover:text-artisan-gold-400 transition-colors duration-200"
                >
                  Chính sách bảo mật
                </a>
                <a
                  href="#"
                  className="hover:text-artisan-gold-400 transition-colors duration-200"
                >
                  Điều khoản sử dụng
                </a>
                <a
                  href="#"
                  className="hover:text-artisan-gold-400 transition-colors duration-200"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-white">
              <span>Được tạo với</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>tại Việt Nam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
