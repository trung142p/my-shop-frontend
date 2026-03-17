import React from "react";
import axios from "axios";

function OrderDetail({ order, onClose, onUpdate }) {
    if (!order) return null;

    const handleUpdateStatus = async (field, value) => {
        try {
            await axios.patch(`https://my-shop-api-p7kz.onrender.com/api/orders/${order.id}`, { [field]: value });
            onUpdate(); // Reload lại danh sách sau khi sửa
            alert("Cập nhật trạng thái thành công!");
        } catch (err) {
            alert("Lỗi khi cập nhật trạng thái");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Chi tiết đơn hàng</h2>
                        <p className="text-slate-400 text-xs mt-1 font-mono">ID: {order.order_code}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-2xl">&times;</button>
                </div>

                <div className="p-8 max-h-[75vh] overflow-y-auto">
                    {/* Thông tin khách hàng */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b pb-8">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Người nhận</h3>
                            <p className="font-bold text-lg text-slate-800">{order.customer_info.name}</p>
                            <p className="text-pink-600 font-bold">{order.customer_info.phone}</p>
                            <p className="text-gray-600 text-sm mt-2">
                                {order.customer_info.addressDetail}, {order.customer_info.district}, {order.customer_info.province}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Thanh toán & Trạng thái</h3>
                            <div className="space-y-3">
                                <p className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${order.payment_method === 'COD' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {order.payment_method === 'COD' ? '💰 THANH TOÁN COD' : '💳 CHUYỂN KHOẢN 50%'}
                                </p>

                                {order.payment_method === 'PREPAY' && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-blue-800 font-bold">Thanh toán:</span>
                                        <select
                                            onChange={(e) => handleUpdateStatus('paymentStatus', e.target.value)}
                                            className="text-xs border rounded p-1 font-medium bg-blue-50"
                                            defaultValue={order.paymentStatus || "Chưa thanh toán"}
                                        >
                                            <option value="Chưa thanh toán">Chưa thanh toán</option>
                                            <option value="Đã thanh toán">Đã thanh toán</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Vận chuyển:</span>
                                    <select
                                        onChange={(e) => handleUpdateStatus('status', e.target.value)}
                                        className="text-xs border rounded p-1 font-bold bg-gray-50"
                                        defaultValue={order.status}
                                    >
                                        <option value="Xác nhận">Xác nhận</option>
                                        <option value="Đang vận chuyển">Đang vận chuyển</option>
                                        <option value="Thành công">Thành công</option>
                                        <option value="Hủy">Hủy</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm trong đơn</h3>
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <img src={item.coverImage || item.image} alt="" className="w-16 h-16 object-cover rounded-xl shadow-sm bg-white" />
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800 leading-tight">{item.name}</p>
                                    <p className="text-xs text-gray-400">Số lượng: <span className="text-slate-700 font-bold">{item.quantity}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString()}₫</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tổng tiền */}
                    <div className="mt-8 pt-6 border-t flex justify-between items-end">
                        <div className="text-gray-400 text-xs italic">
                            * Vui lòng kiểm tra kỹ trạng thái trước khi lưu.
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">TỔNG CỘNG THANH TOÁN:</p>
                            <p className="text-3xl font-black text-pink-600">{order.total_price.toLocaleString()}₫</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;