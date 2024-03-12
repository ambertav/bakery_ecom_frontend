import axios from '../../utilities/axiosConfig';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [user, loading, error] = useAuthState(auth); 
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        // listener for authentication changes
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setCurrentUser(currentUser);
        });

        // clean up after unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setCurrentUser(user);

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/user/info');
                if (response.status === 200) {
                    setName(response.data.name);
                    setIsAdmin(response.data.isAdmin);
                }
            } catch (error) {
                console.error('Error fetching user info: ', error);
            }
        }

        if (user && isAdmin === null) fetchUserInfo();

    }, [user]);

    const logout = async () => {
        try {
            await auth.signOut();
            setCurrentUser(null);
            setIsAdmin(null); 
            setName('');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user: currentUser, isAdmin: isAdmin, logout: logout }}>
            {children}
        </AuthContext.Provider>
    );
};
