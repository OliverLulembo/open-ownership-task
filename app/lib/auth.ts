import { User, UserRole } from '@/types/workflow';
import usersData from '@/data/users.json';

let currentUser: User | null = null;

export function login(email: string): User | null {
  const user = usersData.find(u => u.email === email) as User | undefined;
  if (user) {
    currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    return user;
  }
  return null;
}

export function logout(): void {
  currentUser = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      currentUser = JSON.parse(stored);
    }
  }
  return currentUser;
}

export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

export function requireAuth(): User {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
}

