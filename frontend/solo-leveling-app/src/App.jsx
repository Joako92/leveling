import React from 'react';
import './style.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PlayerStatus from './pages/PlayerStatus';
import DailyQuest from './pages/DailyQuest';
import Calendar from './pages/Calendar';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { isAuthenticated } from './utils/auth';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';

function AppContent() {
  const location = useLocation();
  const hideMenuRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldShowMenu = isAuthenticated() && !hideMenuRoutes.includes(location.pathname);

  return (
    <div className="pb-14">
      <TopNav />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/status" element={<PlayerStatus />} />
        <Route path="/daily-quest" element={<DailyQuest />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      
      {shouldShowMenu && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
