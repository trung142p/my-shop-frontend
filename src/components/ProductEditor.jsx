import { useState, useEffect } from "react";
import axios from "axios";

const categories = ["Âm đạo giả", "Dương vật giả", "Cốc thủ dâm", "Trứng rung tình yêu", "Máy thủ dâm bú mút", "Máy massage tình yêu", "Vòng đeo dương vật", "Đồ chơi hậu môn", "Máy tập dương vật", "Đồ chơi SM", "Bao cao su", "Đồ lot sexy", "Gel bôi trơn"];

function ProductEditor({ onCreated, editProduct, setEditProduct }) {
    const [formData, setFormData] = useState({ name: "", price: "", category: categories[0], brand: "", material: "", function: "", size: "", description: "" });
    const [mainImage, setMainImage] = useState(null);
    const [subImages, setSubImages] = useState([]);

    useEffect(() => {
        if (editProduct) setFormData(editProduct);
    }, [editProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        try {
            let finalImageUrl = formData.coverImage;

            // Nếu có chọn ảnh mới thì mới upload
            if (mainImage) {
                const imgData = new FormData();
                imgData.append("image", mainImage);
                const uploadRes = await axios.post("https://my-shop-api-p7kz.onrender.com/api/products/upload", imgData);
                finalImageUrl = uploadRes.data.imageUrl;
            }

            const payload = { ...formData, coverImage: finalImageUrl, price: Number(formData.price) };

            if (editProduct) {
                await axios.put(`https://my-shop-api-p7kz.onrender.com/api/products/${editProduct._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("https://my-shop-api-p7kz.onrender.com/api/products", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            alert("Thành công!");
            setEditProduct(null);
            setMainImage(null);
            onCreated();
        } catch (err) { alert("Lỗi xử lý sản phẩm"); }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow border space-y-3 sticky top-20">
            <h3 className="font-bold text-pink-600 border-b pb-2 uppercase">{editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
            <input className="w-full border p-2 rounded" placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-2">
                <input className="border p-2 rounded" placeholder="Giá" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                <select className="border p-2 rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <input className="border p-2 rounded" placeholder="Thương hiệu" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Chất liệu" value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Kích thước" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Chức năng" value={formData.function} onChange={e => setFormData({ ...formData, function: e.target.value })} />
            </div>
            <textarea className="w-full border p-2 rounded h-20" placeholder="Mô tả" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <div>
                <label className="text-[10px] font-bold block mb-1">ẢNH CHÍNH:</label>
                <input type="file" onChange={e => setMainImage(e.target.files[0])} className="text-xs" />
            </div>
            <button type="submit" className={`w-full py-2 rounded text-white font-bold uppercase ${editProduct ? 'bg-orange-500' : 'bg-pink-600'}`}>
                {editProduct ? "Lưu thay đổi" : "Đăng sản phẩm"}
            </button>
            {editProduct && <button type="button" onClick={() => setEditProduct(null)} className="w-full text-gray-400 text-xs mt-2 underline">Hủy sửa</button>}
        </form>
    );
}
export default ProductEditor;