import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import ProductSkeleton from "./ProductSkeleton";

// Thêm props admin và onEdit để nhận từ AdminDashboard
function ProductList({ admin = false, onEdit }) {
  const [products, setProducts] = useState([]);

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

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

  if (loading) {
    const skeletonCount = admin ? 6 : 8;
    return (
      <div className={`grid ${admin ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-4"} gap-6`}>
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
        fetchProducts(); // Load lại danh sách sau khi xóa
      } catch (err) {
        showToast("Lỗi khi xóa sản phẩm!", "error");
      }
    }
  };

  return (
    <div className={`grid ${admin ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-4"} gap-6`}>
      {products.map((product) => (
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

          {/* HIỂN THỊ NÚT ĐIỀU KHIỂN NẾU LÀ ADMIN */}
          {admin ? (
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
          ) : (
            /* HIỂN THỊ LINK CHI TIẾT NẾU LÀ KHÁCH HÀNG */
            <Link
              to={`/product/${product.id}`}
              className="mt-3 block text-center bg-gray-900 text-white py-2 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Xem chi tiết
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductList;