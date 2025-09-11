import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api'; // 👈 **CRITICAL CHANGE #1: Import your custom 'api' instance**

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ⬇️ Axios interceptor to auto-logout on token expiry/invalid
  useEffect(() => {
    // 👇 **CRITICAL CHANGE #2: Attach the interceptor to your 'api' instance**
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => api.interceptors.response.eject(interceptor);
  }, [navigate]); // Added navigate as a dependency

  const login = async (email, password) => {
    // 👇 **CRITICAL CHANGE #3: Use 'api' for all requests**
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
    }
  };

  const register = async (userData) => {
    // 👇 **CRITICAL CHANGE #4: Use 'api' for all requests**
    const res = await api.post('/auth/register', userData);
    if (res.data.token && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Note: The Authorization header is managed by the interceptor in api.js now,
    // so deleting it from a global default is no longer necessary.
  };

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