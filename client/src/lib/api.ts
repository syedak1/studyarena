import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({ baseURL: `${API_BASE}/api` });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getPlayerUid(): string {
  if (typeof window === 'undefined') return '';
  let uid = localStorage.getItem('playerUid');
  if (!uid) {
    uid = Math.random().toString(36).slice(2, 10);
    localStorage.setItem('playerUid', uid);
  }
  return uid;
}

export async function silentAuth(name: string) {
  const uid = getPlayerUid();
  const email = `player.${uid}@studyarena.demo`;
  const password = `demo-${uid}`;
  let data;
  try {
    data = (await api.post('/auth/signup', { email, password, name, school: 'University of Michigan', schoolType: 'COLLEGE' })).data;
  } catch {
    data = (await api.post('/auth/login', { email, password })).data;
  }
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.user.id);
  localStorage.setItem('studentName', name);
  return data;
}

export function getToken() { return typeof window !== 'undefined' ? localStorage.getItem('token') : null; }
export function getUserId() { return typeof window !== 'undefined' ? localStorage.getItem('userId') : null; }
export function isLoggedIn() { return !!getToken(); }

export async function uploadResource(file: File, title: string) {
  const fd = new FormData(); fd.append('file', file); fd.append('title', title);
  return (await api.post('/resources/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
}

export async function generateQuiz(resourceId: string, numQuestions = 5) {
  return (await api.post('/quizzes/generate', { resourceId, numQuestions })).data;
}

export async function createRoom(quizId: string, timePerQuestion = 20) {
  return (await api.post('/rooms/create', { quizId, timePerQuestion })).data;
}

export async function getRoomByCode(joinCode: string) {
  return (await api.get(`/rooms/${joinCode}`)).data;
}

// ─── Leaderboard ───

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  totalScore: number;
  totalCorrect: number;
  totalAnswered: number;
  gamesPlayed: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    return (await api.get('/leaderboard')).data;
  } catch {
    return [];
  }
}

export async function getMyStats() {
  try {
    return (await api.get('/leaderboard/me')).data;
  } catch {
    return { totalScore: 0, totalCorrect: 0, totalAnswered: 0, gamesPlayed: 0 };
  }
}

export default api;