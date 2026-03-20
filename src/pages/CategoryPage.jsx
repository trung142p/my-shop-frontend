import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductSkeleton from "../components/ProductSkeleton";

function CategoryPage() {
    const { categoryName } = useParams(); // slug: "am-dao-gia"
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();

    // Map slug sang tên hiển thị cho tiêu đề
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
                // Lọc theo slug (categoryName) thay vì tên hiển thị
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
    }, [categoryName, showToast]); // bỏ displayName khỏi dependency

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        showToast("Đã thêm vào giỏ hàng!", "success");
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group"
                        >
                            <Link to={`/product/${product.id}`}>
                                <div className="overflow-hidden">
                                    <img
                                        src={product.images?.[0] || product.image}
                                        alt={product.name}
                                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="text-lg font-semibold hover:text-pink-500 line-clamp-2 h-14">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-pink-600 font-bold mt-2 text-lg">
                                    {product.price?.toLocaleString()}₫
                                </p>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                                >
                                    Thêm vào giỏ
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