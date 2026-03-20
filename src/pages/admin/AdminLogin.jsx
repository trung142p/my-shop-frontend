import { useState, useEffect } from "react"; // Thêm useEffect
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Dùng useNavigate thay cho window.location
//import { useToast } from "../context/ToastContext";

function AdminLogin() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //const { showToast } = useToast();

    // Nếu đã có token rồi thì vào thẳng Dashboard, không cho ở lại trang Login
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                "https://my-shop-api-p7kz.onrender.com/api/admin/login",
                { password }
            );

            localStorage.setItem("adminToken", res.data.token);
            // Dùng navigate mượt hơn window.location.href
            navigate("/admin/dashboard");
        } catch (err) {
            //showToast("Sai mật khẩu", "error");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-10 shadow-lg rounded-xl w-80">
                <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">
                    Admin Access
                </h2>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Nhấn Enter để login
                />
                <button
                    onClick={handleLogin}
                    className="mt-4 bg-pink-600 hover:bg-pink-700 text-white w-full py-2 rounded transition-colors font-medium"
                >
                    Đăng nhập
                </button>
            </div>
        </div>
    );
}

export default AdminLogin;
