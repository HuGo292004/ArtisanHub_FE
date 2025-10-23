import { axiosClient } from "./axiosClient";

export const artistService = {
  // Lấy danh sách tất cả nghệ nhân
  getAllArtists: async () => {
    try {
      // Thay đổi endpoint theo API thực tế của bạn
      const response = await axiosClient.get("/api/artist-profiles");
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nghệ nhân:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết một nghệ nhân và sản phẩm của họ
  getArtistDetail: async (artistId) => {
    try {
      const response = await axiosClient.get(
        `/api/my-products/artist/${artistId}/products`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết nghệ nhân:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết một nghệ nhân
  getArtistById: async (artistId) => {
    try {
      const response = await axiosClient.get(`/artist-profiles/${artistId}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nghệ nhân:", error);
      throw error;
    }
  },

  // Tìm kiếm nghệ nhân theo tên hoặc chuyên môn
  searchArtists: async (query) => {
    try {
      const response = await axiosClient.get(
        `/artists/search?q=${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm nghệ nhân:", error);
      throw error;
    }
  },
};
