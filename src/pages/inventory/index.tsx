import axios from '../../utilities/axiosConfig';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react';
import { FormInput, ProductType } from '../../../types/types';

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
  const [sort, setSort] = useState<string>('recommended');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchProducts = async () => {
      // defining parameters for axios call
      const categoryParam = category ? `category=${category}` : '';
      const pageParam = `page=${params?.get('page')}`;
      const sortParam = sort ? `sort=${sort}` : '';
      const searchParam = params?.get('search')
        ? `search=${params?.get('search')}`
        : '';

      // combining paramaters
      const queryParams = [categoryParam, searchParam, sortParam, pageParam]
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

    fetchProducts();

    return () => clearTimeout(timeout);
  }, [params?.getAll, currentPage, category]);

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

      // reset sort parameters, only add category to query
      setSort('recommended');

      selectedCategory ? (newQuery['category'] = selectedCategory) : '';
    }

    handleParamUpdates(new URLSearchParams(newQuery).toString());
  };

  const handleSearchSubmit = (search: string) => {
    setSort('recommended');

    let categoryParam: { category?: string } = category ? { category } : {};
    let searchParam: { search?: string } = search ? { search } : {};

    const newQuery = { ...categoryParam, ...searchParam };

    handleParamUpdates(new URLSearchParams(newQuery).toString());
  };

  const handleParamUpdates = (queryString: string) => {
    // defaulting to page one on any change
    setCurrentPage(1);
    setIsLoading(true);

    router.push(`inventory?${queryString}`);
  };

  function loaded() {
    return (
      <main>
        <h1>All Products</h1>
        <div>
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
        </div>
        <Search
          placeholder="search products"
          onSearchSubmit={handleSearchSubmit}
        />
        <div>
          <ul>
            {products && products.length > 0 ? (
              products.map((p, index) => (
                <div key={index}>
                  <InventoryItem product={p} />
                </div>
              ))
            ) : (
              <div>No products</div>
            )}
          </ul>
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
