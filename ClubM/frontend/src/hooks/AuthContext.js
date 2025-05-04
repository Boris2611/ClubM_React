import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login error');
            return false;
        }
    };
    
    const register = async (name, email, password) => {
        try {
            const data = await registerUser({ name, email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Register error');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok && data.user) {
                    setUser(data.user);
                    setError(null);
                } else {
                    setError('Auth error');
                    setUser(null);
                    localStorage.removeItem('token');
                }
            } catch (err) {
                setError('Auth error');
                setUser(null);
                localStorage.removeItem('token');
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
        // eslint-disable-next-line
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);