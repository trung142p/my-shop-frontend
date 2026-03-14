import ProductEditor from "../../components/ProductEditor";
import ProductList from "../../components/ProductList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();

    const reloadProducts = () => {
        setRefresh(!refresh);
    };

    // Hàm Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("adminToken"); // Xóa "chốt bảo vệ"
        navigate("/admin/login"); // Đá về trang login
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header của Dashboard */}
            <div className="bg-white shadow-sm mb-8">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-pink-600">⚙️</span> Quản lý hệ thống
                    </h1>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-600 hover:text-pink-600 transition-colors"
                        >
                            Xem trang chủ
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-md"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Cột trái: Form thêm sản phẩm */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                                Thêm sản phẩm mới
                            </h2>
                            <ProductEditor onCreated={reloadProducts} />
                        </div>
                    </div>

                    {/* Cột phải: Danh sách sản phẩm hiện có */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                                Danh sách sản phẩm đang bán
                            </h2>
                            <div className="overflow-hidden">
                                {/* Truyền key để khi reloadProducts chạy, ProductList sẽ tải lại dữ liệu */}
                                <ProductList key={refresh} admin={true} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;