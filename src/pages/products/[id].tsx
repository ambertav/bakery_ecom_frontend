import axios from '../../utilities/axiosConfig';
import Link from 'next/link';
import { useState, useEffect, FormEvent, MouseEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/app/firebase/AuthContext';
import { ProductType, CartItem, ShoppingCart } from '../../../types/types';

import Product from '@/components/Product';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductShow() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [validPortions, setValidPortions] = useState<string[]>([]);
  const [formState, setFormState] = useState({
    qty: 1,
    portion: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = router.query;

  const constructPortionArray = (category : string) : string[] => {
    let portions : string[] = ['whole'];

    if (category === 'cupcake' || category === 'donut') portions.push('mini');
    else if (category === 'cake' || category === 'pie') portions.push('mini', 'slice');

    return portions;
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`product/${id}`);
        if (response.status === 200) {
            setProduct(response.data.product);
            setValidPortions(constructPortionArray(response.data.product.category));
        }
      } catch (error) {
        console.error('Error fetching product: ', error);
      } finally {
        timeout = setTimeout(() => {
          setIsLoading(false);
        }, 750);
      }
    };
    fetchProduct();

    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (evt : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    let { name, value } = evt.target;

    setFormState((prev: any) => ({
        ...prev,
        [name]: value,
      }));
  }

  const generateUniqueId = () => {
    const now = new Date();
    return now.getTime() + now.getMilliseconds(); // gets timestamp id
  }

  const handleAddToCart = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const data = {
      id: product!.id,
      qty: Number(formState.qty),
      portion: product!.portions.find(p => p.size === formState.portion.toLowerCase())?.id
    };

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
      const localStorageCart: ShoppingCart = JSON.parse(
        localStorage.getItem('cart') || '[]'
      );

      const id = generateUniqueId(); // generate an id for the new cart item

      const newItem: CartItem = {
        id,
        product: {
            id: data.id,
            name: product!.name,
            image: product!.name,
        },
        price: (product!.portions.find(p => p.id === data.portion)?.price || 0) * data.qty,
        portion: {
            id: data.portion!,
            size: formState.portion,
            price: product!.portions.find(p => p.id === data.portion)?.price!
        },
        quantity: data.qty,
        orderId: null,
      };

      // checks if product is already in cart
      const existingIndex = localStorageCart.findIndex(
        (item) => item.product.id === newItem.product.id
      );

      if (existingIndex !== -1)
        localStorageCart[existingIndex].quantity +=
          data.qty; // if found, update quantity
      else localStorageCart.push(newItem); // else add to local storage

      localStorage.setItem('cart', JSON.stringify(localStorageCart));
      console.log('Local storage success');
    }
  }

  function loaded() {
    return (
      <main>
        <div>
          {product !== null ? (
            <>
              <Product product={product} page="show" />
              {!isAdmin && (
                <>
                  <form
                    onSubmit={(evt) => {
                      handleAddToCart(evt);
                    }}
                  >
                    <select
                        id="portion"
                        name="portion"
                        value={formState.portion}
                        onChange={handleChange}
                        required={true}
                    >
                        <option value=''>Select a portion size</option>
                        {validPortions && validPortions.map((p, index) => 
                        <option key={index} value={p.toUpperCase()}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                        )}
                    </select>
                    <input
                      type="number"
                      name="qty"
                      id="qty"
                      value={formState.qty}
                      min={1}
                      onChange={handleChange}
                    />
                    <input type="submit" value="Add to Cart" disabled={product!.portions.find(p => p.size === formState.portion.toLowerCase())?.soldOut || formState.portion === ''} />
                  </form>
                </>
              )}
              {isAdmin && (
                <Link href={`/products/${product.id}/edit`}>Edit Product</Link>
              )}
            </>
          ) : (
            <div>No product</div>
          )}
        </div>
      </main>
    );
  }

  function loading() {
    return <LoadingSpinner />;
  }

  return isLoading ? loading() : loaded();
}
