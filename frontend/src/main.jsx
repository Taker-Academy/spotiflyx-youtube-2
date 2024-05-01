import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import LoginPage from './LoginApp.jsx';
import CreateAcc from './CreateAcc.jsx';
import UserPage from './UserPage.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<CreateAcc />} />
      <Route path="/home" element={<App />} />
      <Route path="/user/me" element={<UserPage />} />
      <Route path="" element={<LoginPage />} />
    </Routes>
  </Router>
);
