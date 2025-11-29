import { axiosClient } from "./axiosClient";

export const cartService = {
  // Lấy danh sách sản phẩm trong giỏ hàng (GET /api/Carts)
  getCartItems: async () => {
    try {
      const response = await axiosClient.get("/api/Carts");
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:", error);
      throw error;
    }
  },

  // Thêm sản phẩm vào giỏ hàng (POST /api/Carts)
  addToCart: async (productId, quantity = 1) => {
    try {
      const cartData = {
        productId: productId,
        quantity: quantity,
      };

      const response = await axiosClient.post("/api/Carts", cartData);
      return response;
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      throw error;
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  // Sử dụng PUT /api/Carts/{cartItemId}/quantity
  updateCartItem: async (cartItemId, quantity) => {
    try {
      const response = await axiosClient.put(
        `/api/Carts/${cartItemId}/quantity`,
        {
          quantity: quantity,
        }
      );
      return response;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng:",
        error
      );
      throw error;
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (cartItemId) => {
    try {
      const response = await axiosClient.delete(`/api/Carts/${cartItemId}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      throw error;
    }
  },

  // Xóa tất cả sản phẩm khỏi giỏ hàng
  clearCart: async () => {
    try {
      const response = await axiosClient.delete("/api/Carts/clear");
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng:", error);
      throw error;
    }
  },

  // Lấy tổng số lượng sản phẩm trong giỏ hàng
  getCartItemCount: async () => {
    try {
      const response = await cartService.getCartItems();
      if (response && response.isSuccess && response.data) {
        const totalItems = response.data.reduce(
          (total, item) => total + item.quantity,
          0
        );
        return totalItems;
      }
      return 0;
    } catch (error) {
      console.error("Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:", error);
      return 0;
    }
  },
};
