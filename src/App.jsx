import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories"; // Mới thêm
import ProductList from "./components/ProductList";
import Footer from "./components/Footer"; // Bạn nhớ tạo file Footer từ code trước tôi gửi nhé
import FloatingContact from "./components/FloatingContact"; // Mới thêm
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";
import Checkout from "./pages/Checkout";
import { Routes, Route, Navigate } from "react-router-dom";

import { Routes, Route } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Nếu không có token, chuyển hướng về trang login ngay
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollToTop />
      <Navbar />
      <FloatingContact />

      <div className="pt-16">
        <Routes>
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/" element={
            <>
              <Hero />
              <Categories />
              <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest text-center">
                  Sản phẩm <span className="text-pink-500">Đặc sắc</span>
                </h2>
                <ProductList />
              </div>
            </>
          } />

          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* --- BƯỚC 2: BAO BỌC DASHBOARD BẰNG PROTECTED ROUTE --- */}
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