import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Gọi API lấy danh sách sản phẩm
        const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi kết nối Backend:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        /* Quan trọng: Sử dụng product.id (có dấu gạch dưới) theo chuẩn MongoDB */
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="bg-white p-3 rounded-lg shadow-md hover:shadow-xl transition group"
        >
          <div className="overflow-hidden rounded-md h-48 mb-3">
            <img
              /* Kiểm tra: Nếu có images[0] thì lấy, không thì mới lấy image, cuối cùng là ảnh mặc định */
              src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10">
            {product.name}
          </h3>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-pink-600 font-bold">
              {product.price.toLocaleString()} ₫
            </span>
            <span className="text-xs text-gray-400">Đã bán 0</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductList;