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
  const [sort, setSort] = useState<string>('recommended');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchProducts = async () => {
      if (router.isReady) {
        const categoryParam = category ? `category=${category}` : '';
        const pageParam = `page=${currentPage}`;
        const sortParam = sort ? `sort=${sort}` : '';

        // combining paramaters
        const queryParams = [categoryParam, sortParam, pageParam]
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page },
    });
  };

  const handleCategoryChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    setCategory(evt.target.value);

    // reset page and sort when category is changed
    setSort('recommended');
    setCurrentPage(1);

    setIsLoading(true);
    router.push({
        pathname: router.pathname,
        query: { category: evt.target.value },
      });
  };

  const handleSortChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setSort(evt.target.value);

    // reset page when sort is changed
    setCurrentPage(1);

    setIsLoading(true);
    router.push({
        pathname: router.pathname,
        query: { ...router.query, sort: evt.target.value, page: 1 },
    })
  };

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
          <div>
            <h3>Sort by</h3>
            <input
              type="radio"
              name="sort"
              id="recommended"
              value="recommended"
              checked={sort === 'recommended'}
              onChange={handleSortChange}
            />
            <label htmlFor="recommended">Recommended</label>
            <input
              type="radio"
              name="sort"
              id="priceAscending"
              value="priceAsc"
              checked={sort === 'priceAsc'}
              onChange={handleSortChange}
            />
            <label htmlFor="priceAscending">Price: low to high</label>
            <input
              type="radio"
              name="sort"
              id="priceDescending"
              value="priceDesc"
              checked={sort === 'priceDesc'}
              onChange={handleSortChange}
            />
            <label htmlFor="priceDescending">Price: high to low</label>
            <input
              type="radio"
              name="sort"
              id="nameAscending"
              value="nameAsc"
              checked={sort === 'nameAsc'}
              onChange={handleSortChange}
            />
            <label htmlFor="descending">Name: A to Z</label>
            <input
              type="radio"
              name="sort"
              id="nameDescending"
              value="nameDesc"
              checked={sort === 'nameDesc'}
              onChange={handleSortChange}
            />
            <label htmlFor="descending">Name: Z to A</label>
          </div>
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
