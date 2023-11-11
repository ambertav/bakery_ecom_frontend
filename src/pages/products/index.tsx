import axios from '../../utilities/axiosConfig';
import { useState, useEffect } from 'react';
import { ProductType } from '../../../types/types';

import LoadingSpinner from '@/components/LoadingSpinner';
import Product from '@/components/Product';

export default function ProductIndex () {
    const [ products, setProducts ] = useState<ProductType[] | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('product');
                if (response.status === 200) {
                    const { products } = response.data;
                    setProducts(products);
                }
            } catch (error) {
                console.error('Error fetching products: ', error);
            };
        }
        fetchProducts();
        setTimeout(() => {
            setIsLoading(false);
        }, 750);
    }, []);

    function loaded () {
        return (
            <main>
                <h1>All Products</h1>
                <div>
                    <ul>
                        {products !== null
                            ? products.map((p, key) => (
                                <div key={key}>
                                    <Product product={p} page='index' /> 
                                </div>
                            ))
                        : (
                            <div>No products</div>
                        )
                        }
                    </ul>
                </div>
        </main>
        );
    }

    function loading () {
        return <LoadingSpinner />;
    }

    return isLoading ? loading() : loaded();
}