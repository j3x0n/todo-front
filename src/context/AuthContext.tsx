import { createContext, useState, ReactNode } from 'react';
import { setAuthHeader, clearAuthHeader, default as api } from '../axios';

interface AuthContextProps {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider= ({ children }: {children: ReactNode}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = async (username: string, password: string): Promise<void> => {
    const response = await api.post('/login', { username, password });
    const token = response.data.access_token;
    setToken(token);
    localStorage.setItem('todo-token', token);
    setAuthHeader(token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('todo-token');
    clearAuthHeader();
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
