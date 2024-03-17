import axios from '../../utilities/axiosConfig';
import { useRouter } from 'next/router';
import { useAuth } from '../../app/firebase/AuthContext';
import { useState, useEffect, ChangeEvent } from 'react';
import { ProductType } from '../../../types/types';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import Product from '@/components/Product';

export default function ProductIndex() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [products, setProducts] = useState<ProductType[] | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(router.query.page) || 1
  );
  const [category, setCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchProducts = async () => {
      if (router.isReady) {
        const categoryParam = category ? `category=${category}` : '';
        const pageParam = `page=${router.query.page}`;

        // combining paramaters
        const queryParams = [categoryParam, pageParam].filter(param => param).join('&');
    
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
  }, [router.isReady, currentPage, router.query]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page },
    });
  };

  const handleCategoryChange = (evt : ChangeEvent<HTMLSelectElement>) => {
    setCategory(evt.target.value);
    setIsLoading(true);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, category: evt.target.value },
    });
  }

  function loaded() {
    return (
      <main>
        <h1>All Products</h1>
        <div>
        <div key={'category'}>
            <label htmlFor={'category'}>Filter by Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              <option value="cake">Cake</option>
              <option value="cupcake">Cupcake</option>
              <option value="pie">Pie</option>
              <option value="cookie">Cookie</option>
              <option value="donut">Donut</option>
              <option value="pastry">Pastry</option>
            </select>
          </div>
        </div>
        <div>
        sort by price asecending sort by price descending
        </div>
        <div>search</div>
        <div>
          <ul>
            {products !== null ? (
              products.map((p, key) => (
                <div key={key}>
                    <Product product={p} page="index" />
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
