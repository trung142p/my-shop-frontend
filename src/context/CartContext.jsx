import React, { createContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const { showToast } = useToast();

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        // Kiểm tra tồn kho
        if (product.stock <= 0) {
            showToast("Sản phẩm này đã hết hàng!", "error");
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            const newQuantity = (existingItem?.quantity || 0) + quantity;

            // Kiểm tra nếu số lượng vượt quá tồn kho
            if (newQuantity > product.stock) {
                showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, "warning");
                return prevCart;
            }

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity, checked: true }];
        });
        //showToast("Đã thêm vào giỏ hàng!", "success");
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) return;

        // Tìm sản phẩm trong giỏ để kiểm tra tồn kho
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
            toggleCheck
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;