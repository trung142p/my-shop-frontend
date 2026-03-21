import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Cart() {
    const { cart, removeFromCart, updateQuantity, toggleCheck } = useContext(CartContext);
    const navigate = useNavigate();
    const { t } = useTranslation('cart');

    const selectedItems = cart.filter(item => item.checked);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto p-4 py-10">
            <h1 className="text-2xl font-bold mb-8 border-b pb-4 text-gray-800 dark:text-white">{t('title')}</h1>

            {cart.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{t('empty')}</p>
                    <button onClick={() => navigate("/")} className="text-pink-600 font-bold underline">{t('continueShopping')}</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border dark:border-gray-700">
                            {/* Hàng trên: checkbox + ảnh + tên */}
                            <div className="flex gap-3">
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => toggleCheck(item.id)}
                                    className="w-5 h-5 accent-pink-600 cursor-pointer mt-1 flex-shrink-0"
                                />

                                {/* Ảnh */}
                                <img
                                    src={item.images?.[0] || item.image}
                                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                    alt={item.name}
                                />

                                {/* Tên và giá */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm line-clamp-2">
                                        {item.name}
                                    </h3>
                                    <p className="text-pink-600 font-bold text-sm mt-1">
                                        {item.price.toLocaleString()} ₫
                                    </p>
                                </div>
                            </div>

                            {/* Hàng dưới: bộ tăng giảm + nút xóa */}
                            <div className="flex items-center justify-between mt-3 pl-8">
                                {/* Bộ tăng giảm số lượng */}
                                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="px-3 py-1 font-bold text-sm min-w-[40px] text-center text-gray-800 dark:text-white">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Nút xóa */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span className="hidden xs:inline">{t('delete')}</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Thanh tổng tiền */}
                    <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 shadow-lg border-t dark:border-gray-700 mt-4 rounded-t-xl">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {t('total')} ({selectedItems.length} {t('selected')}):
                            </p>
                            <p className="text-xl font-bold text-pink-600">
                                {totalPrice.toLocaleString()} ₫
                            </p>
                        </div>
                        <button
                            disabled={selectedItems.length === 0}
                            onClick={() => navigate("/checkout")}
                            className={`w-full py-3 rounded-xl font-bold text-white transition-all ${selectedItems.length > 0
                                ? "bg-pink-600 hover:bg-pink-700"
                                : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                                }`}
                        >
                            {t('checkout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;