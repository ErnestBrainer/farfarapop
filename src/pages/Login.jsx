import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username, email, or phone
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setMessage("❌ Please enter username, email, or phone.");
      return;
    }
    if (!password.trim()) {
      setMessage("❌ Password is required.");
      return;
    }

    try {
      const res = await axios.post("http://10.23.15.151:5000/api/auth/login", {
        identifier: identifier.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful!");
      navigate("/"); // Redirect to home feed
    } catch (err) {
      console.error(err);
      const backendMsg = err.response?.data?.error || "Login failed.";
      setMessage(`❌ ${backendMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            FarfaraPop
          </h1>
          <p className="text-gray-400">Welcome back! Login to continue</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Phone Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            Login
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            message.includes("✅") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link 
            to="/forgot-password" 
            className="text-pink-500 hover:text-pink-400 text-sm"
          >
            Forgot Password?
          </Link>
        </div>
        
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-pink-500 hover:text-pink-400 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
