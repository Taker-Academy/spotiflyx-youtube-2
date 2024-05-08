import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import de Navigate
import App from './App.jsx';
import LoginPage from './LoginApp.jsx';
import CreateAcc from './CreateAcc.jsx';
import Setting_user from './Setting_user.jsx';
import UserPage from './UserPage.jsx';
import UploadVideos from './UploadVideos.jsx';

const PrivateRoute = ({ element, ...props }) => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  if (!token || !email) {
    return <Navigate to="/auth/login" />;
  }

  return element;
};

const CustomRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<CreateAcc />} />
      <Route path="/user/setting" element={<PrivateRoute element={<Setting_user />} />} />
      <Route path="/home" element={<PrivateRoute element={<App />} />} />
      <Route path="/user/me" element={<PrivateRoute element={<UserPage />} />} />
      <Route path="/videos/upload" element={<PrivateRoute element={<UploadVideos />} />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <Router>
    <CustomRoutes />
  </Router>
);
