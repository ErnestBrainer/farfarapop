import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            U
          </div>
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Account Settings</h3>
            <p className="text-gray-400 text-sm">Update your profile information</p>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">My Videos</h3>
            <p className="text-gray-400 text-sm">View and manage your uploaded videos</p>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Privacy Settings</h3>
            <p className="text-gray-400 text-sm">Control your privacy preferences</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;