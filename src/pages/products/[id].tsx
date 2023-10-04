import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/app/firebase/AuthContext';
import { ProductType } from '../../../types/types';

import Product from '@/components/Product';

export default function ProductShow () {
    const { user } = useAuth();
    const router = useRouter();
    const [ product, setProduct ] = useState<ProductType | null>(null);
    const url = 'http://127.0.0.1:5000/product/';

    const { id } = router.query;
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(url + id);
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

    async function handleAddToCart () {
        // if no user, redirect to login page (for now)
        // if user, make req to /cart/create to create cart item for user
    }

    return (
        <main>
            <div>
                {product !== null ? 
                (
                    <>
                        <Product product={product} page='show' />
                        <button onClick={handleAddToCart}>Add to Cart</button>
                    </>
                ) : (
                    <div>No product</div>
                )
                }
            </div>
        </main>
    );
}