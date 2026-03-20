import { useLocation, useNavigate } from "react-router-dom";

function BankTransfer() {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Lấy orderData từ state được gửi sang từ Checkout
    const orderData = state?.orderData;

    // Nếu không có dữ liệu (truy cập trực tiếp link), đưa về trang chủ
    if (!orderData) {
        return (
            <div className="max-w-4xl mx-auto p-6 py-20 text-center">
                <p className="text-gray-500 mb-4">Không tìm thấy thông tin đơn hàng.</p>
                <button onClick={() => navigate("/")} className="text-pink-600 font-bold underline">Về trang chủ</button>
            </div>
        );
    }

    const halfPrice = orderData.total_price / 2;

    return (
        <div className="max-w-4xl mx-auto p-6 py-12">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
                <p className="text-blue-700 font-medium">
                    🎉 Đơn hàng <strong>{orderData.order_code}</strong> đã được hệ thống ghi nhận thành công!
                    Vui lòng chuyển khoản 50% giá trị để chúng tôi tiến hành chuẩn bị hàng.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Bên trái: Thông tin */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">Thông tin chuyển khoản</h2>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="space-y-3">
                            <p className="text-gray-600 flex justify-between">Ngân hàng: <span className="font-bold text-black">VietinBank</span></p>
                            <p className="text-gray-600 flex justify-between">Số tài khoản: <span className="font-bold text-black text-lg">0792131283</span></p>
                            <p className="text-gray-600 flex justify-between">Chủ tài khoản: <span className="font-bold text-black uppercase">VO HOANG PHUC</span></p>
                            <div className="pt-3 border-t">
                                <p className="text-gray-600">Số tiền cần thanh toán (50%):</p>
                                <p className="font-black text-pink-600 text-3xl">{halfPrice.toLocaleString()}₫</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm text-gray-500 mb-2 font-medium">Nội dung chuyển khoản (Bắt buộc):</p>
                            <p className="bg-gray-100 p-3 font-mono font-bold text-center border-dashed border-2 border-pink-300 text-pink-700 text-lg rounded-lg">
                                {orderData.order_code}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-3 text-gray-500 hover:text-pink-600 font-medium transition-colors"
                    >
                        Quay lại trang chủ sau khi chuyển khoản
                    </button>
                </div>

                {/* Bên phải: QR Code */}
                <div className="flex flex-col items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="mb-4 font-bold text-gray-700">Quét mã nhanh qua ứng dụng</p>
                    <div className="relative group">
                        <img
                            src="https://res.cloudinary.com/ddivnd5nh/image/upload/v1773758124/e841a9ff-d072-4016-8f45-8546a203d1d9_llzhev.jpg"
                            alt="QR Code"
                            className="w-full max-w-[280px] border-4 border-white shadow-xl rounded-xl transition-transform group-hover:scale-105"
                        />
                    </div>
                    <p className="mt-4 text-xs text-center text-gray-400 italic">
                        * Sau khi chuyển khoản, bộ phận CSKH sẽ xác nhận <br /> và cập nhật trạng thái đơn hàng trong 15-30 phút.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BankTransfer;