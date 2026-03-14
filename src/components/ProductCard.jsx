import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product, admin, onDelete }) {

  const { addToCart } = useContext(CartContext);

  // ===== ADMIN CARD =====
  if (admin) {
    return (
      <div className="border rounded-lg p-2 text-center hover:shadow transition">

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-28 object-cover rounded"
        />

        <h3 className="text-sm font-semibold mt-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-pink-600 font-bold text-sm">
          {product.price.toLocaleString()}₫
        </p>

        <p className="text-xs text-gray-500">
          Kho: {product.stock || 0}
        </p>

        <button
          onClick={() => onDelete(product.id)}
          className="mt-2 text-red-500 text-xs hover:underline"
        >
          Xóa
        </button>

      </div>
    );
  }

  // ===== SHOP CARD =====
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">

      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-4">

        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold hover:text-pink-500">
            {product.name}
          </h3>
        </Link>

        <p className="text-pink-600 font-bold mt-2">
          {product.price.toLocaleString()}₫
        </p>

        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        >
          Thêm vào giỏ
        </button>

      </div>

    </div>
  );
}

export default ProductCard;