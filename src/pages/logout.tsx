import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Logout() {
    const router = useRouter();
    const { logout } = useAuth();

    useEffect(() => {
        const handleLogout = async () => {
            await logout();
            router.push('/'); 
        }

        handleLogout();
    }, []);

    return null;
}
