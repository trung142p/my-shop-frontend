import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function FloatingCartButton() {
    const { cart } = useContext(CartContext);
    const location = useLocation();

    // Tính tổng số lượng sản phẩm trong giỏ
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Các trang không hiển thị floating cart button
    const hiddenPages = [
        "/cart",
        "/checkout",
        "/complete",
        "/bank-transfer",
        "/admin/login",
        "/admin/dashboard",
        "/track-order"
    ];

    // Kiểm tra nếu đang ở trang cần ẩn
    if (hiddenPages.includes(location.pathname) || location.pathname.startsWith("/admin")) {
        return null;
    }

    // Nếu giỏ hàng trống thì không hiển thị
    if (totalItems === 0) {
        return null;
    }

    return (
        <Link
            to="/cart"
            className="fixed bottom-6 right-4 z-50 md:hidden"
        >
            <div className="relative">
                <div className="bg-pink-600 rounded-full p-3 shadow-lg hover:bg-pink-700 transition-all duration-300 active:scale-95">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                {/* Badge số lượng */}
                {totalItems > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce-slow">
                        {totalItems > 99 ? "99+" : totalItems}
                    </div>
                )}
            </div>
        </Link>
    );
}

export default FloatingCartButton;