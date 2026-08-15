import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminPanel = ({ user }) => {
  const [bonusAmount, setBonusAmount] = useState(500);
  const [message, setMessage] = useState('');

  const giveCoinsToAll = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      snapshot.forEach(async (docSnapshot) => {
        const userData = docSnapshot.data();
        await updateDoc(doc(db, 'users', docSnapshot.id), {
          coins: (userData.coins || 1000) + bonusAmount
        });
      });
      
      alert(`Всем начислено по ${bonusAmount} монет! 🎉`);
    } catch (error) {
      console.error('Error giving coins:', error);
      alert('Ошибка при начислении монет');
    }
  };

  const sendGlobalMessage = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        userId: 'admin',
        userName: 'Система',
        text: message,
        emoji: '📢',
        timestamp: Date.now(),
        room: 'main',
        isSystem: true
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>⭐ Панель администратора</h2>
      
      <div className="admin-section">
        <h3>💰 Начислить монеты всем</h3>
        <div className="admin-controls">
          <input
            type="number"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(Number(e.target.value))}
            min="100"
            max="10000"
          />
          <button onClick={giveCoinsToAll} className="btn-primary">
            Начислить всем
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h3>📢 Системное сообщение</h3>
        <div className="admin-controls">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение для всех..."
            rows={3}
          />
          <button onClick={sendGlobalMessage} className="btn-primary">
            Отправить
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h3>📊 Статистика</h3>
        <p>Пользователей онлайн: ...</p>
        <p>Всего сообщений: ...</p>
        <p>Активных игр: ...</p>
      </div>
    </div>
  );
};

export default AdminPanel;