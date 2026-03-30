import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function OrderComplete() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation('order');

    const orderData = state?.orderData;
    const orderCode = orderData?.order_code || state?.orderCode;

    // Lưu mã đơn hàng vào localStorage khi có orderCode
    useEffect(() => {
        if (orderCode) {
            localStorage.setItem("lastOrderCode", orderCode);
        }
    }, [orderCode]);

    if (!orderData) {
        return (
            <div className="max-w-4xl mx-auto p-6 py-20 text-center">
                <p className="text-gray-500 mb-4">Không tìm thấy thông tin đơn hàng.</p>
                <button onClick={() => navigate("/")} className="text-pink-600 font-bold underline">Về trang chủ</button>
            </div>
        );
    }

    const handleTrackOrder = () => {
        navigate("/track-order", { state: { orderCode } });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                🎉 {t('complete.success')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">
                {t('complete.wait')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
                Thời gian xác nhận: 15-30 phút (giờ hành chính)
            </p>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-4">
                    <div className="bg-pink-50 dark:bg-pink-900/30 inline-block px-4 py-2 rounded-full">
                        <span className="text-sm font-medium text-pink-600">MÃ ĐƠN HÀNG</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-pink-600 mt-2">{orderCode}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('complete.saveCode')}</p>
                </div>

                <div className="border-t dark:border-gray-700 pt-4 mt-2">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">📋 Thông tin đơn hàng</h3>
                    {orderData.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-2 text-sm border-b border-gray-100 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">{item.name} x{item.quantity}</span>
                            <span className="font-medium text-gray-800 dark:text-white">{(item.price * item.quantity).toLocaleString()}₫</span>
                        </div>
                    ))}
                    <div className="flex justify-between pt-3 mt-2 font-bold">
                        <span className="dark:text-white">Tổng cộng:</span>
                        <span className="text-pink-600 text-lg">{orderData.total_price?.toLocaleString()}₫</span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <p>📦 Phương thức: {orderData.payment_method === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản trước 50%'}</p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleTrackOrder}
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        🔍 {t('complete.trackNow')}
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium transition-all"
                    >
                        🏠 {t('complete.backHome')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderComplete;