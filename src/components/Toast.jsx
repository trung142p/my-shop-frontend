import React, { useEffect } from "react";

function Toast({ message, type = "success", onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const styles = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500",
    };

    const icons = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ",
    };

    return (
        <div className="animate-slide-in">
            <div className={`${styles[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-[400px]`}>
                <span className="text-xl font-bold">{icons[type]}</span>
                <span className="flex-1 text-sm">{message}</span>
                <button onClick={onClose} className="text-white hover:text-gray-200 text-xl leading-none">×</button>
            </div>
        </div>
    );
}

export default Toast;