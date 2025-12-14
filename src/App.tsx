import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { CartDrawer } from "./components/common/CartDrawer";
import { HomePage } from "./pages/HomePage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { CartPage } from "./pages/CartPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage.tsx";
import { CheckoutPage } from "./pages/CheckoutPage.tsx";
import { ProfilePage } from "./pages/ProfilePage";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg font-sans text-gray-900 dark:text-dark-text transition-colors duration-300">
          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>

          <Footer />
          <CartDrawer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
