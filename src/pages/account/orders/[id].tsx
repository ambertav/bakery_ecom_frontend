import axios from 'axios';
import Link from 'next/link';
import { getIdToken } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/app/firebase/AuthContext';

import LoadingSpinner from '@/components/LoadingSpinner';

import { OrderType, AddressType, ShoppingCart  } from '../../../../types/types';

export default function OrderDetail () {
    const router = useRouter();
    const { user } = useAuth();
    const { id } = router.query;

    const [ isLoading, setIsLoading ] = useState <boolean> (true);
    const [ order, setOrder ] = useState <OrderType | null> (null);
    const [ address, setAddress ] = useState <AddressType | null> (null);
    const [ items, setItems ] = useState <ShoppingCart | null > (null);

    const url = `http://127.0.0.1:5000/api/order/${id}`;


    useEffect(() => {
        const fetchOrder = async () => {
            if (user) {
                try {
                    const token = await getIdToken(user);
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    if (response.status === 200) {
                        const { id, date, paymentStatus, shippingMethod, status, totalPrice } = response.data.order;
                        setOrder({
                            id,
                            date,
                            paymentStatus,
                            shippingMethod,
                            status,
                            totalPrice
                        });
                        setAddress(response.data.order.address);
                        setItems(response.data.order.items);
                    }
                    
                } catch (error) {
                    console.error('Error fetching order history: ', error);
                }
            }
        }
        fetchOrder();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    function loaded () {
        return (
            <main>
                <h1>Order</h1>
                <div>
                    <div>
                        { items ? (
                            items.map((i, index) => (
                            <li key={index}>
                                <p>{ i.name }</p>
                                <img src={ i.image } alt={ i.name } />
                                <p>{ i.quantity }</p>
                                <p>{ i.price }</p>
                                <Link href={`/products/${ i.productId }`}>View Product</Link>
                            </li>
                            ))
                        ) : ( 'no items' )}
                    </div>
                    <div>
                        <p>Placed On: { order && order.date }</p>
                        <p>Status: { order && order.status }</p>
                        <p>Shipping method: { order && order.shippingMethod }</p>
                        <p>Payment status: { order && order.paymentStatus }</p>
                    </div>
                    <div>
                        <p>Ship To</p>
                        <p>{ address && address.firstName } { address && address.lastName }</p>
                        <p>{ address && address.street }</p>
                        <p>{ address && address.city }, { address && address.state } { address && address.zip }</p>
                    </div>
                </div>
            </main>
        );
    }

    function loading () {
        return <LoadingSpinner />;
    }

    return isLoading ? loading() : loaded();
}