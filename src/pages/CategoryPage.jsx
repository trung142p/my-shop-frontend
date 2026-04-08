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

    const isVideoUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        const urlLower = url.toLowerCase();
        return videoExtensions.some(ext => urlLower.includes(ext));
    };

    const getProductImage = (product) => {
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            for (let item of product.images) {
                if (!isVideoUrl(item)) {
                    return item;
                }
            }
        }
        if (product.image && !isVideoUrl(product.image)) {
            return product.image;
        }
        return "https://placehold.co/400x400?text=No+Image";
    };

    const getCategoryDisplayName = (slug) => {
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

    const displayName = getCategoryDisplayName(categoryName);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            setLoading(true);
            try {
                const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/products");
                const filtered = res.data.filter(
                    (product) => (product.category === categoryName || product.category === displayName) && !product.is_hidden
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
    }, [categoryName, displayName, showToast]);

    const handleAddToCart = (product) => {
        if (product.stock <= 0) {
            showToast("Sản phẩm này đã hết hàng!", "error");
            return;
        }
        addToCart(product, 1);
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
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-gray-500 mb-6">Danh mục {displayName} hiện chưa có sản phẩm nào.</p>
                    <Link to="/" className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition">Về trang chủ</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <Link to={`/product/${product.id}`} className="block overflow-hidden">
                                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                    <img
                                        src={getProductImage(product)}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                        onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image"; }}
                                    />

                                    {/* 🔥 BADGE - GÓC TRÊN TRÁI */}
                                    {product.badge === "new" && (
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className="relative flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[11px] font-black uppercase px-2.5 py-1.5 rounded-lg shadow-lg tracking-wide">
                                                <span className="text-sm">🆕</span>
                                                NEW
                                                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-600 rotate-45"></span>
                                            </span>
                                        </div>
                                    )}
                                    {product.badge === "hot" && (
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className="relative flex items-center gap-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[11px] font-black uppercase px-2.5 py-1.5 rounded-lg shadow-lg tracking-wide">
                                                <span className="text-sm">🔥</span>
                                                HOT
                                                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-rose-600 rotate-45"></span>
                                            </span>
                                        </div>
                                    )}

                                    {/* 💰 GIẢM GIÁ - GÓC TRÊN PHẢI */}
                                    <div className="absolute top-3 right-3 z-20">
                                        <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black px-2.5 py-1.5 rounded-lg shadow-md">
                                            -15%
                                        </span>
                                    </div>

                                    {/* 📦 TÌNH TRẠNG KHO - GÓC DƯỚI PHẢI */}
                                    {(product.stock || 0) <= 0 ? (
                                        <div className="absolute bottom-3 right-3 z-20">
                                            <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-md">
                                                HẾT HÀNG
                                            </span>
                                        </div>
                                    ) : (product.stock || 0) <= 5 ? (
                                        <div className="absolute bottom-3 right-3 z-20">
                                            <span className="bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-md">
                                                CÒN {product.stock}
                                            </span>
                                        </div>
                                    ) : null}

                                    {/* LỚP PHỦ KHI HOVER */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                                        <span className="bg-white text-gray-800 px-5 py-2.5 rounded-full text-sm font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-pink-500 hover:text-white">
                                            Xem chi tiết
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <div className="p-4">
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200 hover:text-pink-600 transition line-clamp-2 min-h-[3rem] text-sm md:text-base">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                                    <span className="text-xl font-black text-pink-600">
                                        {Number(product.price).toLocaleString()}₫
                                    </span>
                                    <span className="text-xs text-gray-400 line-through">
                                        {Math.round(product.price * 1.15).toLocaleString()}₫
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <span>📦</span>
                                        <span>Còn: {product.stock || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>❤️</span>
                                        <span>Đã bán: {product.sold || 0}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={(product.stock || 0) <= 0}
                                    className={`mt-4 w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${(product.stock || 0) <= 0
                                            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-md hover:shadow-lg"
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {(product.stock || 0) <= 0 ? "Tạm hết hàng" : "Thêm vào giỏ"}
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