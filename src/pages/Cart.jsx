import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
    const { cart, removeFromCart, updateQuantity, toggleCheck } = useContext(CartContext);
    const navigate = useNavigate();

    // Chỉ tính tiền cho những sản phẩm được tích chọn
    const selectedItems = cart.filter(item => item.checked);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto p-4 py-10">
            <h1 className="text-2xl font-bold mb-8 border-b pb-4">GIỎ HÀNG</h1>

            {cart.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
                    <button onClick={() => navigate("/")} className="text-pink-600 font-bold underline">Tiếp tục mua sắm</button>
                </div>
            ) : (
                <div className="space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white p-4 shadow-sm rounded-sm border">
                            {/* Checkbox tích chọn */}
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleCheck(item.id)}
                                className="w-5 h-5 accent-pink-600 cursor-pointer"
                            />

                            <img src={item.images?.[0] || item.image} className="w-20 h-20 object-cover rounded" alt={item.name} />

                            <div className="flex-1">
                                <h3 className="font-medium text-gray-800 line-clamp-1">{item.name}</h3>
                                <p className="text-pink-600 font-bold">{item.price.toLocaleString()} ₫</p>
                            </div>

                            {/* Bộ tăng giảm số lượng */}
                            <div className="flex items-center border border-gray-200 rounded">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                                <span className="px-3 py-1 font-bold border-x">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                            </div>

                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 ml-4 text-sm">Xóa</button>
                        </div>
                    ))}

                    {/* Thanh tổng tiền cố định ở dưới */}
                    <div className="sticky bottom-0 bg-white p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-gray-600 text-sm">Tổng cộng ({selectedItems.length} sản phẩm đã chọn):</p>
                            <p className="text-2xl font-bold text-pink-600">{totalPrice.toLocaleString()} ₫</p>
                        </div>
                        <button
                            disabled={selectedItems.length === 0}
                            onClick={() => navigate("/checkout")}
                            className={`px-10 py-3 rounded-sm font-bold text-white transition-all ${selectedItems.length > 0 ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            THANH TOÁN NGAY
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;