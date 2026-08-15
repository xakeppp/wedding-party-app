import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import Chat from '../components/Chat';
import GameBingo from '../components/GameBingo';
import GameBattle from '../components/GameBattle';
import ToastGenerator from '../components/ToastGenerator';
import AdminPanel from '../components/AdminPanel';
import './MainApp.css';

interface MainAppProps {
  user: any;
}

const MainApp: React.FC<MainAppProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'games' | 'rooms' | 'profile'>('chat');
  const [balance, setBalance] = useState(user.coins);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentRoom, setCurrentRoom] = useState('main');
  const [isAdmin, setIsAdmin] = useState(user.role === 'admin' || user.role === 'moderator');

  useEffect(() => {
    // Подписка на сообщения в реальном времени
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs.reverse());
    });

    return () => unsubscribe();
  }, [currentRoom]);

  const sendMessage = async (text: string, room: string = currentRoom) => {
    if (!text.trim()) return;

    await addDoc(collection(db, 'messages'), {
      userId: user.id,
      userName: user.name,
      text: text,
      emoji: user.emoji,
      timestamp: Date.now(),
      room: room,
      reactions: []
    });

    // Начисляем монеты за сообщение
    if (balance < 1000) { // Лимит на получение
      const newBalance = balance + 5;
      setBalance(newBalance);
      // В реальном приложении обновляем в Firebase
    }
  };

  const handleSpendCoins = (amount: number) => {
    setBalance(prev => prev - amount);
  };

  return (
    <div className="main-app">
      <header className="header">
        <div className="user-info">
          <span className="user-emoji">{user.emoji}</span>
          <span className="user-name">{user.name}</span>
          {isAdmin && <span className="admin-badge">⭐ Организатор</span>}
        </div>
        <div className="balance">
          💰 {balance} монет
        </div>
      </header>

      <div className="tab-content">
        {activeTab === 'chat' && (
          <Chat
            user={user}
            messages={messages}
            sendMessage={sendMessage}
            currentRoom={currentRoom}
            setCurrentRoom={setCurrentRoom}
            balance={balance}
            onSpendCoins={handleSpendCoins}
          />
        )}

        {activeTab === 'games' && (
          <div className="games-container">
            <h2>🎮 Игры и развлечения</h2>
            <div className="games-grid">
              <GameBingo user={user} balance={balance} onSpendCoins={handleSpendCoins} />
              <GameBattle user={user} balance={balance} onSpendCoins={handleSpendCoins} />
              <ToastGenerator user={user} balance={balance} onSpendCoins={handleSpendCoins} />
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="rooms-container">
            <h2>🚪 Комнаты</h2>
            {/* Список комнат */}
          </div>
        )}

        {activeTab === 'profile' && isAdmin && (
          <AdminPanel user={user} />
        )}
      </div>

      <nav className="bottom-nav">
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}>
          💬 Чат
        </button>
        <button onClick={() => setActiveTab('games')} className={activeTab === 'games' ? 'active' : ''}>
          🎮 Игры
        </button>
        <button onClick={() => setActiveTab('rooms')} className={activeTab === 'rooms' ? 'active' : ''}>
          🚪 Комнаты
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>
            ⭐ Админ
          </button>
        )}
      </nav>
    </div>
  );
};

export default MainApp;