import { useState, useEffect } from "react";
import axios from "axios";

const categories = ["Âm đạo giả", "Dương vật giả", "Cốc thủ dâm", "Trứng rung tình yêu", "Gel bôi trơn"];

function ProductEditor({ onCreated, editProduct, setEditProduct }) {
    const [formData, setFormData] = useState({ name: "", price: "", category: categories[0], image: "", images: [], description: "" });

    useEffect(() => {
        if (editProduct) setFormData({ ...editProduct, images: Array.isArray(editProduct.images) ? editProduct.images : [] });
        else setFormData({ name: "", price: "", category: categories[0], image: "", images: [], description: "" });
    }, [editProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editProduct
                ? `https://my-shop-api-p7kz.onrender.com/api/products/${editProduct.id}`
                : "https://my-shop-api-p7kz.onrender.com/api/products";

            await (editProduct ? axios.put(url, formData) : axios.post(url, formData));
            alert("Thành công!");
            setEditProduct(null);
            onCreated();
        } catch (err) { alert("Lỗi xử lý!"); }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h3 className="font-bold border-b pb-2">{editProduct ? "SỬA SẢN PHẨM" : "THÊM MỚI"}</h3>
            <input className="w-full border p-2 rounded" placeholder="Tên SP" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            <input className="w-full border p-2 rounded" type="number" placeholder="Giá" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
            <select className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input className="w-full border p-2 rounded" placeholder="URL Ảnh chính" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
            <textarea className="w-full border p-2 rounded" placeholder="Mô tả" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <button type="submit" className="w-full bg-slate-900 text-white p-3 rounded font-bold uppercase tracking-wider">Lưu lại</button>
            {editProduct && <button onClick={() => setEditProduct(null)} className="w-full text-gray-500 text-sm">Hủy bỏ</button>}
        </form>
    );
}
export default ProductEditor;