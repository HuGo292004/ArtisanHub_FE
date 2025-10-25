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

  // Load cart items from localStorage on mount, fallback to API
  useEffect(() => {
    const savedCart = localStorage.getItem("artisan_cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setCartItems(cartData);
        const totalCount = cartData.reduce(
          (total, item) => total + (item.quantity || 0),
          0
        );
        setCartItemCount(totalCount);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        // Clear corrupted data and load from API
        localStorage.removeItem("artisan_cart");
        loadCartItems();
      }
    } else {
      loadCartItems();
    }
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

  // Add item to cart (LOCAL STATE ONLY - NO API CALL)
  const addToCart = (productId, quantity = 1, productData = null) => {
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItem = prevItems.find(
        (item) =>
          String(item.productId || item.product?.productId) ===
          String(productId)
      );

      let newItems;
      if (existingItem) {
        // If product exists, increase quantity ONLY for the matching item
        newItems = prevItems.map((item) => {
          if (
            String(item.productId || item.product?.productId) ===
            String(productId)
          ) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item; // Return unchanged item
        });
      } else {
        // If product doesn't exist, add new item
        const newItem = {
          // Add cart-specific fields first
          cartItemId: `temp-${Date.now()}`, // Temporary ID for local state
          productId: productId,
          quantity: quantity,
          // Then spread product data (this will override any conflicts)
          ...(productData || {}), // Include any product data passed, fallback to empty object
          // Fallback values if productData is null/undefined
          productName: productData?.productName || "Sản phẩm không tên",
          price: productData?.price || 0,
          imageUrl:
            productData?.imageUrl ||
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
          category: productData?.category || "Chưa phân loại",
        };
        newItems = [...prevItems, newItem];
      }

      // Save to localStorage
      localStorage.setItem("artisan_cart", JSON.stringify(newItems));

      const newCount = newItems.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      setCartItemCount(newCount);
      return newItems;
    });

    return { success: true, message: "Đã thêm sản phẩm vào giỏ hàng" };
  };

  // Update item quantity in cart (LOCAL STATE ONLY - NO API CALL)
  const updateCartItem = (cartItemId, quantity) => {
    if (quantity <= 0) {
      // Remove item from local state when quantity reaches 0
      setCartItems((prevItems) => {
        const newItems = prevItems.filter(
          (item) =>
            (item.cartItemId || item.id || item.productId) !== cartItemId
        );
        // Save to localStorage
        localStorage.setItem("artisan_cart", JSON.stringify(newItems));

        const newCount = newItems.reduce(
          (total, item) => total + (item.quantity || 0),
          0
        );
        setCartItemCount(newCount);
        return newItems;
      });
      return { success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" };
    }

    // Update quantity in local state
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        // Try to find the item by cartItemId first, then by productId as fallback
        const itemCartId = String(item.cartItemId || item.id || "");
        const itemProductId = String(item.productId || "");
        const targetId = String(cartItemId);

        // Check if this is the item we want to update
        const isMatch = itemCartId === targetId || itemProductId === targetId;

        if (isMatch) {
          return { ...item, quantity };
        }
        return item;
      });

      // Save to localStorage
      localStorage.setItem("artisan_cart", JSON.stringify(newItems));

      const newCount = newItems.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      setCartItemCount(newCount);
      return newItems;
    });

    return { success: true, message: "Đã cập nhật số lượng sản phẩm" };
  };

  // Remove item from cart (LOCAL STATE ONLY - NO API CALL)
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) => (item.cartItemId || item.id || item.productId) !== cartItemId
      );
      // Save to localStorage
      localStorage.setItem("artisan_cart", JSON.stringify(newItems));

      const newCount = newItems.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      setCartItemCount(newCount);
      return newItems;
    });

    return { success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" };
  };

  // Clear entire cart (LOCAL STATE ONLY - NO API CALL)
  const clearCart = () => {
    setCartItems([]);
    setCartItemCount(0);
    // Clear localStorage
    localStorage.removeItem("artisan_cart");
    return {
      success: true,
      message: "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
    };
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
