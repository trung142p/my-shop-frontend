import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function FloatingCartButton() {
    const { cart, showTooltip, setShowTooltip } = useContext(CartContext);
    const location = useLocation();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const hiddenPages = [
        "/cart",
        "/checkout",
        "/complete",
        "/bank-transfer",
        "/admin/login",
        "/admin/dashboard",
        "/track-order"
    ];

    if (hiddenPages.includes(location.pathname) || location.pathname.startsWith("/admin")) {
        return null;
    }

    if (totalItems === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-24 right-4 z-50 md:hidden">
            {/* Tooltip hướng dẫn - nằm bên trái nút giỏ hàng */}
            {showTooltip && (
                <>
                    {/* Tooltip chính */}
                    <div className="absolute bottom-0 right-16 mb-0 mr-2 animate-bounce-slow">
                        <div className="relative bg-pink-500 text-white text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg whitespace-nowrap">
                            <span className="flex items-center gap-2">
                                🛍️ Có sản phẩm mới!
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                            {/* Mũi tên chỉ sang phải (về phía nút giỏ) */}
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-pink-500"></div>
                        </div>
                    </div>

                    {/* Bàn tay chỉ - chỉ vào nút giỏ */}
                    <div className="absolute -bottom-2 right-14 text-3xl animate-bounce z-10 pointer-events-none">
                        👆
                    </div>
                </>
            )}

            <Link
                to="/cart"
                onClick={() => setShowTooltip(false)}
                className="relative block"
            >
                <div className="bg-pink-600 rounded-full p-3 shadow-lg hover:bg-pink-700 transition-all duration-300 active:scale-95">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                {totalItems > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                        {totalItems > 99 ? "99+" : totalItems}
                    </div>
                )}
            </Link>
        </div>
    );
}

export default FloatingCartButton;