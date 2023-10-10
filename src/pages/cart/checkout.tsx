import Link from 'next/link';

import CartQuery from '../../components/CartQuery';
import CheckoutButton from '@/components/CheckoutButton';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Checkout () {
    return (
        <CartQuery>
            {(cart, isLoading) => (
                <main>
                    <h1>Checkout</h1>
                    { isLoading ? ( <LoadingSpinner /> ) : (
                        <div>
                            
                            <Link href='/cart'>Back to Cart</Link>
                            <div>
                                {cart !== null && cart.length > 0 ? (
                                    <CheckoutButton cart={cart} />
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    )}
        </main>
      )}
    </CartQuery>
  );
}
