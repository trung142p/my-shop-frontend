import { useState } from "react";
import axios from "axios";

const categories = [
    { id: "am-dao-gia", name: "Âm đạo giả" }, { id: "duong-vat-gia", name: "Dương vật giả" },
    { id: "coc-thu-dam", name: "Cốc thủ dâm" }, { id: "trung-rung", name: "Trứng rung tình yêu" },
    { id: "may-thu-dam", name: "Máy thủ dâm bú mút" }, { id: "may-massage", name: "Máy massage tình yêu" },
    { id: "vong-deo", name: "Vòng đeo dương vật" }, { id: "do-choi-hau-mon", name: "Đồ chơi hậu môn" },
    { id: "may-tap", name: "Máy tập dương vật" }, { id: "do-choi-sm", name: "Đồ chơi SM" },
    { id: "bao-cao-su", name: "Bao cao su" }, { id: "do-lot", name: "Đồ lót sexy" },
    { id: "gel-boi-tron", name: "Gel bôi trơn" }
];

function ProductEditor({ onCreated }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "", price: "", description: "", category: "am-dao-gia",
        brand: "", material: "", function: "", size: ""
    });
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Upload ảnh trước (Giữ nguyên logic của bạn)
            const imgData = new FormData();
            imgData.append("image", image);
            const uploadRes = await axios.post("https://my-shop-api-p7kz.onrender.com/api/products/upload", imgData);
            const imageUrl = uploadRes.data.imageUrl;

            // 2. Tạo sản phẩm với đầy đủ thông tin mới
            const token = localStorage.getItem("adminToken");
            await axios.post(
                "https://my-shop-api-p7kz.onrender.com/api/products",
                { ...formData, coverImage: imageUrl, price: Number(formData.price) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Đã đăng sản phẩm thành công!");
            onCreated(); // Load lại danh sách sản phẩm ở bên phải
        } catch (err) {
            console.error(err);
            alert("Lỗi khi tạo sản phẩm. Kiểm tra lại ảnh hoặc Server.");
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-5 text-gray-800 border-b pb-2">Thêm sản phẩm mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full border p-2 rounded shadow-sm" placeholder="Tên sản phẩm" required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                <div className="grid grid-cols-2 gap-3">
                    <input type="number" className="border p-2 rounded shadow-sm" placeholder="Giá bán" required
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    <select className="border p-2 rounded shadow-sm bg-gray-50"
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <input className="border p-2 rounded text-sm" placeholder="Thương hiệu" onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                    <input className="border p-2 rounded text-sm" placeholder="Chất liệu" onChange={(e) => setFormData({ ...formData, material: e.target.value })} />
                    <input className="border p-2 rounded text-sm" placeholder="Kích thước" onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
                    <input className="border p-2 rounded text-sm" placeholder="Chức năng" onChange={(e) => setFormData({ ...formData, function: e.target.value })} />
                </div>

                <textarea className="w-full border p-2 rounded h-24 shadow-sm" placeholder="Mô tả chi tiết sản phẩm..."
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Hình ảnh sản phẩm:</p>
                    <input type="file" required onChange={(e) => setImage(e.target.files[0])} className="text-sm" />
                </div>

                <button type="submit" disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold text-white transition shadow-lg ${loading ? 'bg-gray-400' : 'bg-pink-600 hover:bg-pink-700'}`}>
                    {loading ? "ĐANG TẢI LÊN..." : "ĐĂNG SẢN PHẨM NGAY"}
                </button>
            </form>
        </div>
    );
}
export default ProductEditor;