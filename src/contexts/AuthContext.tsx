import axios from '../utilities/axiosConfig';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../../types/types';

interface AuthContextType {
    user : User | null;
    logout : () => Promise<void>;
}

interface AuthContextProviderProps {
    children : ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () : AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthContextProvider = ({ children } : AuthContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('user/info');
                if (response.status === 200) setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user info: ', error);
            }
        }


        checkAuth();
    }, []);

    const logout = async () => {
        try {
            const response = await axios.get('user/logout');
            if (response.status === 200) setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
