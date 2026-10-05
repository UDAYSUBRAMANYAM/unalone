import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes";

import SignUp from "./pages/signUp";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/Homepage";
import LandingPage from "./pages/LandingPage";
import LocationPage from "./pages/LocationPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import AuthorPage from "./pages/AuthorPage";
import Navbar from "./components/Navbar";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Public */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/author" element={<AuthorPage/>} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/landing_page" element={<LandingPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;