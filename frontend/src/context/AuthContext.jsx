import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { getToken, setToken, removeToken, isAuthenticated } from '../utils/token';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    const response = await axiosInstance.get('/users/me');
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                    removeToken();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', { username, password });
            const { token } = response.data;
            setToken(token);

            // Fetch user profile immediately
            const profileResponse = await axiosInstance.get('/users/me');
            setUser(profileResponse.data);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            await axiosInstance.post('/auth/register', { username, email, password });
            return { success: true };
        } catch (error) {
            console.error("Registration failed", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        removeToken();
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
