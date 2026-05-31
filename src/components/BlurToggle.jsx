import React from "react";
import { useBlur } from "../context/BlurContext";

function BlurToggle() {
    const { isBlurred, toggleBlur } = useBlur();

    return (
        <button
            onClick={toggleBlur}
            className="relative group"
            title={isBlurred ? "Bật chế độ hiển thị bình thường" : "Bật chế độ làm mờ nội dung nhạy cảm"}
        >
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${isBlurred
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    : "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/50"
                }`}>
                <span className="text-base">
                    {isBlurred ? "👁️‍🗨️" : "🔞"}
                </span>
                <span className="text-xs font-medium hidden sm:inline">
                    {isBlurred ? "Hiển thị" : "Ẩn đồi trụy"}
                </span>
            </div>
        </button>
    );
}

export default BlurToggle;