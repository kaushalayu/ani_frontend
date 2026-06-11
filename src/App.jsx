import { Routes, Route } from 'react-router-dom'
import Layout from './Components/Layout'
import { ProtectedRoute, AdminRoute } from './Components/ProtectedRoute'

import Home from './Pages/Home'
import About from './Pages/About'
import Shop from './Pages/Shop'
import SingleProduct from './Pages/SingleProduct'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import Blog from './Pages/Blog'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import FAQ from './Pages/FAQ'
import Services from './Pages/Services'
import Testimonials from './Pages/Testimonials'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import TermOfUse from './Pages/TermOfUse'
import NotFound from './Pages/NotFound'
import NewArrivals from './Pages/NewArrivals'
import BestSellers from './Pages/BestSellers'
import Painkillers from './Pages/Painkillers'
import SleepingPills from './Pages/SleepingPills'
import Anxiety from './Pages/Anxiety'
import Wishlist from './Pages/Wishlist'
import ComingSoon from './Pages/ComingSoon'
import JoinNow from './Pages/JoinNow'
import ThankYou from './Pages/ThankYou'
import LoadMore from './Pages/LoadMore'
import ThreeColumnSidebar from './Pages/ThreeColumnSidebar'

// Admin Panel
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/pages/Dashboard'
import AdminProducts from './admin/pages/Products'
import AdminProductForm from './admin/pages/ProductForm'
import AdminOrders from './admin/pages/Orders'
import AdminOrderDetail from './admin/pages/OrderDetail'
import AdminUsers from './admin/pages/Users'
import AdminCategories from './admin/pages/Categories'
import AdminBlogs from './admin/pages/Blogs'
import AdminSeo from './admin/pages/Seo'

// Setup
import AdminSetup from './Pages/AdminSetup'

function App() {
  return (
    <Routes>
      {/* ─── Main Website ─── */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<SingleProduct />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="join-now" element={<JoinNow />} />
        <Route path="admin-setup" element={<AdminSetup />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="services" element={<Services />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-use" element={<TermOfUse />} />
        <Route path="new-arrivals" element={<NewArrivals />} />
        <Route path="best-sellers" element={<BestSellers />} />
        <Route path="painkillers" element={<Painkillers />} />
        <Route path="sleeping-pills" element={<SleepingPills />} />
        <Route path="anxiety" element={<Anxiety />} />
        <Route path="coming-soon" element={<ComingSoon />} />
        <Route path="load-more" element={<LoadMore />} />
        <Route path="three-column-sidebar" element={<ThreeColumnSidebar />} />

        {/* ─── Cart & Wishlist: FREE (no login needed) ─── */}
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />

        {/* ─── Checkout & ThankYou: Login REQUIRED to place order ─── */}
        <Route
          path="checkout"
          element={<ProtectedRoute><Checkout /></ProtectedRoute>}
        />
        <Route
          path="thank-you"
          element={<ProtectedRoute><ThankYou /></ProtectedRoute>}
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ─── Admin Panel (admin role required) ─── */}
      <Route
        path="/admin"
        element={<AdminRoute><AdminLayout /></AdminRoute>}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/edit/:id" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="seo" element={<AdminSeo />} />
      </Route>
    </Routes>
  )
}

export default App
