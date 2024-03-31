import axios from '../../../utilities/axiosConfig';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/firebase/AuthContext';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

import { OrderType } from '../../../../types/types';

export default function OrderHistory() {
  const router = useRouter();
  const params = useSearchParams();

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(params?.get('page')) || 1
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchOrders = async () => {
      if (user) {
        const pageParam = `page=${params?.get('page')}`;

        try {
          const response = await axios.get(`order/?${pageParam}`);
          if (response.status === 200) {
            setOrders(response.data.orders);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
          }
        } catch (error) {
          console.error('Error fetching order history: ', error);
        } finally {
          timeout = setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      }
    };

    fetchOrders();

    return () => clearTimeout(timeout);
  }, [params]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    router.push(`orders?page=${page}`);
  };

  function loaded() {
    return (
      <main>
        <h1>Order History</h1>
        <div>
          {orders && (
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
          )}
        </div>
        <div>
          <Pagination
            totalPages={totalPages!}
            currentPage={currentPage!}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    );
  }

  function loading() {
    return <LoadingSpinner />;
  }

  return isLoading ? loading() : loaded();
}
