import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProvinces, getDistrictsByProvinceCode } from "sub-vn";

function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Lấy danh sách sản phẩm đã được tích chọn trong giỏ hàng
    const selectedItems = cart.filter(item => item.checked);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [info, setInfo] = useState({
        name: "",
        phone: "",
        email: "",
        province: "",
        district: "",
        addressDetail: "",
        paymentMethod: "COD"
    });

    useEffect(() => {
        setProvinces(getProvinces());
    }, []);

    const handleProvinceChange = (e) => {
        const pName = e.target.value;
        const pObj = provinces.find(p => p.name === pName);
        setInfo({ ...info, province: pName, district: "" });
        if (pObj) setDistricts(getDistrictsByProvinceCode(pObj.code));
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        // Chống spam
        if (isSubmitting) {
            return;
        }

        // Kiểm tra ràng buộc dữ liệu
        if (!info.name || !info.phone || !info.province || !info.district || !info.addressDetail) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }

        if (selectedItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            customer_info: {
                name: info.name.trim(),
                phone: info.phone.trim(),
                email: info.email.trim(),
                province: info.province,
                district: info.district,
                addressDetail: info.addressDetail.trim()
            },
            items: selectedItems,
            total_price: info.paymentMethod === 'COD' ? totalPrice + 30000 : totalPrice,
            payment_method: info.paymentMethod
        };

        try {
            const res = await axios.post("https://my-shop-api-p7kz.onrender.com/api/orders", orderData);

            if (res.data.success) {
                alert("🎉 Đặt hàng thành công!");
                clearCart();

                if (info.paymentMethod === 'PREPAY') {
                    // Lấy mã đơn từ response của server
                    navigate("/bank-transfer", {
                        state: {
                            orderData: {
                                ...orderData,
                                order_code: res.data.order_code
                            }
                        }
                    });
                } else {
                    navigate("/");
                }
            }
        } catch (err) {
            console.error("Lỗi đặt hàng:", err);
            const msg = err.response?.data?.message || "Kết nối server thất bại!";
            alert("Lỗi: " + msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 py-10">
            {/* CỘT TRÁI: FORM THÔNG TIN */}
            <form onSubmit={handleConfirmOrder} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-pink-600">Thông tin nhận hàng</h2>

                    <input
                        type="text"
                        required
                        value={info.name}
                        placeholder="Họ và tên"
                        className="w-full border p-3 mb-3 rounded shadow-sm focus:ring-2 focus:ring-pink-300 outline-none"
                        onChange={e => setInfo({ ...info, name: e.target.value })}
                        disabled={isSubmitting}
                    />

                    <input
                        type="tel"
                        required
                        value={info.phone}
                        placeholder="Số điện thoại"
                        className="w-full border p-3 mb-3 rounded shadow-sm focus:ring-2 focus:ring-pink-300 outline-none"
                        onChange={e => setInfo({ ...info, phone: e.target.value })}
                        disabled={isSubmitting}
                    />

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <select
                            required
                            className="border p-3 rounded shadow-sm"
                            value={info.province}
                            onChange={handleProvinceChange}
                            disabled={isSubmitting}
                        >
                            <option value="">Chọn Tỉnh/Thành</option>
                            {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                        </select>

                        <select
                            required
                            className="border p-3 rounded shadow-sm"
                            disabled={!info.province || isSubmitting}
                            value={info.district}
                            onChange={e => setInfo({ ...info, district: e.target.value })}
                        >
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>

                    <input
                        type="text"
                        required
                        value={info.addressDetail}
                        placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)"
                        className="w-full border p-3 rounded shadow-sm"
                        onChange={e => setInfo({ ...info, addressDetail: e.target.value })}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-pink-600">Phương thức thanh toán</h2>

                    <label className={`flex items-center gap-3 p-4 border rounded mb-3 cursor-pointer transition-all ${info.paymentMethod === 'COD' ? 'border-pink-500 bg-pink-50 shadow-md' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="radio"
                            name="pay"
                            checked={info.paymentMethod === 'COD'}
                            onChange={() => setInfo({ ...info, paymentMethod: 'COD' })}
                            disabled={isSubmitting}
                        />
                        <div>
                            <p className="font-bold">Thanh toán khi nhận hàng (COD)</p>
                            <p className="text-xs text-gray-500 italic">Phí vận chuyển: +30.000₫</p>
                        </div>
                    </label>

                    <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-all ${info.paymentMethod === 'PREPAY' ? 'border-pink-500 bg-pink-50 shadow-md' : 'border-blue-200 bg-blue-50/30'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="radio"
                            name="pay"
                            checked={info.paymentMethod === 'PREPAY'}
                            onChange={() => setInfo({ ...info, paymentMethod: 'PREPAY' })}
                            disabled={isSubmitting}
                        />
                        <div>
                            <p className="font-bold text-blue-700">Chuyển khoản trước 50%</p>
                            <p className="text-xs text-green-600 font-medium">✨ MIỄN PHÍ GIAO HÀNG (Tiết kiệm 30k)</p>
                        </div>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold uppercase text-lg shadow-lg transform transition active:scale-95 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
                >
                    {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
                </button>
            </form>

            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
            <div className="bg-white p-6 rounded-2xl shadow-xl h-fit sticky top-24 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Đơn hàng của bạn</h2>
                    {/* Mã đơn hàng sẽ được hệ thống tạo tự động */}
                </div>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                    {selectedItems.map(item => (
                        <div key={item.id} className="flex gap-4 items-center border-b pb-3">
                            <img
                                src={item.coverImage || item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border bg-gray-50"
                                onError={(e) => { e.target.src = "https://placehold.co/150"; }}
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-400">Số lượng: {item.quantity}</p>
                            </div>
                            <span className="font-bold text-sm">{(item.price * item.quantity).toLocaleString()}₫</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-gray-500">
                        <span>Tạm tính:</span>
                        <span>{totalPrice.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Phí ship:</span>
                        <span>{info.paymentMethod === 'COD' ? "30.000₫" : "0₫ (Freeship)"}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-3">
                        <span className="text-lg font-bold">TỔNG CỘNG:</span>
                        <span className="text-2xl font-black text-pink-600">
                            {(info.paymentMethod === 'COD' ? totalPrice + 30000 : totalPrice).toLocaleString()}₫
                        </span>
                    </div>

                    {info.paymentMethod === 'PREPAY' && (
                        <div className="bg-blue-50 p-3 rounded-lg mt-4 border border-blue-100">
                            <p className="text-xs text-blue-800 font-medium">Cần thanh toán trước 50%:</p>
                            <p className="text-lg font-bold text-blue-600">{(totalPrice / 2).toLocaleString()}₫</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Checkout;