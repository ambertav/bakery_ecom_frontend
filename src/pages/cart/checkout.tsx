import Link from 'next/link';
import { useState } from 'react';

import CartQuery from '../../components/CartQuery';
import CheckoutButton from '@/components/CheckoutButton';
import LoadingSpinner from '@/components/LoadingSpinner';

interface AddressType {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}

const initAddress : AddressType = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
}

export default function Checkout () {
    const [ billing, setBilling ] = useState <AddressType> (initAddress);
    const [ shipping, setShipping ] = useState <AddressType> (initAddress);
    const [ method, setMethod ] = useState <string> ('');

    function renderAddressForm (formState : AddressType, formName : string) {
        return (
            <>
                <div>
                    <label htmlFor='firstName'>First Name:</label>
                    <input
                        type='text'
                        id='name'
                        name='firstName'
                        value={formState.firstName}
                        onChange={(evt) => handleInputChange(evt, formName)}
                    />
                    </div>
                <div>
                    <label htmlFor='lastName'>Last Name:</label>
                    <input
                        type='text'
                        id='name'
                        name='lastName'
                        value={formState.lastName}
                        onChange={(evt) => handleInputChange(evt, formName)}
                    />
                </div>
                <div>
                    <label htmlFor='address'>Address:</label>
                    <input
                        type='text'
                        id='address'
                        name='address'
                        value={formState.address}
                        onChange={(evt) => handleInputChange(evt, formName)}
                    />
                </div>
                <div>
                    <label htmlFor='city'>City:</label>
                    <input
                        type='text'
                        id='city'
                        name='city'
                        value={formState.city}
                        onChange={(evt) => handleInputChange(evt, formName)}
                    />
                </div>
                <div>
                    <label htmlFor='state'>State:</label>
                    <input
                        type='text'
                        id='state'
                        name='state'
                        value={formState.state}
                        onChange={(evt) => handleInputChange(evt, formName)}
                    />
                </div>
                <div>
                    <label htmlFor='zip'>Zip Code:</label>
                    <input
                        type='text'
                        id='zip'
                        name='zip'
                        pattern='[0-9]{5}'
                        title='Enter a valid 5 digit zip code'
                        value={formState.zip}
                        onChange={(evt) => handleInputChange(evt, formName)}
                    />
                </div>
            </>
        )
    }

    function handleInputChange (evt : React.ChangeEvent<HTMLInputElement>, formName: string) {
        const { name, value } = evt.target;
        if (formName === 'Billing') {
            setBilling((prevBilling) => ({
                ...prevBilling,
                [name]: value,
            }));
        }
        if (formName === 'Shipping') {
            setShipping((prevShipping) => ({
                ...prevShipping,
                [name]: value,
            }));
        }
    }

    function handleSelectChange (evt : React.ChangeEvent<HTMLSelectElement>) {
        setMethod(evt.target.value);
    }


    return (
        <CartQuery>
            {(cart, isLoading) => (
                <main>
                    <h1>Checkout</h1>
                    { isLoading ? ( <LoadingSpinner /> ) : (
                        <div>
                            <form>
                                <div>
                                    <h3>Billing Address</h3>
                                    {renderAddressForm(billing, 'Billing')}
                                </div>
                                <div>
                                    <h3>Shipping Address</h3>
                                    {renderAddressForm(shipping, 'Shipping')}
                                </div>
                                <div>
                                    <h3>Select Delivery Method</h3>
                                    <select name="method" id="method" value={method} onChange={(evt) => handleSelectChange(evt)}>
                                        <option value="">Select Option</option>
                                        <option value="STANDARD">Standard</option>
                                        <option value="EXPRESS">Express</option>
                                        <option value="NEXT_DAY">Next Day</option>
                                    </select>
                                </div>
                            </form>
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
