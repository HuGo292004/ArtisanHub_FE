import { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "@/services/cartService";

const CartContext = createContext();

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

  // Load cart items from API on mount - LUÔN LOAD TỪ BACKEND
  useEffect(() => {
    // LUÔN load từ backend để đảm bảo đồng bộ
    loadCartItems();
    // Không dùng localStorage nữa vì nó gây mất đồng bộ
  }, []);

  // Load cart items from API
  const loadCartItems = async () => {
    try {
      setLoading(true);
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
      console.error("Error loading cart items:", err);
      setError(err.message || "Không thể tải giỏ hàng");
      setCartItems([]);
      setCartItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart - GỌI API VÀ RELOAD TỪ BACKEND
  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);

      // Gọi API add to cart
      const response = await cartService.addToCart(productId, quantity);

      if (response && response.isSuccess) {
        // Reload từ backend để lấy data mới
        await loadCartItems();
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

  // Update item quantity - GỌI API VÀ RELOAD TỪ BACKEND
  const updateCartItem = async (productId, quantity) => {
    try {
      setError(null);

      if (quantity <= 0) {
        return await removeFromCart(productId);
      }

      // Gọi API update (DELETE + POST)
      const response = await cartService.updateCartItem(productId, quantity);

      if (response && response.isSuccess) {
        // Reload từ backend
        await loadCartItems();
        return { success: true, message: "Đã cập nhật số lượng sản phẩm" };
      } else {
        throw new Error(response?.message || "Không thể cập nhật");
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      await loadCartItems(); // Reload anyway
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
        // Reload từ backend
        await loadCartItems();
        return { success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" };
      } else {
        throw new Error(response?.message || "Không thể xóa");
      }
    } catch (err) {
      console.error("Error removing:", err);
      await loadCartItems(); // Reload anyway
      setError(err.message || "Không thể xóa");
      return { success: false, message: err.message || "Không thể xóa" };
    }
  };

  // Clear cart - GỌI API VÀ RELOAD TỪ BACKEND
  const clearCart = async () => {
    try {
      setError(null);

      // Thử gọi API clear
      try {
        const response = await cartService.clearCart();
        if (response && response.isSuccess) {
          await loadCartItems();
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
