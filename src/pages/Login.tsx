import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CODES, MONEY_CODES } from '../firebase';

const EMOJIS = ['😎', '🥳', '🎉', '💃', '🕺', '🤵', '👰', '🍾', '💖', '🎊', '😜', '🤪', '🦄', '🌟', '🎭', '🎪'];

interface LoginProps {
  setUser: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name.trim()) {
      setError('Введи имя!');
      return;
    }

    let role = 'guest';
    let bonusCoins = 0;
    let userEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    // Проверяем код
    const upperCode = code.toUpperCase();
    
    if (upperCode && ADMIN_CODES[upperCode]) {
      const adminData = ADMIN_CODES[upperCode];
      if (adminData.name.toLowerCase() === name.toLowerCase()) {
        role = adminData.role;
        userEmoji = adminData.emoji;
        bonusCoins = 5000;
      } else {
        setError('Неверное имя для этого кода! 😏');
        return;
      }
    }

    // Проверяем денежные коды
    if (upperCode && MONEY_CODES[upperCode]) {
      bonusCoins += MONEY_CODES[upperCode];
    }

    const user = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      emoji: userEmoji,
      role,
      coins: 1000 + bonusCoins,
      createdAt: Date.now()
    };

    localStorage.setItem('wedding_user', JSON.stringify(user));
    setUser(user);
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">💍 Рустам & Лиза 💍</h1>
        <p className="subtitle">Присоединяйся к свадебной вечеринке!</p>
        
        <div className="input-group">
          <label>Твое имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Вася"
            className="input"
            maxLength={20}
          />
        </div>

        <div className="input-group">
          <label>Секретный код (если есть):</label>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Код от организаторов"
            className="input"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button onClick={handleLogin} className="btn-primary">
          Войти на праздник 🎉
        </button>

        <div className="info-text">
          <p>💡 Подсказка: у каждого гостя 1000 монет!</p>
          <p>🎮 Играй в игры, зарабатывай и трать монеты</p>
        </div>
      </div>
    </div>
  );
};

export default Login;