import axios from 'axios';
import { getIdToken } from 'firebase/auth';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/app/firebase/AuthContext';
import { ProductType } from '../../../types/types';

import Product from '@/components/Product';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductShow () {
    const { user } = useAuth();
    const router = useRouter();

    const [ product, setProduct ] = useState<ProductType | null>(null);
    const [ formState, setFormState ] = useState({
        qty: 1
    });
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    const url = 'http://127.0.0.1:5000/';
    const { id } = router.query;
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(url + 'product/' + id);
                if (response.status === 200) setProduct(response.data.product);
            } catch (error) {
                console.error('Error fetching product: ', error);
            }
        }
        fetchProduct();
        setTimeout(() => {
            setIsLoading(false);
        }, 750);
    }, []);

    async function handleAddToCart (evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const data = {
            id: product?.id,
            qty: formState.qty
        }
        // if no user, redirect to login page (for now)
        if (!user) router.push('/login');
        // if user, make req to /cart/create to create cart item for user
        else {
            try {
                const token = await getIdToken(user);
                const response = await axios.post(url + '/user/cart/add', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                if (response.status === 201) {
                    console.log('success');
                    // render cart pop up on navbar to link to cart
                }
            } catch (error) {
                console.error('Error adding to cart: ', error);
            }
        }

    }


    function loaded () {
        return (
            <main>
                <div>
                    {product !== null ? 
                    (
                        <>
                            <Product product={product} page='show' />
                            <form onSubmit={(evt) => {handleAddToCart(evt)}}>
                                <input type="number" name="qty" id="qty" value={formState.qty} min={1} onChange={(evt) => {
                                    setFormState({
                                        qty: Number(evt.target.value)
                                    });
                                }}/>
                                <input type="submit" value="Add to Cart" />
                            </form>
                        </>
                    ) : (
                        <div>No product</div>
                    )
                    }
                </div>
            </main>
        );
    }

    function loading () {
        return <LoadingSpinner />;
    }

    return isLoading ? loading() : loaded();
}