import axios from '../../utilities/axiosConfig';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import LoadingSpinner from '@/components/LoadingSpinner';

import { AddressType, OrderType } from '../../../types/types';

export default function Account() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderType[] | null>(null);
  const [address, setAddress] = useState<AddressType | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchRecentOrders = async () => {
      if (user) {
        try {
          const response = await axios.get('order/?recent=true');
          if (response.status === 200) setOrders(response.data.orders);
          else throw new Error('Failed to fetch recent orders');
        } catch (error) {
          console.error('Error fetching order history: ', error);
          throw error;
        }
      }
    };

    const fetchDefaultAddress = async () => {
      if (user) {
        try {
          const response = await axios.get('address/?default=true');
          if (response.status === 200) setAddress(response.data.addresses);
          else throw new Error('Failed to fetch default address');
        } catch (error) {
          console.error('Error fetching default addresses:', error);
          throw error;
        }
      }
    };

    const fetchData = async () => {
      try {
        // to fetch recent orders and default addresses concurrently
        await Promise.all([fetchRecentOrders(), fetchDefaultAddress()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        timeout = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchData();

    return () => clearTimeout(timeout);
  }, []);

  function loaded() {
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
                    <p>{o.id}</p>
                    <p>{o.date}</p>
                    <p>{o.totalPrice}</p>
                    <p>{o.status}</p>
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
              <p>
                {address && address.firstName} {address && address.lastName}
              </p>
              <p>{address && address.street}</p>
              <p>
                {address && address.city}, {address && address.state}{' '}
                {address && address.zip}
              </p>
            </div>
          ) : (
            'no default address'
          )}
          <Link href={'/account/address/manage'}>Manage All Addresses</Link>
        </div>
      </main>
    );
  }

  function loading() {
    return <LoadingSpinner />;
  }

  return isLoading ? loading() : loaded();
}
