import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PlayerStatus from './pages/PlayerStatus';
import DailyQuest from './pages/DailyQuest';
import Calendar from './pages/Calendar';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NavigationMenu from "./components/NavigationMenu";
import { isAuthenticated } from './utils/auth';

function AppContent() {
  const location = useLocation();
  const hideMenuRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldShowMenu = isAuthenticated() && !hideMenuRoutes.includes(location.pathname);

  return (
    <div className="pb-20">
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

      {shouldShowMenu && <NavigationMenu />}
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
