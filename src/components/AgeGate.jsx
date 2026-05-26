import React, { useState, useEffect } from "react";

function AgeGate({ children }) {
    const [isVerified, setIsVerified] = useState(false);
    const [showGate, setShowGate] = useState(false);

    useEffect(() => {
        // Kiểm tra xem đã xác nhận độ tuổi trong localStorage chưa
        const ageVerified = localStorage.getItem("ageVerified");
        const verifiedTime = localStorage.getItem("ageVerifiedTime");

        if (ageVerified === "true" && verifiedTime) {
            const hoursPassed = (Date.now() - parseInt(verifiedTime)) / (1000 * 60 * 60);
            // 🔧 SỬA: 24 giờ thay vì 720 giờ (30 ngày)
            if (hoursPassed < 24) {
                setIsVerified(true);
                setShowGate(false);
            } else {
                // Hết hạn (sau 24h), xóa localStorage và hiển thị lại
                localStorage.removeItem("ageVerified");
                localStorage.removeItem("ageVerifiedTime");
                setShowGate(true);
            }
        } else {
            setShowGate(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("ageVerified", "true");
        localStorage.setItem("ageVerifiedTime", Date.now().toString());
        setIsVerified(true);
        setShowGate(false);
    };

    const handleReject = () => {
        // Chuyển đến trang Google (hoặc trang thông báo "Không đủ tuổi")
        window.location.href = "https://www.google.com";
    };

    if (!showGate && isVerified) {
        return <>{children}</>;
    }

    if (showGate) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md">
                <div className="max-w-lg w-full mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl">🔞</span>
                            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                                Xác Nhận Độ Tuổi
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                            Trang web này bao gồm các sản phẩm và nội dung dành cho người trưởng thành
                            (ví dụ: đồ chơi tình dục, phụ kiện hỗ trợ sinh lý, gel bôi trơn, v.v.),
                            chỉ dành cho người từ <strong className="text-pink-600">18 tuổi trở lên</strong>
                            (hoặc đủ tuổi trưởng thành theo quy định pháp luật tại khu vực bạn đang truy cập).
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                            Bằng cách nhấn <strong className="text-green-600">"Tôi trên 18 tuổi"</strong>,
                            bạn xác nhận rằng mình đủ tuổi hợp pháp để truy cập nội dung người lớn
                            và đồng ý với Điều khoản sử dụng của chúng tôi.
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-3 mb-6">
                            <p className="text-amber-700 dark:text-amber-400 text-xs">
                                ⚠️ Nếu bạn chưa đủ 18 tuổi, vui lòng rời khỏi trang web ngay lập tức.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAccept}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">✅</span>
                                Tôi trên 18 tuổi - Tiếp tục
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">❌</span>
                                Tôi dưới 18 tuổi - Rời khỏi
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-center">
                        <p className="text-gray-400 text-[10px]">
                            Bằng việc tiếp tục, bạn đồng ý với
                            <a href="#" className="text-pink-500 hover:underline ml-1">Điều khoản sử dụng</a>
                            và <a href="#" className="text-pink-500 hover:underline ml-1">Chính sách bảo mật</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

export default AgeGate;