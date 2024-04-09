import axios from '../../utilities/axiosConfig';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../app/firebase/AuthContext';
import { useState, useEffect } from 'react';
import { OrderType } from '../../../types/types';

import LoadingSpinner from '@/components/LoadingSpinner';
import FulfillmentItem from '@/components/FulfillmentItem';
import Pagination from '@/components/Pagination';

export default function Fulfillment() {
  const router = useRouter();
  const params = useSearchParams();

  const { isAdmin } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(params?.get('page')) || 1
  );
  // used to change display and to construct fetch endpoint
  const [activeTab, setActiveTab] = useState<string>('pending');

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchOrdersForFulfillment = async () => {
      try {
        const pageParam = `page=${params?.get('page') || 1}`;
        const response = await axios.get(
          `order/fulfillment/${activeTab}/?${pageParam}`
        );
        if (response.status === 200) {
          setOrders(response.data.orders);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        }
      } catch (error) {
        console.error('Error fetching orders for fulfillment: ', error);
      } finally {
        timeout = setTimeout(() => {
          setIsLoading(false);
        }, 750);
      }
    };

    fetchOrdersForFulfillment();

    return () => clearTimeout(timeout);
  }, [activeTab, params?.get('page')]);

  const handleTabChange = (tabName: string) => {
    if (activeTab === tabName) return;
    else setActiveTab(tabName);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    router.push(`fulfillment/?page=${page}`);
  };

  function loaded() {
    return (
      <main>
        <h1>Fulfillment</h1>
        <div>
          <button
            onClick={() => handleTabChange('pending')}
            disabled={activeTab === 'pending'}
          >
            Pending
          </button>
          <button
            onClick={() => handleTabChange('in-progress')}
            disabled={activeTab === 'in-progress'}
          >
            In Progress
          </button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Delivery Method</th>
                <th>Address</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((o, index) => (
                  <>
                    <FulfillmentItem key={index} order={o} />
                    <br />
                  </>
                ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage!}
            totalPages={totalPages!}
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
