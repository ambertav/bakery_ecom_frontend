import axios from '../../utilities/axiosConfig';
import { useRouter } from 'next/router';
import { useAuth } from '../../app/firebase/AuthContext';
import { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchProducts = async () => {
      if (router.isReady) {
        try {
          const response = await axios.get(
            `product/?page=${router.query.page}`
          );
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
  }, [router.isReady, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page },
    });
  };

  function loaded() {
    return (
      <main>
        <h1>All Products</h1>
        <div>
          filter
          <div>category sort by price asecending sort by price descending</div>
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
