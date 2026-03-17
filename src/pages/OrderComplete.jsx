import { useLocation, useNavigate } from "react-router-dom";

function OrderComplete() {
    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">
                ✓
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">CHÚC MỪNG, ĐƠN HÀNG CỦA BẠN ĐÃ ĐƯỢC ĐẶT!</h1>
            <p className="text-gray-600 mb-8">XIN VUI LÒNG CHỜ CHÚNG TÔI LIÊN HỆ ĐỂ XÁC NHẬN ĐƠN HÀNG.</p>

            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md border border-gray-100">
                <h3 className="font-bold border-b pb-2 mb-4">Thông tin đơn hàng: {state?.orderCode}</h3>
                {state?.items?.map(item => (
                    <div key={item.id} className="flex justify-between py-1 text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-medium">{(item.price * item.quantity).toLocaleString()}₫</span>
                    </div>
                ))}
            </div>
            <button onClick={() => navigate("/")} className="mt-8 text-pink-600 font-medium">Quay lại trang chủ</button>
        </div>
    );
}
export default OrderComplete;