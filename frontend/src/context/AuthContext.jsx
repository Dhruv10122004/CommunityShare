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
    const res = await axios.post('/api/auth/login', { email, password }); // this is sending the email and password to the backend for authentication
    if (res.data.token && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData); // this is sending the user data to the backend for registration
    if (res.data.token && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ // this will render the child components wrapped in this AuthProvider with the user state and methods
      user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // this is a custom hook to use the AuthContext in any component