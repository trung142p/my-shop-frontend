import ProductEditor from "../../components/ProductEditor";
import ProductList from "../../components/ProductList";
import OrderDetail from "../../components/OrderDetail";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function AdminDashboard() {
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("products");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Phân trang cho đơn hàng
    const [orderCurrentPage, setOrderCurrentPage] = useState(1);
    const ordersPerPage = 5;

    // Phân trang cho sản phẩm
    const [productCurrentPage, setProductCurrentPage] = useState(1);
    const productsPerPage = 8; // 8 sản phẩm mỗi trang (4x2)

    const navigate = useNavigate();

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
        fetchOrders();
    }, [refresh]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    // Tính toán thống kê
    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
        const completedOrders = orders.filter(o => o.status === "Thành công").length;
        const pendingOrders = orders.filter(o => o.status === "Chờ xác nhận").length;
        const shippingOrders = orders.filter(o => o.status === "Đang vận chuyển").length;

        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split("T")[0];
        }).reverse();

        const dailyRevenue = last7Days.map(day => {
            return orders
                .filter(o => o.created_at?.split("T")[0] === day)
                .reduce((sum, o) => sum + (o.total_price || 0), 0);
        });

        const codCount = orders.filter(o => o.payment_method === "COD").length;
        const prepayCount = orders.filter(o => o.payment_method === "PREPAY").length;

        return {
            totalOrders: orders.length,
            totalRevenue,
            completedOrders,
            pendingOrders,
            shippingOrders,
            dailyRevenue,
            last7Days,
            codCount,
            prepayCount,
        };
    }, [orders]);

    // Lọc và phân trang đơn hàng
    const filteredOrders = useMemo(() => {
        let filtered = orders;
        if (filterStatus !== "all") {
            filtered = filtered.filter(o => o.status === filterStatus);
        }
        if (searchTerm) {
            filtered = filtered.filter(o =>
                o.order_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customer_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customer_info?.phone?.includes(searchTerm)
            );
        }
        return filtered;
    }, [orders, filterStatus, searchTerm]);

    const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const paginatedOrders = filteredOrders.slice(
        (orderCurrentPage - 1) * ordersPerPage,
        orderCurrentPage * ordersPerPage
    );

    useEffect(() => {
        setOrderCurrentPage(1);
    }, [filterStatus, searchTerm]);

    // Chart data
    const revenueChartData = {
        labels: stats.last7Days.map(d => d.slice(5)),
        datasets: [
            {
                label: "Doanh thu (₫)",
                data: stats.dailyRevenue,
                backgroundColor: "rgba(219, 39, 119, 0.5)",
                borderColor: "rgb(219, 39, 119)",
                borderWidth: 1,
            },
        ],
    };

    const paymentChartData = {
        labels: ["COD", "Chuyển khoản 50%"],
        datasets: [
            {
                data: [stats.codCount, stats.prepayCount],
                backgroundColor: ["#ec489a", "#3b82f6"],
                borderWidth: 0,
            },
        ],
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* Sidebar */}
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
                    <button onClick={() => setActiveTab("stats")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'stats' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-slate-800'}`}>
                        📊 Thống kê
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition mt-10">
                        🚪 Đăng xuất
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="font-bold text-gray-800 uppercase tracking-tight">Hệ thống quản trị</h1>
                    <button onClick={() => navigate("/")} className="text-pink-600 border border-pink-200 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-pink-50 transition">👁️ Xem Web</button>
                </header>

                <main className="p-8 flex-1">
                    {activeTab === "stats" ? (
                        <div>
                            <h2 className="text-xl font-bold mb-6">📊 Thống kê</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-pink-500">
                                    <p className="text-gray-500 text-sm">Tổng đơn hàng</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500">
                                    <p className="text-gray-500 text-sm">Doanh thu</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()}₫</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-500">
                                    <p className="text-gray-500 text-sm">Đơn chờ xác nhận</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
                                    <p className="text-gray-500 text-sm">Đang vận chuyển</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.shippingOrders}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="font-bold mb-4">📈 Doanh thu 7 ngày qua</h3>
                                    <Bar data={revenueChartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="font-bold mb-4">💳 Phương thức thanh toán</h3>
                                    <div className="w-64 mx-auto">
                                        <Doughnut data={paymentChartData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
                                    </div>
                                    <div className="mt-4 text-center text-sm text-gray-500">
                                        <span className="inline-block w-3 h-3 bg-pink-500 rounded-full mr-1"></span> COD: {stats.codCount}
                                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full ml-3 mr-1"></span> Chuyển khoản: {stats.prepayCount}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === "products" ? (
                        <div className="space-y-8">
                            {/* Form thêm/sửa sản phẩm - Full width */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    {editProduct ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
                                </h2>
                                <ProductEditor
                                    onCreated={reloadData}
                                    editProduct={editProduct}
                                    setEditProduct={setEditProduct}
                                    compact={false}
                                />
                            </div>

                            {/* Danh sách sản phẩm - 4 cột */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">📋 Danh sách sản phẩm</h2>
                                    <p className="text-sm text-gray-500">Hiển thị {productsPerPage} sản phẩm/trang</p>
                                </div>
                                <ProductList
                                    key={refresh}
                                    admin={true}
                                    onEdit={(product) => {
                                        setEditProduct(product);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    itemsPerPage={productsPerPage}
                                    currentPage={productCurrentPage}
                                    onPageChange={setProductCurrentPage}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Thanh tìm kiếm và lọc */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <input
                                    type="text"
                                    placeholder="🔍 Tìm theo mã đơn, tên, SĐT..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border rounded-lg bg-white"
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                                    <option value="Xác nhận">Xác nhận đơn</option>
                                    <option value="Đang vận chuyển">Đang vận chuyển</option>
                                    <option value="Thành công">Thành công</option>
                                    <option value="Hủy">Hủy đơn</option>
                                </select>
                            </div>

                            {/* Bảng đơn hàng */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                                        <tr>
                                            <th className="p-4">Mã đơn</th>
                                            <th className="p-4">Khách hàng</th>
                                            <th className="p-4">Khu vực</th>
                                            <th className="p-4">Sản phẩm</th>
                                            <th className="p-4">Tổng tiền</th>
                                            <th className="p-4">Thời gian</th>
                                            <th className="p-4 text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedOrders.map((order) => (
                                            <tr key={order.id} onClick={() => setSelectedOrder(order)} className="hover:bg-pink-50 cursor-pointer transition">
                                                <td className="p-4 font-mono text-xs">{order.order_code}</td>
                                                <td className="p-4">
                                                    <p className="font-bold">{order.customer_info?.name || "N/A"}</p>
                                                    <p className="text-xs text-gray-500">{order.customer_info?.phone}</p>
                                                </td>
                                                <td className="p-4 text-xs">{order.customer_info?.district}, {order.customer_info?.province}</td>
                                                <td className="p-4 text-xs">{order.items?.length} món</td>
                                                <td className="p-4 font-bold text-pink-600">{order.total_price?.toLocaleString()}₫</td>
                                                <td className="p-4 text-xs">{formatDateTime(order.created_at)}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.status === "Thành công" ? "bg-green-100 text-green-700" :
                                                            order.status === "Hủy" ? "bg-red-100 text-red-700" :
                                                                order.status === "Đang vận chuyển" ? "bg-blue-100 text-blue-700" :
                                                                    "bg-yellow-100 text-yellow-700"
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredOrders.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">Không tìm thấy đơn hàng</div>
                                )}

                                {/* Phân trang đơn hàng */}
                                {totalOrderPages > 1 && (
                                    <div className="flex justify-center gap-2 py-4 border-t">
                                        <button
                                            onClick={() => setOrderCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={orderCurrentPage === 1}
                                            className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            ←
                                        </button>
                                        <span className="px-4 py-1 text-sm">
                                            Trang {orderCurrentPage} / {totalOrderPages}
                                        </span>
                                        <button
                                            onClick={() => setOrderCurrentPage(p => Math.min(totalOrderPages, p + 1))}
                                            disabled={orderCurrentPage === totalOrderPages}
                                            className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={reloadData} />}
        </div>
    );
}

export default AdminDashboard;