import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../app/firebase/firebaseConfig';

async function logout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

export default function Logout() {
  const router = useRouter();
    useEffect(() => {
        const handleLogout = async () => {
            await logout();
            router.push('/'); 
        }

        handleLogout();
    }, []);
    return null;
}
