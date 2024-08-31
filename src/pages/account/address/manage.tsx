import axios from '../../../utilities/axiosConfig';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import LoadingSpinner from '@/components/LoadingSpinner';

import { AddressType } from '../../../../types/types';

export default function ManageAddress() {
  const { user } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<AddressType[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchAddresses = async () => {
      if (user) {
        try {
          const response = await axios.get('address/');
          if (response.status === 200) setAddresses(response.data.addresses);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        } finally {
          timeout = setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      }
    };
    fetchAddresses();

    return () => clearTimeout(timeout);
  }, []);

  async function handleDefault(id: number) {
    try {
      const response = await axios.put(`address/default/${id}`, null);
      if (response.status === 200) router.reload();
    } catch (error) {
      console.error('Error updating addresses:', error);
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await axios.delete(`address/${id}/delete`);
      if (response.status === 200) router.reload();
    } catch (error: any) {
      if (
        error.response.status === 400 &&
        error.response.data.error === 'Violates not null constraint'
      ) {
        setErrorMessage(
          'This address is associated with an order and cannot be deleted'
        );
      }
      console.error('Error deleting address:', error);
    }
  }

  function loaded() {
    return (
      <main>
        <h1>Manage Addresses</h1>
        <div>
          {errorMessage ? errorMessage : ''}
          {addresses ? (
            <ul>
              {addresses!.map((a, index) => (
                <li key={index}>
                  <p>
                    {a.firstName} {a.lastName}
                  </p>
                  <p>{a.street}</p>
                  <p>
                    {a.city}, {a.state} {a.zip}
                  </p>
                  <p>
                    {' '}
                    {a.default ? (
                      'Current Default'
                    ) : (
                      <button onClick={() => handleDefault(a.id!)}>
                        Set as Default
                      </button>
                    )}
                  </p>
                  <button onClick={() => handleDelete(a.id!)}>
                    Delete Address
                  </button>
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

  function loading() {
    return <LoadingSpinner />;
  }

  return isLoading ? loading() : loaded();
}
