import React, { useState, useEffect } from 'react';

const BINGO_ITEMS = [
  'Рустам поправил галстук',
  'Лиза заплакала',
  'Кто-то украл цветок',
  'Драка на танцполе',
  'Бабушка танцует',
  'Тост со слезами',
  'Кто-то уснул',
  'Фотосессия',
  'Конкурс',
  'Поцелуй',
  'Разбился бокал',
  'Кто-то поет',
  'Танцы до упаду',
  'Объятия',
  'Селфи с молодоженами',
  'Шутка про тещу'
];

const GameBingo = ({ user, balance, onSpendCoins }) => {
  const [bingoCard, setBingoCard] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [hasBingo, setHasBingo] = useState(false);

  useEffect(() => {
    // Генерируем случайную карточку 3x3
    const shuffled = [...BINGO_ITEMS].sort(() => Math.random() - 0.5);
    setBingoCard(shuffled.slice(0, 9));
  }, []);

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);

    // Проверяем на бинго
    checkBingo(newChecked);
  };

  const checkBingo = (checked: Set<string>) => {
    // Проверка по горизонтали, вертикали и диагонали
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтали
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикали
      [0, 4, 8], [2, 4, 6] // диагонали
    ];

    for (const line of lines) {
      if (line.every(index => checked.has(bingoCard[index]))) {
        setHasBingo(true);
        alert('🎉 БИНГО! Ты выиграл 1000 монет!');
        return;
      }
    }
  };

  return (
    <div className="game-card">
      <h3>🎯 Свадебное Бинго</h3>
      <p className="game-description">
        Отмечай события, которые видишь на свадьбе!
      </p>
      <div className="bingo-grid">
        {bingoCard.map((item, index) => (
          <button
            key={index}
            onClick={() => toggleItem(item)}
            className={`bingo-cell ${checkedItems.has(item) ? 'checked' : ''}`}
          >
            {item}
          </button>
        ))}
      </div>
      {hasBingo && (
        <div className="bingo-win">
          🎉🎉🎉 БИНГО! Поздравляем!
        </div>
      )}
    </div>
  );
};

export default GameBingo;