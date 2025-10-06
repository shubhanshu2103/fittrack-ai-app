import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiBell, FiUser } from 'react-icons/fi'; // Importing icons

const Navbar = () => {
  // Style for active NavLink
  const activeLinkStyle = {
    color: '#06B6D4', // The cyan accent color
    fontWeight: '600',
  };

  return (
    <nav className="bg-slate-800/50 border-b border-slate-700 p-4 sticky top-0 z-10 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side: Logo and Nav Links */}
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-white">FitTrack AI</h1>
          <div className="hidden md:flex items-center space-x-6 text-slate-300">
            <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} end>Dashboard</NavLink>
            <NavLink to="/workouts" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Workouts</NavLink>
            <NavLink to="/progress" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Progress</NavLink>
          </div>
        </div>

        {/* Right side: Icons and Profile */}
        <div className="flex items-center space-x-5">
          <button className="text-slate-300 hover:text-white">
            <FiBell size={22} />
          </button>
          <button className="text-slate-300 hover:text-white">
             <FiUser size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;