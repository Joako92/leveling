import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-xl text-sm font-medium shadow-sm transition-all"
    >
      <LogOut size={16} />
      Salir
    </button>
  );
}
