import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── simple auth ───

export async function silentAuth(name: string) {
  // creates an account if it doesn't exist, or logs in if it does.
  // the name as both the display name and a fake email/password.
  // good enough for now
  const fakeEmail = `${name.toLowerCase().replace(/\s+/g, '.')}@studyarena.demo`;
  const fakePassword = `demo-${name.toLowerCase()}`;

  try {
    // try to sign up first
    const res = await api.post('/auth/signup', {
      email: fakeEmail,
      password: fakePassword,
      name: name,
      school: 'University of Michigan',
      schoolType: 'COLLEGE',
    });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userId', res.data.user.id);
    return res.data;
  } catch {
    // signup fails (email taken), log in instead
    try {
      const res = await api.post('/auth/login', {
        email: fakeEmail,
        password: fakePassword,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      return res.data;
    } catch (loginErr) {
      console.error('Auth failed:', loginErr);
      throw loginErr;
    }
  }
}

// ─── Resources ───

export async function uploadResource(file: File, title: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);

  const res = await api.post('/resources/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// ─── Quizzes ───

export async function generateQuiz(resourceId: string, numQuestions: number = 5) {
  const res = await api.post('/quizzes/generate', { resourceId, numQuestions });
  return res.data;
}

export async function getQuiz(quizId: string) {
  const res = await api.get(`/quizzes/${quizId}`);
  return res.data;
}

// ─── Rooms ───

export async function createRoom(quizId: string, timePerQuestion: number = 20) {
  const res = await api.post('/rooms/create', { quizId, timePerQuestion });
  return res.data;
}

export async function getRoomByCode(joinCode: string) {
  const res = await api.get(`/rooms/${joinCode}`);
  return res.data;
}

export default api;