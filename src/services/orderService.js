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

  // Lấy danh sách đơn hàng của khách hàng (customer)
  // GET /api/Order/my-orders?page=1&size=10&searchTerm=&status=
  getMyOrders: async (params = {}) => {
    try {
      const { page = 1, size = 10, searchTerm = "", status = "" } = params;
      const response = await axiosClient.get("/api/Order/my-orders", {
        params: { page, size, searchTerm, status },
      });
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng của khách hàng
  // GET /api/Order/my-orders/{orderId}
  getOrderDetail: async (orderId) => {
    try {
      const response = await axiosClient.get(`/api/Order/my-orders/${orderId}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      throw error;
    }
  },

  // Xác nhận đã nhận hàng (Customer xác nhận khi đơn hàng đang Shipping)
  // POST /api/Order/my-orders/{orderId}/confirm-delivered
  confirmDelivered: async (orderId) => {
    try {
      const response = await axiosClient.post(
        `/api/Order/my-orders/${orderId}/confirm-delivered`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi xác nhận đã nhận hàng:", error);
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

  // Tính hoa hồng sau khi thanh toán thành công
  // POST /api/Order/commission
  // Body: { orderCode: number, paymentStatus: string }
  calculateCommission: async (orderCode, paymentStatus) => {
    try {
      const response = await axiosClient.post("/api/Order/commission", {
        orderCode: Number(orderCode),
        paymentStatus: paymentStatus,
      });
      return response;
    } catch (error) {
      console.error("Lỗi khi tính hoa hồng:", error);
      throw error;
    }
  },
};

export default orderService;
