import { useEffect } from "react";

function Toast({ message, type = "success", onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500",
    }[type];

    const icon = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ",
    }[type];

    return (
        <div className="fixed top-20 right-4 z-[100] animate-slide-in">
            <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px]`}>
                <span className="text-xl font-bold">{icon}</span>
                <span className="flex-1 text-sm">{message}</span>
                <button onClick={onClose} className="text-white hover:text-gray-200">×</button>
            </div>
        </div>
    );
}

export default Toast;