import React, { useState } from "react"; // Thêm useState vào đây
import axios from "axios";

function OrderDetail({ order, onClose, onUpdate }) {
    // 1. Tạo state quản lý loading
    const [isUpdating, setIsUpdating] = useState(false);

    if (!order) return null;

    const handleUpdateStatus = async (field, value) => {
        if (isUpdating) return; // Nếu đang chạy thì không cho bấm tiếp

        setIsUpdating(true); // Bắt đầu loading
        try {
            await axios.patch(`https://my-shop-api-p7kz.onrender.com/api/orders/${order.id}`, {
                [field]: value
            });

            onUpdate();
            alert("Cập nhật thành công!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdating(false); // Kết thúc loading dù thành công hay thất bại
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Chi tiết đơn hàng</h2>
                        <p className="text-slate-400 text-xs mt-1 font-mono">Mã: {order.order_code}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-2xl">&times;</button>
                </div>

                <div className="p-8 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b pb-8">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Người nhận</h3>
                            <p className="font-bold text-lg text-slate-800">{order.customer_info?.name}</p>
                            <p className="text-pink-600 font-bold">{order.customer_info?.phone}</p>
                            <p className="text-gray-600 text-sm mt-2">
                                {order.customer_info?.addressDetail}, {order.customer_info?.district}, {order.customer_info?.province}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Quản lý trạng thái</h3>
                            <div className="space-y-4">

                                {/* Cập nhật Thanh toán */}
                                <div className={`flex items-center justify-between p-3 rounded-xl border border-dashed transition ${isUpdating ? 'opacity-50 bg-gray-100' : 'bg-slate-50 border-slate-200'}`}>
                                    <span className="text-xs font-bold text-slate-500 uppercase">Thanh toán:</span>
                                    <select
                                        disabled={isUpdating} // Khóa select khi đang update
                                        onChange={(e) => handleUpdateStatus('payment_status', e.target.value)}
                                        className="text-xs border-none rounded bg-transparent font-bold text-blue-600 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                                        defaultValue={order.payment_status}
                                    >
                                        <option value="Chưa thanh toán">Chưa thanh toán</option>
                                        <option value="Đã thanh toán">Đã thanh toán</option>
                                    </select>
                                </div>

                                {/* Cập nhật Vận chuyển */}
                                <div className={`flex items-center justify-between p-3 rounded-xl border border-dashed transition ${isUpdating ? 'opacity-50 bg-gray-100' : 'bg-slate-50 border-slate-200'}`}>
                                    <span className="text-xs font-bold text-slate-500 uppercase">Vận chuyển:</span>
                                    <select
                                        disabled={isUpdating} // Khóa select khi đang update
                                        onChange={(e) => handleUpdateStatus('status', e.target.value)}
                                        className="text-xs border-none rounded bg-transparent font-bold text-pink-600 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                                        defaultValue={order.status}
                                    >
                                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                                        <option value="Xác nhận">Xác nhận đơn</option>
                                        <option value="Đang vận chuyển">Đang vận chuyển</option>
                                        <option value="Thành công">Thành công</option>
                                        <option value="Hủy">Hủy đơn</option>
                                    </select>
                                </div>
                                {isUpdating && <p className="text-[10px] text-center text-blue-500 font-bold animate-pulse italic">Đang đồng bộ dữ liệu...</p>}
                            </div>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm giữ nguyên như cũ... */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sản phẩm đơn hàng</h3>
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                <img src={item.coverImage || item.image} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm bg-white" />
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">SL: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-slate-900 text-sm">{(item.price * item.quantity).toLocaleString()}₫</p>
                            </div>
                        ))}
                    </div>

                    {/* Tổng tiền giữ nguyên như cũ... */}
                    <div className="mt-8 pt-6 border-t flex justify-between items-center">
                        <div className="px-4 py-2 bg-pink-50 rounded-lg">
                            <p className="text-[10px] text-pink-400 font-bold uppercase">Phương thức</p>
                            <p className="text-xs font-bold text-pink-700">{order.payment_method === 'COD' ? '💰 THANH TOÁN COD' : '💳 CHUYỂN KHOẢN'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Tổng tiền</p>
                            <p className="text-2xl font-black text-pink-600">{order.total_price?.toLocaleString()}₫</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;