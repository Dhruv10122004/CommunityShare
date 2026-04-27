import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!storedUser || !token) {
                setAuthLoading(false); 
                return;
            }

            try {
                await api.get('/auth/profile');
                setUser(JSON.parse(storedUser));
            } catch (err) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setAuthLoading(false); 
            }
        };

        validateToken();
    }, []);

    useEffect(() => {
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
        return () => api.interceptors.response.eject(interceptor);
    }, [navigate]);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.token && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
        }
    };

    const register = async (userData) => {
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
    };

    const token = localStorage.getItem('token');

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            register,
            logout,
            authLoading  
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);