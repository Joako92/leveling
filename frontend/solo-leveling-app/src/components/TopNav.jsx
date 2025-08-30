import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TopNav.css';
import SoloTrainingIcon from "../assets/Icon.png";
import LogoutButton from '../components/LogoutButton';
import { isAuthenticated } from '../utils/auth';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideMenuRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldShowMenu = isAuthenticated() && !hideMenuRoutes.includes(location.pathname);
  
  return (
    <nav className="top-nav">
    {shouldShowMenu && <LogoutButton />}
      <button
        onClick={() => navigate('/')}
        className={`tab-button ${location.pathname === '/' ? 'active' : ''}`}
      >
        <img 
          src={SoloTrainingIcon} 
          className="Icon" 
          alt="Solo Training Icon" 
        />
      </button>
    </nav>
  );
}
