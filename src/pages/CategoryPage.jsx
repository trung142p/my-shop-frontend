import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductSkeleton from "../components/ProductSkeleton";

function CategoryPage() {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();

    const getDisplayName = (slug) => {
        const map = {
            "am-dao-gia": "Âm đạo giả",
            "duong-vat-gia": "Dương vật giả",
            "coc-thu-dam": "Cốc thủ dâm",
            "trung-rung": "Trứng rung tình yêu",
            "may-bu-mut": "Máy thủ dâm bú mút",
            "may-massage": "Máy massage tình yêu",
            "vong-deo": "Vòng đeo dương vật",
            "hau-mon": "Đồ chơi hậu môn",
            "may-tap": "Máy tập dương vật",
            "sm": "Đồ chơi SM",
            "bao-cao-su": "Bao cao su",
            "do-lot": "Đồ lót sexy",
            "gel": "Gel bôi trơn",
        };
        return map[slug] || slug;
    };

    const displayName = getDisplayName(categoryName);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            setLoading(true);
            try {
                const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/products");
                const filtered = res.data.filter(
                    (product) => product.category === categoryName
                );
                setProducts(filtered);
            } catch (err) {
                console.error("Lỗi lấy sản phẩm:", err);
                showToast("Không thể tải sản phẩm!", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByCategory();
    }, [categoryName, showToast]);

    const handleAddToCart = (product) => {
        if (product.stock <= 0) {
            showToast("Sản phẩm này đã hết hàng!", "error");
            return;
        }
        addToCart(product, 1);
        // Toast sẽ hiển thị từ CartContext
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Link to="/" className="hover:text-pink-600">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-pink-600 font-medium">{displayName}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wider">
                    {displayName}
                </h1>
                <p className="text-gray-500 mt-2">
                    {products.length} sản phẩm
                </p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                        Không tìm thấy sản phẩm
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Danh mục {displayName} hiện chưa có sản phẩm nào.
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
                    >
                        Về trang chủ
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <Link to={`/product/${product.id}`} className="block overflow-hidden">
                                <div className="relative aspect-square bg-gray-100">
                                    <img
                                        src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Badge hết hàng */}
                                    {(product.stock || 0) <= 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                HẾT HÀNG
                                            </span>
                                        </div>
                                    )}
                                    {/* Badge giảm giá -15% */}
                                    <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        -15%
                                    </div>
                                    {/* Badge số lượng còn lại */}
                                    {(product.stock || 0) > 0 && (product.stock || 0) <= 5 && (
                                        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            Còn {product.stock}
                                        </div>
                                    )}
                                    {/* Overlay xem nhanh */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            Xem chi tiết
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <div className="p-4">
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="font-semibold text-gray-800 hover:text-pink-600 transition line-clamp-2 min-h-[3rem]">
                                        {product.name}
                                    </h3>
                                </Link>

                                {/* Giá */}
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xl font-bold text-pink-600">
                                        {Number(product.price).toLocaleString()}₫
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        {Math.round(product.price * 1.15).toLocaleString()}₫
                                    </span>
                                </div>

                                {/* Stock và Sold */}
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>📦 Còn lại: {product.stock || 0}</span>
                                    <span>❤️ Đã bán: {product.sold || 0}</span>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={(product.stock || 0) <= 0}
                                    className={`mt-3 w-full py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${(product.stock || 0) <= 0
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-900 hover:bg-pink-600 text-white"
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {(product.stock || 0) <= 0 ? "Hết hàng" : "Thêm vào giỏ"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryPage;