import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";
import axios from "axios";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();
    const { t } = useTranslation('product');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`https://my-shop-api-p7kz.onrender.com/api/products/${id}`);
                let data = res.data;

                if (typeof data.images === 'string') {
                    try {
                        data.images = JSON.parse(data.images);
                    } catch (e) {
                        data.images = [];
                    }
                }

                if (typeof data.specs === 'string') {
                    try {
                        data.specs = JSON.parse(data.specs);
                    } catch (e) {
                        data.specs = [];
                    }
                }

                if (data.description) {
                    data.description = data.description.replace(/\\n/g, '\n');
                }

                setProduct(data);
                const imgs = Array.isArray(data.images) ? data.images : [];
                setMainImage(imgs[0] || data.image);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi lấy chi tiết sản phẩm:", err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        if (product.stock <= 0) {
            showToast("Sản phẩm này đã hết hàng!", "error");
            return;
        }
        if (quantity > product.stock) {
            showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, "warning");
            return;
        }
        addToCart(product, quantity);
    };

    if (loading) return <div className="text-center py-20 font-bold dark:text-white">Đang tải dữ liệu...</div>;
    if (!product) return <div className="text-center py-20 dark:text-white">Sản phẩm không tồn tại!</div>;

    const allImages = Array.isArray(product.images) ? product.images : [product.image];
    const isOutOfStock = (product.stock || 0) <= 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-sm shadow-sm flex flex-col md:flex-row gap-8">
                {/* CỘT TRÁI: HÌNH ẢNH GALLERY */}
                <div className="w-full md:w-2/5">
                    <div className="border border-gray-100 dark:border-gray-700 rounded-sm overflow-hidden mb-4 bg-white dark:bg-gray-800 aspect-square flex items-center justify-center relative">
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                                    {t('detail.outOfStock')}
                                </span>
                            </div>
                        )}
                        <img src={mainImage} alt={product.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {allImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 object-cover flex-shrink-0 cursor-pointer border-2 ${mainImage === img ? 'border-pink-500' : 'border-transparent'}`}
                                alt="thumb"
                            />
                        ))}
                    </div>
                </div>

                {/* CỘT PHẢI: THÔNG TIN */}
                <div className="w-full md:w-3/5 flex flex-col">
                    <h1 className="text-2xl font-medium text-gray-800 dark:text-white mb-4 uppercase">{product.name}</h1>

                    {/* Giá và thông tin tồn kho */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-5 mb-6">
                        <div className="flex items-baseline gap-4 flex-wrap">
                            <span className="text-3xl font-bold text-pink-600">{product.price?.toLocaleString()} ₫</span>
                            <span className="text-sm text-gray-400 line-through">
                                {Math.round(product.price * 1.15).toLocaleString()} ₫
                            </span>
                        </div>

                        {/* Thông tin tồn kho và đã bán */}
                        <div className="flex gap-6 mt-3 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">📦 {t('detail.stock')}:</span>
                                <span className={`font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                    {isOutOfStock ? t('detail.outOfStock') : `${product.stock} sản phẩm`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">📈 {t('detail.sold')}:</span>
                                <span className="font-bold text-pink-600">{product.sold || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* THÔNG SỐ KỸ THUẬT */}
                    {product.specs && product.specs.length > 0 && (
                        <div className="border border-dashed border-pink-200 dark:border-pink-800 bg-pink-50/30 dark:bg-pink-900/20 p-4 rounded-md mb-6">
                            <h3 className="text-sm font-bold mb-3 uppercase dark:text-white">{t('detail.specs')}</h3>
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                {product.specs.map((spec, index) => (
                                    <React.Fragment key={index}>
                                        <div className="text-gray-500 font-medium">{spec.label}:</div>
                                        <div className="font-medium text-gray-800 dark:text-gray-300">{spec.value}</div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Số lượng và nút mua */}
                    {!isOutOfStock && (
                        <>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            setQuantity(Math.min(product.stock, Math.max(1, val)));
                                        }}
                                        className="w-12 text-center font-bold border-x dark:border-gray-600 outline-none dark:bg-gray-800 dark:text-white"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Còn {product.stock} sản phẩm</span>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-pink-600 text-white py-4 rounded-sm font-bold hover:bg-pink-700 transition"
                            >
                                {t('detail.addToCart')}
                            </button>
                        </>
                    )}

                    {isOutOfStock && (
                        <button
                            disabled
                            className="w-full bg-gray-400 text-white py-4 rounded-sm font-bold cursor-not-allowed"
                        >
                            {t('detail.outOfStock')}
                        </button>
                    )}
                </div>
            </div>

            {/* PHẦN MÔ TẢ */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 md:p-10 rounded-sm shadow-sm">
                <h2 className="bg-gray-800 dark:bg-gray-700 p-4 text-white text-lg font-bold uppercase mb-8 text-center">{t('detail.description')}</h2>
                <div className="max-w-3xl mx-auto">
                    {product.description?.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                        <div key={index} className="mb-6">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-loose mb-6">{paragraph}</p>
                            {allImages[index + 1] && (
                                <div className="my-10 text-center">
                                    <img src={allImages[index + 1]} className="w-full rounded-lg shadow-md" alt="detail" />
                                    <p className="text-sm text-gray-400 mt-2 italic">Cận cảnh chi tiết sản phẩm</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;