import { useLocation } from "react-router-dom";

function BankTransfer() {
    const { state } = useLocation();
    const orderData = state?.orderData;
    const halfPrice = orderData ? orderData.total_price / 2 : 0;

    return (
        <div className="max-w-4xl mx-auto p-6 py-12">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
                <p className="text-blue-700 font-medium">
                    Đơn hàng của bạn đã được đặt thành công, vui lòng chuyển khoản trong thời gian sớm nhất để được chúng tôi nhanh chóng giao sản phẩm đến cho bạn.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Bên trái: Thông tin */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Thông tin chuyển khoản</h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <p className="text-gray-600">Ngân hàng: <span className="font-bold text-black">VietinBank</span></p>
                        <p className="text-gray-600">Số tài khoản: <span className="font-bold text-black text-lg">0792131283</span></p>
                        <p className="text-gray-600">Chủ tài khoản: <span className="font-bold text-black uppercase">Châu Ngọc Trung</span></p>
                        <p className="text-gray-600">Số tiền (50%): <span className="font-bold text-pink-600 text-2xl">{halfPrice.toLocaleString()}₫</span></p>
                        <p className="text-gray-600 mt-4">Nội dung chuyển khoản:</p>
                        <p className="bg-gray-100 p-2 font-mono font-bold text-center border-dashed border-2 border-gray-300">
                            {orderData?.order_code}
                        </p>
                    </div>
                </div>

                {/* Bên phải: QR Code */}
                <div className="flex flex-col items-center">
                    <p className="mb-4 font-medium text-gray-500 text-sm">Quét mã bằng ứng dụng Ngân hàng/MoMo</p>
                    <img
                        src="https://res.cloudinary.com/ddivnd5nh/image/upload/v1773758124/e841a9ff-d072-4016-8f45-8546a203d1d9_llzhev.jpg"
                        alt="QR Code"
                        className="w-full max-w-[300px] border-8 border-white shadow-2xl rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}

export default BankTransfer;