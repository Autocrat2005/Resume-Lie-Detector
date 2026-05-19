import { LocalSession } from './types';

const STORAGE_KEY = 'rld_sessions';

export function getLocalSessions(): LocalSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalSession(session: LocalSession): void {
  if (typeof window === 'undefined') return;
  const sessions = getLocalSessions();
  sessions.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 50)));
}

export function getLocalSession(id: string): LocalSession | null {
  const sessions = getLocalSessions();
  return sessions.find((s) => s.id === id) || null;
}

export function updateLocalSessionAnswers(
  id: string,
  answer: {
    question: string;
    skill: string;
    answer: string;
    passed: boolean;
    feedback: string;
  }
): void {
  if (typeof window === 'undefined') return;
  const sessions = getLocalSessions();
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    sessions[idx].answers.push(answer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
}

export function clearLocalSessions(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
