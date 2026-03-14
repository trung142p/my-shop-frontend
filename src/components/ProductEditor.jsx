import { useState } from "react";
import axios from "axios";

function ProductEditor({ onCreated }) {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = async () => {

        try {

            // upload ảnh
            const formData = new FormData();
            formData.append("image", image);

            const uploadRes = await axios.post(
                "https://my-shop-api-p7kz.onrender.com/api/products/upload",
                formData
            );

            const imageUrl = uploadRes.data.imageUrl;

            // tạo sản phẩm
            const token = localStorage.getItem("adminToken");

            await axios.post(
                "https://my-shop-api-p7kz.onrender.com/api/products",
                {
                    name,
                    price,
                    description,
                    coverImage: imageUrl
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Tạo sản phẩm thành công");

            onCreated();

        } catch (err) {

            console.log(err);
            alert("Lỗi tạo sản phẩm");

        }

    };

    return (

        <div className="border p-6 mb-10">

            <h2 className="text-xl font-bold mb-4">
                Thêm sản phẩm
            </h2>

            <input
                className="border p-2 w-full mb-3"
                placeholder="Tên sản phẩm"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                className="border p-2 w-full mb-3"
                placeholder="Giá"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            <textarea
                className="border p-2 w-full mb-3"
                placeholder="Mô tả sản phẩm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <input
                type="file"
                className="mb-3"
                onChange={(e) => setImage(e.target.files[0])}
            />

            <button
                onClick={handleSubmit}
                className="bg-black text-white px-6 py-2"
            >
                Đăng sản phẩm
            </button>

        </div>

    );

}

export default ProductEditor;