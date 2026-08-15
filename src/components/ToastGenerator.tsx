import React, { useState } from 'react';

const TOASTS = [
  'Дорогие Рустам и Лиза! Желаю вам, чтобы ваша любовь была как интернет - безлимитной, быстрой и всегда доступной! 🚀',
  'Пусть ваша семейная жизнь будет как хорошее вино - с годами только лучше и крепче! 🍷',
  'Рустам, помни: счастливый муж - это муж, который всегда прав. Лиза, помни: счастливая жена - это жена, которая всегда права. Живите дружно! 😄',
  'Желаю вам, чтобы в вашем доме всегда было три вещи: любовь, смех и вкусная еда! 🏠❤️',
  'Лиза, передаю тебе инструкцию к Рустаму: кормить, любить, хвалить, и он будет самым счастливым! 😜',
  'Пусть ваша жизнь будет как сказка - долгой и счастливой, но без драконов и злых колдуний! 🐉✨',
  'Желаю вам море любви, океан счастья и реки шампанского! 🥂',
  'Рустам и Лиза! Пусть ваш семейный бюджет всегда будет в плюсе, а ссоры - только из-за того, кто кого больше любит! 💑',
  'Совет да любовь! Пусть ваши сердца бьются в унисон, как лучший танцевальный дуэт! 💃🕺',
  'Желаю вам, чтобы через 50 лет вы так же смотрели друг на друга влюбленными глазами! 👵👴❤️'
];

const ToastGenerator = ({ user, balance, onSpendCoins }) => {
  const [toast, setToast] = useState('');
  const [generated, setGenerated] = useState(false);

  const generateToast = () => {
    if (balance >= 50) {
      onSpendCoins(50);
      const randomToast = TOASTS[Math.floor(Math.random() * TOASTS.length)];
      setToast(randomToast);
      setGenerated(true);
    } else {
      alert('Недостаточно монет! Нужно 50 🪙');
    }
  };

  const copyToast = () => {
    navigator.clipboard.writeText(toast);
    alert('Тост скопирован! Вставь его в чат 🎉');
  };

  return (
    <div className="game-card">
      <h3>🎤 Генератор тостов</h3>
      <p className="game-description">
        Нужен тост? Сгенерируй крутой тост за 50 🪙!
      </p>

      {generated && (
        <div className="toast-text">
          <p>{toast}</p>
          <button onClick={copyToast} className="btn-secondary">
            📋 Скопировать
          </button>
          <button onClick={generateToast} className="btn-secondary">
            🔄 Ещё тост (50🪙)
          </button>
        </div>
      )}

      {!generated && (
        <button onClick={generateToast} className="btn-primary">
          Сгенерировать тост! (50🪙)
        </button>
      )}
    </div>
  );
};

export default ToastGenerator;