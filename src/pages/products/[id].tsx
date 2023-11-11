import axios from '../../utilities/axiosConfig';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/app/firebase/AuthContext';
import { ProductType, CartItem, ShoppingCart } from '../../../types/types';

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

    const { id } = router.query;
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`product/${id}`);
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

    function generateUniqueId () {
        const now = new Date();
        return now.getTime() + now.getMilliseconds(); // gets timestamp id
    }

    async function handleAddToCart (evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const data = {
            id: product!.id,
            qty: formState.qty
        }

        if (user) {
            // if user, make req to /cart/create to create cart item for user
            try {
                const response = await axios.post('cart/add', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 201) {
                    console.log('success');
                    // render cart pop up on navbar to link to cart
                }
            } catch (error) {
                console.error('Error adding to cart: ', error);
            }
        } else {
            // if no user, add cart item to local storage
            const localStorageCart : ShoppingCart = JSON.parse(localStorage.getItem('cart') || '[]');

            const id = generateUniqueId(); // generate an id for the new cart item

            const newItem : CartItem = {
                id,
                productId: data.id,
                name: product!.name,
                image: product!.image,
                price: product!.price,
                quantity: data.qty,
            }

            // checks if product is already in cart
            const existingIndex = localStorageCart.findIndex(item => item.productId === newItem.productId);

            if (existingIndex !== -1) localStorageCart[existingIndex].quantity += data.qty; // if found, update quantity
            else localStorageCart.push(newItem); // else add to local storage

            localStorage.setItem('cart', JSON.stringify(localStorageCart));
            console.log('Local storage success');
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