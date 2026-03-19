import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/upload", label: "Upload", icon: "➕" },
    { path: "/inbox", label: "Inbox", icon: "�" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-around items-center bg-black text-white p-2 border-t border-gray-800 z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
            location.pathname === item.path 
              ? "text-white" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <span className="text-2xl mb-1">{item.icon}</span>
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;