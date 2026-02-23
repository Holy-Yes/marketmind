import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('mm_token');
        const savedUser = localStorage.getItem('mm_user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const register = async (email, password, name) => {
        const res = await api.register({ email, password, name });
        localStorage.setItem('mm_token', res.access_token);
        localStorage.setItem('mm_user', JSON.stringify(res.user));
        setUser(res.user);
        return res;
    };

    const login = async (email, password) => {
        const res = await api.login({ email, password });
        localStorage.setItem('mm_token', res.access_token);
        localStorage.setItem('mm_user', JSON.stringify(res.user));
        setUser(res.user);
        return res;
    };

    const logout = () => {
        localStorage.removeItem('mm_token');
        localStorage.removeItem('mm_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
