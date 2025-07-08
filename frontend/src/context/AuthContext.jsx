/*
Making this AuthContext to manage user authentication state across the application.
This context will provide methods for login, registration, and logout, and will store the user state
in localStorage to persist the session.
It helps us avoid prop drilling and makes the user state accessible throughout the app.
*/
import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.token && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token); // Store token
    }
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    if (res.data.token && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token); // Store token
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove token
    delete axios.defaults.headers.common['Authorization']; // But after logout, if you don’t remove it manually, Axios will continue sending that stale token — even though your app has “logged out.”
  };

  // Optionally, provide the token for convenience
  const token = localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);