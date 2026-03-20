import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { cart } = useContext(CartContext);

    // Tính tổng số lượng sản phẩm trong giỏ
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="bg-black text-white shadow-lg fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center gap-4">

                    {/* Logo Shop - Thiên đường sung sướng (cải tiến) */}
                    <Link to="/" className="group">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent hover:from-pink-300 hover:to-pink-500 transition-all duration-300">
                                Thiên đường
                            </span>
                            <span className="text-xl font-light text-white/80 group-hover:text-white transition-colors duration-300">
                                ·
                            </span>
                            <span className="text-xl font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                                sung sướng
                            </span>
                        </div>
                        <div className="text-[10px] text-gray-500 tracking-wider mt-0.5 hidden sm:block">
                            LUXURY PLEASURE
                        </div>
                    </Link>

                    {/* Thanh tìm kiếm (chỉ hiện trên màn hình máy tính) */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm (vd: bao cao su, trứng rung...)"
                            className="w-full px-4 py-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex space-x-6 items-center min-w-max">
                        <Link to="/" className="hover:text-pink-400 font-semibold transition">
                            Trang chủ
                        </Link>
                        <Link to="/products" className="hover:text-pink-400 font-semibold transition">
                            Sản phẩm
                        </Link>
                        <Link to="/contact" className="hover:text-pink-400 font-semibold transition">
                            Liên hệ
                        </Link>
                    </div>

                    {/* Nút Giỏ hàng Desktop */}
                    <div className="hidden md:block min-w-max">
                        <Link to="/cart" className="flex items-center hover:text-pink-400 bg-gray-800 px-3 py-2 rounded-lg transition">
                            <span className="text-xl mr-2">🛒</span>
                            <span className="font-semibold">Giỏ hàng</span>
                            <span className="ml-2 bg-pink-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                                {totalItems}
                            </span>
                        </Link>
                    </div>

                    {/* Nút Hamburger cho Mobile */}
                    <button
                        className="md:hidden text-2xl focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>

                </div>
            </div>

            {/* Menu thả xuống cho Mobile */}
            {menuOpen && (
                <div className="md:hidden bg-black px-4 pb-4 pt-2 border-t border-gray-800">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full px-4 py-2 mb-4 text-black rounded-lg focus:outline-none"
                    />
                    <Link to="/" className="block py-3 border-b border-gray-800 hover:text-pink-500">
                        Trang chủ
                    </Link>
                    <Link to="/products" className="block py-3 border-b border-gray-800 hover:text-pink-500">
                        Sản phẩm
                    </Link>
                    <Link to="/contact" className="block py-3 border-b border-gray-800 hover:text-pink-500">
                        Liên hệ
                    </Link>
                    <Link to="/cart" className="block py-3 text-pink-500 font-bold">
                        🛒 Giỏ hàng ({totalItems})
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;