import axios from 'axios';
import { getIdToken } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/firebase/AuthContext';


import { CartItem, ShoppingCart } from '../../types/types';
import LoadingSpinner from '@/components/LoadingSpinner';



export default function ShoppingCart () {
    const { user } = useAuth();

    const [ cart, setCart ] = useState<ShoppingCart | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        const fetchShoppingCart = async () => {
            try {

            } catch (error) {
                console.error('Error fetching shopping cart: ', error);
            }
        }
        fetchShoppingCart();
        setTimeout(() => {
            setIsLoading(false);
        }, 750);
    }, []);

    function loaded () {
        return (
            <main>
                Loaded
            </main>
        );
    }

    function loading () {
        return <LoadingSpinner />;
    }

    return isLoading ? loading() : loaded();

}