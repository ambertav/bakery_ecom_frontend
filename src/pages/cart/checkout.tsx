import axios from '../../utilities/axiosConfig';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { useCartContext } from '../../components/CartContext';
import AddressForm from '../../components/AddressForm';
import LoadingSpinner from '@/components/LoadingSpinner';

import { AddressType } from '../../../types/types';

// empty address for state initialization
const initAddress: AddressType = {
  id: 0,
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  default: false,
};

export default function Checkout() {
  const cartContext = useCartContext();

  const [billing, setBilling] = useState<AddressType>(initAddress);
  const [shipping, setShipping] = useState<AddressType>(initAddress);
  const [existingAddresses, setExistingAddresses] = useState<
    AddressType[] | null
  >(null);
  const [method, setMethod] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isNewDelivery, setIsNewDelivery] = useState<boolean>(false);
  const [isNewBilling, setIsNewBilling] = useState<boolean>(false);
  const [showAddressOptions, setShowAddressOptions] = useState<boolean>(false);

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
              setExistingAddresses(response.data.addresses);
              setShipping(response.data.addresses[0]);
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

  function handleSameAsShipping(evt: React.ChangeEvent<HTMLSelectElement>) {
    // updates shipping state with billing state
    evt.preventDefault();
    if (evt.target.value === 'yes') {
      setBilling(shipping);
      setShowAddressOptions(false);
      setIsNewBilling(false);
    } else {
      setBilling(initAddress);
      if (existingAddresses) setShowAddressOptions(true);
      else setIsNewBilling(true);
    }
  }

  function handleSelectChange(evt: React.ChangeEvent<HTMLSelectElement>) {
    // updates state for delivery method select tag
    setMethod(evt.target.value);
  }

  function handleCheckboxChange(
    evt: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) {
    // determines if address checked is billing
    if (type === 'billing') {
      if (evt.target.checked && existingAddresses) {
        // value is set to index of existingBilling array, sets form's billing state to the existing one
        setBilling(existingAddresses[parseInt(evt.target.value)]);
      } else {
        // clears out form's billing state when checkbox is unchecked
        setBilling(initAddress);
      }
    }
    // performs the same logic if shipping
    if (type === 'delivery') {
      if (evt.target.checked && existingAddresses) {
        setShipping(existingAddresses[parseInt(evt.target.value)]);
      } else {
        setShipping(initAddress);
      }
    }
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    if (cartContext) {
      setIsProcessing(true);
      const { cart, user } = cartContext;
      // request to server to return stripe checkout session url + create user's order instance
      try {
        // pass in cart info and form submission to server request
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
  }

  if (cartContext) {
    return (
      <main>
        <h1>Checkout</h1>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <h3>Delivery Address</h3>
                {existingAddresses !== null && existingAddresses.length > 0 ? (
                  <div>
                    {existingAddresses.map((address, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          value={index}
                          onChange={(evt) => {
                            handleCheckboxChange(evt, 'delivery');
                          }}
                          checked={shipping === address}
                        />
                        {address.firstName} {address.lastName} <br />
                        {address.street} <br />
                        {address.city}, {address.state} {address.zip}
                      </label>
                    ))}
                  </div>
                ) : (
                  ''
                )}
                <button
                  onClick={(evt) => {
                    evt.preventDefault();
                    setIsNewDelivery((prev) => !prev);
                  }}
                >
                  {isNewDelivery ? 'Remove address' : 'Add new address'}
                </button>
                {isNewDelivery ? (
                  <AddressForm
                    formState={shipping}
                    setFormState={setShipping}
                  />
                ) : (
                  ''
                )}
              </div>
              <div>
                <h3>Select Delivery Method</h3>
                <select
                  name="method"
                  id="method"
                  value={method}
                  onChange={(evt) => handleSelectChange(evt)}
                >
                  <option value="">Select Option</option>
                  <option value="STANDARD">Standard</option>
                  <option value="EXPRESS">Express</option>
                  <option value="NEXT_DAY">Next Day</option>
                </select>
              </div>
              <div>
                <h3>Billing Address</h3>
                <p>is Billing same as shipping?</p>
                <select
                  id="sameAsBilling"
                  name="sameAsBilling"
                  defaultValue=""
                  onChange={(evt) => handleSameAsShipping(evt)}
                >
                  <option value=""></option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {showAddressOptions && existingAddresses ? (
                  <div>
                    {existingAddresses.map((address, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          value={index}
                          onChange={(evt) => {
                            handleCheckboxChange(evt, 'billing');
                          }}
                          checked={billing === address}
                        />
                        {address.firstName} {address.lastName} <br />
                        {address.street} <br />
                        {address.city}, {address.state} {address.zip}
                      </label>
                    ))}
                  </div>
                ) : (
                  ''
                )}
                <button
                  onClick={(evt) => {
                    evt.preventDefault();
                    setIsNewBilling((prev) => !prev);
                  }}
                >
                  {isNewBilling ? 'Remove address' : 'Add new address'}
                </button>
                {isNewBilling ? (
                  <AddressForm
                    formState={shipping}
                    setFormState={setShipping}
                  />
                ) : (
                  ''
                )}
              </div>
              <input
                type="submit"
                value={isProcessing ? 'Processing...' : 'Continue to Payment'}
              />
            </form>
            <Link href="/cart">Back to Cart</Link>
          </div>
        )}
      </main>
    );
  } else {
    return <div>Error</div>;
  }
}
