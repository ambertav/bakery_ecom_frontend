import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getIdToken } from 'firebase/auth';

import { useCartContext } from '../../components/CartContext';
import LoadingSpinner from '@/components/LoadingSpinner';

import { ShoppingCart, AddressType } from '../../../types/types';

const initAddress : AddressType = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
}

export default function Checkout () {
    const cartContext = useCartContext();

    const [ billing, setBilling ] = useState <AddressType> (initAddress);
    const [ shipping, setShipping ] = useState <AddressType> (initAddress);
    const [ method, setMethod ] = useState <string> ('');

    const [ isProcessing, setIsProcessing ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState <boolean> (true);

    const url = 'http://127.0.0.1:5000/create-checkout-session';

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 750);
    }, []);

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
        );
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

    async function handleSubmit (evt : React.FormEvent) {
        evt.preventDefault();
        if (cartContext) {
            const { cart, user } = cartContext
            setIsProcessing(true);
            try {
                const token = await getIdToken(user);
                const response = await axios.post(url, { cart }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                window.location = response.data.checkout_url;
            } catch (error) {
                console.error('Error creating Checkout session:', error);
                setIsProcessing(false);
            }
        }
    }

    if (cartContext) {
        const { cart, user } = cartContext;
            return (
                    <main>
                        <h1>Checkout</h1>
                        { isLoading ? ( <LoadingSpinner /> ) : (
                            <div>
                                <form onSubmit={handleSubmit}>
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
                                    <input type="submit" value={isProcessing ? 'Processing' : 'Continue to Payment'} />
                                </form>
                                <Link href='/cart'>Back to Cart</Link>
                            </div>
                        )}
                    </main>
                );
            } else {
                return <div>Error</div>
            }
}
