import Link from 'next/link';

import CartQuery from '../../components/CartQuery';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Cart() {
    let total : number = 0;
    return (
        <CartQuery>
            {(cart, isLoading, error, handleRemove, updateQuantity) => (
                <main>
                <h1>Shopping Cart</h1>
                { isLoading ? ( <LoadingSpinner /> ) : (
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
                                        <img src={c.image} alt={c.name} /> {/* Add alt attribute */}
                                        <div>
                                            <button onClick={() => {updateQuantity('minus', c.id, c.quantity)}}>-</button>
                                            <p>{c.quantity}</p>
                                            <button onClick={() => {updateQuantity('plus', c.id, c.quantity)}}>+</button>
                                        </div>
                                        <p>{c.price}</p>
                                        <div>
                                            <button onClick={() => {handleRemove(c.id)}}>Remove from Cart</button>
                                        </div>
                                    </div>
                                </li>
                                );
                            })
                            ) : ( <li>no cart</li> )
                        }
                    </ul>
                    { total > 0 ? ( <div>Total price: {total.toFixed(2)}</div> ) : ( '' )}
                    {cart !== null && cart.length > 0 ? (
                        <Link href='/cart/checkout'>Checkout</Link>
                    ) : (
                        ''
                    )}
                </div>
                )}
            </main>
        )}
        </CartQuery>
    );
}
