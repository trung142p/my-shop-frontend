import React from 'react';

function Hero() {
  return (
    <div className="relative bg-black h-[400px] md:h-[500px] overflow-hidden">
      {/* Hình nền Banner - Bạn có thể thay link ảnh xịn của bạn vào đây */}
      <img
        src="https://res.cloudinary.com/ddivnd5nh/image/upload/v1773420713/oichin-store-inside-2048x1150_dirxtx.png"
        alt="Banner Shop"
        className="w-full h-full object-cover opacity-60"
      />

      {/* Nội dung đè lên banner */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          THIÊN ĐƯỜNG <span className="text-pink-500">CẢM XÚC</span>
        </h1>
        <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-8">
          Khám phá bộ sưu tập đồ chơi người lớn cao cấp, bảo mật thông tin 100%, giao hàng kín đáo.
        </p>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">
          MUA NGAY TẠI ĐÂY
        </button>
      </div>
    </div>
  );
}

export default Hero;