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
import RashiName from "./pages/RashiName"
import About from "./pages/About";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            <div className="max-w-7xl mx-auto pt-20 px-6">
              <HeroSection />
              <FeatureSection />
              <Pricing />
              <Testimonials />
              <Footer />
            </div>
          }
        />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* All Pages */}
        <Route path="/chatpage" element={<ChatPage/>}/>
        <Route path="/rashiname" element={<RashiName/>}/>
        <Route path="/about" element={<About/>}/>

      </Routes>
    </Router>
  );
};

export default App;
