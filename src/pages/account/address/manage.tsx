import axios from '../../../utilities/axiosConfig';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/firebase/AuthContext';

import LoadingSpinner from '@/components/LoadingSpinner';

import { AddressType } from '../../../../types/types';

export default function ManageAddress () {
    const { user } = useAuth();
    const router = useRouter();

    const [ isLoading, setIsLoading ] = useState <boolean> (true);
    const [ addresses, setAddresses ] = useState <AddressType[] | null> (null);

    useEffect(() => {
        const fetchAddresses = async () => {
            if (user) {
                try {
                    const response = await axios.get('address/');
                    if (response.status === 200) setAddresses(response.data.addresses);
                } catch (error) {
                    console.error('Error fetching billing addresses:', error);
                }
            }
        }
        fetchAddresses();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);


    async function handleDefault (id : number) {
        try {
            const response = await axios.put(`address/default/${id}`, null);
            if (response.status === 200) router.reload();
        } catch (error) {
            console.error('Error updating addresses:', error);
        }
    }

    async function handleDelete (id : number) {
        try {
            const response = await axios.delete(`address/${id}/delete`);
            if (response.status === 200) router.reload();
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    }

    function loaded () {
        return (
            <main>
                <h1>Manage Addresses</h1>
                <div>
                    {addresses ? (
                        <ul>
                        {addresses!.map((a, index) => (
                            <li key={index}>
                                <p>{ a.firstName } { a.lastName }</p>
                                <p>{ a.street }</p>
                                <p>{ a.city }, { a.state } {a.zip}</p>
                                <p> {a.default ? 'Current Default' : <button onClick={() => handleDefault(a.id)}>Set as Default</button> }</p>
                                <button onClick={() => handleDelete(a.id)}>Delete Address</button>
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
