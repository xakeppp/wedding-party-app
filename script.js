// Конфигурация
const ADMIN_CODES = {
    'RUSTIK': { name: 'Рустам', role: 'admin', emoji: '👑' },
    'LIZOK': { name: 'Лиза', role: 'admin', emoji: '👸' },
    'BESTMAN2024': { name: 'Свидетель', role: 'moderator', emoji: '🎩' }
};

const MONEY_CODES = {
    'GORKO': 500,
    'BOMBOM': 300,
    'HONEYMOON': 1000,
    'PARTY': 250
};

const SECRET_ROOMS = {
    'STEAM_2024': { name: 'Комната Пацанов 🎮', icon: '🍺' },
    'BESTY': { name: 'Комната Девчонок 💅', icon: '💋' },
    'SURPRISE': { name: 'Сюрприз для молодоженов 🎁', icon: '🎁' }
};

const EMOJIS = ['😎', '🥳', '🎉', '💃', '🕺', '🤵', '👰', '🍾', '💖', '🎊', '😜', '🤪', '🦄', '🌟', '🎭', '🎪'];

const TOASTS = [
    'Дорогие Рустам и Лиза! Желаю вам, чтобы ваша любовь была как интернет - безлимитной, быстрой и всегда доступной! 🚀',
    'Пусть ваша семейная жизнь будет как хорошее вино - с годами только лучше! 🍷',
    'Желаю вам, чтобы в вашем доме всегда было три вещи: любовь, смех и вкусная еда! 🏠❤️',
    'Пусть ваша жизнь будет как сказка - долгой и счастливой! ✨',
    'Совет да любовь! Пусть ваши сердца бьются в унисон! 💑'
];

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

const CHALLENGES = [
    'Скажи тост за молодоженов! 🥂',
    'Сделай селфи с невестой! 📸',
    'Станцуй с женихом! 💃',
    'Расскажи смешную историю про Рустама! 😄',
    'Спой песню про любовь! 🎤',
    'Обними 5 человек! 🤗',
    'Придумай новое прозвище для пары! 💑',
    'Покажи свой лучший танец! 🕺',
    'Сделай комплимент всем за столом! ❤️',
    'Расскажи анекдот! 😂'
];

let currentUser = null;
let currentRoom = 'main';
let bingoCard = [];
let checkedBingo = new Set();
let messages = [];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сообщения из localStorage
    const savedMessages = localStorage.getItem('wedding_messages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
    }
    
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('wedding_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainScreen();
    }
});

// Вход
function login() {
    console.log('Функция login вызвана');
    
    const nameInput = document.getElementById('userName');
    const codeInput = document.getElementById('secretCode');
    const errorDiv = document.getElementById('loginError');
    
    const name = nameInput.value.trim();
    const code = codeInput.value.toUpperCase().trim();
    
    console.log('Имя:', name, 'Код:', code);
    
    // Очищаем ошибку
    errorDiv.textContent = '';
    
    if (!name) {
        errorDiv.textContent = 'Введи имя!';
        nameInput.focus();
        return;
    }
    
    let role = 'guest';
    let emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    let bonusCoins = 0;
    
    // Проверяем админ коды
    if (code && ADMIN_CODES[code]) {
        const adminData = ADMIN_CODES[code];
        if (adminData.name.toLowerCase() === name.toLowerCase()) {
            role = adminData.role;
            emoji = adminData.emoji;
            bonusCoins += 5000;
        } else {
            errorDiv.textContent = 'Неверное имя для этого кода! 😏';
            return;
        }
    }
    
    // Проверяем денежные коды
    if (code && MONEY_CODES[code]) {
        bonusCoins += MONEY_CODES[code];
    }
    
    // Создаем пользователя
    currentUser = {
        id: 'user_' + Date.now(),
        name: name,
        emoji: emoji,
        role: role,
        coins: 1000 + bonusCoins,
        createdAt: Date.now()
    };
    
    console.log('Создан пользователь:', currentUser);
    
    // Сохраняем в localStorage
    localStorage.setItem('wedding_user', JSON.stringify(currentUser));
    
    // Показываем главный экран
    showMainScreen();
}

// Показать главный экран
function showMainScreen() {
    console.log('Показываем главный экран');
    
    // Скрываем экран входа
    document.getElementById('loginScreen').style.display = 'none';
    
    // Показываем главный экран
    document.getElementById('mainScreen').style.display = 'flex';
    
    // Обновляем информацию
    document.getElementById('userEmoji').textContent = currentUser.emoji;
    document.getElementById('displayName').textContent = currentUser.name;
    document.getElementById('balance').textContent = currentUser.coins;
    document.getElementById('profileEmoji').textContent = currentUser.emoji;
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileBalance').textContent = currentUser.coins;
    
    // Статус
    let status = 'Гость 🎉';
    if (currentUser.role === 'admin') {
        status = 'Организатор 👑';
        document.getElementById('adminBadge').style.display = 'inline';
        document.getElementById('adminPanel').style.display = 'block';
    } else if (currentUser.role === 'moderator') {
        status = 'Свидетель 🎩';
        document.getElementById('adminBadge').style.display = 'inline';
        document.getElementById('adminPanel').style.display = 'block';
    }
    document.getElementById('profileStatus').textContent = status;
    
    // Загружаем данные
    loadMessages();
    generateBingoCard();
    loadRooms();
}

// Переключение вкладок
function switchTab(tabName) {
    console.log('Переключаем вкладку:', tabName);
    
    const tabs = ['chat', 'games', 'rooms', 'profile'];
    tabs.forEach(tab => {
        const tabElement = document.getElementById(tab + 'Tab');
        if (tabElement) {
            tabElement.style.display = tab === tabName ? 'block' : 'none';
        }
    });
    
    // Обновляем активную вкладку
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Находим нужную кнопку
    const buttons = document.querySelectorAll('.tab');
    const tabIndex = tabs.indexOf(tabName);
    if (buttons[tabIndex]) {
        buttons[tabIndex].classList.add('active');
    }
}

// Отправка сообщений
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const message = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        text: text,
        emoji: currentUser.emoji,
        timestamp: Date.now(),
        room: currentRoom
    };
    
    // Добавляем сообщение
    messages.push(message);
    localStorage.setItem('wedding_messages', JSON.stringify(messages));
    
    // Очищаем input
    input.value = '';
    
    // Обновляем чат
    loadMessages();
    
    // Начисляем монеты
    if (currentUser.coins < 1500) {
        currentUser.coins += 5;
        updateBalance();
    }
}

// Быстрые сообщения
function quickMessage(text) {
    const input = document.getElementById('messageInput');
    if (input) {
        input.value = text;
        sendMessage();
    }
}

// Загрузка сообщений
function loadMessages() {
    const messagesDiv = document.getElementById('messages');
    if (!messagesDiv) return;
    
    messagesDiv.innerHTML = '';
    
    const filteredMessages = messages
        .filter(msg => msg.room === currentRoom)
        .slice(-50);
    
    filteredMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message' + (msg.userId === currentUser.id ? ' own' : '');
        
        const time = new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span>${msg.emoji}</span>
                <span class="message-user">${msg.userName}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-text">${msg.text}</div>
        `;
        
        messagesDiv.appendChild(messageDiv);
    });
    
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Генерация тоста
function generateToast() {
    if (currentUser.coins < 50) {
        alert('Недостаточно монет! Нужно 50 🪙');
        return;
    }
    
    currentUser.coins -= 50;
    updateBalance();
    
    const toast = TOASTS[Math.floor(Math.random() * TOASTS.length)];
    const input = document.getElementById('messageInput');
    if (input) {
        input.value = toast;
        sendMessage();
    }
}

// Бинго
function generateBingoCard() {
    const shuffled = [...BINGO_ITEMS].sort(() => Math.random() - 0.5);
    bingoCard = shuffled.slice(0, 9);
    checkedBingo.clear();
    
    const bingoGrid = document.getElementById('bingoGrid');
    if (!bingoGrid) return;
    
    bingoGrid.innerHTML = '';
    
    bingoCard.forEach(item => {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.textContent = item;
        cell.onclick = function() {
            toggleBingoItem(item, cell);
        };
        bingoGrid.appendChild(cell);
    });
}

function toggleBingoItem(item, cell) {
    if (checkedBingo.has(item)) {
        checkedBingo.delete(item);
        cell.classList.remove('checked');
    } else {
        checkedBingo.add(item);
        cell.classList.add('checked');
    }
    
    checkBingo();
}

function checkBingo() {
    if (!bingoCard.length) return;
    
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (const line of lines) {
        if (line.every(index => checkedBingo.has(bingoCard[index]))) {
            currentUser.coins += 1000;
            updateBalance();
            alert('🎉 БИНГО! Ты выиграл 1000 монет!');
            generateBingoCard();
            break;
        }
    }
}

// Битва полов
function startBattle() {
    if (currentUser.coins < 300) {
        alert('Недостаточно монет! Нужно 300 🪙');
        return;
    }
    
    currentUser.coins -= 300;
    updateBalance();
    
    const questions = [
        { q: 'Кто первый признался в любви?', options: ['Рустам', 'Лиза', 'Оба сразу'] },
        { q: 'Кто лучше готовит?', options: ['Рустам', 'Лиза', 'Доставка еды'] },
        { q: 'Кто дольше собирается?', options: ['Рустам', 'Лиза', 'Оба по 2 часа'] }
    ];
    
    const question = questions[Math.floor(Math.random() * questions.length)];
    const battleArea = document.getElementById('battleArea');
    
    if (battleArea) {
        battleArea.innerHTML = `
            <h4 style="margin: 15px 0;">${question.q}</h4>
            ${question.options.map((opt, i) => `
                <button onclick="voteBattle(${i})" class="btn-game" style="margin: 5px; width: 100%;">
                    ${opt}
                </button>
            `).join('')}
        `;
    }
}

function voteBattle(optionIndex) {
    const battleArea = document.getElementById('battleArea');
    if (battleArea) {
        battleArea.innerHTML = '<p style="margin: 15px 0;">Голос учтен! ✅</p>';
    }
    currentUser.coins += 50;
    updateBalance();
}

// Случайный конкурс
function randomChallenge() {
    if (currentUser.coins < 100) {
        alert('Недостаточно монет! Нужно 100 🪙');
        return;
    }
    
    currentUser.coins -= 100;
    updateBalance();
    
    const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    const challengeResult = document.getElementById('challengeResult');
    
    if (challengeResult) {
        challengeResult.innerHTML = `
            <h4 style="margin: 15px 0;">Твое задание:</h4>
            <p style="font-size: 18px; margin: 20px 0;">${challenge}</p>
            <button onclick="completeChallenge()" class="btn-game">Готово! +200🪙</button>
        `;
    }
}

function completeChallenge() {
    currentUser.coins += 200;
    updateBalance();
    const challengeResult = document.getElementById('challengeResult');
    if (challengeResult) {
        challengeResult.innerHTML = '<p style="margin: 15px 0;">Красавчик! 🎉</p>';
    }
}

// Комнаты
function loadRooms() {
    const roomsList = document.getElementById('roomsList');
    if (!roomsList) return;
    
    const rooms = [
        { id: 'main', name: '💬 Общий чат' },
        { id: 'toasts', name: '🥂 Тосты и поздравления' },
        { id: 'photos', name: '📸 Фото и видео' }
    ];
    
    roomsList.innerHTML = rooms.map(room => `
        <div class="room-card" onclick="switchRoom('${room.id}')">
            ${room.name}
        </div>
    `).join('');
}

function switchRoom(roomId) {
    currentRoom = roomId;
    loadMessages();
}

function joinSecretRoom() {
    const passwordInput = document.getElementById('roomPassword');
    const password = passwordInput.value.toUpperCase().trim();
    
    if (SECRET_ROOMS[password]) {
        const room = SECRET_ROOMS[password];
        currentRoom = password.toLowerCase();
        loadMessages();
        alert('Вы вошли в комнату: ' + room.name);
        passwordInput.value = '';
    } else {
        alert('Неверный пароль! 😜');
    }
}

// Обновление баланса
function updateBalance() {
    document.getElementById('balance').textContent = currentUser.coins;
    document.getElementById('profileBalance').textContent = currentUser.coins;
    localStorage.setItem('wedding_user', JSON.stringify(currentUser));
}

// Админ функции
function giveCoinsToAll() {
    if (currentUser.role === 'admin' || currentUser.role === 'moderator') {
        alert('Всем гостям начислено по 500 монет! 🎉');
    }
}

// Выход
function logout() {
    localStorage.removeItem('wedding_user');
    location.reload();
}

// Для отладки - выводим в консоль
console.log('Скрипт загружен успешно!');
console.log('Доступные функции:', Object.keys(window).filter(k => typeof window[k] === 'function'));
