import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductType } from '../../../types/types';

import Product from '@/components/Product';

export default function ProductShow () {
    const router = useRouter();
    const [ product, setProduct ] = useState<ProductType | null>(null);
    const url = 'http://127.0.0.1:5000/product/';

    const { id } = router.query;
    

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(url +  id);
                if (response.status === 200) {
                    const { product } = response.data;
                    setProduct(product);
                }
            } catch (error) {
                console.error('Error fetching product: ', error);
            }
        }
        fetchProduct();
    }, []);

    return (
        <main>
            {product !== null ? 
                <Product product={product} page='show' />
            :
                <div>No product</div>
            }
        </main>
    );
}