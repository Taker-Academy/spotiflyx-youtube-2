import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import LoginPage from './LoginApp.jsx';
import CreateAcc from './CreateAcc.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/html/login.html" element={<LoginPage />} />
      <Route path="/html/home.html" element={<App />} />
      <Route path="/html/create_account.html" element={<CreateAcc />} />
    </Routes>
  </Router>
);
