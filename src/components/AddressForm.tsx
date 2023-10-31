import { AddressType } from "../../types/types";

interface AddressFormProps {
    formState: AddressType;
    setFormState: (state : any) => void;
}

export default function AddressForm ({ formState, setFormState } : AddressFormProps) {

    function handleInputChange (evt : React.ChangeEvent<HTMLInputElement>) {
        // updates corresponding state based on which form is being changed
        const { name, value } = evt.target;
        setFormState((prev  : AddressType) => ({
            ...prev,
            [name]: value,
        }));
    }
    
    return (
        <form>
            <div>
                <label htmlFor='firstName'>First Name:</label>
                <input
                    type='text'
                    id='name'
                    name='firstName'
                    value={formState.firstName}
                    onChange={handleInputChange}
                />
                </div>
            <div>
                <label htmlFor='lastName'>Last Name:</label>
                <input
                    type='text'
                    id='name'
                    name='lastName'
                    value={formState.lastName}
                    onChange={(evt) => handleInputChange(evt)}
                />
            </div>
            <div>
                <label htmlFor='street'>Street:</label>
                <input
                    type='text'
                    id='street'
                    name='street'
                    value={formState.street}
                    onChange={(evt) => handleInputChange(evt)}
                />
            </div>
            <div>
                <label htmlFor='city'>City:</label>
                <input
                    type='text'
                    id='city'
                    name='city'
                    value={formState.city}
                    onChange={(evt) => handleInputChange(evt)}
                />
            </div>
            <div>
                <label htmlFor='state'>State:</label>
                <input
                    type='text'
                    id='state'
                    name='state'
                    value={formState.state}
                    onChange={(evt) => handleInputChange(evt)}
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
                    onChange={(evt) => handleInputChange(evt)}
                />
            </div>
        </form>
    );
}