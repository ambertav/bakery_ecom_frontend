import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getIdToken } from 'firebase/auth';

import { useCartContext } from '../../components/CartContext';
import LoadingSpinner from '@/components/LoadingSpinner';

import { AddressType } from '../../../types/types';

// empty address for state initialization
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

    const [ isLoading, setIsLoading ] = useState <boolean> (true);
    const [ isProcessing, setIsProcessing ] = useState<boolean>(false);

    // url endpoint for stripe checkout page creation
    const url = 'http://127.0.0.1:5000/create-checkout-session';

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 750);
    }, []);

    function renderAddressForm (formState : AddressType, formName : string) {
        // to render both billing and shipping address forms
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
        // updates corresponding state based on which form is being changed
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

    function handleSameAsBilling (evt : React.MouseEvent<HTMLButtonElement>) {
        // updates shipping state with billing state
        evt.preventDefault();
        setShipping(billing);
    }

    function handleSelectChange (evt : React.ChangeEvent<HTMLSelectElement>) {
        // updates state for delivery method select tag
        setMethod(evt.target.value);
    }

    async function handleSubmit (evt : React.FormEvent) {
        evt.preventDefault();
        if (cartContext) {
            setIsProcessing(true);
            const { cart, user } = cartContext;

            // request to server to return stripe checkout session url
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
                                <button onClick={handleSameAsBilling}>Same as billing</button>
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
