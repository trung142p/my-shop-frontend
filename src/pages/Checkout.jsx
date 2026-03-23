import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProvinces, getDistrictsByProvinceCode } from "sub-vn";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";

function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const { t } = useTranslation('checkout');

    const selectedItems = cart.filter(item => item.checked);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const { showToast } = useToast();

    const [info, setInfo] = useState({
        name: "",
        phone: "",
        email: "",
        receiveUpdates: false,
        province: "",
        district: "",
        addressDetail: "",
        paymentMethod: "COD"
    });

    useEffect(() => {
        setProvinces(getProvinces());
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        const isValid = validateEmail(email);
        setEmailValid(isValid);
        setInfo({ ...info, email, receiveUpdates: isValid ? info.receiveUpdates : false });
    };

    const handleProvinceChange = (e) => {
        const pName = e.target.value;
        const pObj = provinces.find(p => p.name === pName);
        setInfo({ ...info, province: pName, district: "" });
        if (pObj) setDistricts(getDistrictsByProvinceCode(pObj.code));
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!info.name || !info.phone || !info.province || !info.district || !info.addressDetail) {
            showToast("Vui lòng điền đầy đủ thông tin giao hàng!", "warning");
            return;
        }

        if (info.email && !emailValid) {
            showToast("Email không hợp lệ! Vui lòng nhập đúng định dạng.", "warning");
            return;
        }

        if (selectedItems.length === 0) {
            showToast("Giỏ hàng của bạn đang trống!", "warning");
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            customer_info: {
                name: info.name.trim(),
                phone: info.phone.trim(),
                email: info.email.trim(),
                receiveUpdates: info.receiveUpdates,
                province: info.province,
                district: info.district,
                addressDetail: info.addressDetail.trim()
            },
            items: selectedItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                coverImage: item.coverImage,
                variant_id: item.variant_id,
                variant_name: item.variant_name
            })),
            total_price: info.paymentMethod === 'COD' ? totalPrice + 30000 : totalPrice,
            payment_method: info.paymentMethod
        };

        try {
            const res = await axios.post("https://my-shop-api-p7kz.onrender.com/api/orders", orderData);

            if (res.data.success) {
                // Cập nhật stock và sold cho từng sản phẩm
                for (const item of selectedItems) {
                    try {
                        if (item.variant_id) {
                            // Cập nhật stock của variant
                            await axios.patch(`https://my-shop-api-p7kz.onrender.com/api/products/variants/${item.variant_id}/stock`, {
                                stock: (item.stock || 0) - item.quantity
                            });
                        } else {
                            // Cập nhật stock và sold của sản phẩm chính
                            await axios.patch(`https://my-shop-api-p7kz.onrender.com/api/products/${item.id}`, {
                                stock: (item.stock || 0) - item.quantity,
                                sold: (item.sold || 0) + item.quantity
                            });
                        }
                    } catch (err) {
                        console.error("Lỗi cập nhật sản phẩm:", err);
                    }
                }

                showToast("🎉 Đặt hàng thành công!", "success");
                clearCart();

                // Phân biệt phương thức thanh toán
                if (info.paymentMethod === 'PREPAY') {
                    // Chuyển sang trang chuyển khoản
                    navigate("/bank-transfer", {
                        state: {
                            orderData: {
                                ...orderData,
                                order_code: res.data.order_code
                            }
                        }
                    });
                } else {
                    // COD: chuyển sang trang hoàn tất
                    navigate("/complete", {
                        state: {
                            orderData: {
                                ...orderData,
                                order_code: res.data.order_code
                            }
                        }
                    });
                }
            }
        } catch (err) {
            console.error("Lỗi đặt hàng:", err);
            const msg = err.response?.data?.message || "Kết nối server thất bại!";
            showToast("Lỗi: " + msg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 py-10">
            <form onSubmit={handleConfirmOrder} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-pink-600">{t('shippingInfo')}</h2>

                    <input
                        type="text"
                        required
                        value={info.name}
                        placeholder={t('fullName')}
                        className="w-full border p-3 mb-3 rounded shadow-sm focus:ring-2 focus:ring-pink-300 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        onChange={e => setInfo({ ...info, name: e.target.value })}
                        disabled={isSubmitting}
                    />

                    <input
                        type="tel"
                        required
                        value={info.phone}
                        placeholder={t('phone')}
                        className="w-full border p-3 mb-3 rounded shadow-sm focus:ring-2 focus:ring-pink-300 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        onChange={e => setInfo({ ...info, phone: e.target.value })}
                        disabled={isSubmitting}
                    />

                    <input
                        type="email"
                        value={info.email}
                        placeholder={t('email')}
                        className={`w-full border p-3 mb-2 rounded shadow-sm focus:ring-2 focus:ring-pink-300 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${info.email && !emailValid ? 'border-red-500' : ''
                            }`}
                        onChange={handleEmailChange}
                        disabled={isSubmitting}
                    />
                    {info.email && !emailValid && (
                        <p className="text-xs text-red-500 mb-2">Email không hợp lệ! Vui lòng nhập đúng định dạng (ví dụ: ten@gmail.com)</p>
                    )}

                    {info.email && emailValid && (
                        <label className="flex items-center gap-2 mb-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={info.receiveUpdates}
                                onChange={(e) => setInfo({ ...info, receiveUpdates: e.target.checked })}
                                disabled={isSubmitting}
                                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{t('receiveUpdates')}</span>
                        </label>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <select
                            required
                            className="border p-3 rounded shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={info.province}
                            onChange={handleProvinceChange}
                            disabled={isSubmitting}
                        >
                            <option value="">{t('province')}</option>
                            {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                        </select>

                        <select
                            required
                            className="border p-3 rounded shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={!info.province || isSubmitting}
                            value={info.district}
                            onChange={e => setInfo({ ...info, district: e.target.value })}
                        >
                            <option value="">{t('district')}</option>
                            {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>

                    <input
                        type="text"
                        required
                        value={info.addressDetail}
                        placeholder={t('address')}
                        className="w-full border p-3 rounded shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        onChange={e => setInfo({ ...info, addressDetail: e.target.value })}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-pink-600">{t('paymentMethod')}</h2>

                    <label className={`flex items-center gap-3 p-4 border rounded mb-3 cursor-pointer transition-all ${info.paymentMethod === 'COD' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md' : 'dark:border-gray-600'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="radio"
                            name="pay"
                            checked={info.paymentMethod === 'COD'}
                            onChange={() => setInfo({ ...info, paymentMethod: 'COD' })}
                            disabled={isSubmitting}
                        />
                        <div>
                            <p className="font-bold dark:text-white">{t('cod')}</p>
                            <p className="text-xs text-gray-500 italic">{t('codFee')}</p>
                        </div>
                    </label>

                    <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-all ${info.paymentMethod === 'PREPAY' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md' : 'border-blue-200 dark:border-gray-600 bg-blue-50/30 dark:bg-blue-900/20'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="radio"
                            name="pay"
                            checked={info.paymentMethod === 'PREPAY'}
                            onChange={() => setInfo({ ...info, paymentMethod: 'PREPAY' })}
                            disabled={isSubmitting}
                        />
                        <div>
                            <p className="font-bold text-blue-700 dark:text-blue-400">{t('prepay')}</p>
                            <p className="text-xs text-green-600 font-medium">✨ {t('prepayDesc')}</p>
                        </div>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold uppercase text-lg shadow-lg transform transition active:scale-95 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
                >
                    {isSubmitting ? t('processing') : t('submitOrder')}
                </button>
            </form>

            {/* Cột phải: Tóm tắt đơn hàng */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl h-fit sticky top-24 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white">{t('orderSummary') || "Đơn hàng của bạn"}</h2>
                </div>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                    {selectedItems.map((item, index) => (
                        <div key={`${item.id}-${item.variant_id || 'default'}-${index}`} className="flex gap-4 items-center border-b pb-3 dark:border-gray-700">
                            <img
                                src={item.coverImage || item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border bg-gray-50 dark:bg-gray-700"
                                onError={(e) => { e.target.src = "https://placehold.co/150"; }}
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium line-clamp-1 dark:text-white">{item.name}</p>
                                {item.variant_name && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        🎨 {item.variant_name}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400">{t('quantity') || "Số lượng"}: {item.quantity}</p>
                            </div>
                            <span className="font-bold text-sm dark:text-white">{(item.price * item.quantity).toLocaleString()}₫</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 pt-4 border-t dark:border-gray-700">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>{t('subtotal') || "Tạm tính"}:</span>
                        <span>{totalPrice.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>{t('shipping') || "Phí ship"}:</span>
                        <span>{info.paymentMethod === 'COD' ? "30.000₫" : "0₫ (Freeship)"}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-3 dark:border-gray-700">
                        <span className="text-lg font-bold dark:text-white">{t('total') || "TỔNG CỘNG"}:</span>
                        <span className="text-2xl font-black text-pink-600">
                            {(info.paymentMethod === 'COD' ? totalPrice + 30000 : totalPrice).toLocaleString()}₫
                        </span>
                    </div>

                    {info.paymentMethod === 'PREPAY' && (
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mt-4 border border-blue-100 dark:border-blue-800">
                            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">{t('needPay') || "Cần thanh toán trước 50%:"}</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(totalPrice / 2).toLocaleString()}₫</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Checkout;