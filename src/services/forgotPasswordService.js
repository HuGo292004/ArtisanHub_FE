import { axiosClient } from "./axiosClient";

export const forgotPasswordService = {
  // Gửi email reset password
  sendResetEmail: async (email) => {
    try {
      const response = await axiosClient.post(
        "/api/v1/Account/forgot-password",
        {
          email: email,
        }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi gửi email reset password:", error);
      throw error;
    }
  },

  // Reset password với token
  resetPassword: async (token, newPassword, confirmPassword) => {
    try {
      const response = await axiosClient.post(
        "/api/v1/Account/reset-password",
        {
          token: token,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi reset password:", error);
      throw error;
    }
  },

  // Verify token (nếu API có endpoint này)
  verifyToken: async (token) => {
    try {
      const response = await axiosClient.get(
        `/api/v1/Account/verify-reset-token?token=${token}`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi verify token:", error);
      throw error;
    }
  },
};
