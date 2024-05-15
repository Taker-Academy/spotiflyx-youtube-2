import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import LoginPage from './LoginApp.jsx';
import CreateAcc from './CreateAcc.jsx';
import Setting_user from './Setting_user.jsx';
import UploadVideos from './UploadVideos.jsx';
import VideoPage from './VideoPage.jsx';
import UserFavorite from './UserFavorites.jsx';

const PrivateRoute = ({ element, ...props }) => {
  const email = localStorage.getItem('email');

  if (!email) {
    return <Navigate to="/auth/login" />;
  }

  return element;
};

const CustomRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<CreateAcc />} />
      <Route path="" element={<LoginPage />} />
      <Route path="/user/setting" element={<PrivateRoute element={<Setting_user />} />} />
      <Route path="/home" element={<PrivateRoute element={<App />} />} />
      <Route path="/videos/upload" element={<PrivateRoute element={<UploadVideos />} />} />
      <Route path="/videos/:videoId" element={<VideoPage />} />
      <Route path="/user/favorite" element={<UserFavorite />} />
    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <Router>
    <CustomRoutes />
  </Router>
);
