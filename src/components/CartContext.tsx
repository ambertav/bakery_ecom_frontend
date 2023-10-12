import axios from 'axios';
import { useRouter } from 'next/router';
import { getIdToken, User } from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/app/firebase/AuthContext';
import { ShoppingCart } from '../../types/types';

type CartContextType = {
    cart: ShoppingCart | null;
    user: User;
    error: Error | null;
    handleRemove: (id: number) => void;
    updateQuantity: (action: 'minus' | 'plus', id: number, quantity: number) => void;
}

type CartContextProviderProps = {
    children: ReactNode;
}

const CartContext = createContext <CartContextType | undefined> (undefined);

export const useCartContext = () => {
    return useContext(CartContext);
}

export const CartContextProvider = ({ children }: CartContextProviderProps) => {
    const { user } = useAuth();
    const router = useRouter();

    const [ cart, setCart ] = useState<ShoppingCart | null>(null);
    const [ error, setError ] = useState<Error | null>(null);

    const url = 'http://127.0.0.1:5000/user/cart/';

    useEffect(() => {
        const fetchShoppingCart = async () => {
            if (user) {
                try {
                    const token = await getIdToken(user);
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    if (response.status === 200) setCart(response.data.shopping_cart);
                } catch (error) {
                    console.error('Error fetching shopping cart: ', error);
                }
            }
        }
        fetchShoppingCart();
    }, [user, cart]);

    async function handleRemove (id : number) {
        try {
            const token = await getIdToken(user);
            const response = await axios.delete(url + id + '/delete', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });
            if (response.status === 200) router.reload();
        } catch (error) {
            console.error('Error removing from cart: ', error);
        } 
    }

    async function updateQuantity (action : 'minus' | 'plus', id : number, quantity : number) {
        let newQty = quantity;
        if (action === 'minus') newQty--;
        else if (action === 'plus') newQty++;
        try {
            const token = await getIdToken(user);
            const response = await axios.put(url + id + '/update', { newQty }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });
            if (response.status === 200) router.reload();
        } catch (error) {
            console.error('Error updating cart: ', error);
        } 
    }

    return (
        <CartContext.Provider value={{ cart, user, error, handleRemove, updateQuantity }}> 
            { children }
        </CartContext.Provider>
    );
}