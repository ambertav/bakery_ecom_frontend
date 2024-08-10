import Link from 'next/link';
import { useState, useEffect } from 'react';

import { useCartContext } from '../../components/CartContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import CartItem from '@/components/CartItem';

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
                  total += Number(c.price);
                  // render cart information
                  return (
                    <li key={key}>
                      <div>
                        <CartItem item={c} />
                        <div>
                          <button
                            onClick={() => {
                              updateQuantity('minus', c.id, c.quantity);
                            }}
                          >
                            -
                          </button>
                          <button
                            onClick={() => {
                              updateQuantity('plus', c.id, c.quantity);
                            }}
                          >
                            +
                          </button>
                        </div>
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
