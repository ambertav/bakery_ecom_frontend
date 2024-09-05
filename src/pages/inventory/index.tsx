import axios from '../../utilities/axiosConfig';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react';
import { ProductType, UpdatedPortionsState } from '../../../types/types';

import LoadingSpinner from '@/components/LoadingSpinner';
import Filter from '@/components/Filter';
import Search from '@/components/Search';
import Pagination from '@/components/Pagination';
import InventoryItem from '@/components/InventoryItem';

export default function Inventory() {
  const router = useRouter();
  const params = useSearchParams();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(params?.get('page')) || 1
  );
  const [category, setCategory] = useState<string>(
    (params?.get('category') as string) || ''
  );
  const [getReport, setGetReport] = useState<boolean>(
    params?.get('generate-report') === 'true'
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatedPortions, setUpdatedPortions] = useState<UpdatedPortionsState>(
    {}
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchProducts = async () => {
      // defining parameters for axios call
      const categoryParam = category ? `category=${category}` : '';
      const pageParam = `page=${params?.get('page')}`;
      const searchParam = params?.get('search')
        ? `search=${params?.get('search')}`
        : '';

      // combining paramaters
      const queryParams = [categoryParam, searchParam, pageParam]
        .filter((param) => param)
        .join('&');

      // urlPath with query params
      const url = `product/?${queryParams}`;

      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        }
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        timeout = setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    const fetchReport = async () => {
      try {
        const response = await axios.get('product/inventory/generate-report');
        if (response.status === 200) {
          setProducts(response.data.products);
          // responds with structure to update inventory to reduce duplicate processing
          setUpdatedPortions(response.data.updatedPortionsState);
          setTotalPages(1);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        timeout = setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    getReport ? fetchReport() : fetchProducts();

    return () => clearTimeout(timeout);
  }, [params?.getAll, currentPage, category, getReport]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    const query = { ...params?.getAll, page: String(page) };
    const queryString = new URLSearchParams(query).toString();
    router.push(`inventory?${queryString}`);
  };

  const handleFilterChange = (selectedCategory: string) => {
    const newQuery: any = {};

    if (selectedCategory !== null) {
      // set category and add to query
      setCategory(selectedCategory);

      selectedCategory ? (newQuery['category'] = selectedCategory) : '';
    }

    handleParamUpdates(new URLSearchParams(newQuery).toString());
  };

  const handleSearchSubmit = (search: string) => {
    let categoryParam: { category?: string } = category ? { category } : {};
    let searchParam: { search?: string } = search ? { search } : {};

    const newQuery = { ...categoryParam, ...searchParam };

    handleParamUpdates(new URLSearchParams(newQuery).toString());
  };

  const handleParamUpdates = (queryString: string) => {
    // defaulting to page one on any change
    setCurrentPage(1);
    setIsLoading(true);

    let url = `inventory?${queryString}`;

    // Remove 'generate-report' if it is not included in the query string
    if (!queryString.includes('generate-report')) {
      url = url
        .replace(/([?&])generate-report=true/, '$1')
        .replace(/([?&])$/, '');
    }

    router.push(url);
  };

  const handleInventorySubmit = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    // if the updatedPortions state is empty, return
    if (Object.keys(updatedPortions).length === 0) return;

    try {
      const response = await axios.put(
        '/product/inventory/update',
        updatedPortions,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        setIsLoading(true);
        setUpdatedPortions({} as UpdatedPortionsState);
        router.push('/inventory');
      }
    } catch (error) {
      console.error('Error updating inventory: ', error);
    }
  };

  const handleGenerateReport = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setGetReport(true);
    router.push('/inventory?generate-report=true');
  };

  function loaded() {
    return (
      <main>
        <h1>Inventory</h1>
        <div>
          {params?.get('generate-report') !== 'true' && (
            <>
              <Filter
                filterOptions={[
                  'cake',
                  'cupcake',
                  'pie',
                  'cookie',
                  'donut',
                  'pastry',
                ]}
                filter={category}
                label="Category"
                id="category"
                onFilterChange={handleFilterChange}
              />
              <Search
                placeholder="search products"
                onSearchSubmit={handleSearchSubmit}
              />
            </>
          )}
        </div>
        <div>
          <button
            onClick={handleInventorySubmit}
            disabled={
              updatedPortions && Object.keys(updatedPortions).length === 0
            }
          >
            Update Inventory
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={params?.get('generate-report') === 'true'}
          >
            Generate Report
          </button>
          <table>
            <thead>
              <tr>
                <th>Manage</th>
                <th>Product ID</th>
                <th>Name</th>
                <th>Portions</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((p, index) => (
                  <InventoryItem
                    key={index}
                    product={p}
                    updatedPortions={updatedPortions}
                    setUpdatedPortions={setUpdatedPortions}
                  />
                ))}
            </tbody>
          </table>
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
