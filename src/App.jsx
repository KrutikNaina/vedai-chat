// vedai-landing/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

/* Common */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SEO from "./components/SEO";

/* Home */
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import LiveChatPreview from "./components/LiveChatPreview";
import Testimonials from "./components/Testimonials";
import ContactSection from "./components/ContactSection";


/* Auth */
import Login from "./auth/login";
import Signup from "./auth/Signup";

/* Pages */
import ChatPage from "./pages/ChatPage";
import About from "./pages/About";
import VedAI404 from "./pages/VedAI404";

/* User Dashboard */
import UserDashboard from "./user-dashboard/pages/UserDashboard";

/* Blog (User Side) */
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";

/* E-Katha */
import EKathaFlow from "./E-Katha/EKathaFlow";

/* Admin */
import AdminLayout from "./admin/AdminLayout";
import AdminGuard from "./admin/AdminGuard";
import Dashboard from "./admin/Dashboard";

/* Admin – Users */
import Users from "./admin/Users";
import UserDetail from "./admin/UserDetail";

/* Admin – eKatha */
import KathaList from "./admin/Katha/KathaList";
import AddKatha from "./admin/Katha/AddKatha";
import EditKatha from "./admin/Katha/EditKatha";
import ViewKatha from "./admin/Katha/ViewKatha";

/* Admin – Contact */
import Contacts from "./admin/Contacts";
import ContactView  from "./admin/ContactView";

/* Admin – API */
import ApiLogs from "./admin/ApiLogs";

/* Admin – Blog */
import AdminBlogList from "./admin/Blog/BlogList";
import AddBlog from "./admin/Blog/AddBlog";
import EditBlog from "./admin/Blog/EditBlog";

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <Navbar />

        <Routes>
          {/* ================= HOME ================= */}
          <Route
            path="/"
            element={
              <>
                <SEO
                  title="VedAI — AI-Powered Spiritual Guidance from Bhagavad Gita & Vedas"
                  description="VedAI offers AI-driven wisdom from the Bhagavad Gita, Vedas, Ekatha rituals, astrology insights, and spiritual guidance."
                  keywords="VedAI, AI Bhagavad Gita, Vedic AI, Hindu spiritual chatbot, Ekatha rituals"
                  url="https://vedai-chat.vercel.app/"
                  image="/vedai-preview.png"
                />

                <div className="max-w-7xl mx-auto pt-20 px-6">
                  <HeroSection />
                  <FeatureSection />
                  <LiveChatPreview />
                  <Testimonials />
                  <ContactSection />
                  <Footer />
                </div>
              </>
            }
          />

          {/* ================= AUTH ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ================= USER PAGES ================= */}
          <Route path="/chatpage" element={<ChatPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<UserDashboard />} />

          {/* ================= BLOG (USER) ================= */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          {/* ================= E-KATHA ================= */}
          <Route path="/ekatha" element={<EKathaFlow />} />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* Users */}
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetail />} />

            {/* eKatha */}
            <Route path="katha" element={<KathaList />} />
            <Route path="katha/add" element={<AddKatha />} />
            <Route path="katha/edit/:id" element={<EditKatha />} />
            <Route path="katha/view/:id" element={<ViewKatha />} />

            {/* Blog (Admin) */}
            <Route path="blog" element={<AdminBlogList />} />
            <Route path="blog/add" element={<AddBlog />} />
            <Route path="blog/edit/:id" element={<EditBlog />} />

            {/* Contact Admin */}
            <Route path="contacts" element={<Contacts />} />
            <Route path="contacts/:id" element={<ContactView />} />

            {/* API Logs */}
            <Route path="api-logs" element={<ApiLogs />} />
          </Route>

          {/* ================= 404 ================= */}
          <Route path="*" element={<VedAI404 />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;
