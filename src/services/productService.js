import { axiosClient } from "./axiosClient";

export const productService = {
  // Lấy danh sách sản phẩm trending
  getTrendingProducts: async (top = 10) => {
    try {
      const response = await axiosClient.get(
        `/api/favorites/trending?top=${top}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm trending:", error);
      throw error;
    }
  },

  // Lấy tất cả sản phẩm
  getAllProducts: async () => {
    try {
      const response = await axiosClient.get("/api/products");
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (productId) => {
    try {
      const response = await axiosClient.get(`/api/products/${productId}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      throw error;
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (query) => {
    try {
      const response = await axiosClient.get(`/api/products/search?q=${query}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await axiosClient.get(
        `/api/products/category/${categoryId}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
      throw error;
    }
  },
};
