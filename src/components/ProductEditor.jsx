import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import VariantManager from "./VariantManager";

const categories = ["Âm đạo giả", "Dương vật giả", "Cốc thủ dâm", "Trứng rung tình yêu", "Máy thủ dâm bú mút", "Máy massage tình yêu", "Vòng đeo dương vật", "Đồ chơi hậu môn", "Máy tập dương vật", "Đồ chơi SM", "Bao cao su", "Đồ lót sexy", "Gel bôi trơn"];

function ProductEditor({ onCreated, editProduct, setEditProduct, compact = false }) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: categories[0],
        image: "",
        images: [],
        description: "",
        brand: "",
        material: "",
        function: "",
        size: "",
        stock: 0,
        sold: 0,
        cnbuy_link: "",
        oichin_link: ""
    });
    const [savedProductId, setSavedProductId] = useState(null);

    const { showToast } = useToast();

    // Hàm chuyển đổi từ specs array sang các trường riêng
    const convertSpecsToFields = (specs) => {
        const fields = {
            brand: "",
            material: "",
            function: "",
            size: ""
        };

        if (Array.isArray(specs)) {
            specs.forEach(spec => {
                const label = spec.label?.toLowerCase().trim();
                const value = spec.value || "";

                if (label === "thương hiệu" || label === "thuong hieu") {
                    fields.brand = value;
                } else if (label === "chất liệu" || label === "chat lieu") {
                    fields.material = value;
                } else if (label === "chức năng" || label === "chuc nang") {
                    fields.function = value;
                } else if (label === "kích thước" || label === "kich thuoc") {
                    fields.size = value;
                }
            });
        }

        return fields;
    };

    // Đồng bộ khi sửa sản phẩm
    useEffect(() => {
        if (editProduct) {
            const specsFields = convertSpecsToFields(editProduct.specs);

            setFormData({
                name: editProduct.name || "",
                price: editProduct.price || "",
                category: editProduct.category || categories[0],
                image: editProduct.image || "",
                images: Array.isArray(editProduct.images) ? editProduct.images : [],
                description: editProduct.description || "",
                brand: specsFields.brand,
                material: specsFields.material,
                function: specsFields.function,
                size: specsFields.size,
                stock: editProduct.stock || 0,
                sold: editProduct.sold || 0,
                cnbuy_link: editProduct.cnbuy_link || "",
                oichin_link: editProduct.oichin_link || ""
            });
            setSavedProductId(editProduct.id);
        } else {
            setFormData({
                name: "",
                price: "",
                category: categories[0],
                image: "",
                images: [],
                description: "",
                brand: "",
                material: "",
                function: "",
                size: "",
                stock: 0,
                sold: 0,
                cnbuy_link: "",
                oichin_link: ""
            });
            setSavedProductId(null);
        }
    }, [editProduct]);

    // Chuyển đổi từ 4 trường sang mảng specs
    const buildSpecsArray = () => {
        const specs = [];
        if (formData.brand && formData.brand.trim()) {
            specs.push({ label: "Thương hiệu", value: formData.brand.trim() });
        }
        if (formData.material && formData.material.trim()) {
            specs.push({ label: "Chất liệu", value: formData.material.trim() });
        }
        if (formData.function && formData.function.trim()) {
            specs.push({ label: "Chức năng", value: formData.function.trim() });
        }
        if (formData.size && formData.size.trim()) {
            specs.push({ label: "Kích thước", value: formData.size.trim() });
        }
        return specs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price) {
            showToast("Vui lòng nhập tên và giá sản phẩm!", "warning");
            return;
        }

        const productData = {
            name: formData.name,
            price: Number(formData.price),
            category: formData.category,
            image: formData.image,
            images: formData.images,
            description: formData.description,
            specs: buildSpecsArray(),
            stock: Number(formData.stock),
            sold: Number(formData.sold),
            cnbuy_link: formData.cnbuy_link || null,
            oichin_link: formData.oichin_link || null
        };

        try {
            if (editProduct) {
                await axios.put(`https://my-shop-api-p7kz.onrender.com/api/products/${editProduct.id}`, productData);
                showToast("Cập nhật thành công!", "success");
                setSavedProductId(editProduct.id);
            } else {
                const res = await axios.post("https://my-shop-api-p7kz.onrender.com/api/products", productData);
                showToast("Đăng sản phẩm thành công!", "success");
                setSavedProductId(res.data.id);
            }
            onCreated();
        } catch (err) {
            console.error(err);
            showToast("Lỗi xử lý!", "error");
        }
    };

    // ===== COMPACT MODE =====
    if (compact) {
        return (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter border-b pb-3">
                    {editProduct ? "🛠️ Chỉnh sửa sản phẩm" : "🚀 Đăng sản phẩm mới"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border p-2 rounded-lg text-sm" placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input className="border p-2 rounded-lg text-sm" placeholder="Giá" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    <select className="border p-2 rounded-lg text-sm" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input className="border p-2 rounded-lg text-sm" placeholder="Ảnh đại diện URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                </div>

                {/* 4 thông số kỹ thuật */}
                <div className="grid grid-cols-2 gap-4">
                    <input className="border p-2 rounded-lg text-sm" placeholder="Thương hiệu" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                    <input className="border p-2 rounded-lg text-sm" placeholder="Chất liệu" value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} />
                    <input className="border p-2 rounded-lg text-sm" placeholder="Chức năng" value={formData.function} onChange={e => setFormData({ ...formData, function: e.target.value })} />
                    <input className="border p-2 rounded-lg text-sm" placeholder="Kích thước" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} />
                </div>

                {/* Stock và Sold */}
                <div className="grid grid-cols-2 gap-4">
                    <input className="border p-2 rounded-lg text-sm" placeholder="Số lượng tồn kho" type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} />
                    <input className="border p-2 rounded-lg text-sm" placeholder="Số lượng đã bán" type="number" min="0" value={formData.sold} onChange={e => setFormData({ ...formData, sold: parseInt(e.target.value) || 0 })} />
                </div>

                {/* Hiển thị link CNBUY và OICHIN (chỉ xem, không sửa) */}
                {formData.cnbuy_link && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Link CNBUY:</label>
                        <a href={formData.cnbuy_link} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-500 hover:text-blue-700 truncate">
                            {formData.cnbuy_link}
                        </a>
                    </div>
                )}
                {formData.oichin_link && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Link OICHIN:</label>
                        <a href={formData.oichin_link} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-500 hover:text-blue-700 truncate">
                            {formData.oichin_link}
                        </a>
                    </div>
                )}

                {/* Ảnh chi tiết - dùng textarea */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Ảnh chi tiết (cách nhau bởi dấu phẩy):</label>
                    <textarea
                        rows="3"
                        className="w-full border p-2 rounded-lg text-sm resize-y"
                        placeholder="URL1, URL2, URL3..."
                        value={Array.isArray(formData.images) ? formData.images.join(", ") : ""}
                        onChange={e => setFormData({ ...formData, images: e.target.value.split(",").map(img => img.trim()) })}
                    />
                </div>
                <textarea className="w-full border p-2 rounded-lg text-sm h-24" placeholder="Mô tả sản phẩm" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-slate-900 text-white p-3 rounded-xl font-bold uppercase text-xs hover:bg-pink-600 transition-all">
                        {editProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
                    </button>
                    {editProduct && (
                        <button type="button" onClick={() => setEditProduct(null)} className="bg-gray-100 px-4 rounded-xl font-bold text-xs">Hủy</button>
                    )}
                </div>

                {/* VariantManager - chỉ hiển thị khi đã có productId */}
                {savedProductId && (
                    <div className="mt-6 border-t pt-4">
                        <VariantManager productId={savedProductId} />
                    </div>
                )}
            </form>
        );
    }

    // ===== FULL MODE =====
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="Nhập tên sản phẩm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) *</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="Nhập giá" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                    <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (URL)</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                </div>
            </div>

            {/* 4 thông số kỹ thuật */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">🏷️ Thương hiệu</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="VD: FleshLight, Manmiao, Leten..." value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">🧪 Chất liệu</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="VD: Silicone, TPE, SuperSkin..." value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">⚡ Chức năng</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="VD: Rung, Xoay, Sưởi ấm..." value={formData.function} onChange={e => setFormData({ ...formData, function: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📏 Kích thước</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="VD: 90 x 250 mm, 15cm..." value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} />
                </div>
            </div>

            {/* Stock và Sold */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📦 Số lượng tồn kho</label>
                    <input
                        type="number"
                        min="0"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📈 Số lượng đã bán</label>
                    <input
                        type="number"
                        min="0"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                        value={formData.sold}
                        onChange={e => setFormData({ ...formData, sold: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </div>

            {/* Hiển thị link CNBUY và OICHIN (chỉ xem, không sửa) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.cnbuy_link && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">🔗 Link CNBUY</label>
                        <a
                            href={formData.cnbuy_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 break-all"
                        >
                            {formData.cnbuy_link}
                        </a>
                        <p className="text-xs text-gray-400 mt-1">(Chỉ xem, không sửa được trong form)</p>
                    </div>
                )}
                {formData.oichin_link && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">🔗 Link OICHIN</label>
                        <a
                            href={formData.oichin_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 break-all"
                        >
                            {formData.oichin_link}
                        </a>
                        <p className="text-xs text-gray-400 mt-1">(Chỉ xem, không sửa được trong form)</p>
                    </div>
                )}
            </div>

            {/* Ảnh chi tiết - dùng textarea */}
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">🖼️ Ảnh chi tiết (cách nhau bởi dấu phẩy)</label>
                    <textarea
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-y"
                        placeholder="URL1, URL2, URL3..."
                        value={Array.isArray(formData.images) ? formData.images.join(", ") : ""}
                        onChange={e => setFormData({ ...formData, images: e.target.value.split(",").map(img => img.trim()) })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📝 Mô tả sản phẩm</label>
                    <textarea className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" rows="5" placeholder="Mô tả chi tiết sản phẩm..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all">
                    {editProduct ? "💾 Lưu thay đổi" : "➕ Thêm sản phẩm"}
                </button>
                {editProduct && (
                    <button type="button" onClick={() => setEditProduct(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all">
                        ❌ Hủy chỉnh sửa
                    </button>
                )}
            </div>

            {/* VariantManager - chỉ hiển thị khi đã có productId */}
            {savedProductId && (
                <div className="mt-6 border-t pt-6">
                    <VariantManager productId={savedProductId} />
                </div>
            )}
        </form>
    );
}

export default ProductEditor;