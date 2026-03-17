import ProductEditor from "../../components/ProductEditor";
import ProductList from "../../components/ProductList";
import OrderDetail from "../../components/OrderDetail"; // Đảm bảo bạn đã tạo file này
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("products");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    const reloadData = () => setRefresh(!refresh);

    // Lấy danh sách đơn hàng từ Server
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/orders");
                // Sắp xếp mới nhất lên đầu
                const sortedOrders = res.data.sort((a, b) => b.id - a.id);
                setOrders(sortedOrders);
            } catch (err) {
                console.error("Lỗi lấy đơn hàng:", err);
            }
        };
        if (activeTab === "orders") fetchOrders();
    }, [activeTab, refresh]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold mt-1">{value || "0"}</p>
            </div>
            <div className={`p-3 rounded-lg ${color} text-white text-xl shadow-lg`}>{icon}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 min-h-screen flex flex-col shadow-xl fixed lg:relative z-20">
                <div className="p-6 text-white text-2xl font-black italic tracking-widest border-b border-slate-800">
                    ADMIN<span className="text-pink-500">CP</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'products' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-slate-800'}`}
                    >
                        📦 Sản phẩm
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'orders' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-slate-800'}`}
                    >
                        📑 Đơn hàng
                    </button>
                    <div className="pt-10">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition">
                            🚪 Đăng xuất
                        </button>
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="font-bold text-gray-800 uppercase tracking-tight">Hệ thống quản trị nội bộ</h1>
                    <button onClick={() => navigate("/")} className="text-pink-600 border border-pink-200 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-pink-50 transition">👁️ Xem Web</button>
                </header>

                <main className="p-8">
                    {/* STATS AREA */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Tổng sản phẩm" value="--" icon="📦" color="bg-blue-500" />
                        <StatCard title="Đơn hàng mới" value={orders.length} icon="🔥" color="bg-orange-500" />
                        <StatCard title="Doanh thu" value="--" icon="💰" color="bg-green-500" />
                    </div>

                    {activeTab === "products" ? (
                        /* GIAO DIỆN SẢN PHẨM */
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-4">
                                <ProductEditor onCreated={reloadData} />
                            </div>
                            <div className="lg:col-span-8">
                                <ProductList key={refresh} admin={true} />
                            </div>
                        </div>
                    ) : (
                        /* GIAO DIỆN ĐƠN HÀNG */
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b">
                                <h3 className="font-bold text-lg text-slate-800">Danh sách đơn hàng mới nhất</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
                                        <tr>
                                            <th className="p-4">STT</th>
                                            <th className="p-4">Mã đơn</th>
                                            <th className="p-4">Khu vực</th>
                                            <th className="p-4">Tổng tiền</th>
                                            <th className="p-4">Thanh toán</th>
                                            <th className="p-4 text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.length > 0 ? (
                                            orders.map((order, index) => (
                                                <tr
                                                    key={order.id}
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="hover:bg-pink-50/50 cursor-pointer transition-colors group"
                                                >
                                                    <td className="p-4 text-gray-400">{index + 1}</td>
                                                    <td className="p-4 font-black text-slate-700 group-hover:text-pink-600 transition-colors">
                                                        {order.order_code}
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="font-medium">{order.customer_info.district}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase">{order.customer_info.province}</p>
                                                    </td>
                                                    <td className="p-4 font-bold text-slate-900">
                                                        {order.total_price?.toLocaleString()}₫
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter border ${order.payment_method === 'COD'
                                                                ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                                                                : 'bg-blue-50 text-blue-600 border-blue-200'
                                                            }`}>
                                                            {order.payment_method === 'COD' ? 'THANH TOÁN COD' : 'CHUYỂN KHOẢN 50%'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.status === 'Hủy' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {order.status || "Chờ xác nhận"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="p-10 text-center text-gray-400 italic">Chưa có đơn hàng nào được ghi nhận.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MODAL CHI TIẾT ĐƠN HÀNG */}
            {selectedOrder && (
                <OrderDetail
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={() => {
                        reloadData();
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
}

export default AdminDashboard;