import React, { useState, useEffect } from 'react';

const QUESTIONS = [
  {
    question: 'Кто первый признался в любви?',
    options: ['Рустам', 'Лиза', 'Это была любовь с первого взгляда!']
  },
  {
    question: 'Кто лучше готовит?',
    options: ['Рустам', 'Лиза', 'Доставка еды']
  },
  {
    question: 'Кто дольше собирается на свидание?',
    options: ['Рустам', 'Лиза', 'Оба по 2 часа']
  },
  {
    question: 'Кто чаще убирается дома?',
    options: ['Рустам', 'Лиза', 'Робот-пылесос']
  },
  {
    question: 'Кто громче храпит?',
    options: ['Рустам', 'Лиза', 'Соседи жалуются на обоих']
  }
];

const GameBattle = ({ user, balance, onSpendCoins }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [votes, setVotes] = useState<number[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const startBattle = () => {
    if (balance >= 300) {
      onSpendCoins(300);
      setCurrentQuestion(0);
      setVotes([]);
      setHasVoted(false);
      setShowResults(false);
    } else {
      alert('Недостаточно монет! Нужно 300 🪙');
    }
  };

  const vote = (optionIndex: number) => {
    if (!hasVoted) {
      const newVotes = [...votes];
      newVotes[optionIndex] = (newVotes[optionIndex] || 0) + 1;
      setVotes(newVotes);
      setHasVoted(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setVotes([]);
      setHasVoted(false);
      setShowResults(false);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="game-card">
      <h3>⚔️ Битва полов</h3>
      <p className="game-description">
        Голосуй за правильный ответ! Стоимость: 300 🪙
      </p>

      {!showResults && votes.length > 0 ? (
        <>
          <div className="question">
            <h4>{QUESTIONS[currentQuestion].question}</h4>
            {QUESTIONS[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => vote(index)}
                className={`vote-btn ${hasVoted ? 'voted' : ''}`}
                disabled={hasVoted}
              >
                {option}
                {hasVoted && <span className="vote-count">{votes[index] || 0} голосов</span>}
              </button>
            ))}
          </div>
          {hasVoted && (
            <button onClick={nextQuestion} className="btn-primary">
              {currentQuestion < QUESTIONS.length - 1 ? 'Следующий вопрос ➜' : 'Результаты 📊'}
            </button>
          )}
        </>
      ) : showResults ? (
        <div className="battle-results">
          <h4>🏆 Результаты битвы!</h4>
          <p>Лучший знаток пары получает звание "Свадебный эксперт"!</p>
          <button onClick={startBattle} className="btn-primary">
            Начать заново (300🪙)
          </button>
        </div>
      ) : (
        <button onClick={startBattle} className="btn-primary">
          Начать битву! (300🪙)
        </button>
      )}
    </div>
  );
};

export default GameBattle;