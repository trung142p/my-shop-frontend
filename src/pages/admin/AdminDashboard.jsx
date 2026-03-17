import ProductEditor from "../../components/ProductEditor";
import ProductList from "../../components/ProductList";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("products");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); // Để xem chi tiết đơn hàng
    const navigate = useNavigate();

    const reloadProducts = () => setRefresh(!refresh);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/orders");
                setOrders(res.data);
            } catch (err) { console.error("Lỗi lấy đơn hàng"); }
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
            <div className={`p-3 rounded-lg ${color} text-white text-xl`}>{icon}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* SIDEBAR */}
            <div className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold tracking-tighter flex items-center gap-2">🛒 MY SHOP CMS</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <button onClick={() => setActiveTab("products")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'products' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}>📦 Sản phẩm</button>
                    <button onClick={() => setActiveTab("orders")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'orders' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}>📑 Đơn hàng</button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full px-4 py-2 bg-slate-800 hover:bg-red-600 rounded-lg text-sm">Đăng xuất</button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="font-bold text-gray-800 uppercase">Hệ thống quản trị</h1>
                    <button onClick={() => navigate("/")} className="text-pink-600 border border-pink-100 px-4 py-1 rounded-full text-sm">👁️ Xem Web</button>
                </header>

                <main className="p-8">
                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Tổng sản phẩm" value="--" icon="📦" color="bg-blue-500" />
                        <StatCard title="Đơn hàng mới" value={orders.length} icon="🔥" color="bg-orange-500" />
                        <StatCard title="Doanh thu" value="--" icon="💰" color="bg-green-500" />
                    </div>

                    {activeTab === "products" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-4"><ProductEditor onCreated={reloadProducts} /></div>
                            <div className="lg:col-span-8"><ProductList key={refresh} admin={true} /></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4">STT</th>
                                        <th className="p-4">Mã đơn</th>
                                        <th className="p-4">Địa chỉ</th>
                                        <th className="p-4">Tổng tiền</th>
                                        <th className="p-4">Phương thức</th>
                                        <th className="p-4">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50 cursor-pointer">
                                            <td className="p-4">{index + 1}</td>
                                            <td className="p-4 font-bold">{order.order_code}</td>
                                            <td className="p-4">{order.customer_info.province}</td>
                                            <td className="p-4 font-bold text-pink-600">{order.total_price.toLocaleString()}₫</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.payment_method === 'COD' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {order.payment_method === 'COD' ? 'COD (Vàng)' : '50% (Xanh)'}
                                                </span>
                                            </td>
                                            <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-[10px]">{order.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;