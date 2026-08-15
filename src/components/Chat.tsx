import React, { useState, useRef, useEffect } from 'react';
import { SECRET_ROOMS } from '../firebase';
import './Chat.css';

interface ChatProps {
  user: any;
  messages: any[];
  sendMessage: (text: string, room?: string) => void;
  currentRoom: string;
  setCurrentRoom: (room: string) => void;
  balance: number;
  onSpendCoins: (amount: number) => void;
}

const ROOMS = [
  { id: 'main', name: 'Общий чат', icon: '💬' },
  { id: 'toasts', name: 'Тосты и поздравления', icon: '🥂' },
  { id: 'photos', name: 'Фото и видео', icon: '📸' },
];

const Chat: React.FC<ChatProps> = ({ user, messages, sendMessage, currentRoom, setCurrentRoom, balance, onSpendCoins }) => {
  const [messageText, setMessageText] = useState('');
  const [showSecretRoom, setShowSecretRoom] = useState(false);
  const [secretPassword, setSecretPassword] = useState('');
  const [secretRooms, setSecretRooms] = useState<string[]>([]);
  const [pinnedMessage, setPinnedMessage] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      sendMessage(messageText, currentRoom);
      setMessageText('');
    }
  };

  const handleSecretRoom = () => {
    const upperPassword = secretPassword.toUpperCase();
    if (SECRET_ROOMS[upperPassword]) {
      setSecretRooms([...secretRooms, upperPassword]);
      setSecretPassword('');
      setShowSecretRoom(false);
    } else {
      alert('Неверный пароль! 😜');
    }
  };

  const handlePinMessage = (message: any) => {
    if (balance >= 200) {
      onSpendCoins(200);
      setPinnedMessage(message);
      setTimeout(() => setPinnedMessage(null), 10000);
    } else {
      alert('Недостаточно монет! Нужно 200 🪙');
    }
  };

  const filteredMessages = messages.filter(m => m.room === currentRoom);

  return (
    <div className="chat-container">
      <div className="rooms-tabs">
        {ROOMS.map(room => (
          <button
            key={room.id}
            onClick={() => setCurrentRoom(room.id)}
            className={`room-tab ${currentRoom === room.id ? 'active' : ''}`}
          >
            {room.icon} {room.name}
          </button>
        ))}
        {secretRooms.map(roomKey => (
          <button
            key={roomKey}
            onClick={() => setCurrentRoom(roomKey)}
            className="room-tab secret"
          >
            {SECRET_ROOMS[roomKey].icon} {SECRET_ROOMS[roomKey].name}
          </button>
        ))}
        <button onClick={() => setShowSecretRoom(true)} className="room-tab add-room">
          🔒
        </button>
      </div>

      {showSecretRoom && (
        <div className="secret-room-modal">
          <input
            type="password"
            value={secretPassword}
            onChange={(e) => setSecretPassword(e.target.value)}
            placeholder="Секретный пароль"
          />
          <button onClick={handleSecretRoom}>Войти</button>
          <button onClick={() => setShowSecretRoom(false)}>Отмена</button>
        </div>
      )}

      {pinnedMessage && (
        <div className="pinned-message">
          📌 {pinnedMessage.userName}: {pinnedMessage.text}
        </div>
      )}

      <div className="messages-list">
        {filteredMessages.map(message => (
          <div key={message.id} className={`message ${message.userId === user.id ? 'own' : ''}`}>
            <div className="message-header">
              <span className="message-emoji">{message.emoji}</span>
              <span className="message-user">{message.userName}</span>
              <span className="message-time">
                {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="message-text">{message.text}</div>
            <div className="message-actions">
              <button className="action-btn" onClick={() => handlePinMessage(message)}>
                📌 (200🪙)
              </button>
              <button className="action-btn">❤️</button>
              <button className="action-btn">😂</button>
              <button className="action-btn">🔥</button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Сообщение в ${currentRoom}...`}
          maxLength={500}
        />
        <button onClick={handleSend} className="send-btn">➤</button>
      </div>
    </div>
  );
};

export default Chat;