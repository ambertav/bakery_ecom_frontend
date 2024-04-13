import axios from '../../utilities/axiosConfig';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../app/firebase/AuthContext';
import { useState, useEffect, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { FormInput, ProductType } from '../../../types/types';

import LoadingSpinner from '@/components/LoadingSpinner';
import Filter from '@/components/Filter';
import Sort from '@/components/Sort';
import Search from '@/components/Search';
import Pagination from '@/components/Pagination';
import Product from '@/components/Product';
import Inventory from '@/components/Inventory';

export default function ProductIndex() {
  const router = useRouter();
  const params = useSearchParams();

  const { isAdmin } = useAuth();

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
  const [updatedProducts, setUpdatedProducts] = useState<FormInput>({});

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

  // useEffect to update category from navigation links
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    setIsLoading(true);

    setCategory(params?.get('category') ?? '');

    timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [params?.getAll]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    const query = { ...params?.getAll, page: String(page) };
    const queryString = new URLSearchParams(query).toString();
    router.push(`products?${queryString}`);
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

  const handleSortChange = (selectedSort: string) => {
    const newQuery: any = {};

    setSort(selectedSort);
    newQuery['sort'] = selectedSort;

    // add category and search to query to maintain those parameters
    category ? (newQuery['category'] = category) : '';
    params?.get('search') ? (newQuery['search'] = params?.get('search')) : '';

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

    router.push(`products?${queryString}`);
  };

  const handleInventorySubmit = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    // if the updatedProducts state is empty, return
    if (Object.keys(updatedProducts).length === 0) return;

    try {
      const response = await axios.put(
        '/product/inventory/update',
        updatedProducts,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        setIsLoading(true);
        router.push('/products');
      }
    } catch (error) {
      console.error('Error updating inventory: ', error);
    }
  };

  function loaded() {
    return (
      <main>
        <h1>All Products</h1>
        <div>
          <Filter
            filterOptions={['cake', 'cupcake', 'pie', 'cookie', 'donut', 'pastry']}
            filter={category}
            label='Category'
            id='category'
            onFilterChange={handleFilterChange}
          />

          <Sort
            sortOptions={[
              'recommended',
              'priceAsc',
              'priceDesc',
              'nameAsc',
              'nameDesc',
            ]}
            sort={sort}
            onSortChange={handleSortChange}
          />
        </div>
        <Search onSearchSubmit={handleSearchSubmit} />
        <div>
          <ul>
            {products && products.length > 0 ? (
              isAdmin ? (
                <>
                  <button onClick={handleInventorySubmit}>
                    Update Inventory
                  </button>
                  {products.map((p, index) => (
                    <div key={index}>
                      <Inventory
                        product={p}
                        setUpdatedProducts={setUpdatedProducts}
                      />
                    </div>
                  ))}
                </>
              ) : (
                products.map((p, index) => (
                  <div key={index}>
                    <Product product={p} page="index" />
                  </div>
                ))
              )
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
