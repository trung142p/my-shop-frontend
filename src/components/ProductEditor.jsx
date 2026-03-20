import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const categories = ["Âm đạo giả", "Dương vật giả", "Cốc thủ dâm", "Trứng rung tình yêu", "Máy thủ dâm bú mút", "Máy massage tình yêu", "Vòng đeo dương vật", "Đồ chơi hậu môn", "Máy tập dương vật", "Đồ chơi SM", "Bao cao su", "Đồ lot sexy", "Gel bôi trơn"];

function ProductEditor({ onCreated, editProduct, setEditProduct, compact = false }) {
    const [formData, setFormData] = useState({
        name: "", price: "", category: categories[0],
        brand: "", material: "", function: "",
        size: "", description: "", image: "", images: []
    });

    const { showToast } = useToast();

    useEffect(() => {
        if (editProduct) {
            setFormData({
                ...editProduct,
                images: Array.isArray(editProduct.images) ? editProduct.images : []
            });
        } else {
            setFormData({ name: "", price: "", category: categories[0], brand: "", material: "", function: "", size: "", description: "", image: "", images: [] });
        }
    }, [editProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editProduct) {
                await axios.put(`https://my-shop-api-p7kz.onrender.com/api/products/${editProduct.id}`, formData);
                showToast("Cập nhật thành công!", "success");
                setEditProduct(null);
            } else {
                await axios.post("https://my-shop-api-p7kz.onrender.com/api/products", formData);
                showToast("Đăng sản phẩm thành công!", "success");
            }
            onCreated();
        } catch (err) {
            console.error(err);
            showToast("Lỗi xử lý!", "error");
        }
    };

    // Nếu compact = true (dùng trong sidebar cũ), giữ giao diện cũ
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
                    <input className="border p-2 rounded-lg text-sm" placeholder="Thương hiệu" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Ảnh đại diện (URL):</label>
                    <input className="w-full border p-2 rounded-lg text-sm" placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Ảnh chi tiết (cách nhau bởi dấu phẩy):</label>
                    <input className="w-full border p-2 rounded-lg text-sm" placeholder="URL1, URL2..." value={Array.isArray(formData.images) ? formData.images.join(", ") : ""} onChange={e => setFormData({ ...formData, images: e.target.value.split(",").map(img => img.trim()) })} />
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
            </form>
        );
    }

    // Giao diện mới: rộng rãi, form 2 cột
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="Nhập thương hiệu" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (URL)</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh chi tiết (cách nhau bởi dấu phẩy)</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="URL1, URL2, URL3..." value={Array.isArray(formData.images) ? formData.images.join(", ") : ""} onChange={e => setFormData({ ...formData, images: e.target.value.split(",").map(img => img.trim()) })} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
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
        </form>
    );
}

export default ProductEditor;