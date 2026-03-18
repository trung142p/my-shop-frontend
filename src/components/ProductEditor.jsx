import { useState, useEffect } from "react";
import axios from "axios";

const categories = ["Âm đạo giả", "Dương vật giả", "Cốc thủ dâm", "Trứng rung tình yêu", "Máy thủ dâm bú mút", "Máy massage tình yêu", "Vòng đeo dương vật", "Đồ chơi hậu môn", "Máy tập dương vật", "Đồ chơi SM", "Bao cao su", "Đồ lot sexy", "Gel bôi trơn"];

function ProductEditor({ onCreated, editProduct, setEditProduct }) {
    const [formData, setFormData] = useState({ name: "", price: "", category: categories[0], brand: "", material: "", function: "", size: "", description: "" });
    const [mainImage, setMainImage] = useState(null);
    const [subImages, setSubImages] = useState([]);

    useEffect(() => {
        if (editData) {
            setFormData({
                ...editData,
                images: Array.isArray(editData.images) ? editData.images : []
            });
        } else {
            setFormData({ name: "", price: "", description: "", category: "", image: "", images: [] });
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                // Gọi API PUT/PATCH để cập nhật
                await axios.put(`https://my-shop-api-p7kz.onrender.com/api/products/${editData.id}`, formData);
                alert("Cập nhật thành công!");
            } else {
                // Gọi API POST để thêm mới
                await axios.post("https://my-shop-api-p7kz.onrender.com/api/products", formData);
                alert("Đăng sản phẩm thành công!");
            }
            onCreated();
        } catch (err) { alert("Lỗi xử lý!"); }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Giá" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />

            {/* MỤC ẢNH ĐẠI DIỆN */}
            <div className="col-span-1">
                <label className="text-xs font-bold">Ảnh đại diện (Single):</label>
                <input className="w-full border p-2 rounded" placeholder="URL Image" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
            </div>

            {/* MỤC ẢNH CHI TIẾT */}
            <div className="col-span-1">
                <label className="text-xs font-bold">Ảnh chi tiết (Nhiều ảnh - cách nhau bởi dấu phẩy):</label>
                <input
                    className="w-full border p-2 rounded"
                    placeholder="URL1, URL2, URL3..."
                    value={Array.isArray(formData.images) ? formData.images.join(", ") : ""}
                    onChange={e => setFormData({ ...formData, images: e.target.value.split(",").map(img => img.trim()) })}
                />
            </div>

            <textarea className="col-span-2 border p-2 rounded" placeholder="Mô tả" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

            <div className="col-span-2 flex gap-2">
                <button type="submit" className="flex-1 bg-slate-900 text-white p-3 rounded-xl font-bold uppercase">
                    {editData ? "💾 Lưu sản phẩm" : "🚀 Đăng sản phẩm"}
                </button>
                {editData && (
                    <button type="button" onClick={onCancel} className="bg-gray-200 p-3 rounded-xl font-bold">Hủy</button>
                )}
            </div>
        </form>
    );
}
export default ProductEditor;