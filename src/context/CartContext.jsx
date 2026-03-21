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

    // Tự động ẩn tooltip sau 5 giây
    useEffect(() => {
        if (showTooltip) {
            const timer = setTimeout(() => {
                setShowTooltip(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showTooltip]);

    const addToCart = (product, quantity = 1) => {
        if (product.stock <= 0) {
            showToast("Sản phẩm này đã hết hàng!", "error");
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            const newQuantity = (existingItem?.quantity || 0) + quantity;

            if (newQuantity > product.stock) {
                showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, "warning");
                return prevCart;
            }

            let newCart;
            if (existingItem) {
                newCart = prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                newCart = [...prevCart, { ...product, quantity, checked: true }];
            }

            showToast("Đã thêm vào giỏ hàng!", "success");

            // Hiển thị tooltip hướng dẫn trên mobile
            if (window.innerWidth <= 768) {
                setShowTooltip(true);
            }

            return newCart;
        });
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) return;

        const item = cart.find(item => item.id === productId);
        if (item && newQty > (item.stock || 0)) {
            showToast(`Chỉ còn ${item.stock} sản phẩm trong kho!`, "warning");
            return;
        }

        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity: newQty } : item
        ));
    };

    const toggleCheck = (productId) => {
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, checked: !item.checked } : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
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