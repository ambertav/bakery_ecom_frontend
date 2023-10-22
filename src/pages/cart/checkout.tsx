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
    street: '',
    city: '',
    state: '',
    zip: '',
}

export default function Checkout () {
    const cartContext = useCartContext();

    const [ billing, setBilling ] = useState <AddressType> (initAddress);
    const [ shipping, setShipping ] = useState <AddressType> (initAddress);
    const [ existingBilling, setExistingBilling ] = useState <AddressType[] | null> (null);
    const [ existingShipping, setExistingShipping ] = useState  <AddressType[] | null> (null);
    const [ method, setMethod ] = useState <string> ('');

    const [ isLoading, setIsLoading ] = useState <boolean> (true);
    const [ isProcessing, setIsProcessing ] = useState<boolean>(false);

    // url endpoint for stripe checkout page creation
    const url = 'http://127.0.0.1:5000/user/';

    // retrieves user's saved addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (cartContext) {
                const { user } = cartContext;
                if (user) {
                    try {
                        const token = await getIdToken(user)
                        const response = await axios.get(url + 'get-address', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            withCredentials: true,
                        });
    
                        if (response.status === 200) {
                            const { billAddress, shipAddress } = response.data || {};
                            setExistingBilling(billAddress as AddressType[] || null);
                            setExistingShipping(shipAddress as AddressType[] || null);
                        }
                    } catch (error) {
                        console.error('Error fetching billing addresses:', error);
                    }
                }
            }
        }
        fetchAddresses();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
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
                    <label htmlFor='street'>Street:</label>
                    <input
                        type='text'
                        id='street'
                        name='street'
                        value={formState.street}
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

    function handleCheckboxChange (evt : React.ChangeEvent<HTMLInputElement>, type : string) {
        // determines if address checked is billing
        if (type === 'billing') {
            if (evt.target.checked && existingBilling) {
                // value is set to index of existingBilling array, sets form's billing state to the existing one
                setBilling(existingBilling[parseInt(evt.target.value)])
            } else {
                // clears out form's billing state when checkbox is unchecked
                setBilling(initAddress);
            }
        }
        // performs the same logic if shipping
        if (type === 'shipping') {
            if (evt.target.checked && existingShipping) {
                setShipping(existingShipping[parseInt(evt.target.value)])
            } else {
                setShipping(initAddress);
            }
        }
    }

    async function handleSubmit (evt : React.FormEvent) {
        evt.preventDefault();
        if (cartContext) {
            setIsProcessing(true);
            const { cart, user } = cartContext;
            // request to server to return stripe checkout session url + create user's order instance
            try {
                const token = await getIdToken(user);
                // pass in cart info and form submission to server request
                const response = await axios.post(url + 'order/create-checkout-session', { cart, billing, shipping, method }, {
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
                                {existingBilling !== null && existingBilling.length > 0 ? (
                                        <div>
                                            <h5>Select an existing address:</h5>
                                            {existingBilling.map((address, index) => (
                                                <label key={index}>
                                                    <input
                                                        type="checkbox"
                                                        value={index}
                                                        onChange={(evt) => {handleCheckboxChange(evt, 'billing')}}
                                                    />
                                                    {address.firstName} {address.lastName} <br />
                                                    {address.street} <br />
                                                    {address.city}, {address.state} {address.zip}
                                                </label>
                                            ))}
                                        </div>
                                    ) : ('') }

                                {renderAddressForm(billing, 'Billing')}
                            </div>
                            <div>
                                <h3>Shipping Address</h3>
                                <button onClick={handleSameAsBilling}>Same as billing</button>

                                {existingShipping !== null && existingShipping.length > 0 ? (
                                        <div>
                                            <h5>Select an existing address:</h5>
                                            {existingShipping.map((address, index) => (
                                                <label key={index}>
                                                    <input
                                                        type="checkbox"
                                                        value={index}
                                                        onChange={(evt) => {handleCheckboxChange(evt, 'shipping')}}
                                                    />
                                                    {address.firstName} {address.lastName} <br />
                                                    {address.street} <br />
                                                    {address.city}, {address.state} {address.zip}
                                                </label>
                                            ))}
                                        </div>
                                    ) : ('') }

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
                            <input type="submit" value={isProcessing ? 'Processing...' : 'Continue to Payment'} />
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
