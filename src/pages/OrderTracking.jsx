import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";

function OrderTracking() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation('order');

    const [orderCode, setOrderCode] = useState("");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Đọc mã đơn từ localStorage hoặc state khi vào trang
    useEffect(() => {
        if (state?.orderCode) {
            localStorage.setItem("lastOrderCode", state.orderCode);
            setOrderCode(state.orderCode);
        } else {
            const savedCode = localStorage.getItem("lastOrderCode");
            if (savedCode) {
                setOrderCode(savedCode);
            }
        }
    }, [state]);

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
                showToast(t('track.notFound'), "error");
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
        "Chờ xác nhận": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        "Xác nhận": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        "Đang vận chuyển": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
        "Thành công": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        "Hủy": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🔍 {t('track.title')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{t('track.desc')}</p>
            </div>

            <div className="max-w-md mx-auto mb-10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder={t('track.placeholder')}
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {loading ? "..." : t('track.search')}
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    Mã đơn hàng được gửi qua email khi đặt hàng thành công
                </p>
            </div>

            {searched && !loading && order && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
                        <h2 className="text-white font-bold text-lg">📦 Kết quả tra cứu</h2>
                        <p className="text-pink-100 text-sm">Mã đơn: {order.order_code}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 p-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 dark:border-gray-700">👤 {t('track.customerInfo')}</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t('track.orderDate')}:</span>
                                    <span className="font-medium dark:text-white">{formatDate(order.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t('track.name')}:</span>
                                    <span className="font-medium dark:text-white">{maskName(order.customer_info?.name)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t('track.phone')}:</span>
                                    <span className="font-medium dark:text-white">{maskPhone(order.customer_info?.phone)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Địa chỉ:</span>
                                    <span className="font-medium text-gray-400">{t('track.addressHidden')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 dark:border-gray-700">📋 {t('track.orderDetails')}</h3>

                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm py-1">
                                        <span className="text-gray-600 dark:text-gray-400">{item.name} x{item.quantity}</span>
                                        <span className="font-medium dark:text-white">{(item.price * item.quantity).toLocaleString()}₫</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t dark:border-gray-700 pt-3">
                                <div className="flex justify-between font-bold">
                                    <span className="dark:text-white">{t('track.total')}:</span>
                                    <span className="text-pink-600">{order.total_price?.toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-500 dark:text-gray-400">{t('track.paymentMethod')}:</span>
                                    <span className="dark:text-white">{order.payment_method === 'COD' ? 'COD' : 'Chuyển khoản 50%'}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{statusIcons[order.status] || "📦"}</span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{t('track.status')}:</span>
                                </div>
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                                    {order.status}
                                </span>
                                {order.status === "Thành công" && (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">{t('track.delivered')}</p>
                                )}
                                {order.status === "Đang vận chuyển" && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">{t('track.shipping')}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t dark:border-gray-700">
                        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                            {t('track.contactHotline')} <span className="font-medium text-pink-600">0792131283</span>
                        </p>
                    </div>
                </div>
            )}

            {searched && !loading && !order && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">{t('track.notFound')}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{t('track.checkCode')}</p>
                </div>
            )}
        </div>
    );
}

export default OrderTracking;