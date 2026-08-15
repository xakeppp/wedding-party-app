import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  // ЗАМЕНИ НА СВОИ ДАННЫЕ ИЗ FIREBASE CONSOLE
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Константы
export const ADMIN_CODES = {
  'RUSTIK': { name: 'Рустам', role: 'admin', emoji: '👑' },
  'LIZOK': { name: 'Лиза', role: 'admin', emoji: '👸' },
  'BESTMAN2024': { name: 'Свидетель', role: 'moderator', emoji: '🎩' }
};

export const SECRET_ROOMS = {
  'STEAM_2024': { name: 'Комната Пацанов 🎮', icon: '🍺' },
  'BESTY': { name: 'Комната Девчонок 💅', icon: '💋' },
  'SURPRISE': { name: 'Сюрприз для молодоженов 🎁', icon: '🎁' }
};

export const MONEY_CODES = {
  'GORKO': 500,
  'BOMBOM': 300,
  'HONEYMOON': 1000,
  'PARTY': 250
};