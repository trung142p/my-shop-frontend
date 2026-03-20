import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductSkeleton from "./ProductSkeleton";

function ProductList({ admin = false, onEdit, itemsPerPage = 6, currentPage = 1, onPageChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi kết nối Backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Phân trang sản phẩm
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    showToast("Đã thêm vào giỏ hàng!", "success");
  };

  if (loading) {
    const skeletonCount = admin ? 6 : 8;
    return (
      <div className={`grid ${admin ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-4"} gap-4 md:gap-6`}>
        {[...Array(skeletonCount)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (window.confirm("Trung có chắc muốn xóa sản phẩm này không?")) {
      try {
        await axios.delete(`https://my-shop-api-p7kz.onrender.com/api/products/${id}`);
        showToast("Đã xóa xong!", "success");
        fetchProducts();
      } catch (err) {
        showToast("Lỗi khi xóa sản phẩm!", "error");
      }
    }
  };

  // ===== ADMIN VIEW =====
  if (admin) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group relative"
            >
              <div className="overflow-hidden rounded-lg h-40 mb-3 bg-gray-50">
                <img
                  src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10 mb-1">
                {product.name}
              </h3>

              <p className="text-pink-600 font-black text-base">
                {Number(product.price).toLocaleString()}₫
              </p>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dashed">
                <button
                  onClick={() => onEdit(product)}
                  className="bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition"
                >
                  🛠️ Sửa
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-50 text-red-500 py-2 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang cho admin */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <span className="px-4 py-1 text-sm">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}
      </div>
    );
  }

  // ===== SHOP VIEW (trang chủ) =====
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Ảnh sản phẩm - click vào ảnh để xem chi tiết */}
            <Link to={`/product/${product.id}`} className="block overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Badge giảm giá demo */}
                <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -15%
                </div>
                {/* Overlay xem nhanh - hover hiện */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Xem chi tiết
                  </span>
                </div>
              </div>
            </Link>

            <div className="p-4">
              {/* Tên sản phẩm - click vào tên cũng vào chi tiết */}
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

              {/* Nút thêm vào giỏ */}
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-3 w-full bg-gray-900 hover:bg-pink-600 text-white py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang cho shop (nếu cần, hiện tại không hiển thị ở trang chủ) */}
      {totalPages > 1 && false && (
        <div className="flex justify-center gap-2 mt-8">
          <button className="px-3 py-1 rounded border hover:bg-gray-50">←</button>
          <span className="px-4 py-1 text-sm">Trang {currentPage} / {totalPages}</span>
          <button className="px-3 py-1 rounded border hover:bg-gray-50">→</button>
        </div>
      )}
    </div>
  );
}

export default ProductList;