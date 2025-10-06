import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthLayout from './layouts/AuthLayout.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import WorkoutsPage from './pages/WorkoutsPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LogWorkoutPage from './pages/LogWorkoutPage.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
function App() {
  return (
    <>
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/log-workout" element={<LogWorkoutPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}
export default App;