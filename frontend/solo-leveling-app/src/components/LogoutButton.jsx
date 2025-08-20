import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = confirm('¿Seguro que querés cerrar sesión?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('jugadorId');
      navigate('/login');
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <LogOut size={18} className="logout-icon" />
    </button>
  );
}
