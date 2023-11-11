import axios from '../../../utilities/axiosConfig';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/firebase/AuthContext';

import LoadingSpinner from '@/components/LoadingSpinner';

import { OrderType } from '../../../../types/types';

export default function OrderHistory () {
    const { user } = useAuth();

    const [ isLoading, setIsLoading ] = useState <boolean> (true);
    const [ orders, setOrders ] = useState <OrderType[] | null> (null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                try {
                    const response = await axios.get('order/');
                    if (response.status === 200) setOrders(response.data.orders);
                } catch (error) {
                    console.error('Error fetching order history: ', error);
                }
            }
        }
        fetchOrders();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    function loaded () {
        return (
            <main>
                <h1>Order History</h1>
                <div>
                    {orders ? (
                        <ul>
                            {orders!.map((o, index) => (
                                <li key={index}>
                                    <p>{ o.id }</p>
                                    <p>{ o.date }</p>
                                    <p>{ o.totalPrice }</p>
                                    <p>{ o.status }</p>
                                    <Link href={`/account/orders/${o.id}`}>View Order</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        'no orders'
                    )}
                </div>
            </main>
        );
    }

    function loading () {
        return <LoadingSpinner />;
    }

    return isLoading ? loading() : loaded();
}
