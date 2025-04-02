import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlayerStatus from './pages/PlayerStatus';
import DailyQuest from './pages/DailyQuest';
import Calendar from './pages/Calendar';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/status" element={<PlayerStatus />} />
          <Route path="/daily-quest" element={<DailyQuest />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
