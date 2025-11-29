import { create } from 'zustand';

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
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: role === 'manager' ? 'mgr-001' : 'emp-001',
      name: role === 'manager' ? 'Alex Manager' : 'John Employee',
      email,
      role,
      department: 'Engineering',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    
    const newState = {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
      isAuthenticated: true,
    };
    
    saveToStorage(newState);
    set(newState);
  },
  
  register: async (name: string, email: string, password: string, role: UserRole) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'emp-' + Date.now(),
      name,
      email,
      role,
      department: 'Engineering',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    
    const newState = {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
      isAuthenticated: true,
    };
    
    saveToStorage(newState);
    set(newState);
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
