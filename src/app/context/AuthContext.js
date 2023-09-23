import { useContext, createContext, useState, useEffect } from 'react';

// firebase auth methods
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getIdToken, onAuthStateChanged } from 'firebase/auth';
// firebase config
import { auth } from '../firebaseInit';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);

    const signup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            setUser(newUser);
        } catch (error) {
            console.log('Error signing up: ', error);
        }
    }

    const login = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const currentUser = userCredential.user;
            setUser(currentUser);
        } catch (error) {
            console.log('Error logging in: ', error);
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    }

    const getToken = async () => {
        if (user) {
            try {
                const token = await getIdToken(user);
                return token;
            } catch (error) {
                console.error('Error getting token: ', error);
                return null
            }
        }
        return null;
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, [ user ]);

    return (
    <AuthContext.Provider value={{ user, signup, login, logout, getToken }}>{ children }</AuthContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(AuthContext);
}