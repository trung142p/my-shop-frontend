import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";
import BankTransfer from "./pages/BankTransfer";
import CategoryPage from "./pages/CategoryPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import OrderTracking from "./pages/OrderTracking";
import FloatingCartButton from "./components/FloatingCartButton";
import { useTranslation } from "react-i18next";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [shopCurrentPage, setShopCurrentPage] = useState(1);
  const { t } = useTranslation('home');

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <ScrollToTop />
      <Navbar />
      <FloatingContact />
      <FloatingCartButton />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Categories />
              <div id="featured-products" className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                    {t('featured.title')} <span className="text-pink-500">{t('featured.title')?.split(' ').pop()}</span>
                  </h2>
                  <div className="w-24 h-1 bg-pink-500 mx-auto rounded-full"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                    {t('featured.desc')}
                  </p>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="mb-8 max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('featured.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-full focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none shadow-sm transition-colors"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                      {t('featured.searchResult')}: "<span className="font-medium text-pink-600">{searchTerm}</span>"
                    </p>
                  )}
                </div>

                <ProductList
                  searchTerm={searchTerm}
                  currentPage={shopCurrentPage}
                  onPageChange={setShopCurrentPage}
                  itemsPerPage={16}
                />
              </div>
            </>
          } />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/complete" element={<OrderComplete />} />
          <Route path="/bank-transfer" element={<BankTransfer />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;