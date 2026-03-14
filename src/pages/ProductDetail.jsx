import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`https://my-shop-api-p7kz.onrender.com/api/products/${id}`);
                let data = res.data;

                // --- BỘ LỌC XỬ LÝ DỮ LIỆU LỖI TỪ SUPABASE ---
                // 1. Xử lý images (nếu là chuỗi thì biến thành mảng)
                if (typeof data.images === 'string') {
                    try {
                        data.images = JSON.parse(data.images);
                    } catch (e) {
                        data.images = [];
                    }
                }

                // 2. Xử lý specs (nếu là chuỗi thì biến thành mảng)
                if (typeof data.specs === 'string') {
                    try {
                        data.specs = JSON.parse(data.specs);
                    } catch (e) {
                        data.specs = [];
                    }
                }

                // 3. Xử lý description (Biến các ký tự \\n thành xuống dòng thật)
                if (data.description) {
                    data.description = data.description.replace(/\\n/g, '\n');
                }
                // --------------------------------------------

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

    if (loading) return <div className="text-center py-20 font-bold">Đang tải dữ liệu...</div>;
    if (!product) return <div className="text-center py-20">Sản phẩm không tồn tại!</div>;

    const allImages = Array.isArray(product.images) ? product.images : [product.image];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
            <div className="bg-white p-4 md:p-8 rounded-sm shadow-sm flex flex-col md:flex-row gap-8">
                {/* CỘT TRÁI: HÌNH ẢNH GALLERY */}
                <div className="w-full md:w-2/5">
                    <div className="border border-gray-100 rounded-sm overflow-hidden mb-4 bg-white aspect-square flex items-center justify-center">
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
                    <h1 className="text-2xl font-medium text-gray-800 mb-4 uppercase">{product.name}</h1>
                    <div className="bg-gray-50 p-5 mb-6">
                        <span className="text-3xl font-bold text-pink-600">{product.price?.toLocaleString()} ₫</span>
                    </div>

                    {/* THÔNG SỐ KỸ THUẬT */}
                    <div className="border border-dashed border-pink-200 bg-pink-50/30 p-4 rounded-md mb-6">
                        <h3 className="text-sm font-bold mb-3 uppercase">📋 Thông số kỹ thuật</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            {product.specs?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <div className="text-gray-500">{item.label}:</div>
                                    <div className="font-medium text-gray-800">{item.value}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* NÚT MUA */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center border border-gray-300">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1">-</button>
                            <input type="number" value={quantity} readOnly className="w-12 text-center font-bold" />
                            <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1">+</button>
                        </div>
                    </div>
                    <button onClick={() => addToCart(product, quantity)} className="w-full bg-pink-600 text-white py-4 rounded-sm font-bold hover:bg-pink-700">THÊM VÀO GIỎ HÀNG</button>
                </div>
            </div>

            {/* PHẦN DƯỚI: MÔ TẢ XEN KẼ ẢNH */}
            <div className="mt-8 bg-white p-6 md:p-10 rounded-sm shadow-sm">
                <h2 className="bg-gray-800 p-4 text-white text-lg font-bold uppercase mb-8 text-center">Chi Tiết Sản Phẩm</h2>
                <div className="max-w-3xl mx-auto">
                    {product.description?.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                        <div key={index} className="mb-6">
                            <p className="text-gray-700 text-lg leading-loose mb-6">{paragraph}</p>
                            {/* Chèn ảnh từ gallery vào giữa các đoạn văn */}
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