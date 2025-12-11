import { axiosClient } from "./axiosClient";

export const productService = {
  // Lấy danh sách tất cả sản phẩm (GET /api/my-products/all)
  getAllProducts: async (params = {}) => {
    try {
      const { page = 1, size = 10, searchTerm = "" } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (searchTerm) {
        queryParams.append("searchTerm", searchTerm);
      }

      const response = await axiosClient.get(
        `/api/my-products/all?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm của user hiện tại (GET /api/my-products)
  getMyProducts: async (params = {}) => {
    try {
      const { page = 1, size = 10 } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      const response = await axiosClient.get(`/api/my-products?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm của tôi:", error);
      throw error;
    }
  },

  // Tạo sản phẩm mới (POST /api/my-products)
  createProduct: async (productData) => {
    try {
      const response = await axiosClient.post("/api/my-products", productData);
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết một sản phẩm (GET /api/my-products/{productId})
  getProductById: async (productId) => {
    try {
      const response = await axiosClient.get(`/api/my-products/${productId}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      throw error;
    }
  },

  // Cập nhật sản phẩm (PUT /api/my-products/{productId})
  // Body: FormData với các fields: CategoryId, Name, Description, Story, Price, DiscountPrice, StockQuantity, Weight, Images, Status
  updateProduct: async (productId, productData) => {
    try {
      // Nếu productData là FormData thì gửi trực tiếp, không set Content-Type để axios tự set với boundary
      const response = await axiosClient.put(
        `/api/my-products/${productId}`,
        productData
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      throw error;
    }
  },

  // Xóa sản phẩm (DELETE /api/my-products/{productId})
  deleteProduct: async (productId) => {
    try {
      const response = await axiosClient.delete(
        `/api/my-products/${productId}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw error;
    }
  },

  // Lấy sản phẩm cho khách hàng (GET /api/my-products/customer/{productId})
  getProductForCustomer: async (productId) => {
    try {
      const response = await axiosClient.get(
        `/api/my-products/customer/${productId}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm cho khách hàng:", error);
      throw error;
    }
  },

  // Lấy sản phẩm theo nghệ nhân (GET /api/my-products/artist/{artistId}/products)
  getProductsByArtist: async (artistId, params = {}) => {
    try {
      const { page = 1, size = 10 } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      const response = await axiosClient.get(
        `/api/my-products/artist/${artistId}/products?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo nghệ nhân:", error);
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục (GET /api/my-products/category/{categoryId})
  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const { page = 1, size = 10 } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      const response = await axiosClient.get(
        `/api/my-products/category/${categoryId}?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
      throw error;
    }
  },

  // Tìm kiếm sản phẩm nâng cao (GET /api/my-products/search)
  searchProducts: async (searchParams = {}) => {
    try {
      const {
        query = "",
        category = "",
        minPrice = "",
        maxPrice = "",
        artistId = "",
        page = 1,
        size = 10,
        sortBy = "",
        sortOrder = "asc",
      } = searchParams;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (query) queryParams.append("query", query);
      if (category) queryParams.append("category", category);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (artistId) queryParams.append("artistId", artistId);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

      const response = await axiosClient.get(
        `/api/my-products/search?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      throw error;
    }
  },

  // Lọc sản phẩm (GET /api/my-products/filter)
  filterProducts: async (filterParams = {}) => {
    try {
      const {
        category = "",
        priceRange = "",
        rating = "",
        availability = "",
        page = 1,
        size = 10,
        sortBy = "",
        sortOrder = "asc",
      } = filterParams;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (category) queryParams.append("category", category);
      if (priceRange) queryParams.append("priceRange", priceRange);
      if (rating) queryParams.append("rating", rating);
      if (availability) queryParams.append("availability", availability);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

      const response = await axiosClient.get(
        `/api/my-products/filter?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lọc sản phẩm:", error);
      throw error;
    }
  },
};
