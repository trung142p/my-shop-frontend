import ProductEditor from "../../components/ProductEditor";
import ProductList from "../../components/ProductList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const [orders, setOrders] = useState([]);

useEffect(() => {
    const fetchOrders = async () => {
        const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/orders");
        setOrders(res.data);
    };
    if (activeTab === "orders") fetchOrders();
}, [activeTab]);

function AdminDashboard() {
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("products"); // Điều hướng nội bộ
    const navigate = useNavigate();

    const reloadProducts = () => {
        setRefresh(!refresh);
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    // Thẻ thống kê nhanh (Stats)
    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color} text-white text-xl`}>
                {icon}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">

            {/* --- SIDEBAR TRÁI --- */}
            <div className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold tracking-tighter flex items-center gap-2">
                        <span className="bg-pink-600 p-1 rounded">🛒</span> MY SHOP CMS
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeTab === 'products' ? 'bg-pink-600 text-white' : 'hover:bg-slate-800 text-gray-400'}`}
                    >
                        📦 Sản phẩm
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 text-gray-400 flex items-center gap-3">
                        📑 Đơn hàng (Soon)
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 text-gray-400 flex items-center gap-3">
                        👥 Khách hàng
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-slate-800 hover:bg-red-600 transition-colors rounded-lg text-sm font-medium"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* --- NỘI DUNG CHÍNH --- */}
            <div className="flex-1 flex flex-col">
                {activeTab === "orders" && (
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4">STT</th>
                                    <th className="p-4">Mã đơn</th>
                                    <th className="p-4">Địa chỉ</th>
                                    <th className="p-4">Tổng giá</th>
                                    <th className="p-4">Phương thức</th>
                                    <th className="p-4">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4 font-bold">{order.order_code}</td>
                                        <td className="p-4 text-sm">{order.customer_info.province}</td>
                                        <td className="p-4 font-bold text-pink-600">{order.total_price.toLocaleString()}₫</td>
                                        <td className="p-4">
                                            <span className={`font-bold ${order.payment_method === 'COD' ? 'text-yellow-600' : 'text-blue-600'}`}>
                                                {order.payment_method}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{order.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400">Trang quản trị</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-gray-800">Quản lý sản phẩm</span>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm font-medium text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-full transition-all border border-pink-100"
                    >
                        👁️ Xem website
                    </button>
                </header>

                <main className="p-8">
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Tổng sản phẩm" value="" icon="📦" color="bg-blue-500" />
                        <StatCard title="Đơn hàng mới" value="" icon="🔥" color="bg-orange-500" />
                        <StatCard title="Doanh thu (Ước tính)" value="0" icon="💰" color="bg-green-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Form thêm sản phẩm */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50">
                                    <h3 className="font-bold text-gray-800">Tạo sản phẩm mới</h3>
                                    <p className="text-xs text-gray-400 mt-1">Điền thông tin chi tiết cho sản phẩm</p>
                                </div>
                                <div className="p-6">
                                    <ProductEditor onCreated={reloadProducts} />
                                </div>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-800">Danh mục kho hàng</h3>
                                        <p className="text-xs text-gray-400 mt-1">Quản lý và chỉnh sửa sản phẩm hiện có</p>
                                    </div>
                                    <button
                                        onClick={reloadProducts}
                                        className="text-gray-400 hover:text-pink-600 transition-all"
                                    >
                                        🔄 Làm mới
                                    </button>
                                </div>
                                <div className="p-6">
                                    <ProductList key={refresh} admin={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;