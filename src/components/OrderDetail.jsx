import { useState } from "react";
import axios from "axios";

function OrderDetail({ order, onClose, onUpdate }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (field, value) => {
        setIsUpdating(true);
        try {
            await axios.patch(`https://my-shop-api-p7kz.onrender.com/api/orders/${order.id}`, { [field]: value });
            onUpdate();
            alert("Đã cập nhật!");
        } catch (err) { alert("Lỗi cập nhật!"); }
        finally { setIsUpdating(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
                <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                    <h2 className="font-bold">CHI TIẾT: {order.order_code}</h2>
                    <button onClick={onClose} className="text-xl">&times;</button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-400 font-bold uppercase">Khách hàng</p>
                            <p className="font-bold">{order.customer_info?.name}</p>
                            <p className="text-pink-600">{order.customer_info?.phone}</p>
                        </div>
                        <div className="space-y-2">
                            <select disabled={isUpdating} onChange={(e) => handleUpdate('status', e.target.value)} className="w-full border p-2 rounded font-bold text-sm" defaultValue={order.status}>
                                <option value="Chờ xác nhận">Chờ xác nhận</option>
                                <option value="Xác nhận">Xác nhận đơn</option>
                                <option value="Đang vận chuyển">Đang vận chuyển</option>
                                <option value="Thành công">Thành công</option>
                                <option value="Hủy">Hủy đơn</option>
                            </select>
                        </div>
                    </div>
                    <div className="max-h-40 overflow-y-auto border-t pt-4">
                        {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">{item.name} x{item.quantity}</span>
                                <span className="font-bold">{(item.price * item.quantity).toLocaleString()}₫</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-right border-t pt-4">
                        <p className="text-2xl font-bold text-pink-600">{order.total_price?.toLocaleString()}₫</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OrderDetail;