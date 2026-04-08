import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";
import ProductSkeleton from "./ProductSkeleton";

function ProductList({
  admin = false,
  onEdit,
  adjustMode = false,
  onToggleHidden = null,
  adjustProducts = null,
  adjustLoading = false,
  itemsPerPage = 16,
  currentPage = 1,
  onPageChange,
  searchTerm = "",
  filterCategory = "all",
  sortOrder = "",
  sortAlpha = ""
}) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [variantsCache, setVariantsCache] = useState({});
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();
  const { t } = useTranslation('home');

  const isImageUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg'];
    const urlLower = url.toLowerCase();
    return imageExtensions.some(ext => urlLower.includes(ext));
  };

  const getProductImage = (product) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      for (let item of product.images) {
        if (isImageUrl(item)) {
          return item;
        }
      }
    }
    if (product.image && isImageUrl(product.image)) {
      return product.image;
    }
    return "https://placehold.co/400x400?text=No+Image";
  };

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

  const getFirstVariant = async (productId) => {
    if (variantsCache[productId] !== undefined) {
      return variantsCache[productId];
    }
    try {
      const res = await axios.get(`https://my-shop-api-p7kz.onrender.com/api/products/${productId}/variants`);
      const firstVariant = res.data.length > 0 ? res.data[0] : null;
      setVariantsCache(prev => ({ ...prev, [productId]: firstVariant }));
      return firstVariant;
    } catch (err) {
      console.error("Lỗi lấy biến thể:", err);
      return null;
    }
  };

  const handleAddToCart = async (product) => {
    if (product.stock <= 0) {
      showToast("Sản phẩm này đã hết hàng!", "error");
      return;
    }
    let itemToAdd = { ...product, quantity: 1 };
    const firstVariant = await getFirstVariant(product.id);
    if (firstVariant) {
      itemToAdd = {
        ...product,
        variant_id: firstVariant.id,
        variant_name: firstVariant.name,
        price: firstVariant.price || product.price,
        stock: firstVariant.stock ?? product.stock
      };
      if (firstVariant.stock <= 0) {
        showToast(`Biến thể "${firstVariant.name}" đã hết hàng!`, "error");
        return;
      }
    }
    addToCart(itemToAdd, 1);
  };

  useEffect(() => {
    if (!admin || adjustMode) return;
    let result = [...products];
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(product => product.name?.toLowerCase().includes(term));
    }
    if (filterCategory && filterCategory !== "all") {
      result = result.filter(product => product.category === filterCategory);
    }
    if (sortAlpha === "az") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortAlpha === "za") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }
    if (sortOrder === "asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    setFilteredProducts(result);
    if (onPageChange) onPageChange(1);
  }, [products, searchTerm, filterCategory, sortOrder, sortAlpha, admin, adjustMode]);

  const getFilteredAdjustProducts = () => {
    if (!adjustProducts) return [];
    let result = [...adjustProducts];
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(product => product.name?.toLowerCase().includes(term));
    }
    if (filterCategory && filterCategory !== "all") {
      result = result.filter(product => product.category === filterCategory);
    }
    if (sortAlpha === "az") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortAlpha === "za") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }
    if (sortOrder === "asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    return result;
  };

  const filteredAdjustProducts = getFilteredAdjustProducts();
  const displayProducts = adjustMode && adjustProducts ? filteredAdjustProducts : (admin ? filteredProducts : products);
  const displayLoading = adjustMode ? adjustLoading : loading;
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);
  const paginatedProducts = displayProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxVisible = 9;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return (
      <div className="flex justify-center gap-2 mt-8 flex-wrap">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">«</button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded border hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">‹</button>
        {pages.map(page => (
          <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 rounded border transition ${currentPage === page ? "bg-pink-600 text-white border-pink-600" : "hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"}`}>{page}</button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">›</button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">»</button>
      </div>
    );
  };

  // ===== ADMIN VIEW =====
  if (admin) {
    if (displayLoading) {
      return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(8)].map((_, i) => (<ProductSkeleton key={i} />))}</div>;
    }
    if (displayProducts.length === 0) return <div className="text-center py-10 text-gray-500 dark:text-gray-400">🔍 Không tìm thấy sản phẩm nào phù hợp</div>;
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition group relative">
              <Link to={`/product/${product.id}`} target="_blank" className="block overflow-hidden rounded-lg h-40 mb-3 bg-gray-50 dark:bg-gray-700">
                <div className="relative w-full h-full">
                  <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image"; }} />
                  {product.badge === "new" && <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">🆕 NEW</div>}
                  {product.badge === "hot" && <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">🔥 HOT</div>}
                </div>
              </Link>
              <h3 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2 h-10 mb-1">{product.name}</h3>
              <p className="text-pink-600 font-black text-base">{Number(product.price).toLocaleString()}₫</p>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2"><span>📦 Kho: {product.stock || 0}</span><span>📈 Đã bán: {product.sold || 0}</span></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">📁 {product.category || "Chưa phân loại"}</p>
              <div className="flex gap-2 mt-2">
                {product.cnbuy_link && <a href={product.cnbuy_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-700 underline flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>CNBUY</a>}
                {product.oichin_link && <a href={product.oichin_link} target="_blank" rel="noopener noreferrer" className="text-xs text-green-500 hover:text-green-700 underline flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>OICHIN</a>}
              </div>
              {adjustMode ? (
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${!product.is_hidden ? 'text-green-600' : 'text-gray-400'}`}>{!product.is_hidden ? 'Hiển thị' : 'Đã ẩn'}</span>
                    <button onClick={() => onToggleHidden && onToggleHidden(product)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${!product.is_hidden ? 'bg-pink-600' : 'bg-gray-300 dark:bg-gray-600'}`}><span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${!product.is_hidden ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                    <span className={`text-xs ${product.is_hidden ? 'text-red-500' : 'text-gray-400'}`}>{product.is_hidden ? '🔒 Ẩn' : '🔓'}</span>
                  </div>
                  <button onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>Sửa</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dashed dark:border-gray-700">
                  <button onClick={() => onEdit(product)} className="bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 py-2 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition">🛠️ Sửa</button>
                  <button onClick={() => handleDelete(product.id)} className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition">🗑️ Xóa</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">Tìm thấy {displayProducts.length} sản phẩm</div>
        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />}
      </div>
    );
  }

  // ===== SHOP VIEW =====
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(16)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  const shopProducts = products.filter(p => !p.is_hidden);
  const shopTotalPages = Math.ceil(shopProducts.length / itemsPerPage);
  const shopPaginatedProducts = shopProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (shopProducts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        🔍 Không tìm thấy sản phẩm nào
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {shopPaginatedProducts.map((product) => (
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
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x400?text=No+Image";
                  }}
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

            {/* THÔNG TIN SẢN PHẨM */}
            <div className="p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 hover:text-pink-600 transition line-clamp-2 min-h-[3rem] text-sm md:text-base">
                  {product.name}
                </h3>
              </Link>

              {/* GIÁ */}
              <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                <span className="text-xl font-black text-pink-600">
                  {Number(product.price).toLocaleString()}₫
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {Math.round(product.price * 1.15).toLocaleString()}₫
                </span>
              </div>

              {/* THÔNG TIN PHỤ */}
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

              {/* NÚT THÊM VÀO GIỎ */}
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

      {shopTotalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={shopTotalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default ProductList;