import axios from '../../utilities/axiosConfig';
import { useRouter, useSearchParams } from 'next/navigation';
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

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<string>(
    (params?.get('delivery-method') as string) || ''
  );
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(params?.get('page')) || 1
  );

  // array of order ids used to batch start orders and set them to in progress
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

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

  const handleStartOrders = async () => {
    setIsLoading(true);
    // send over array of order ids to batch send to in progress
    try {
      const response = await axios.put(
        'order/fulfillment/set-in-progress/',
        selectedOrders
      );
      if (response.status === 200) {
        // clear out array
        setSelectedOrders([]);
        // automatically navigate admin to in progress tab
        setActiveTab('in-progress');
      }
    } catch (error) {
      console.error('Error batch starting orders: ', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleUndoStatus = async (orderId: number) => {
    setIsLoading(true);
    // send over order id to undo assignment and set status to pending
    try {
      const response = await axios.put(
        `order/fulfillment/${orderId}/set-pending/`
      );
      if (response.status === 200) {
        // remove order from state in lieu of full data re-fetch
        setOrders((prev) => prev.filter(order => order.id !== orderId));
      }
    } catch (error) {
      console.error(
        `Error returning order ${orderId} to pending status: `,
        error
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleCompleteStatus = async (orderId: number) => {
    setIsLoading(true);
    // send over order id to complete
    try {
      const response = await axios.put(
        `order/fulfillment/${orderId}/set-complete/`
      );
      if (response.status === 200) {
        // remove order from state in lieu of full data re-fetch
        setOrders((prev) => prev.filter(order => order.id !== orderId));
      }
    } catch (error) {
      console.error(`Error completing order ${orderId}: `, error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
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
        {!params?.get('search') && (
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
        {activeTab === 'pending' && (
          <button
            onClick={handleStartOrders}
            disabled={selectedOrders.length === 0}
          >
            Batch Start Orders
          </button>
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
                {activeTab === 'in-progress' && <th>Assigned To</th>}
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((o, index) => (
                  <FulfillmentItem
                    key={index}
                    order={o}
                    selectedOrders={selectedOrders}
                    setSelectedOrders={setSelectedOrders}
                    onUndo={handleUndoStatus}
                    onComplete={handleCompleteStatus}
                  />
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
