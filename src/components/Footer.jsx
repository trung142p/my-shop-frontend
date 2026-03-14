// src/components/Footer.jsx
import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Cột 1: Trung tâm hỗ trợ */}
                <div>
                    <h4 className="text-white text-lg font-bold mb-4">TRUNG TÂM HỖ TRỢ</h4>
                    <div className="space-y-2">
                        <p>Hotline: <span className="text-pink-500 font-bold">0792131283</span></p>
                        <p>Email: vohoangphuc112280@gmail.com</p>
                        <div className="flex space-x-4 mt-4">
                            {/* Bạn sẽ thay src ảnh bằng icon thực tế sau */}
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">Zalo</div>
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">Mail</div>
                        </div>
                    </div>
                </div>

                {/* Cột 2: Địa chỉ */}
                <div>
                    <h4 className="text-white text-lg font-bold mb-4">ĐỊA CHỈ</h4>
                    <p className="mb-4">📍 Xã Giồng Trôm, Vĩnh Long</p>
                    {/* Bản đồ */}
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15679.5!2d106.0!3d10.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1600000000000"
                        className="w-full h-32 rounded border-0"
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>

                {/* Cột 3: Về chúng tôi */}
                <div>
                    <h4 className="text-white text-lg font-bold mb-4">VỀ CHÚNG TÔI</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-pink-500 transition">Giới thiệu</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition">Liên hệ</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition">Chính sách bảo mật</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition">Chính sách đổi trả</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition">Hướng dẫn mua hàng</a></li>
                    </ul>
                </div>

                {/* Cột 4: Phương thức */}
                <div>
                    <h4 className="text-white text-lg font-bold mb-4">PHƯƠNG THỨC THANH TOÁN</h4>
                    <div className="flex space-x-2 mb-6">
                        <span className="px-2 py-1 bg-white text-blue-800 text-xs font-bold rounded">VNPay</span>
                        <span className="px-2 py-1 bg-pink-600 text-white text-xs font-bold rounded">MoMo</span>
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">ZaloPay</span>
                    </div>

                    <h4 className="text-white text-lg font-bold mb-4">ĐỐI TÁC VẬN CHUYỂN</h4>
                    <div className="flex space-x-2 text-xs">
                        <span className="px-2 py-1 bg-gray-700 rounded">GHTK</span>
                        <span className="px-2 py-1 bg-gray-700 rounded">Viettel Post</span>
                        <span className="px-2 py-1 bg-gray-700 rounded">Ahamove</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;