import React, { createContext, useContext, useState, useEffect } from "react";

const BlurContext = createContext();

export const useBlur = () => {
    const context = useContext(BlurContext);
    if (!context) {
        throw new Error("useBlur must be used within BlurProvider");
    }
    return context;
};

export const BlurProvider = ({ children }) => {
    const [isBlurred, setIsBlurred] = useState(() => {
        const saved = localStorage.getItem("blurMode");
        return saved === "true";
    });

    useEffect(() => {
        localStorage.setItem("blurMode", isBlurred);
    }, [isBlurred]);

    const toggleBlur = () => setIsBlurred(!isBlurred);
    const enableBlur = () => setIsBlurred(true);
    const disableBlur = () => setIsBlurred(false);

    return (
        <BlurContext.Provider
            value={{
                isBlurred,
                toggleBlur,
                enableBlur,
                disableBlur,
            }}
        >
            {children}
        </BlurContext.Provider>
    );
};