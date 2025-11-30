import { create } from 'zustand';
import { apiFetch, setAuthToken } from '@/lib/api';

export type UserRole = 'employee' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Simple storage helper
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    return stored ? JSON.parse(stored) : { user: null, token: null, isAuthenticated: false };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
};

const saveToStorage = (state: Pick<AuthState, 'user' | 'token' | 'isAuthenticated'>) => {
  try {
    localStorage.setItem('auth-storage', JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
};

const initialState = loadFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  token: initialState.token,
  isAuthenticated: initialState.isAuthenticated,
  
  login: async (email: string, password: string, role: UserRole) => {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: email, password }),
      });

      const newState = {
        user: res.user,
        token: res.token,
        isAuthenticated: true,
      };

      setAuthToken(res.token);
      saveToStorage(newState);
      set(newState);
    } catch (err) {
      throw new Error('Login failed');
    }
  },
  
  register: async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username: email, email, password, role }),
      });

      const newState = {
        user: res.user,
        token: res.token,
        isAuthenticated: true,
      };

      setAuthToken(res.token);
      saveToStorage(newState);
      set(newState);
    } catch (err) {
      throw new Error('Registration failed');
    }
  },
  
  logout: () => {
    const newState = {
      user: null,
      token: null,
      isAuthenticated: false,
    };
    saveToStorage(newState);
    set(newState);
  },
  
  setUser: (user: User) => {
    set((state) => {
      const newState = { ...state, user };
      saveToStorage(newState);
      return newState;
    });
  },
}));
