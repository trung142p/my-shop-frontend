import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";

function OrderTracking() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [orderCode, setOrderCode] = useState(state?.orderCode || "");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Hàm che dấu thông tin
    const maskName = (name) => {
        if (!name) return "N/A";
        if (name.length <= 2) return name[0] + "***";
        return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
    };

    const maskPhone = (phone) => {
        if (!phone) return "N/A";
        if (phone.length <= 4) return "****" + phone.slice(-2);
        return "*".repeat(phone.length - 4) + phone.slice(-4);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSearch = async () => {
        if (!orderCode.trim()) {
            showToast("Vui lòng nhập mã đơn hàng!", "warning");
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/orders");
            const foundOrder = res.data.find(o => o.order_code === orderCode.trim());

            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                setOrder(null);
                showToast("Không tìm thấy đơn hàng với mã này!", "error");
            }
        } catch (err) {
            console.error("Lỗi tra cứu:", err);
            showToast("Không thể tra cứu đơn hàng!", "error");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        "Chờ xác nhận": "bg-yellow-100 text-yellow-700",
        "Xác nhận": "bg-blue-100 text-blue-700",
        "Đang vận chuyển": "bg-indigo-100 text-indigo-700",
        "Thành công": "bg-green-100 text-green-700",
        "Hủy": "bg-red-100 text-red-700",
    };

    const statusIcons = {
        "Chờ xác nhận": "⏳",
        "Xác nhận": "✅",
        "Đang vận chuyển": "🚚",
        "Thành công": "🎉",
        "Hủy": "❌",
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">🔍 Tra cứu đơn hàng</h1>
                <p className="text-gray-500">Nhập mã đơn hàng để kiểm tra trạng thái giao hàng</p>
            </div>

            {/* Form tìm kiếm */}
            <div className="max-w-md mx-auto mb-10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="VD: ORD-1742480000000"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {loading ? "Đang tìm..." : "Tìm"}
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    Mã đơn hàng được gửi qua email khi đặt hàng thành công
                </p>
            </div>

            {/* Kết quả tra cứu */}
            {searched && !loading && order && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
                        <h2 className="text-white font-bold text-lg">📦 Kết quả tra cứu</h2>
                        <p className="text-pink-100 text-sm">Mã đơn: {order.order_code}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 p-6">
                        {/* Cột trái: Thông tin khách hàng (ẩn) */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">👤 Thông tin người nhận</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Ngày đặt:</span>
                                    <span className="font-medium">{formatDate(order.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Họ tên:</span>
                                    <span className="font-medium">{maskName(order.customer_info?.name)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Số điện thoại:</span>
                                    <span className="font-medium">{maskPhone(order.customer_info?.phone)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Địa chỉ:</span>
                                    <span className="font-medium text-gray-400">(Đã được bảo mật)</span>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Thông tin đơn hàng */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">📋 Chi tiết đơn hàng</h3>

                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm py-1">
                                        <span className="text-gray-600">{item.name} x{item.quantity}</span>
                                        <span className="font-medium">{(item.price * item.quantity).toLocaleString()}₫</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex justify-between font-bold">
                                    <span>Tổng tiền:</span>
                                    <span className="text-pink-600">{order.total_price?.toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-500">Phương thức:</span>
                                    <span>{order.payment_method === 'COD' ? 'COD' : 'Chuyển khoản 50%'}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{statusIcons[order.status] || "📦"}</span>
                                    <span className="font-semibold text-gray-700">Trạng thái đơn hàng:</span>
                                </div>
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                                    {order.status}
                                </span>
                                {order.status === "Thành công" && (
                                    <p className="text-xs text-green-600 mt-2">✅ Đơn hàng đã được giao thành công. Cảm ơn bạn!</p>
                                )}
                                {order.status === "Đang vận chuyển" && (
                                    <p className="text-xs text-blue-600 mt-2">🚚 Đơn hàng đang trên đường giao đến bạn.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 border-t">
                        <p className="text-xs text-gray-400 text-center">
                            Mọi thắc mắc vui lòng liên hệ hotline: <span className="font-medium text-pink-600">0792131283</span>
                        </p>
                    </div>
                </div>
            )}

            {searched && !loading && !order && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy đơn hàng</h3>
                    <p className="text-gray-500">Vui lòng kiểm tra lại mã đơn hàng</p>
                </div>
            )}
        </div>
    );
}

export default OrderTracking;