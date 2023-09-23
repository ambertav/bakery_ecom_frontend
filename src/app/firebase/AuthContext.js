import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth); // Use your custom auth object

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      // setUser(currentUser); // You don't have setUser defined
    });
    return () => unsubscribe();
  }, []);

  // You need to store the user state somewhere
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
