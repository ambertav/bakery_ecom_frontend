import axios from 'axios';
import { useState, useEffect } from 'react';
import { ProductType } from '../../../types/types';

import Product from '@/components/Product';

interface ProductProps {
    product: ProductType[];
    page: string;
}

export default function ProductIndex () {
    const [ products, setProducts ] = useState<ProductType[] | null>(null);
    const url = 'http://127.0.0.1:5000/product';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(url);
                if (response.status === 200) {
                    const { products } = response.data;
                    setProducts(products)
                }
            } catch (error) {
                console.error('Error fetching products: ', error);
            };
        }
        fetchProducts();
    }, []);

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