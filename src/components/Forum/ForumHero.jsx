import { MessageSquare, Users, BookOpen } from "lucide-react";

const ForumHero = () => {
  return (
    <section className="relative pt-24 pb-16 bg-gradient-to-br from-artisan-brown-900 via-artisan-brown-800 to-artisan-brown-950 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-artisan-gold-400 rounded-full"></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 border border-artisan-gold-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-artisan-gold-500/20 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-artisan-gold-400 to-artisan-gold-600 mb-6 shadow-lg shadow-artisan-gold-500/30">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Diễn Đàn <span className="text-artisan-gold-400">Nghệ Nhân</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-artisan-brown-200 mb-8 max-w-2xl mx-auto">
            Nơi kết nối và chia sẻ kinh nghiệm giữa các nghệ nhân thủ công
            truyền thống Việt Nam
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="flex items-center gap-3 text-artisan-brown-100">
              <div className="p-2 bg-artisan-gold-500/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-artisan-gold-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">Chủ đề</div>
                <div className="text-sm text-artisan-brown-300">
                  Đa dạng lĩnh vực
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-artisan-brown-100">
              <div className="p-2 bg-artisan-gold-500/20 rounded-lg">
                <Users className="w-5 h-5 text-artisan-gold-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">Cộng đồng</div>
                <div className="text-sm text-artisan-brown-300">
                  Nghệ nhân toàn quốc
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-artisan-brown-100">
              <div className="p-2 bg-artisan-gold-500/20 rounded-lg">
                <MessageSquare className="w-5 h-5 text-artisan-gold-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">Thảo luận</div>
                <div className="text-sm text-artisan-brown-300">
                  Chia sẻ kinh nghiệm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#1a0f0a"
          />
        </svg>
      </div>
    </section>
  );
};

export default ForumHero;
