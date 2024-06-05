import axios from '../../utilities/axiosConfig';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { useCartContext } from '../../components/CartContext';
import CheckoutForm from '../../components/CheckoutForm';
import LoadingSpinner from '@/components/LoadingSpinner';

import { CheckoutFormInput, AddressType } from '../../../types/types';

export default function Checkout() {
  // retrieves cart context to submit info through to stripe payment page
  const cartContext = useCartContext();

  // initializes form input state and defines structure
  const [formInput, setFormInput] = useState<CheckoutFormInput>({
    shipping: {} as AddressType,
    method: '',
    billing: {} as AddressType,
  });

  // stores user's existing addresses fetched from database
  const [existingAddresses, setExistingAddresses] = useState<AddressType[]>([]);
  // handles display of loading spinner
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // handles disabling submit button to prevent duplicate, successive submits
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // retrieves user's saved addresses
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchAddresses = async () => {
      if (cartContext) {
        const { user } = cartContext;
        if (user) {
          try {
            const response = await axios.get('address/');

            if (response.status === 200) {
              setExistingAddresses(response.data.addresses as AddressType[]);
              if (response.data.addresses.length !== 0) {
                // if there is an address saved to user,
                // use the first address, which will either be default or the first, as preselected shipping and billing
                setFormInput((prev) => ({
                  ...prev,
                  shipping: response.data.addresses[0],
                  billing: response.data.addresses[0],
                }));
              }
            }
          } catch (error) {
            console.error('Error fetching addresses:', error);
          } finally {
            timeout = setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          }
        }
      }
    };
    fetchAddresses();

    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async () => {
    if (cartContext) {
      setIsProcessing(true);
      const { cart, user } = cartContext;
      // request to server to return stripe checkout session url + create user's order instance
      try {
        // destructure form input for clarity
        const { shipping, method, billing } = formInput;

        // pass in cart and form info to server request
        const response = await axios.post(
          'order/create-checkout-session',
          { cart, billing, shipping, method },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        window.location = response.data.checkout_url;
      } catch (error) {
        console.error('Error creating Checkout session:', error);
        setIsProcessing(false);
      }
    }
  };

  if (cartContext) {
    return (
      <main>
        <h1>Checkout</h1>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <CheckoutForm
              formInput={formInput}
              setFormInput={setFormInput}
              existingAddresses={existingAddresses}
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
            />
            <Link href="/cart">Back to Cart</Link>
          </div>
        )}
      </main>
    );
  } else {
    return <div>Error</div>;
  }
}
