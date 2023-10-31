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
    const [ addresses, setAddresses ] = useState <AddressType[] | null> (null);

    const url = 'http://127.0.0.1:5000/user/';

    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                try {
                    const token = await getIdToken(user);
                    const response = await axios.get(url + 'order/', {
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
        const fetchAddress = async () => {
            if (user) {
                try {
                    const token = await getIdToken(user)
                    const response = await axios.get(url + 'get-address', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    if (response.status === 200) {
                        const { billAddress, shipAddress } = response.data || {}; 
                        // merges types of addresses
                        const allAddresses : AddressType[] = [...billAddress, ...shipAddress];
                        // removes duplicate addresses
                        const addressSet = new Set(allAddresses.map(serializeAddress));
                         // parse back to json, creates array from set, and assigns to state
                        setAddresses(Array.from(addressSet).map((str) => JSON.parse(str)));
                    }
                } catch (error) {
                    console.error('Error fetching billing addresses:', error);
                }
            }
        }
        fetchOrders();
        fetchAddress();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    function serializeAddress (address : AddressType) {
        return JSON.stringify(address);
    }

    function loaded () {
        return (
            <main>
                <h1>this is the account page</h1>
                <div>
                    {orders ? (
                        <ul>
                        {orders!.map((o, index) => (
                            <li key={index}>
                                <p>{ o.id }</p>
                                <p>{ o.date }</p>
                                <p>{ o.totalPrice }</p>
                                <p>{ o.status }</p>
                                <Link href='/account/orders/:id'></Link>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        'no orders'
                    )}
                </div>
                <div>
                    {addresses ? (
                        <ul>
                        {addresses!.map((a, index) => (
                            <li key={index}>
                                <p>{ a.firstName } { a.lastName }</p>
                                <p>{ a.street }</p>
                                <p>{ a.city }, { a.state } {a.zip}</p>
                                <p>{ a.type }</p>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        'no addresses'
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
