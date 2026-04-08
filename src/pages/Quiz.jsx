import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";

function Quiz() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({});
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ============ ĐỊNH NGHĨA CÂU HỎI ============

    // Câu hỏi cơ bản (dùng chung)
    const basicQuestions = {
        1: {
            text: "Giới tính của bạn là?",
            options: [
                { value: "male", label: "👨 Nam" },
                { value: "female", label: "👩 Nữ" },
                { value: "other", label: "🤫 Khác / Không muốn tiết lộ" }
            ]
        },
        2: {
            text: "Bạn đang tìm kiếm sản phẩm cho?",
            options: [
                { value: "self", label: "👤 Bản thân" },
                { value: "gift", label: "🎁 Người khác (tặng quà)" }
            ]
        },
        3: {
            text: "Bạn quan tâm đến sản phẩm dành cho?",
            options: [
                { value: "male", label: "👨 Nam - Sản phẩm dành cho nam" },
                { value: "female", label: "👩 Nữ - Sản phẩm dành cho nữ" }
            ]
        }
    };

    // Câu hỏi dành cho nhánh NAM
    const maleQuestions = {
        4: {
            text: "Mục đích sử dụng chính của bạn là gì?",
            options: [
                { value: "solo", label: "🎯 Thủ dâm cá nhân - Tăng cường khoái cảm khi solo" },
                { value: "enhance", label: "💪 Tăng cường sinh lý - Cải thiện chức năng, kéo dài thời gian" },
                { value: "couple", label: "❤️ Làm mới trải nghiệm tình dục với bạn tình" },
                { value: "curious", label: "🌟 Khám phá, tò mò - Lần đầu sử dụng đồ chơi" }
            ]
        },
        5: {
            text: "Trải nghiệm cảm giác bạn mong muốn?",
            options: [
                { value: "realistic", label: "🎯 Chân thật như thật - Cảm giác giống quan hệ thật" },
                { value: "intense", label: "⚡ Kích thích mạnh mẽ - Rung, xoay, hút, co bóp" },
                { value: "gentle", label: "🌸 Nhẹ nhàng, êm ái - Thư giãn, không quá mạnh" },
                { value: "variety", label: "🎨 Đa dạng - Muốn thử nhiều kiểu khác nhau" }
            ]
        },
        6: {
            text: "Kích thước bạn mong muốn?",
            options: [
                { value: "small", label: "📦 Nhỏ gọn (dưới 12cm) - Dễ cất giấu, dễ mang theo" },
                { value: "medium", label: "📏 Trung bình (12-16cm) - Phổ biến, phù hợp đa số" },
                { value: "large", label: "🔥 Lớn (16-20cm) - Cảm giác đầy, mạnh mẽ" },
                { value: "xlarge", label: "💪 Rất lớn (trên 20cm) - Trải nghiệm extreme" },
                { value: "any", label: "🤷 Không quan trọng" }
            ]
        },
        7: {
            text: "Tính năng đặc biệt bạn muốn? (Chọn 1 ưu tiên nhất)",
            options: [
                { value: "vibration", label: "📳 Rung động - Nhiều chế độ rung khác nhau" },
                { value: "heating", label: "🔥 Sưởi ấm - Làm nóng như thân nhiệt thật" },
                { value: "waterproof", label: "💧 Chống nước - Dùng được trong phòng tắm" },
                { value: "remote", label: "📱 Điều khiển từ xa / App - Tương tác từ xa" },
                { value: "auto", label: "🔄 Tự động chuyển động / Xoay / Hút" },
                { value: "none", label: "❌ Không cần tính năng đặc biệt" }
            ]
        },
        8: {
            text: "Ngân sách dự kiến của bạn?",
            options: [
                { value: "budget_low", label: "💰 Dưới 500.000đ - Tiết kiệm, trải nghiệm cơ bản" },
                { value: "budget_medium", label: "💰💰 500.000đ - 1.500.000đ - Tầm trung, chất lượng tốt" },
                { value: "budget_high", label: "💰💰💰 1.500.000đ - 3.000.000đ - Cao cấp, nhiều tính năng" },
                { value: "budget_premium", label: "👑 Trên 3.000.000đ - Premium, búp bê, công nghệ cao" }
            ]
        }
    };

    // Câu hỏi dành cho nhánh NỮ
    const femaleQuestions = {
        4: {
            text: "Mục đích sử dụng chính của bạn là gì?",
            options: [
                { value: "solo", label: "🎯 Tự sướng cá nhân - Thỏa mãn nhu cầu khi ở một mình" },
                { value: "couple", label: "❤️ Tăng cường khoái cảm khi quan hệ với bạn tình" },
                { value: "curious", label: "🌟 Khám phá cơ thể - Lần đầu dùng đồ chơi" },
                { value: "gift", label: "🎁 Quà tặng cho bạn trai / bạn gái" }
            ]
        },
        5: {
            text: "Loại sản phẩm bạn quan tâm?",
            options: [
                { value: "penetrative", label: "🔞 Dạng xâm nhập - Dương vật giả, cảm giác đầy" },
                { value: "external", label: "✨ Dạng kích thích bên ngoài - Trứng rung, máy massage điểm G" },
                { value: "dual", label: "🔄 Dạng kích thích kép - Kích thích cả âm đạo và âm vật" },
                { value: "enhancement", label: "💖 Dạng nâng cao cảm giác - Gel bôi trơn, đồ lót sexy" },
                { value: "bdsm", label: "⛓️ Dạng BDSM / SM - Trói buộc, roi, kẹp, đồ chơi mạo hiểm" }
            ]
        },
        6: {
            text: "Mức độ rung bạn mong muốn?",
            options: [
                { value: "gentle", label: "🌸 Nhẹ nhàng, êm ái - Rung nhẹ, thư giãn" },
                { value: "medium", label: "⚡ Vừa phải - Rung đủ mạnh để kích thích" },
                { value: "strong", label: "💥 Mạnh, dữ dội - Rung mạnh, cao trào nhanh" },
                { value: "none", label: "❌ Không cần rung - Ưu tiên hình dáng, chất liệu" },
                { value: "variety", label: "🎨 Đa dạng - Muốn nhiều chế độ rung khác nhau" }
            ]
        },
        7: {
            text: "Tính năng đặc biệt bạn muốn? (Chọn 1 ưu tiên nhất)",
            options: [
                { value: "waterproof", label: "💧 Chống nước - Dùng trong phòng tắm, dễ vệ sinh" },
                { value: "heating", label: "🔥 Sưởi ấm - Cảm giác chân thật như người thật" },
                { value: "remote", label: "📱 Điều khiển từ xa - Bạn tình có thể điều khiển" },
                { value: "none", label: "❌ Không cần tính năng đặc biệt" }
            ]
        },
        8: {
            text: "Ngân sách dự kiến của bạn?",
            options: [
                { value: "budget_low", label: "💰 Dưới 500.000đ - Tiết kiệm, trải nghiệm cơ bản" },
                { value: "budget_medium", label: "💰💰 500.000đ - 1.500.000đ - Tầm trung, chất lượng tốt" },
                { value: "budget_high", label: "💰💰💰 1.500.000đ - 3.000.000đ - Cao cấp, nhiều tính năng" },
                { value: "budget_premium", label: "👑 Trên 3.000.000đ - Premium, búp bê, công nghệ cao" }
            ]
        }
    };

    // Xác định câu hỏi hiện tại dựa trên step và gender
    const getCurrentQuestion = () => {
        // Bước 1-3: câu hỏi cơ bản
        if (step <= 3) {
            return basicQuestions[step];
        }

        const gender = answers[3];

        if (gender === "male") {
            return maleQuestions[step];
        } else if (gender === "female") {
            return femaleQuestions[step];
        }

        return null;
    };

    const currentQuestion = getCurrentQuestion();
    const gender = answers[3];
    const totalSteps = gender === "male" || gender === "female" ? 8 : 3;

    // Xử lý khi chọn đáp án
    const handleAnswer = (value, option = {}) => {
        const newAnswers = { ...answers, [step]: value };
        setAnswers(newAnswers);

        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            // Hoàn thành quiz, tìm sản phẩm
            findProducts(newAnswers);
        }
    };

    // Tìm sản phẩm dựa trên câu trả lời
    const findProducts = async (finalAnswers) => {
        setIsLoading(true);
        try {
            const res = await axios.get("https://my-shop-api-p7kz.onrender.com/api/products");
            let products = res.data.filter(p => !p.is_hidden);

            const gender = finalAnswers[3];

            if (gender === "male") {
                // Danh mục sản phẩm cho nam
                const maleCategories = ["Âm đạo giả", "Cốc thủ dâm", "Máy thủ dâm bú mút", "Vòng đeo dương vật", "Máy tập dương vật"];
                products = products.filter(p => maleCategories.includes(p.category));

                // Lọc theo mục đích (câu 4)
                const purpose = finalAnswers[4];
                if (purpose === "solo") {
                    // Giữ nguyên filter
                } else if (purpose === "enhance") {
                    products = products.filter(p => p.category === "Vòng đeo dương vật" || p.category === "Máy tập dương vật");
                } else if (purpose === "couple") {
                    products = products.filter(p => p.name.includes("điều khiển") || p.name.includes("rung"));
                } else if (purpose === "curious") {
                    products = products.filter(p => p.price < 500000);
                }

                // Lọc theo cảm giác (câu 5)
                const feeling = finalAnswers[5];
                if (feeling === "realistic") {
                    products = products.filter(p => p.category === "Âm đạo giả");
                } else if (feeling === "intense") {
                    products = products.filter(p => p.category === "Máy thủ dâm bú mút" || p.category === "Cốc thủ dâm");
                } else if (feeling === "gentle") {
                    products = products.filter(p => p.category === "Trứng rung tình yêu" || p.category === "Gel bôi trơn");
                }

                // Lọc theo ngân sách (câu 8)
                const budget = finalAnswers[8];
                if (budget === "budget_low") {
                    products = products.filter(p => p.price < 500000);
                } else if (budget === "budget_medium") {
                    products = products.filter(p => p.price >= 500000 && p.price <= 1500000);
                } else if (budget === "budget_high") {
                    products = products.filter(p => p.price >= 1500000 && p.price <= 3000000);
                } else if (budget === "budget_premium") {
                    products = products.filter(p => p.price >= 3000000);
                }

                // Lọc theo tính năng (câu 7)
                const feature = finalAnswers[7];
                if (feature === "vibration") {
                    products = products.filter(p => p.name.includes("rung") || p.function?.includes("rung"));
                } else if (feature === "heating") {
                    products = products.filter(p => p.name.includes("sưởi") || p.function?.includes("sưởi"));
                } else if (feature === "waterproof") {
                    products = products.filter(p => p.name.includes("chống nước") || p.function?.includes("chống nước"));
                } else if (feature === "remote") {
                    products = products.filter(p => p.name.includes("điều khiển") || p.function?.includes("điều khiển"));
                }

            } else if (gender === "female") {
                // Danh mục sản phẩm cho nữ
                const femaleCategories = ["Dương vật giả", "Máy massage tình yêu", "Trứng rung tình yêu", "Gel bôi trơn", "Đồ lót sexy", "Đồ chơi SM"];
                products = products.filter(p => femaleCategories.includes(p.category));

                // Lọc theo loại sản phẩm (câu 5)
                const productType = finalAnswers[5];
                if (productType === "penetrative") {
                    products = products.filter(p => p.category === "Dương vật giả");
                } else if (productType === "external") {
                    products = products.filter(p => p.category === "Máy massage tình yêu" || p.category === "Trứng rung tình yêu");
                } else if (productType === "enhancement") {
                    products = products.filter(p => p.category === "Gel bôi trơn" || p.category === "Đồ lót sexy");
                } else if (productType === "bdsm") {
                    products = products.filter(p => p.category === "Đồ chơi SM");
                }

                // Lọc theo ngân sách (câu 8)
                const budget = finalAnswers[8];
                if (budget === "budget_low") {
                    products = products.filter(p => p.price < 500000);
                } else if (budget === "budget_medium") {
                    products = products.filter(p => p.price >= 500000 && p.price <= 1500000);
                } else if (budget === "budget_high") {
                    products = products.filter(p => p.price >= 1500000 && p.price <= 3000000);
                } else if (budget === "budget_premium") {
                    products = products.filter(p => p.price >= 3000000);
                }
            }

            setRecommendedProducts(products.slice(0, 12));
            setShowResults(true);
        } catch (err) {
            console.error("Lỗi tìm sản phẩm:", err);
            showToast("Có lỗi xảy ra, vui lòng thử lại!", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset quiz
    const resetQuiz = () => {
        setStep(1);
        setAnswers({});
        setRecommendedProducts([]);
        setShowResults(false);
    };

    // Hàm lấy ảnh sản phẩm
    const getProductImage = (product) => {
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            const firstImage = product.images[0];
            if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== "") {
                return firstImage;
            }
        }
        if (product.image && product.image.trim() !== "") {
            return product.image;
        }
        return "https://placehold.co/400x400?text=No+Image";
    };

    // ============ HIỂN THỊ KẾT QUẢ ============
    if (showResults) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                        🎉 SẢN PHẨM GỢI Ý CHO BẠN
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Dựa trên nhu cầu của bạn, chúng tôi gợi ý {recommendedProducts.length} sản phẩm phù hợp
                    </p>
                </div>

                {recommendedProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy sản phẩm phù hợp</h3>
                        <p className="text-gray-500 mb-6">Vui lòng thử lại với lựa chọn khác</p>
                        <button
                            onClick={resetQuiz}
                            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
                        >
                            🔄 Làm lại trắc nghiệm
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {recommendedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <Link to={`/product/${product.id}`} className="block overflow-hidden">
                                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image"; }}
                                            />
                                        </div>
                                    </Link>
                                    <div className="p-4">
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 hover:text-pink-600 transition line-clamp-2 min-h-[3rem]">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xl font-bold text-pink-600 mt-2">
                                            {Number(product.price).toLocaleString()}₫
                                        </p>
                                        <Link to={`/product/${product.id}`}>
                                            <button className="mt-3 w-full bg-gray-900 dark:bg-gray-700 text-white py-2 rounded-xl hover:bg-pink-600 transition">
                                                Xem chi tiết
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <button
                                onClick={resetQuiz}
                                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                            >
                                🔄 Làm lại trắc nghiệm
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // ============ HIỂN THỊ CÂU HỎI ============
    if (!currentQuestion) {
        return <div className="text-center py-20">Đang tải...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Thanh tiến trình */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Câu hỏi {step}/{totalSteps}</span>
                        <span>{Math.round((step / totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Thẻ câu hỏi */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                        {currentQuestion.text}
                    </h2>

                    <div className="space-y-4">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option.value, option)}
                                disabled={isLoading}
                                className="w-full text-left p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-200 flex items-center gap-3"
                            >
                                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 font-bold">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nút bắt đầu lại */}
                <div className="text-center mt-6">
                    <button
                        onClick={resetQuiz}
                        className="text-gray-400 hover:text-gray-600 text-sm underline"
                    >
                        Bắt đầu lại
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Quiz;