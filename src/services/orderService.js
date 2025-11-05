import { axiosClient } from "./axiosClient";

export const orderService = {
  // Tạo checkout order và nhận paymentUrl từ backend
  checkout: async (payload) => {
    try {
      const response = await axiosClient.post("/api/Order/checkout", payload);
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng/checkout:", error);
      throw error;
    }
  },
};

export default orderService;

