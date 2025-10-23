import { useState, useEffect } from "react";
import ArtistHero from "./components/ArtistHero";
import ArtistCard from "./components/ArtistCard";
import { artistService } from "@/services/artistService";

export const ArtistLayout = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 6 items per page
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    experienceRange: "",
    hasAchievements: "",
  });

  // Lấy danh sách unique values cho filters
  const getUniqueValues = (key) => {
    if (!Array.isArray(artists)) return [];
    const values = artists
      .map((artist) => artist[key])
      .filter((value) => value && value !== null && value !== "")
      .map((value) => (typeof value === "string" ? value.trim() : value));
    return [...new Set(values)].sort();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      specialty: "",
      location: "",
      experienceRange: "",
      hasAchievements: "",
    });
    setSearchTerm("");
    setCurrentPage(1); // Reset về trang đầu khi reset filter
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        // Gọi API thực tế để lấy danh sách nghệ nhân
        const response = await artistService.getAllArtists();
        if (response && response.isSuccess && response.data.items) {
          setArtists(response.data.items);
          setFilteredArtists(response.data.items);
        } else {
          // Fallback về mảng rỗng nếu API không trả về đúng format
          console.warn("API response format không đúng");
          console.log("Expected format: { isSuccess: true, data: [...] }");
          console.log("Actual response:", response);
          setArtists([]);
          setFilteredArtists([]);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        // Hiển thị lỗi khi API không hoạt động
        setError(err.message || "Không thể tải danh sách nghệ nhân");
        setArtists([]);
        setFilteredArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // Lọc nghệ nhân theo từ khóa tìm kiếm và filters
  useEffect(() => {
    let filtered = Array.isArray(artists) ? artists : [];

    // Filter by search term (chỉ tìm theo tên nghệ nhân)
    if (searchTerm.trim()) {
      filtered = filtered.filter((artist) =>
        artist.artistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialty
    if (filters.specialty) {
      filtered = filtered.filter(
        (artist) =>
          artist.specialty &&
          artist.specialty
            .toLowerCase()
            .includes(filters.specialty.toLowerCase())
      );
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((artist) =>
        artist.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by experience range
    if (filters.experienceRange) {
      filtered = filtered.filter((artist) => {
        const years = artist.experienceYears || 0;
        switch (filters.experienceRange) {
          case "0-5":
            return years >= 0 && years <= 5;
          case "6-15":
            return years >= 6 && years <= 15;
          case "16-30":
            return years >= 16 && years <= 30;
          case "30+":
            return years > 30;
          default:
            return true;
        }
      });
    }

    // Filter by achievements
    if (filters.hasAchievements) {
      filtered = filtered.filter((artist) => {
        if (filters.hasAchievements === "yes") {
          return artist.achievements && artist.achievements.length > 0;
        } else if (filters.hasAchievements === "no") {
          return !artist.achievements || artist.achievements.length === 0;
        }
        return true;
      });
    }

    setFilteredArtists(filtered);

    // Tính toán tổng số trang
    const totalPagesCount = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPagesCount);

    // Reset về trang đầu nếu trang hiện tại vượt quá tổng số trang
    if (currentPage > totalPagesCount && totalPagesCount > 0) {
      setCurrentPage(1);
    }
  }, [searchTerm, filters, artists, itemsPerPage, currentPage]);

  // Tính toán dữ liệu cho trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredArtists.slice(startIndex, endIndex);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý khi search hoặc filter thay đổi
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang đầu
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset về trang đầu
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-artisan-brown-950">
        <ArtistHero />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-artisan-brown-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-artisan-brown-950">
        <ArtistHero />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-artisan-brown-600 text-white px-6 py-2 rounded-lg hover:bg-artisan-brown-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artisan-brown-950">
      <ArtistHero />

      {/* Thanh tìm kiếm và bộ lọc */}
      <section className="py-8 bg-artisan-brown-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search by name */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên nghệ nhân..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 border border-artisan-brown-700 bg-artisan-brown-800 text-white placeholder-artisan-brown-300 rounded-lg search-input-focus"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-artisan-gold-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Filter dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Specialty Filter */}
              <div>
                <label className="block text-artisan-brown-200 text-sm font-medium mb-2">
                  Chuyên môn
                </label>
                <select
                  value={filters.specialty}
                  onChange={(e) =>
                    handleFilterChange("specialty", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-artisan-brown-700 bg-artisan-brown-800 text-white rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                >
                  <option value="">Tất cả chuyên môn</option>
                  {getUniqueValues("specialty").map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-artisan-brown-200 text-sm font-medium mb-2">
                  Địa điểm
                </label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-artisan-brown-700 bg-artisan-brown-800 text-white rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                >
                  <option value="">Tất cả địa điểm</option>
                  {getUniqueValues("location").map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-artisan-brown-200 text-sm font-medium mb-2">
                  Kinh nghiệm
                </label>
                <select
                  value={filters.experienceRange}
                  onChange={(e) =>
                    handleFilterChange("experienceRange", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-artisan-brown-700 bg-artisan-brown-800 text-white rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                >
                  <option value="">Tất cả kinh nghiệm</option>
                  <option value="0-5">0-5 năm</option>
                  <option value="6-15">6-15 năm</option>
                  <option value="16-30">16-30 năm</option>
                  <option value="30+">Trên 30 năm</option>
                </select>
              </div>

              {/* Achievements Filter */}
              <div>
                <label className="block text-artisan-brown-200 text-sm font-medium mb-2">
                  Thành tích
                </label>
                <select
                  value={filters.hasAchievements}
                  onChange={(e) =>
                    handleFilterChange("hasAchievements", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-artisan-brown-700 bg-artisan-brown-800 text-white rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  <option value="yes">Có thành tích</option>
                  <option value="no">Chưa có thành tích</option>
                </select>
              </div>
            </div>

            {/* Reset button */}
            <div className="text-center">
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-artisan-brown-700 hover:bg-artisan-brown-600 text-white rounded-lg transition-colors text-sm"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách nghệ nhân */}
      <section id="artists-section" className="py-16 bg-artisan-brown-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-artisan-gold-400 mb-4 mt-8">
              Danh Sách Cửa Hàng
            </h2>
            <p className="text-artisan-brown-200 text-lg">
              Tìm thấy {filteredArtists.length} cửa hàng
              {searchTerm && ` cho "${searchTerm}"`}
            </p>

            {/* Active filters display */}
            {(searchTerm ||
              Object.values(filters).some((filter) => filter !== "")) && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {filters.specialty && (
                  <span className="px-3 py-1 bg-artisan-gold-500/20 text-artisan-gold-300 rounded-full text-sm">
                    Chuyên môn: {filters.specialty}
                  </span>
                )}
                {filters.location && (
                  <span className="px-3 py-1 bg-artisan-gold-500/20 text-artisan-gold-300 rounded-full text-sm">
                    Địa điểm: {filters.location}
                  </span>
                )}
                {filters.experienceRange && (
                  <span className="px-3 py-1 bg-artisan-gold-500/20 text-artisan-gold-300 rounded-full text-sm">
                    Kinh nghiệm:{" "}
                    {filters.experienceRange === "30+"
                      ? "Trên 30 năm"
                      : `${filters.experienceRange} năm`}
                  </span>
                )}
                {filters.hasAchievements && (
                  <span className="px-3 py-1 bg-artisan-gold-500/20 text-artisan-gold-300 rounded-full text-sm">
                    Thành tích:{" "}
                    {filters.hasAchievements === "yes" ? "Có" : "Chưa có"}
                  </span>
                )}
              </div>
            )}
          </div>

          {!Array.isArray(filteredArtists) || filteredArtists.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-artisan-gold-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Không tìm thấy nghệ nhân nào
              </h3>
              <p className="text-artisan-brown-300">
                Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getCurrentPageData().map((artist) => (
                <ArtistCard key={artist.artistId} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-8 bg-artisan-brown-900">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center space-x-2">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-artisan-brown-700 text-artisan-brown-500 cursor-not-allowed"
                    : "bg-artisan-brown-600 text-white hover:bg-artisan-brown-500"
                }`}
              >
                ← Trước
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? "bg-artisan-gold-500 text-white font-bold"
                        : "bg-artisan-brown-600 text-white hover:bg-artisan-brown-500"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-artisan-brown-700 text-artisan-brown-500 cursor-not-allowed"
                    : "bg-artisan-brown-600 text-white hover:bg-artisan-brown-500"
                }`}
              >
                Sau →
              </button>
            </div>

            {/* Page info */}
            <div className="text-center mt-4">
              <p className="text-artisan-brown-300 text-sm">
                Trang {currentPage} / {totalPages} • Hiển thị{" "}
                {getCurrentPageData().length} trong {filteredArtists.length}{" "}
                nghệ nhân
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
