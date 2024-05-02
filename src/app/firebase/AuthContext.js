import axios from '../../utilities/axiosConfig';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';

import debounce from 'lodash/debounce';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [user, loading, error] = useAuthState(auth); 
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [name, setName] = useState('');

    const debouncedFetchUserInfo = debounce(async () => {
        try {
            const response = await axios.get('/user/info');
            if (response.status === 200) {
                setName(response.data.name);
                setIsAdmin(response.data.isAdmin);
            }
        } catch (error) {
            console.error('Error fetching user info: ', error);
        }
    }, 750);

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

        // Call the debounced function when user or isAdmin changes
        if (user && isAdmin === null) {
            debouncedFetchUserInfo();
        }

        // Cleanup function to cancel the debounce timer
        return () => {
            debouncedFetchUserInfo.cancel();
        };
    }, [user, isAdmin, debouncedFetchUserInfo]);

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
        <AuthContext.Provider value={{ user: currentUser, isAdmin: isAdmin, name: name, logout: logout }}>
            {children}
        </AuthContext.Provider>
    );
};
