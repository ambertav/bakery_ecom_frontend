import axios from 'axios';
import { useRouter } from 'next/router';
import { getIdToken } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/firebase/AuthContext';


import { CartItem, ShoppingCart } from '../../types/types';
import LoadingSpinner from '@/components/LoadingSpinner';



export default function ShoppingCart () {
    const { user } = useAuth();
    const router = useRouter();

    const [ cart, setCart ] = useState<ShoppingCart | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

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
        setTimeout(() => {
            setIsLoading(false);
        }, 900);
    }, [user]);

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

    function loaded () {
        let total : number = 0;
        return (
            <main>
                <h1>Shopping Cart</h1>
                <div>
                    <ul>
                        {cart !== null ? 
                            cart.map((c, key) => {
                                total += Number(c.price);
                                return (
                                    <li key={key}>
                                        <div>
                                            <p>{c.name}</p>
                                            <img src={c.image} />
                                            <p>{c.quantity}</p>
                                            <p>{c.price}</p>
                                            <div>
                                                <button onClick={() => {handleRemove(c.id)}}>Remove from Cart</button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                            :
                            <li>no cart</li>   
                        }
                    </ul>
                    {total > 0 ? 
                        <div>Total price: {total.toFixed(2)}</div>  
                        :
                        ''  
                }
                </div>
            </main>
        );
    }

    function loading () {
        return <LoadingSpinner />;
    }

    return isLoading ? loading() : loaded();

}