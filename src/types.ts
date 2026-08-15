export interface User {
  id: string;
  name: string;
  emoji: string;
  role: 'guest' | 'admin' | 'moderator';
  coins: number;
  createdAt: number;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  emoji: string;
  timestamp: number;
  room: string;
  isPinned?: boolean;
  reactions?: { emoji: string; count: number }[];
}

export interface Room {
  id: string;
  name: string;
  isSecret: boolean;
  password?: string;
  icon: string;
}

export interface GameState {
  bingo: {
    card: string[];
    checked: string[];
    completed: boolean;
  };
  battle: {
    currentQuestion: string;
    votes: { [key: string]: number };
    phase: 'question' | 'voting' | 'results';
  };
}