import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import ContactUs from "./pages/ContactUS";
import Inquiry from "./pages/Inquiry";
import Career from "./pages/Career";
import Service from "./pages/Service";
import Events from "./pages/Events";
import AboutUs from "./pages/AboutUs";
import Gallery from "./pages/Gallery";
import Dashboard from "./admin/Dashboard";
import Login from "./admin/Login";
import Signup from "./admin/Signup";
import VerifyOTP from "./admin/VerifyOTP";

// Redirect to home for invalid routes
const NotFoundRedirect = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/"); // Redirect to home
  }, [navigate]);

  return null; // Render nothing while redirecting
};

// ProtectedRoute to guard "/admin"
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userid");

    // Redirect to login if no token or userid
    if (!token || !userId) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return children; // Render protected components if conditions pass
};

// Route to guard "/admin/verify"
const VerifyRoute = ({ children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect to login if no token
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return children; // Render protected components if conditions pass
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path="/career" element={<Career />} />
        <Route path="/services" element={<Service />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/admin/verify" element={<VerifyOTP />} />
        <Route path="/admin" element={<Dashboard />} />

        {/* Guarded Routes */}
        <Route
          path="/admin/verify"
          element={
            <VerifyRoute>
              <VerifyOTP />
            </VerifyRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/admin/" element={<Dashboard />} /> */}

        {/* Catch-All Route for Invalid Links */}
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
