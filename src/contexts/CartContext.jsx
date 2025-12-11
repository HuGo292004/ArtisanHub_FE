import { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "@/services/cartService";

const CartContext = createContext();

// Constants for localStorage
const PENDING_CART_KEY = "pending_cart_items";

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kiểm tra đăng nhập
  const isLoggedIn = () => {
    try {
      return Boolean(localStorage.getItem("access_token"));
    } catch {
      return false;
    }
  };

  // Helper functions for localStorage cart
  const getPendingCartItems = () => {
    try {
      const items = localStorage.getItem(PENDING_CART_KEY);
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  };

  const savePendingCartItem = (productId, quantity) => {
    try {
      const pendingItems = getPendingCartItems();
      const existingIndex = pendingItems.findIndex(
        (item) => item.productId === productId
      );

      if (existingIndex >= 0) {
        // Cập nhật quantity nếu sản phẩm đã có
        pendingItems[existingIndex].quantity += quantity;
      } else {
        // Thêm sản phẩm mới
        pendingItems.push({ productId, quantity });
      }

      localStorage.setItem(PENDING_CART_KEY, JSON.stringify(pendingItems));
      return true;
    } catch (err) {
      console.error("Error saving to pending cart:", err);
      return false;
    }
  };

  const clearPendingCart = () => {
    try {
      localStorage.removeItem(PENDING_CART_KEY);
    } catch (err) {
      console.error("Error clearing pending cart:", err);
    }
  };

  // Load cart items from API on mount - CHỈ KHI ĐÃ ĐĂNG NHẬP
  useEffect(() => {
    // Chỉ load từ backend khi đã đăng nhập
    if (isLoggedIn()) {
      loadCartItems();
    }
  }, []);

  // Load cart items from API
  const loadCartItems = async (showLoading = true) => {
    // Không gọi API nếu chưa đăng nhập
    if (!isLoggedIn()) {
      setCartItems([]);
      setCartItemCount(0);
      return;
    }

    try {
      // Chỉ hiện loading khi được yêu cầu (lần đầu load)
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const response = await cartService.getCartItems();

      // Since axiosClient interceptor returns response.data,
      // response is already the data object
      if (response && response.isSuccess && response.data) {
        // Check if response.data has items property (nested structure)
        if (response.data.items && Array.isArray(response.data.items)) {
          const cartData = response.data.items;
          setCartItems(cartData);
          const totalCount = cartData.reduce(
            (total, item) => total + (item.quantity || 0),
            0
          );
          setCartItemCount(totalCount);
        } else if (Array.isArray(response.data)) {
          // Ensure response.data is an array
          const cartData = response.data;
          setCartItems(cartData);
          const totalCount = cartData.reduce(
            (total, item) => total + (item.quantity || 0),
            0
          );
          setCartItemCount(totalCount);
        } else {
          setCartItems([]);
          setCartItemCount(0);
        }
      } else if (Array.isArray(response)) {
        // If response is directly an array (fallback case)
        setCartItems(response);
        const totalCount = response.reduce(
          (total, item) => total + (item.quantity || 0),
          0
        );
        setCartItemCount(totalCount);
      } else {
        setCartItems([]);
        setCartItemCount(0);
      }
    } catch (err) {
      // Không log lỗi 401 (chưa đăng nhập hoặc token hết hạn) - đây là trường hợp bình thường
      if (err?.status !== 401) {
        console.error("Error loading cart items:", err);
        setError(err.message || "Không thể tải giỏ hàng");
      }
      setCartItems([]);
      setCartItemCount(0);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Add item to cart - GỌI API VÀ RELOAD TỪ BACKEND
  const addToCart = async (productId, quantity = 1) => {
    // Nếu chưa đăng nhập, lưu vào localStorage
    if (!isLoggedIn()) {
      const saved = savePendingCartItem(productId, quantity);
      if (saved) {
        return {
          success: true,
          message: "Sản phẩm sẽ được thêm vào giỏ hàng sau khi đăng nhập",
          isPending: true,
        };
      } else {
        return {
          success: false,
          message: "Không thể lưu sản phẩm",
        };
      }
    }

    try {
      setError(null);

      // Gọi API add to cart
      const response = await cartService.addToCart(productId, quantity);

      if (response && response.isSuccess) {
        // Reload từ backend để lấy data mới (không hiện loading)
        await loadCartItems(false);
        return { success: true, message: "Đã thêm sản phẩm vào giỏ hàng" };
      } else {
        throw new Error(response?.message || "Không thể thêm vào giỏ hàng");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err.message || "Không thể thêm vào giỏ hàng");
      return {
        success: false,
        message: err.message || "Không thể thêm vào giỏ hàng",
      };
    }
  };

  // Update item quantity - GỌI API PUT /api/Carts/{cartItemId}/quantity
  const updateCartItem = async (cartItemId, quantity) => {
    try {
      setError(null);

      if (quantity <= 0) {
        return await removeFromCart(cartItemId);
      }

      // Gọi API PUT /api/Carts/{cartItemId}/quantity
      const response = await cartService.updateCartItem(cartItemId, quantity);

      if (response && response.isSuccess) {
        // Reload từ backend (không hiện loading)
        await loadCartItems(false);
        return { success: true, message: "Đã cập nhật số lượng sản phẩm" };
      } else {
        throw new Error(response?.message || "Không thể cập nhật");
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      await loadCartItems(false); // Reload anyway (không hiện loading)
      setError(err.message || "Không thể cập nhật");
      return { success: false, message: err.message || "Không thể cập nhật" };
    }
  };

  // Remove item - GỌI API VÀ RELOAD TỪ BACKEND
  const removeFromCart = async (cartItemId) => {
    try {
      setError(null);

      // Gọi API xóa
      const response = await cartService.removeFromCart(cartItemId);

      if (response && response.isSuccess) {
        // Reload từ backend (không hiện loading)
        await loadCartItems(false);
        return { success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" };
      } else {
        throw new Error(response?.message || "Không thể xóa");
      }
    } catch (err) {
      console.error("Error removing:", err);
      await loadCartItems(false); // Reload anyway (không hiện loading)
      setError(err.message || "Không thể xóa");
      return { success: false, message: err.message || "Không thể xóa" };
    }
  };

  // Clear cart - GỌI API VÀ RELOAD TỪ BACKEND
  const clearCart = async () => {
    try {
      setError(null);

      // Xóa pending cart trong localStorage (nếu có)
      clearPendingCart();

      // Thử gọi API clear
      try {
        const response = await cartService.clearCart();
        if (response && response.isSuccess) {
          await loadCartItems(false);
          return { success: true, message: "Đã xóa tất cả" };
        }
      } catch {
        // Fallback: xóa local
        setCartItems([]);
        setCartItemCount(0);
        return { success: true, message: "Đã xóa tất cả" };
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setCartItems([]);
      setCartItemCount(0);
      setError(err.message || "Không thể xóa giỏ hàng");
      return { success: false, message: err.message || "Lỗi" };
    }
  };

  // Sync pending cart items from localStorage to backend after login
  const syncPendingCart = async () => {
    if (!isLoggedIn()) {
      return { success: false, message: "Chưa đăng nhập" };
    }

    const pendingItems = getPendingCartItems();

    if (pendingItems.length === 0) {
      return { success: true, message: "Không có sản phẩm chờ đồng bộ" };
    }

    try {
      let successCount = 0;
      let failCount = 0;

      // Thêm từng sản phẩm vào giỏ hàng
      for (const item of pendingItems) {
        try {
          const response = await cartService.addToCart(
            item.productId,
            item.quantity
          );
          if (response && response.isSuccess) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          console.error("Error syncing item:", item, err);
          failCount++;
        }
      }

      // Xóa pending cart sau khi sync xong
      clearPendingCart();

      // Reload giỏ hàng từ backend
      await loadCartItems(false);

      if (successCount > 0) {
        return {
          success: true,
          message: `Đã thêm ${successCount} sản phẩm vào giỏ hàng${
            failCount > 0 ? ` (${failCount} sản phẩm thất bại)` : ""
          }`,
        };
      } else {
        return {
          success: false,
          message: "Không thể đồng bộ sản phẩm vào giỏ hàng",
        };
      }
    } catch (err) {
      console.error("Error syncing pending cart:", err);
      return {
        success: false,
        message: "Lỗi khi đồng bộ giỏ hàng",
      };
    }
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // API returns flat structure: price directly on item
      const price =
        item.price || item.product?.discountPrice || item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const value = {
    cartItems,
    cartItemCount,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCartItems,
    getTotalPrice,
    syncPendingCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
