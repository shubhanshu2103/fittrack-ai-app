import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx'; 

const MainLayout = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans">
      <Navbar /> 
      <main className="container mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;