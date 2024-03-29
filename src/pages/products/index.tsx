import axios from '../../utilities/axiosConfig';
import { useRouter } from 'next/router';
import { useAuth } from '../../app/firebase/AuthContext';
import { useState, useEffect, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { FormInput, ProductType } from '../../../types/types';

import LoadingSpinner from '@/components/LoadingSpinner';
import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import Product from '@/components/Product';
import Inventory from '@/components/Inventory';

export default function ProductIndex() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(router.query.page) || 1
  );
  const [category, setCategory] = useState<string>(
    (router.query.category as string) || ''
  );
  const [sort, setSort] = useState<string>('recommended');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatedProducts, setUpdatedProducts] = useState<FormInput>({});

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchProducts = async () => {
      if (router.isReady) {
        // defining parameters for axios call
        const categoryParam = category ? `category=${category}` : '';
        const pageParam = `page=${router.query.page}`;
        const sortParam = sort ? `sort=${sort}` : '';
        const searchParam = search ? `search=${search}` : '';

        // combining paramaters
        const queryParams = [categoryParam, searchParam, sortParam, pageParam]
          .filter((param) => param)
          .join('&');

        // urlPath with query params
        const urlPath = `product/?${queryParams}`;

        try {
          const response = await axios.get(urlPath);
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
      }
    };

    fetchProducts();

    return () => clearTimeout(timeout);
  }, [router.isReady, router.query, currentPage, category]);

  // useEffect to update category from navigation links
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    setIsLoading(true);

    if (router.query.category) setCategory(router.query.category as string);
    else setCategory('');

    timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [router.isReady, router.query.category]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page },
    });
  };

  const handleFilterChange = (
    selectedCategory: string | null,
    selectedSort: string | null
  ) => {
    const newQuery: any = {};

    if (selectedCategory !== null) {
      // set category and add to query
      setCategory(selectedCategory);

      // reset sort and search parameters, only add category to query
      setSort('recommended');
      setSearch('');
      selectedCategory ? (newQuery['category'] = selectedCategory) : '';
    }

    if (selectedSort !== null) {
      // set sort and add to query
      setSort(selectedSort);
      newQuery['sort'] = selectedSort;

      // add category and search to query to maintain those parameters
      category ? (newQuery['category'] = category) : '';
      search ? (newQuery['search'] = search) : '';
    }

    // defaulting to page one on any change
    setCurrentPage(1);
    setIsLoading(true);

    router.push({
      pathname: router.pathname,
      query: { ...newQuery },
    });
  };

  const handleSearchChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  };

  const handleSearchSubmit = (evt: FormEvent) => {
    setCurrentPage(1);
    setSort('recommended');
    setIsLoading(true);

    let categoryParam = category ? { category } : {};

    router.push({
      pathname: router.pathname,
      query: { ...categoryParam, search: search },
    });
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
            categories={['cake', 'cupcake', 'pie', 'cookie', 'donut', 'pastry']}
            sortOptions={[
              'recommended',
              'priceAsc',
              'priceDesc',
              'nameAsc',
              'nameDesc',
            ]}
            category={category}
            sort={sort}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div>
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="search">Search</label>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="search products"
              onChange={handleSearchChange}
            />
            <input
              type="submit"
              value="Search"
              disabled={search === '' ? true : false}
            />
          </form>
        </div>
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
