import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Đưa màn hình lên đầu trang (vị trí x=0, y=0)
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth", // Cuộn mượt mà thay vì nhảy lập tức
        });
    }, [pathname]); // Chạy lại mỗi khi đường dẫn (URL) thay đổi

    return null;
};

export default ScrollToTop;