import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import MainApp from './pages/MainApp';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем localStorage на наличие сохраненного пользователя
    const savedUser = localStorage.getItem('wedding_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-screen">🎉 Загрузка...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <MainApp user={user} /> : <Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;