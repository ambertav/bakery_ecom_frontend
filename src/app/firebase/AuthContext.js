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
    }, [user]);

    return (
        <AuthContext.Provider value={{ user: currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
