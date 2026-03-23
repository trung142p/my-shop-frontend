import React, { createContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [showTooltip, setShowTooltip] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Tạo key duy nhất cho sản phẩm (dựa trên id + variant_id)
    const getItemKey = (item) => {
        return item.variant_id ? `${item.id}_${item.variant_id}` : `${item.id}`;
    };

    useEffect(() => {
        if (showTooltip) {
            const timer = setTimeout(() => {
                setShowTooltip(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showTooltip]);

    const addToCart = (product, quantity = 1) => {
        const stockToCheck = product.stock ?? 0;
        if (stockToCheck <= 0) {
            showToast("Sản phẩm này đã hết hàng!", "error");
            return;
        }

        setCart((prevCart) => {
            const itemKey = getItemKey(product);
            const existingItem = prevCart.find((item) => getItemKey(item) === itemKey);
            const newQuantity = (existingItem?.quantity || 0) + quantity;

            if (newQuantity > stockToCheck) {
                showToast(`Chỉ còn ${stockToCheck} sản phẩm trong kho!`, "warning");
                return prevCart;
            }

            let newCart;
            if (existingItem) {
                newCart = prevCart.map((item) =>
                    getItemKey(item) === itemKey
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                newCart = [...prevCart, { ...product, quantity, checked: true }];
            }

            showToast("Đã thêm vào giỏ hàng!", "success");

            if (window.innerWidth <= 768) {
                setShowTooltip(true);
            }

            return newCart;
        });
    };

    const updateQuantity = (productId, newQty, variantId = null) => {
        if (newQty < 1) return;

        setCart(prev => {
            const itemKey = variantId ? `${productId}_${variantId}` : `${productId}`;
            const item = prev.find(item => getItemKey(item) === itemKey);

            if (item && newQty > (item.stock || 0)) {
                showToast(`Chỉ còn ${item.stock} sản phẩm trong kho!`, "warning");
                return prev;
            }

            return prev.map(item => {
                const currentKey = getItemKey(item);
                if (currentKey === itemKey) {
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const toggleCheck = (productId, variantId = null) => {
        setCart(prev => prev.map(item => {
            const itemKey = variantId ? `${productId}_${variantId}` : `${productId}`;
            if (getItemKey(item) === itemKey) {
                return { ...item, checked: !item.checked };
            }
            return item;
        }));
    };

    const removeFromCart = (productId, variantId = null) => {
        setCart((prevCart) => {
            const itemKey = variantId ? `${productId}_${variantId}` : `${productId}`;
            return prevCart.filter((item) => getItemKey(item) !== itemKey);
        });
        showToast("Đã xóa khỏi giỏ hàng!", "info");
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            toggleCheck,
            showTooltip,
            setShowTooltip
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;