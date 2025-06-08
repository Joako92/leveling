import React from 'react';
import { Dumbbell, ListTodo, CalendarDays } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: 'Status', icon: <Dumbbell />, path: '/status' },
    { label: 'Quest', icon: <ListTodo />, path: '/daily-quest' },
    { label: 'Calendario', icon: <CalendarDays />, path: '/calendar' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center text-xs ${
              location.pathname === tab.path ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
