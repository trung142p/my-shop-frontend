import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

function VariantManager({ productId }) {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingVariant, setEditingVariant] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        sku: "",
        image: ""
    });
    const { showToast } = useToast();

    const fetchVariants = async () => {
        if (!productId) return;
        setLoading(true);
        try {
            const res = await axios.get(`https://my-shop-api-p7kz.onrender.com/api/products/${productId}/variants`);
            setVariants(res.data);
        } catch (err) {
            console.error("Lỗi lấy variants:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVariants();
    }, [productId]);

    const resetForm = () => {
        setFormData({ name: "", price: "", stock: "", sku: "", image: "" });
        setEditingVariant(null);
    };

    const handleCreate = async (e) => {
        e.preventDefault();  // 🔧 QUAN TRỌNG: chặn refresh trang
        if (isSubmitting) return; // Chống submit nhiều lần

        if (!formData.name.trim()) {
            showToast("Vui lòng nhập tên biến thể!", "warning");
            return;
        }

        setIsSubmitting(true);

        try {
            const variantData = {
                name: formData.name.trim(),
                price: formData.price ? parseInt(formData.price) : null,
                stock: formData.stock ? parseInt(formData.stock) : 0,
                sku: formData.sku?.trim() || null,
                image: formData.image?.trim() || null
            };

            const res = await axios.post(
                `https://my-shop-api-p7kz.onrender.com/api/products/${productId}/variants`,
                variantData
            );
            setVariants([...variants, res.data]);
            resetForm();
            showToast("Thêm biến thể thành công!", "success");
        } catch (err) {
            console.error(err);
            showToast("Lỗi khi thêm biến thể!", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();  // 🔧 QUAN TRỌNG: chặn refresh trang
        if (isSubmitting) return;

        if (!formData.name.trim()) {
            showToast("Vui lòng nhập tên biến thể!", "warning");
            return;
        }

        setIsSubmitting(true);

        try {
            const variantData = {
                name: formData.name.trim(),
                price: formData.price ? parseInt(formData.price) : null,
                stock: formData.stock ? parseInt(formData.stock) : 0,
                sku: formData.sku?.trim() || null,
                image: formData.image?.trim() || null
            };

            const res = await axios.put(
                `https://my-shop-api-p7kz.onrender.com/api/products/variants/${editingVariant.id}`,
                variantData
            );
            setVariants(variants.map(v => v.id === editingVariant.id ? res.data : v));
            resetForm();
            showToast("Cập nhật biến thể thành công!", "success");
        } catch (err) {
            console.error(err);
            showToast("Lỗi khi cập nhật biến thể!", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (variant) => {
        if (!window.confirm(`Xóa biến thể "${variant.name}"?`)) return;

        try {
            await axios.delete(`https://my-shop-api-p7kz.onrender.com/api/products/variants/${variant.id}`);
            setVariants(variants.filter(v => v.id !== variant.id));
            showToast("Xóa biến thể thành công!", "success");
        } catch (err) {
            console.error(err);
            showToast("Lỗi khi xóa biến thể!", "error");
        }
    };

    const handleEdit = (variant) => {
        setEditingVariant(variant);
        setFormData({
            name: variant.name || "",
            price: variant.price || "",
            stock: variant.stock || "",
            sku: variant.sku || "",
            image: variant.image || ""
        });
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🎨 Biến thể sản phẩm</h3>
            <p className="text-sm text-gray-500 mb-4">
                Thêm các biến thể như: màu sắc, kích thước, loại sản phẩm...
            </p>

            <form onSubmit={editingVariant ? handleUpdate : handleCreate} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                        type="text"
                        placeholder="Tên biến thể (VD: Màu đen)"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border p-2 rounded-lg text-sm"
                        required
                        disabled={isSubmitting}
                    />
                    <input
                        type="number"
                        placeholder="Giá (để trống nếu bằng giá gốc)"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="border p-2 rounded-lg text-sm"
                        disabled={isSubmitting}
                    />
                    <input
                        type="number"
                        placeholder="Tồn kho"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="border p-2 rounded-lg text-sm"
                        disabled={isSubmitting}
                    />
                    <input
                        type="text"
                        placeholder="Mã SKU (tùy chọn)"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="border p-2 rounded-lg text-sm"
                        disabled={isSubmitting}
                    />
                    <input
                        type="text"
                        placeholder="🔗 Ảnh biến thể (URL)"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="border p-2 rounded-lg text-sm"
                        disabled={isSubmitting}
                    />
                </div>
                <div className="flex gap-2 mt-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? "Đang xử lý..." : (editingVariant ? "💾 Cập nhật" : "➕ Thêm biến thể")}
                    </button>
                    {editingVariant && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            ❌ Hủy
                        </button>
                    )}
                </div>
            </form>

            {loading ? (
                <div className="text-center py-4 text-gray-500">Đang tải...</div>
            ) : variants.length === 0 ? (
                <div className="text-center py-4 text-gray-400 border border-dashed rounded-lg">
                    Chưa có biến thể nào. Hãy thêm biến thể đầu tiên!
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Ảnh</th>
                                <th className="p-2 text-left">Tên biến thể</th>
                                <th className="p-2 text-left">Giá</th>
                                <th className="p-2 text-left">Tồn kho</th>
                                <th className="p-2 text-left">SKU</th>
                                <th className="p-2 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variants.map((variant) => (
                                <tr key={variant.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">
                                        {variant.image ? (
                                            <img
                                                src={variant.image}
                                                alt={variant.name}
                                                className="w-10 h-10 object-cover rounded"
                                                onError={(e) => { e.target.src = "https://placehold.co/40x40?text=No+Image"; }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                                Ảnh
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-2 font-medium">{variant.name}</td>
                                    <td className="p-2">
                                        {variant.price ? `${variant.price.toLocaleString()}₫` : 'Giá gốc'}
                                    </td>
                                    <td className="p-2">{variant.stock || 0}</td>
                                    <td className="p-2 text-gray-500">{variant.sku || '—'}</td>
                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => handleEdit(variant)}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(variant)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default VariantManager;