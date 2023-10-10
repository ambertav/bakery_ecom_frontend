import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '@/app/firebase/AuthContext';
import { getIdToken } from 'firebase/auth';


import { ShoppingCart } from '../../types/types';

interface CheckoutProps {
    cart: ShoppingCart;
}

export default function CheckoutButton ({ cart } : CheckoutProps) {
    const { user } = useAuth();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const url = 'http://127.0.0.1:5000/create-checkout-session'

    async function handleCheckout () {
        setIsLoading(true);
        try {
            const token = await getIdToken(user);
            const response = await axios.post(url, { cart }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            window.location = response.data.checkout_url;
        } catch (error) {
            console.error('Error creating Checkout session:', error);
            setIsLoading(false);
        }
    }

    return (
        <button onClick={handleCheckout} disabled={isLoading} >
            {
                isLoading ? 'Processing...' : 'Checkout'
            }
        </button>
    );
}