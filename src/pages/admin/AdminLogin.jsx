import { useState } from "react";
import axios from "axios";

function AdminLogin() {

    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const res = await axios.post(
                "https://my-shop-api-p7kz.onrender.com/api/admin/login",
                { password }
            );

            localStorage.setItem("adminToken", res.data.token);

            window.location.href = "/admin/dashboard";

        } catch (err) {

            alert("Sai mật khẩu");

        }

    };

    return (

        <div className="flex h-screen items-center justify-center">

            <div className="bg-white p-10 shadow rounded w-80">

                <h2 className="text-2xl mb-6 font-bold">
                    Admin Login
                </h2>

                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="border p-2 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="mt-4 bg-black text-white w-full py-2 rounded"
                >
                    Đăng nhập
                </button>

            </div>

        </div>

    );
}

export default AdminLogin;