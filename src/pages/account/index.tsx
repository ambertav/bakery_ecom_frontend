import axios from 'axios';
import Link from 'next/link';
import { getIdToken, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/firebase/AuthContext';

import LoadingSpinner from '@/components/LoadingSpinner';

import { AddressType, OrderType } from '../../../types/types';

export default function Account () {
    const { user } = useAuth();

    const [ isLoading, setIsLoading ] = useState <boolean> (true);
    const [ orders, setOrders ] = useState <OrderType[] | null> (null);
    const [ address, setAddress ] = useState <AddressType | null> (null);

    const url = 'http://127.0.0.1:5000/user/';

    useEffect(() => {
        const fetchRecentOrders = async () => {
            if (user) {
                try {
                    const token = await getIdToken(user);
                    const response = await axios.get(url + 'order/?recent=true', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    if (response.status === 200) setOrders(response.data.orders);
                } catch (error) {
                    console.error('Error fetching order history: ', error);
                }
            }
        }
        const fetchDefaultAddress = async () => {
            if (user) {
                try {
                    const token = await getIdToken(user)
                    const response = await axios.get(url + 'address/?default=true', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    if (response.status === 200) setAddress(response.data.addresses);
                } catch (error) {
                    console.error('Error fetching billing addresses:', error);
                }
            }
        }
        fetchRecentOrders();
        fetchDefaultAddress();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    function loaded () {
        return (
            <main>
                <h1>this is the account page</h1>
                <div>
                    {orders ? (
                        <>
                            <Link href={'/account/orders'}>View All Orders</Link>
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
                        </>
                    ) : (
                        'no orders'
                    )}
                </div>
                <div>
                    <h4>Default Address</h4>
                    {address ? (
                        <div>
                            <p>{ address && address.firstName } { address && address.lastName }</p>
                            <p>{ address && address.street }</p>
                            <p>{ address && address.city }, { address && address.state } { address && address.zip }</p>
                        </div>
                    ) : (
                        'no default address'
                    )}
                    <Link href={'/account/address/manage'}>Manage All Addresses</Link>
                </div>
            </main>
        );
    }

    function loading () {
        return <LoadingSpinner />;
    }

    return isLoading ? loading() : loaded();
}
