import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="bg-slate-900 min-h-screen flex items-center justify-center font-sans">
    <Outlet />
  </div>

);
export default AuthLayout;
