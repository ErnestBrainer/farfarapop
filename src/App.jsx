import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import VideoFeed from "./pages/VideoFeed";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import BottomNav from "./components/BottomNav";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
};

const App = () => {
  const token = localStorage.getItem("token");
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token ? <VideoFeed /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/watch/:id"
          element={
            token ? <Watch /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/upload"
          element={
            token ? <Upload /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/inbox"
          element={
            token ? <Inbox /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile"
          element={
            token ? <Profile /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>

      {token && <BottomNav />}
    </Router>
  );
};

export default App;