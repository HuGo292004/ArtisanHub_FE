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

  // Cập nhật trạng thái đơn hàng
  // PUT /api/Order/status?orderCode={orderCode}
  // Body: "PAID" hoặc "CANCELLED"
  updateOrderStatus: async (orderCode, status) => {
    try {
      const response = await axiosClient.put(
        `/api/Order/status?orderCode=${orderCode}`,
        JSON.stringify(status),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      throw error;
    }
  },
};

export default orderService;

