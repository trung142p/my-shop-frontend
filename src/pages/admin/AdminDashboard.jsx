import ProductEditor from "../../components/ProductEditor";
import ProductList from "../../components/ProductList";
import OrderDetail from "../../components/OrderDetail";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("products");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editProduct, setEditProduct] = useState(null); // Quản lý sản phẩm đang được chọn để sửa

    const navigate = useNavigate();

    // Hàm làm mới dữ liệu và reset form
    const reloadData = () => {
        setRefresh(!refresh);
        setEditProduct(null);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/orders");
                setOrders(res.data);
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

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 min-h-screen flex flex-col shadow-xl fixed lg:relative z-20">
                <div className="p-6 text-white text-2xl font-black italic tracking-widest border-b border-slate-800">
                    ADMIN<span className="text-pink-500">CP</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <button onClick={() => setActiveTab("products")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'products' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-slate-800'}`}>
                        📦 Sản phẩm
                    </button>
                    <button onClick={() => setActiveTab("orders")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'orders' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-slate-800'}`}>
                        📑 Đơn hàng
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition mt-10">
                        🚪 Đăng xuất
                    </button>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="font-bold text-gray-800 uppercase tracking-tight">Hệ thống quản trị</h1>
                    <button onClick={() => navigate("/")} className="text-pink-600 border border-pink-200 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-pink-50 transition">👁️ Xem Web</button>
                </header>

                <main className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 font-bold">Tổng đơn: {orders.length}</div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 font-bold text-green-600">Doanh thu: {orders.reduce((sum, o) => sum + (o.total_price || 0), 0).toLocaleString()}₫</div>
                    </div>

                    {activeTab === "products" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* CỘT TRÁI: Form thêm/sửa sản phẩm */}
                            <div className="lg:col-span-4">
                                <ProductEditor
                                    onCreated={reloadData}
                                    editProduct={editProduct}
                                    setEditProduct={setEditProduct}
                                />
                            </div>
                            {/* CỘT PHẢI: Danh sách sản phẩm */}
                            <div className="lg:col-span-8">
                                <ProductList
                                    key={refresh}
                                    admin={true}
                                    onEdit={(product) => {
                                        setEditProduct(product);
                                        // Cuộn lên đầu trang để admin thấy form sửa
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                                    <tr>
                                        <th className="p-4">STT</th>
                                        <th className="p-4">Khách hàng</th>
                                        <th className="p-4">Khu vực</th>
                                        <th className="p-4">Sản phẩm</th>
                                        <th className="p-4">Tổng tiền</th>
                                        <th className="p-4 text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order, index) => (
                                        <tr key={order.id} onClick={() => setSelectedOrder(order)} className="hover:bg-pink-50 cursor-pointer transition">
                                            <td className="p-4 text-gray-400">{index + 1}</td>
                                            <td className="p-4">
                                                <p className="font-bold">{order.customer_info?.name || "N/A"}</p>
                                                <p className="text-xs text-gray-500">{order.customer_info?.phone}</p>
                                            </td>
                                            <td className="p-4 text-xs">
                                                {order.customer_info?.district}, {order.customer_info?.province}
                                            </td>
                                            <td className="p-4 text-xs">
                                                {order.items?.length} món
                                            </td>
                                            <td className="p-4 font-bold text-pink-600">
                                                {order.total_price?.toLocaleString()}₫
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold">{order.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {selectedOrder && (
                <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={reloadData} />
            )}
        </div>
    );
}

export default AdminDashboard;