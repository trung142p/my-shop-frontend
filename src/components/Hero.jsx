import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-black h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image với overlay gradient */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/ddivnd5nh/image/upload/v1773420713/oichin-store-inside-2048x1150_dirxtx.png"
          alt="Banner Shop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Nội dung */}
      <div className="relative h-full flex items-center max-w-7xl mx-auto px-4">
        <div className="text-white max-w-2xl animate-fade-in-up">
          <div className="inline-block px-3 py-1 bg-pink-500/20 backdrop-blur-sm rounded-full text-pink-300 text-sm mb-4">
            ✨ Khuyến mãi lên đến 30% ✨
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            THIÊN ĐƯỜNG <br />
            <span className="text-pink-500">CẢM XÚC</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-xl">
            Khám phá bộ sưu tập đồ chơi người lớn cao cấp, bảo mật thông tin 100%,
            giao hàng kín đáo trong vòng 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/products")}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-pink-500/25"
            >
              MUA NGAY
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("featured-products");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold transition-all"
            >
              KHÁM PHÁ
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full mt-2 animate-ping"></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;