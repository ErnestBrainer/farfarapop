import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setMessage("❌ Username is required.");
      return;
    }
    if (!password.trim()) {
      setMessage("❌ Password is required.");
      return;
    }
    if (!phone.trim()) {
      setMessage("❌ Phone number is required.");
      return;
    }

    try {
      const res = await axios.post("http://10.23.15.151:5000/api/auth/signup", {
        username: username.trim().toLowerCase(),
        phone: phone.trim(),
        email: null,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("✅ Signup successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      const backendMsg = err.response?.data?.error || "Signup failed.";
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
          <p className="text-gray-400">Create your account to get started</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            Create Account
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            message.includes("✅") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            {message}
          </div>
        )}
        
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-500 hover:text-pink-400 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
