import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";
import axios from "axios";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [variantImage, setVariantImage] = useState(null);
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();
    const { t } = useTranslation('product');
    const [loading, setLoading] = useState(true);

    // Hàm kiểm tra URL có phải video không
    const isVideoUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        const urlLower = url.toLowerCase();
        return videoExtensions.some(ext => urlLower.includes(ext));
    };

    // Hàm lấy ảnh đầu tiên (bỏ qua video)
    const getFirstImage = (images) => {
        if (!images || !Array.isArray(images)) return "";
        for (let item of images) {
            if (!isVideoUrl(item)) {
                return item;
            }
        }
        return "";
    };

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

                // 🔧 SỬA: Main image luôn là ẢNH đầu tiên (bỏ qua video)
                const imagesArray = data.images || [];
                const firstImage = getFirstImage(imagesArray);
                setMainImage(firstImage || data.image || "https://placehold.co/600x600?text=No+Image");

                setLoading(false);
            } catch (err) {
                console.error("Lỗi lấy chi tiết sản phẩm:", err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product?.id) {
            fetchVariants(product.id);
        }
    }, [product?.id]);

    const fetchVariants = async (productId) => {
        try {
            const res = await axios.get(`https://my-shop-api-p7kz.onrender.com/api/products/${productId}/variants`);
            setVariants(res.data);
            if (res.data.length > 0) {
                setSelectedVariant(res.data[0]);
                if (res.data[0].image) {
                    setVariantImage(res.data[0].image);
                }
            }
        } catch (err) {
            console.error("Lỗi lấy variants:", err);
        }
    };

    const handleSelectVariant = (variant) => {
        setSelectedVariant(variant);
        if (variant.image) {
            setVariantImage(variant.image);
        } else {
            setVariantImage(null);
        }
    };

    const displayImage = variantImage || mainImage;
    const displayPrice = selectedVariant?.price || product?.price;
    const displayStock = selectedVariant?.stock ?? product?.stock;
    const isOutOfStock = displayStock <= 0;

    const handleAddToCart = () => {
        if (!product) return;
        if (displayStock <= 0) {
            showToast("Sản phẩm này đã hết hàng!", "error");
            return;
        }
        if (quantity > displayStock) {
            showToast(`Chỉ còn ${displayStock} sản phẩm trong kho!`, "warning");
            return;
        }

        const itemToAdd = {
            ...product,
            variant_id: selectedVariant?.id,
            variant_name: selectedVariant?.name,
            price: displayPrice,
            stock: displayStock
        };
        addToCart(itemToAdd, quantity);
    };

    if (loading) return <div className="text-center py-20 font-bold dark:text-white">Đang tải dữ liệu...</div>;
    if (!product) return <div className="text-center py-20 dark:text-white">Sản phẩm không tồn tại!</div>;

    if (product?.is_hidden) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-gray-900">
                <div className="text-6xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Sản phẩm không tồn tại</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Sản phẩm này hiện không được hiển thị.</p>
                <Link to="/" className="text-pink-600 font-medium underline hover:text-pink-700">
                    Bấm vào đây để đến trang chủ!
                </Link>
            </div>
        );
    }

    const allMedia = product.images || [];
    const allImages = allMedia.filter(item => !isVideoUrl(item));
    const allVideos = allMedia.filter(item => isVideoUrl(item));

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-sm shadow-sm flex flex-col md:flex-row gap-8">
                {/* Cột trái: ẢNH đại diện chính */}
                <div className="w-full md:w-2/5">
                    <div className="border border-gray-100 dark:border-gray-700 rounded-sm overflow-hidden mb-4 bg-white dark:bg-gray-800 aspect-square flex items-center justify-center relative">
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                                    {t('detail.outOfStock')}
                                </span>
                            </div>
                        )}
                        <img
                            src={displayImage}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                e.target.src = "https://placehold.co/600x600?text=No+Image";
                            }}
                        />
                    </div>

                    {/* Thumbnail strip - chỉ hiển thị ẢNH (không video) */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {allImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                onClick={() => {
                                    setMainImage(img);
                                    setVariantImage(null);
                                }}
                                className={`w-20 h-20 object-cover flex-shrink-0 cursor-pointer border-2 rounded ${displayImage === img && !variantImage ? 'border-pink-500' : 'border-transparent'
                                    }`}
                                alt="thumb"
                            />
                        ))}
                        {variants.map((variant) => (
                            variant.image && (
                                <img
                                    key={`variant-${variant.id}`}
                                    src={variant.image}
                                    alt={variant.name}
                                    onClick={() => {
                                        setVariantImage(variant.image);
                                        setSelectedVariant(variant);
                                    }}
                                    className={`w-20 h-20 object-cover flex-shrink-0 cursor-pointer border-2 rounded ${variantImage === variant.image ? 'border-pink-500' : 'border-transparent'
                                        }`}
                                    title={variant.name}
                                />
                            )
                        ))}
                    </div>
                </div>

                {/* Cột phải: Thông tin sản phẩm (giữ nguyên) */}
                <div className="w-full md:w-3/5 flex flex-col">
                    <h1 className="text-2xl font-medium text-gray-800 dark:text-white mb-4 uppercase">{product.name}</h1>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-5 mb-6">
                        <div className="flex items-baseline gap-4 flex-wrap">
                            <span className="text-3xl font-bold text-pink-600">{displayPrice?.toLocaleString()} ₫</span>
                            <span className="text-sm text-gray-400 line-through">
                                {Math.round(product.price * 1.15).toLocaleString()} ₫
                            </span>
                        </div>

                        <div className="flex gap-6 mt-3 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">📦 {t('detail.stock')}:</span>
                                <span className={`font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                    {isOutOfStock ? t('detail.outOfStock') : `${displayStock} sản phẩm`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">📈 {t('detail.sold')}:</span>
                                <span className="font-bold text-pink-600">{product.sold || 0}</span>
                            </div>
                        </div>
                    </div>

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

                    {variants.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold mb-2 uppercase dark:text-white">Chọn loại:</h3>
                            <div className="flex flex-wrap gap-3">
                                {variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => handleSelectVariant(variant)}
                                        className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${selectedVariant?.id === variant.id
                                                ? "border-pink-500 bg-pink-500 text-white"
                                                : "border-gray-300 hover:border-pink-500 hover:bg-pink-50 dark:border-gray-600 dark:hover:bg-pink-900/30"
                                            }`}
                                    >
                                        {variant.image && (
                                            <img
                                                src={variant.image}
                                                alt={variant.name}
                                                className="w-5 h-5 rounded-full object-cover"
                                            />
                                        )}
                                        {variant.name}
                                        {variant.price && variant.price !== product.price && (
                                            <span className="ml-1 text-xs">
                                                ({variant.price.toLocaleString()}₫)
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

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
                                            setQuantity(Math.min(displayStock, Math.max(1, val)));
                                        }}
                                        className="w-12 text-center font-bold border-x dark:border-gray-600 outline-none dark:bg-gray-800 dark:text-white"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(displayStock, quantity + 1))}
                                        className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Còn {displayStock} sản phẩm</span>
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

            {/* Phần mô tả chi tiết - VIDEO sẽ hiển thị ở đây */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 md:p-10 rounded-sm shadow-sm">
                <h2 className="bg-gray-800 dark:bg-gray-700 p-4 text-white text-lg font-bold uppercase mb-8 text-center">{t('detail.description')}</h2>
                <div className="max-w-3xl mx-auto">
                    {product.description?.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                        <div key={index} className="mb-6">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-loose mb-6">{paragraph}</p>
                            {/* Hiển thị VIDEO từ mảng images (bắt đầu từ index 1 trở đi) */}
                            {allMedia[index + 1] && isVideoUrl(allMedia[index + 1]) && (
                                <div className="my-10 text-center">
                                    <video
                                        src={allMedia[index + 1]}
                                        controls
                                        className="w-full rounded-lg shadow-md"
                                    />
                                    <p className="text-sm text-gray-400 mt-2 italic">Video giới thiệu sản phẩm</p>
                                </div>
                            )}
                            {/* Hiển thị ẢNH từ mảng images (bắt đầu từ index 1 trở đi) */}
                            {allMedia[index + 1] && !isVideoUrl(allMedia[index + 1]) && (
                                <div className="my-10 text-center">
                                    <img
                                        src={allMedia[index + 1]}
                                        className="w-full rounded-lg shadow-md"
                                        alt="detail"
                                    />
                                    <p className="text-sm text-gray-400 mt-2 italic">Cận cảnh chi tiết sản phẩm</p>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Hiển thị tất cả video còn lại (nếu có nhiều hơn số đoạn văn) */}
                    {allVideos.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-bold mb-4 text-center">Video giới thiệu</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {allVideos.map((video, idx) => (
                                    <video
                                        key={idx}
                                        src={video}
                                        controls
                                        className="w-full rounded-lg shadow-md"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;