import axios from 'axios';
import { getIdToken, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/firebase/AuthContext';

import LoadingSpinner from '@/components/LoadingSpinner';

export default function Account () {
    const { user } = useAuth();

    const [ isLoading, setIsLoading ] = useState <boolean> (true);
    const [ orders, setOrders ] = useState(null);

    const url = 'http://127.0.0.1:5000/user/';

    useEffect(() => {
        const fetchOrders = async () => {
            
        }
        const fetchAddress = async () => {

        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    function loaded () {
        return (
            <h1>this is the account page</h1>
        );
    }

    function loading () {
        return <LoadingSpinner />;
    }

    return isLoading ? loading() : loaded();
}