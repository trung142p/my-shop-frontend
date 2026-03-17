import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProvinces, getDistrictsByProvinceCode } from "sub-vn";

function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const selectedItems = cart.filter(item => item.checked);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [orderCode] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);

    const [info, setInfo] = useState({
        name: "", phone: "", email: "", province: "", district: "", addressDetail: "", paymentMethod: "COD"
    });

    useEffect(() => { setProvinces(getProvinces()); }, []);

    const handleProvinceChange = (e) => {
        const pName = e.target.value;
        const pObj = provinces.find(p => p.name === pName);
        setInfo({ ...info, province: pName, district: "" });
        if (pObj) setDistricts(getDistrictsByProvinceCode(pObj.code));
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        const orderData = {
            order_code: orderCode,
            customer_info: info,
            items: selectedItems,
            total_price: info.paymentMethod === 'COD' ? totalPrice + 30000 : totalPrice,
            payment_method: info.paymentMethod
        };

        try {
            await axios.post("https://my-shop-api-p7kz.onrender.com/api/orders", orderData);
            clearCart();
            if (info.paymentMethod === "COD") {
                navigate("/complete", { state: { orderCode, items: selectedItems } });
            } else {
                navigate("/bank-transfer", { state: { orderData } });
            }
        } catch (err) { alert("Lỗi kết nối server!"); }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 py-10">
            <form onSubmit={handleConfirmOrder} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Thông tin nhận hàng</h2>
                    <input type="text" required placeholder="Họ và tên" className="w-full border p-3 mb-3 rounded" onChange={e => setInfo({ ...info, name: e.target.value })} />
                    <input type="tel" required placeholder="Số điện thoại" className="w-full border p-3 mb-3 rounded" onChange={e => setInfo({ ...info, phone: e.target.value })} />
                    <select required className="w-full border p-3 mb-3 rounded" value={info.province} onChange={handleProvinceChange}>
                        <option value="">Chọn Tỉnh/Thành</option>
                        {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                    </select>
                    <select required className="w-full border p-3 mb-3 rounded" disabled={!info.province} value={info.district} onChange={e => setInfo({ ...info, district: e.target.value })}>
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
                    </select>
                    <input type="text" required placeholder="Địa chỉ cụ thể" className="w-full border p-3 rounded" onChange={e => setInfo({ ...info, addressDetail: e.target.value })} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
                    <label className="flex items-center gap-3 p-3 border rounded mb-2 cursor-pointer">
                        <input type="radio" name="pay" checked={info.paymentMethod === 'COD'} onChange={() => setInfo({ ...info, paymentMethod: 'COD' })} />
                        <div><p className="font-bold">Thanh toán khi nhận hàng (COD)</p><p className="text-xs text-gray-500">Phí ship 30.000₫</p></div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded cursor-pointer border-pink-500 bg-pink-50">
                        <input type="radio" name="pay" checked={info.paymentMethod === 'PREPAY'} onChange={() => setInfo({ ...info, paymentMethod: 'PREPAY' })} />
                        <div><p className="font-bold text-pink-600">Thanh toán trước 50% (FREESHIP)</p><p className="text-xs text-pink-500">Tiết kiệm 30.000₫</p></div>
                    </label>
                </div>
                <button type="submit" className="w-full bg-pink-600 text-white py-4 rounded font-bold uppercase">Đặt hàng ngay</button>
            </form>

            <div className="bg-gray-100 p-6 rounded-lg h-fit sticky top-20">
                <h2 className="text-xl font-bold mb-4 italic text-gray-500">Mã đơn hàng: {orderCode}</h2>
                <div className="space-y-4">
                    {selectedItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{(item.price * item.quantity).toLocaleString()}₫</span>
                        </div>
                    ))}
                    <div className="border-t pt-4 font-bold text-xl text-pink-600 flex justify-between">
                        <span>TỔNG CỘNG:</span>
                        <span>{(info.paymentMethod === 'COD' ? totalPrice + 30000 : totalPrice).toLocaleString()}₫</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Checkout;