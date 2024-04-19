import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import LoginPage from './LoginApp.jsx';


createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/html/login.html" element={<LoginPage />} />
      <Route path="/html/home.html" element={<App />} />
    </Routes>
  </Router>
);
