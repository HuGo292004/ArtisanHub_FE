const ArtistHero = () => {
  const scrollToArtists = () => {
    const artistsSection = document.getElementById("artists-section");
    if (artistsSection) {
      artistsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-artisan-brown-950 to-artisan-brown-900 py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-artisan-brown-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-artisan-brown-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-artisan-brown-300 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 border-2 border-artisan-brown-300 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tiêu đề chính */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 mt-5">
            Khám phá
            <span className="block text-artisan-gold-400 mt-2">
              Nghệ Thuật Thủ Công
            </span>
            <span className="block text-white text-3xl md:text-4xl lg:text-5xl mt-2">
              Việt Nam
            </span>
          </h1>

          {/* Mô tả */}
          <p className="text-lg md:text-xl text-artisan-brown-200 mb-8 leading-relaxed">
            Khám phá những nghệ nhân tài hoa với bàn tay vàng, những người đã
            dành cả đời để gìn giữ và phát triển các nghề thủ công truyền thống
            của Việt Nam.
          </p>

          {/* Thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-artisan-brown-800/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-artisan-brown-700">
              <div className="text-3xl font-bold text-artisan-gold-400 mb-2">
                50+
              </div>
              <div className="text-artisan-brown-200">Nghệ nhân</div>
            </div>
            <div className="bg-artisan-brown-800/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-artisan-brown-700">
              <div className="text-3xl font-bold text-artisan-gold-400 mb-2">
                15+
              </div>
              <div className="text-artisan-brown-200">Làng nghề</div>
            </div>
            <div className="bg-artisan-brown-800/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-artisan-brown-700">
              <div className="text-3xl font-bold text-artisan-gold-400 mb-2">
                100+
              </div>
              <div className="text-artisan-brown-200">Sản phẩm</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToArtists}
              className="bg-gradient-to-r from-artisan-gold-500 to-artisan-gold-600 hover:from-artisan-gold-600 hover:to-artisan-gold-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Khám phá ngay
            </button>
            <button className="border-2 border-artisan-gold-500 text-white hover:bg-artisan-gold-500/10 px-8 py-3 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm">
              Xem video giới thiệu
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-artisan-brown-950 to-transparent"></div>
    </section>
  );
};

export default ArtistHero;
