import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Login from "./auth/login";
import Signup from "./auth/Signup";
import ChatPage from "./pages/ChatPage";
import About from "./pages/About";
import AboutSection from "./components/AboutSection";
import LiveChatPreview from "./components/LiveChatPreview";
import VedAI404 from "./pages/VedAI404";
import AdminDashboard from "./admin-dashboard/AdminDashboard";
import UserDashboard from "./user-dashboard/pages/UserDashboard";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            <>
              <SEO
                title="VedAI — AI-Powered Spiritual Guidance from the Bhagavad Gita & Vedas"
                description="VedAI is a cosmic AI portal offering insights from the Bhagavad Gita, Vedas, shlokas, dream interpretations, puja rituals, and spiritual names."
                keywords="VedAI, AI Bhagavad Gita, AI spiritual chatbot, Vedic wisdom AI, Hindu dream interpretation, AI puja guide, spiritual names AI"
                url="https://vedai-chat.vercel.app/"
                image="/vedai-preview.png"
              />
              <div className="max-w-7xl mx-auto pt-20 px-6">
                <HeroSection />
                <FeatureSection />
                <LiveChatPreview />
                <Pricing />
                <Testimonials />
                <Footer />
              </div>
            </>
          }
        />


        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* All Pages */}
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<VedAI404 />} />

        {/* Admin Dasboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* User Dashboard */}
        <Route path="/user" element={<UserDashboard />} />

      </Routes>
    </Router>
  );
};

export default App;
