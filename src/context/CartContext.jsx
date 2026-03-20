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

    const addToCart = (product, quantity) => {
        setCart((prevCart) => {
            const isExist = prevCart.find((item) => item.id === product.id);
            if (isExist) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Mặc định khi thêm vào là đã tích chọn (checked: true)
            return [...prevCart, { ...product, quantity, checked: true }];
        });
        showToast("Đã thêm vào giỏ hàng!", "success");
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) return;
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
        /* QUAN TRỌNG: Phải thêm updateQuantity và toggleCheck vào đây */
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