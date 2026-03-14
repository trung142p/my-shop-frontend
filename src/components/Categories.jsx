import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
    { id: 1, name: "Âm đạo giả", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421316/main-nav-am-dao-gia-160x160_p8brsw.png", path: "/category/am-dao-gia" },
    { id: 2, name: "Dương vật giả", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421273/main-nav-duong-vat-gia-1-160x160_uy8bev.png", path: "/category/duong-vat-gia" },
    { id: 3, name: "Cốc thủ dâm", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421251/main-nav-coc-thu-dam-1-160x160_bg6urf.png", path: "/category/coc-thu-dam" },
    { id: 4, name: "Trứng rung tình yêu", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421251/main-nav-trung-rung-tinh-yeu-160x160_kvwy09.png", path: "/category/trung-rung" },
    { id: 5, name: "Máy thủ dâm bú mút", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421251/main-nav-may-thu-dam-bu-mut-1-160x160_trbmhi.png", path: "/category/may-bu-mut" },
    { id: 6, name: "Máy massage tình yêu", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421250/main-nav-may-massage-tinh-yeu-160x160_dcf4po.png", path: "/category/may-massage" },
    { id: 7, name: "Vòng đeo dương vật", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421250/main-nav-vong-deo-duong-vat-160x160_rbsqqm.png", path: "/category/vong-deo" },
    { id: 8, name: "Đồ chơi hậu môn", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421249/main-nav-do-choi-hau-mon-160x160_qzz9vk.png", path: "/category/hau-mon" },
    { id: 9, name: "Máy tập dương vật", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421252/main-nav-may-tap-duong-vat-160x160_dtok0g.png", path: "/category/may-tap" },
    { id: 10, name: "Đồ chơi SM", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421253/main-nav-do-choi-bdsm-160x160_cju62y.png", path: "/category/sm" },
    { id: 11, name: "Bao cao su", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421249/main-nav-bao-cao-su-160x160_e3lmpp.png", path: "/category/bao-cao-su" },
    { id: 12, name: "Đồ lót sexy", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421249/main-nav-do-lot-sexy-160x160_ll3ppw.png", path: "/category/do-lot" },
    { id: 13, name: "Gel bôi trơn", image: "https://res.cloudinary.com/ddivnd5nh/image/upload/v1773421250/main-nav-gel-boi-tron-160x160_gkym4s.png", path: "/category/gel" },
];

function Categories() {
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-center mb-10 uppercase tracking-widest">
                Danh Mục <span className="text-pink-500">Sản Phẩm</span>
            </h2>

            {/* Grid hiển thị danh mục */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => navigate(cat.path)} // Khi nhấn vào sẽ chuyển trang
                        className="group cursor-pointer flex flex-col items-center"
                    >
                        {/* Khung chứa ảnh tròn hoặc vuông bo góc */}
                        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-pink-500 transition-all duration-300 shadow-sm group-hover:shadow-pink-200">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        {/* Tên danh mục */}
                        <h3 className="mt-3 text-[13px] font-bold text-gray-700 group-hover:text-pink-600 text-center uppercase tracking-tighter leading-tight h-10 flex items-center">
                            {cat.name}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Categories;