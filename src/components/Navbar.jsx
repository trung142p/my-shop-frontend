import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { cart } = useContext(CartContext);
    const { darkMode, toggleDarkMode } = useTheme();
    const { t, i18n } = useTranslation('common');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const changeLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    return (
        <nav className="bg-white dark:bg-black text-gray-800 dark:text-white shadow-lg fixed top-0 w-full z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center gap-4">

                    {/* Logo Shop */}
                    <Link to="/" className="group">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                                Thiên đường
                            </span>
                            <span className="text-xl font-light text-gray-500 dark:text-gray-400">·</span>
                            <span className="text-xl font-medium text-gray-700 dark:text-gray-300">
                                sung sướng
                            </span>
                        </div>
                        <div className="text-[10px] text-gray-400 tracking-wider mt-0.5 hidden sm:block">
                            LUXURY PLEASURE
                        </div>
                    </Link>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link to="/" className="hover:text-pink-500 font-semibold transition">
                            {t('nav.home')}
                        </Link>
                        <Link to="/products" className="hover:text-pink-500 font-semibold transition">
                            {t('nav.products')}
                        </Link>
                        <Link to="/contact" className="hover:text-pink-500 font-semibold transition">
                            {t('nav.contact')}
                        </Link>
                        <Link to="/track-order" className="hover:text-pink-500 font-semibold transition">
                            🔍 {t('nav.trackOrder')}
                        </Link>

                        {/* Nút Dark Mode */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {/* Nút Ngôn ngữ */}
                        <button
                            onClick={changeLanguage}
                            className="px-3 py-1 rounded-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition text-sm font-medium"
                        >
                            {i18n.language === "vi" ? "EN" : "VI"}
                        </button>
                    </div>

                    {/* Nút Giỏ hàng Desktop */}
                    <div className="hidden md:block">
                        <Link to="/cart" className="flex items-center hover:text-pink-500 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg transition">
                            <span className="text-xl mr-2">🛒</span>
                            <span className="font-semibold">{t('nav.cart')}</span>
                            <span className="ml-2 bg-pink-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                                {totalItems}
                            </span>
                        </Link>
                    </div>

                    {/* Nút Hamburger Mobile */}
                    <button
                        className="md:hidden text-2xl focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Menu Mobile */}
            {menuOpen && (
                <div className="md:hidden bg-white dark:bg-black px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                    <Link to="/" className="block py-3 border-b border-gray-200 dark:border-gray-800 hover:text-pink-500">
                        {t('nav.home')}
                    </Link>
                    <Link to="/products" className="block py-3 border-b border-gray-200 dark:border-gray-800 hover:text-pink-500">
                        {t('nav.products')}
                    </Link>
                    <Link to="/contact" className="block py-3 border-b border-gray-200 dark:border-gray-800 hover:text-pink-500">
                        {t('nav.contact')}
                    </Link>
                    <Link to="/track-order" className="block py-3 border-b border-gray-200 dark:border-gray-800 hover:text-pink-500">
                        🔍 {t('nav.trackOrder')}
                    </Link>

                    {/* Nút Dark Mode và Ngôn ngữ trên mobile */}
                    <div className="flex gap-4 py-3 border-b border-gray-200 dark:border-gray-800">
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                            {darkMode ? (
                                <>
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                                    </svg>
                                    <span>{t('theme.light')}</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                    <span>{t('theme.dark')}</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={changeLanguage}
                            className="px-3 py-1 rounded-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition text-sm font-medium"
                        >
                            {i18n.language === "vi" ? "EN" : "VI"}
                        </button>
                    </div>

                    <Link to="/cart" className="block py-3 text-pink-500 font-bold">
                        🛒 {t('nav.cart')} ({totalItems})
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;