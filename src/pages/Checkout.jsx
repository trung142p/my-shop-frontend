import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProvinces, getDistrictsByProvinceCode } from "sub-vn";

function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Lấy các sản phẩm đã được tích chọn từ giỏ hàng
    const selectedItems = cart.filter(item => item.checked);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // State quản lý danh sách hành chính
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);

    // State quản lý thông tin khách hàng
    const [info, setInfo] = useState({
        name: "",
        phone: "",
        email: "",
        province: "",
        district: "",
        addressDetail: "",
        paymentMethod: "COD"
    });

    // 1. Load 63 tỉnh thành khi component mount
    useEffect(() => {
        setProvinces(getProvinces());
    }, []);

    // 2. Xử lý khi thay đổi Tỉnh/Thành phố
    const handleProvinceChange = (e) => {
        const provinceName = e.target.value;
        const provinceObj = provinces.find(p => p.name === provinceName);

        // Reset huyện và cập nhật tỉnh mới
        setInfo({ ...info, province: provinceName, district: "" });

        if (provinceObj) {
            setDistricts(getDistrictsByProvinceCode(provinceObj.code));
        } else {
            setDistricts([]);
        }
    };

    // 3. Xử lý xác nhận đặt hàng
    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        // Kiểm tra xem đã chọn quận huyện chưa
        if (!info.district) {
            alert("Vui lòng chọn Quận/Huyện!");
            return;
        }

        const fullAddress = `${info.addressDetail}, ${info.district}, ${info.province}`;
        const finalPrice = info.paymentMethod === 'COD' ? totalPrice + 30000 : totalPrice;

        const orderData = {
            customer: { ...info, address: fullAddress },
            items: selectedItems,
            totalPrice: finalPrice,
            shippingFee: info.paymentMethod === 'COD' ? 30000 : 0
        };

        try {
            // Lưu ý: Đảm bảo server của bạn đã chạy ở port 7000
            await axios.post("https://my-shop-api-p7kz.onrender.com/api/orders", orderData);
            alert("🎉 Chúc mừng! Đơn hàng của bạn đã được gửi thành công.");
            clearCart();
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("❌ Có lỗi xảy ra. Vui lòng kiểm tra kết nối Server!");
        }
    };

    if (selectedItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-xl font-bold text-gray-500 mb-4">Giỏ hàng thanh toán trống!</p>
                <button onClick={() => navigate("/cart")} className="bg-pink-600 text-white px-6 py-2 rounded shadow">Quay lại giỏ hàng</button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-6xl mx-auto px-4">
                <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                                <span className="bg-pink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                Thông tin nhận hàng
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên *</label>
                                    <input type="text" required placeholder="Nguyễn Văn A" className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                        onChange={e => setInfo({ ...info, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                                    <input type="tel" required placeholder="090xxxxxxx" className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                        onChange={e => setInfo({ ...info, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email (không bắt buộc)</label>
                                    <input type="email" placeholder="khachhang@gmail.com" className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                        onChange={e => setInfo({ ...info, email: e.target.value })} />
                                </div>

                                {/* DROPBOX TỈNH THÀNH */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tỉnh / Thành phố *</label>
                                    <select
                                        required
                                        className="w-full border border-gray-300 p-3 rounded-md outline-none bg-white focus:ring-2 focus:ring-pink-500"
                                        value={info.province}
                                        onChange={handleProvinceChange}
                                    >
                                        <option value="">-- Chọn Tỉnh --</option>
                                        {provinces.map(p => (
                                            <option key={p.code} value={p.name}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* DROPBOX QUẬN HUYỆN */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quận / Huyện *</label>
                                    <select
                                        required
                                        disabled={!info.province}
                                        className={`w-full border border-gray-300 p-3 rounded-md outline-none bg-white transition-all ${!info.province ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-pink-500'}`}
                                        value={info.district}
                                        onChange={e => setInfo({ ...info, district: e.target.value })}
                                    >
                                        <option value="">-- Chọn Huyện --</option>
                                        {districts.map(d => (
                                            <option key={d.code} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ cụ thể (Số nhà, đường...) *</label>
                                    <input type="text" required placeholder="Ví dụ: 123 Lê Lợi..." className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                        onChange={e => setInfo({ ...info, addressDetail: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* PHƯƠNG THỨC THANH TOÁN */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                                <span className="bg-pink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                Phương thức thanh toán
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', sub: 'Phí ship 30.000₫' },
                                    { id: 'MOMO', label: 'Ví MoMo', sub: 'Miễn phí vận chuyển' },
                                    { id: 'BANK', label: 'Chuyển khoản ngân hàng', sub: 'Miễn phí vận chuyển' },
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${info.paymentMethod === method.id ? 'border-pink-500 bg-pink-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.id}
                                            checked={info.paymentMethod === method.id}
                                            onChange={() => setInfo({ ...info, paymentMethod: method.id })}
                                            className="mt-1 accent-pink-600 w-4 h-4"
                                        />
                                        <div>
                                            <span className="font-bold block text-gray-800">{method.label}</span>
                                            <span className={`text-xs ${method.id === 'COD' ? 'text-gray-500' : 'text-pink-600 font-medium'}`}>{method.sub}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                <p className="text-sm text-yellow-800">
                                    ✨ <strong>Ưu đãi:</strong> Quý khách nên chọn <strong>Chuyển khoản</strong> hoặc <strong>MoMo</strong> để được <strong>FREESHIP</strong> toàn quốc.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                    <div className="h-fit sticky top-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-pink-600">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Đơn hàng của bạn</h2>
                            <div className="max-h-80 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                                {selectedItems.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="relative flex-shrink-0">
                                            <img src={item.images?.[0] || item.image} className="w-16 h-16 object-cover rounded-md border border-gray-100" alt={item.name} />
                                            <span className="absolute -top-2 -right-2 bg-gray-800 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-700 line-clamp-2 uppercase">{item.name}</h4>
                                            <p className="text-sm text-pink-600 font-bold">{(item.price * item.quantity).toLocaleString()} ₫</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính:</span>
                                    <span className="font-medium text-gray-800">{totalPrice.toLocaleString()} ₫</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển:</span>
                                    <span className="font-medium text-gray-800">
                                        {info.paymentMethod === 'COD' ? '30,000 ₫' : <span className="text-pink-600">Miễn phí</span>}
                                    </span>
                                </div>
                                <div className="flex justify-between text-2xl font-black text-pink-600 pt-4 border-t mt-4 items-baseline">
                                    <span>TỔNG CỘNG:</span>
                                    <div className="text-right">
                                        <div>{(info.paymentMethod === 'COD' ? totalPrice + 30000 : totalPrice).toLocaleString()} ₫</div>
                                        <div className="text-xs font-normal text-gray-400 font-sans italic lowercase">(Đã bao gồm VAT)</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-pink-600 text-white py-4 rounded-md font-bold text-lg mt-8 hover:bg-pink-700 transition-all shadow-xl hover:shadow-pink-200 uppercase tracking-widest active:scale-95"
                            >
                                Đặt hàng ngay
                            </button>
                            <p className="text-center text-[10px] text-gray-400 mt-4 italic">
                                Thông tin của bạn được cam kết bảo mật tuyệt đối.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Checkout;