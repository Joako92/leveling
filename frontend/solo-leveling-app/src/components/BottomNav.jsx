import React from 'react';
import { Dumbbell, ListTodo, CalendarDays } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: 'Estado', icon: <Dumbbell />, path: '/status' },
    { label: 'Tarea', icon: <ListTodo />, path: '/daily-quest' },
    { label: 'Calendario', icon: <CalendarDays />, path: '/calendar' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => navigate(tab.path)}
          className={`tab-button ${
            location.pathname === tab.path ? 'active' : ''
          }`}
        >
          <div className="icon">{tab.icon}</div>
          <span className="label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
