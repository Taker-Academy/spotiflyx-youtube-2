import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import LoginPage from './LoginApp.jsx';
import CreateAcc from './CreateAcc.jsx';
import Setting_user from './Setting_user.jsx';
import UserPage from './UserPage.jsx';
import UploadVideos from './UploadVideos.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<CreateAcc />} />
      <Route path="/user/setting" element={<Setting_user />} />
      <Route path="/home" element={<App />} />
      <Route path="/user/me" element={<UserPage />} />
      <Route path="" element={<LoginPage />} />
      <Route path="/videos/upload" element={<UploadVideos />} />
    </Routes>
  </Router>
);