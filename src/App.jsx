// Dark mode removed: ThemeProvider no longer used
import { ToastProvider } from "@/components/ui/Toast";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
// Products component removed - using ProductLayout instead
import Artisans from "@/components/Artisans";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { LayoutLogin } from "@/components/Login/LayoutLogin";
import { LayoutRegister } from "./components/Register/LayoutRegister";
import AboutPage from "@/components/About/AboutPage";
import ContactPage from "@/components/Contact/ContactPage";
import { ArtistLayout } from "./components/Artist/ArtistLayout";
import { ArtistDetail } from "./components/Artist/ArtistDetail";
import { ProductLayout } from "./components/Product/ProductLayout";
import ProductDetail from "./components/Product/ProductDetail";
import ProfilePage from "./components/Profile/ProfilePage";
import EditProfilePage from "./components/Profile/components/EditProfilePage";
import AddProductPage from "./components/Profile/components/AddProductPage";

// Admin components
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import OrderManagement from "./components/Admin/OrderManagement";
import ArtistManagement from "./components/Admin/ArtistManagement";

// import CartPage from "@/components/Cart/CartPage";
import CartPage from "@/components/Cart/CartPage";

// Forum components
import { ForumLayout, ForumTopicDetail, ForumThreadDetail } from "./components/Forum";

function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-artisan-brown-950 text-artisan-brown-900 dark:text-artisan-brown-50">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <Artisans />
      <Testimonials />
    </main>
  );
}

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductLayout />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/stores" element={<ArtistLayout />} />
              <Route path="/stores/:id" element={<ArtistDetail />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/profile/add-product" element={<AddProductPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage />} />
              {/* Forum Routes */}
              <Route path="/forum" element={<ForumLayout />} />
              <Route path="/forum/topic/:topicId" element={<ForumTopicDetail />} />
              <Route path="/forum/thread/:threadId" element={<ForumThreadDetail />} />
            </Route>
            <Route path="/login" element={<LayoutLogin />} />
            <Route path="/register" element={<LayoutRegister />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="accounts" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="artists" element={<ArtistManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
