import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductEditor from "../../components/ProductEditor";
import ProductList from "../../components/ProductList";
import OrderDetail from "../../components/OrderDetail";

function AdminDashboard() {
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("products");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editProduct, setEditProduct] = useState(null); // Quản lý sản phẩm đang sửa
    const navigate = useNavigate();

    const reloadData = () => setRefresh(prev => !prev);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/orders");
                setOrders(res.data);
            } catch (err) { console.error("Lỗi:", err); }
        };
        if (activeTab === "orders") fetchOrders();
    }, [activeTab, refresh]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-64 bg-slate-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-10">ADMIN <span className="text-pink-500">CP</span></h2>
                <nav className="space-y-4">
                    <button onClick={() => setActiveTab("products")} className={`w-full text-left p-3 rounded ${activeTab === 'products' ? 'bg-pink-600' : ''}`}>📦 Sản phẩm</button>
                    <button onClick={() => setActiveTab("orders")} className={`w-full text-left p-3 rounded ${activeTab === 'orders' ? 'bg-pink-600' : ''}`}>📑 Đơn hàng</button>
                </nav>
            </aside>

            <main className="flex-1 p-8">
                {activeTab === "products" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4">
                            <ProductEditor onCreated={reloadData} editProduct={editProduct} setEditProduct={setEditProduct} />
                        </div>
                        <div className="lg:col-span-8">
                            {/* Truyền hàm setEditProduct vào ProductList để khi bấm Sửa nó hiện lên Editor */}
                            <ProductList key={refresh} admin={true} onEdit={setEditProduct} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 font-bold">
                                <tr><th className="p-4">Khách hàng</th><th className="p-4">Tổng tiền</th><th className="p-4">Trạng thái</th></tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} onClick={() => setSelectedOrder(order)} className="border-b hover:bg-pink-50 cursor-pointer">
                                        <td className="p-4 font-bold">{order.customer_info?.name}</td>
                                        <td className="p-4 text-pink-600 font-bold">{order.total_price?.toLocaleString()}₫</td>
                                        <td className="p-4"><span className="bg-gray-200 px-2 py-1 rounded text-xs">{order.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={reloadData} />}
        </div>
    );
}
export default AdminDashboard;