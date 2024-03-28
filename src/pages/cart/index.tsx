import Link from 'next/link';
import { useState, useEffect } from 'react';

import { useCartContext } from '../../components/CartContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Cart() {
  const cartContext = useCartContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      setIsLoading(false);
    }, 750);

    return () => clearTimeout(timeout);
  }, []);

  if (cartContext) {
    const { cart, user, handleRemove, updateQuantity } = cartContext;
    let total: number = 0;

    return (
      <main>
        <h1>Shopping Cart</h1>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <ul>
              {cart !== null ? (
                cart.map((c, key) => {
                  // add up total price, accounting for multiple quantities
                  total += Number(c.price) * c.quantity;
                  // render cart information
                  return (
                    <li key={key}>
                      <div>
                        <p>{c.name}</p>
                        <img src={c.image} alt={c.name} />{' '}
                        {/* Add alt attribute */}
                        <div>
                          <button
                            onClick={() => {
                              updateQuantity('minus', c.id, c.quantity);
                            }}
                          >
                            -
                          </button>
                          <p>{c.quantity}</p>
                          <button
                            onClick={() => {
                              updateQuantity('plus', c.id, c.quantity);
                            }}
                          >
                            +
                          </button>
                        </div>
                        <p>{c.price}</p>
                        <div>
                          <button
                            onClick={() => {
                              handleRemove(c.id);
                            }}
                          >
                            Remove from Cart
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li>no cart</li>
              )}
            </ul>
            {total > 0 ? <div>Total price: {total.toFixed(2)}</div> : ''}
            {cart !== null && cart.length > 0 ? (
              <Link href={user ? '/cart/checkout' : '/login'}>Checkout</Link>
            ) : (
              ''
            )}
          </div>
        )}
      </main>
    );
  } else {
    return <div>Error</div>;
  }
}
