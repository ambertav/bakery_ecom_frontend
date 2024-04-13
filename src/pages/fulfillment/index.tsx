import axios from '../../utilities/axiosConfig';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../app/firebase/AuthContext';
import { useState, useEffect } from 'react';
import { OrderType } from '../../../types/types';

import LoadingSpinner from '@/components/LoadingSpinner';
import FulfillmentItem from '@/components/FulfillmentItem';
import Filter from '@/components/Filter';
import Search from '@/components/Search';
import Pagination from '@/components/Pagination';

export default function Fulfillment() {
  const router = useRouter();
  const params = useSearchParams();

  const { isAdmin } = useAuth();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<string>(
    (params?.get('delivery-method') as string) || ''
  );
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(params?.get('page')) || 1
  );
  // used to change display and to construct fetch endpoint
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchOrdersForFulfillment = async () => {
      // defining parameters for axios call
      const deliveryParam = deliveryMethod
        ? `delivery-method=${deliveryMethod}`
        : '';
      const pageParam = `page=${params?.get('page') || 1}`;
      const searchParam = params?.get('search')
        ? `search=${params?.get('search')}`
        : '';

      const queryParams = [deliveryParam, pageParam, searchParam]
        .filter((param) => param)
        .join('&');

      // urlPath with query params
      const url = `order/fulfillment/${activeTab}/?${queryParams}`;

      try {
        const response = await axios.get(url);
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
  }, [activeTab, params?.getAll, deliveryMethod]);

  const handleTabChange = (tabName: string) => {
    if (activeTab === tabName) return;
    else setActiveTab(tabName);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    router.push(`fulfillment/?page=${page}`);
  };

  const handleFilterChange = (selectedDeliveryMethod: string) => {
    const newQuery: any = {};

    if (selectedDeliveryMethod !== null) {
      // set category and add to query
      setDeliveryMethod(selectedDeliveryMethod);

      selectedDeliveryMethod
        ? (newQuery['delivery-method'] = selectedDeliveryMethod)
        : '';
    }

    handleParamUpdates(new URLSearchParams(newQuery).toString());
  };

  const handleSearchSubmit = (search: string) => {
    let searchParam: { search?: string } = search ? { search } : {};
    const newQuery = { ...searchParam };
    handleParamUpdates(new URLSearchParams(newQuery).toString());
  };

  const handleParamUpdates = (queryString: string) => {
    // defaulting to page one on any change
    setCurrentPage(1);
    setIsLoading(true);

    router.push(`fulfillment?${queryString}`);
  };

  function loaded() {
    return (
      <main>
        <h1>Fulfillment</h1>
        <Filter
          filterOptions={['standard', 'express', 'next day', 'pick up']}
          filter={deliveryMethod}
          label="Delivery Method"
          id="deliveryMethod"
          onFilterChange={handleFilterChange}
        />
        <Search
          placeholder="search by order ID"
          onSearchSubmit={handleSearchSubmit}
        />
        {params?.get('search') && (
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
        )}
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
