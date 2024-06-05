import { useState, Dispatch, ChangeEvent } from 'react';
import AddressForm from './AddressForm';

import { CheckoutFormInput, AddressType } from '../../types/types';


interface CheckoutFormProps {
    formInput: CheckoutFormInput;
    setFormInput: Dispatch<React.SetStateAction<CheckoutFormInput>>;
    existingAddresses: AddressType[];
    onSubmit: () => void;
    isProcessing: boolean;
}

export default function CheckoutForm ({ formInput, setFormInput, existingAddresses, onSubmit, isProcessing } : CheckoutFormProps) {
    const [sameAsShipping, setSameAsShipping] = useState<boolean>(true);
    const [showAddShipping, setShowAddShipping] = useState<boolean>(false);
    const [showAddBilling, setShowAddBilling] = useState<boolean>(false);
    const [showChoicesForBilling, setShowChoicesForBilling] = useState<boolean>(false);


    const handleCheckbox = (evt : ChangeEvent<HTMLInputElement>, role : 'shipping' | 'billing') => {
        // role -> enum of string options indicating type of address

        // if checkbox checked...
        if (evt.target.checked && existingAddresses) {
                // update formInput by using string value of role to determine which address to update
                setFormInput((prev) => ({
                    ...prev,
                    [role]: existingAddresses[parseInt(evt.target.value)]
                }));

        // if checkbox unchecked...
        } else {
            // clear formInput by setting corresponding address to empty object
            setFormInput((prev) => ({
                ...prev,
                [role]: {} as AddressType
            }));
        }
    }

    const handleMethodSelect = (evt : ChangeEvent<HTMLSelectElement>) => {
        setFormInput((prev) => ({
            ...prev,
            method: evt.target.value
        }));
      }

    const handleSameAsShipping = (evt: React.ChangeEvent<HTMLInputElement>) => {
        // updates billing address with shipping address info
        evt.preventDefault();
        if (evt.target.value === 'yes') {
            setSameAsShipping(true);
          setFormInput((prev) => ({
            ...prev, billing: prev?.shipping
            }));
            setShowChoicesForBilling(false);
            setShowAddBilling(false);
      } else {
        setSameAsShipping(false);
        setShowChoicesForBilling(true);
      }
    }

    const handleSubmit = async () => {
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit}>
        <div>
          <h3>Delivery Address</h3>
          {existingAddresses.length > 0 && (
            <div>
              {existingAddresses.map((address, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={index}
                    onChange={(evt) => {
                      handleCheckbox(evt, 'shipping');
                    }}
                    checked={formInput.shipping === address}
                  />
                  {address.firstName} {address.lastName} <br />
                  {address.street} <br />
                  {address.city}, {address.state} {address.zip}
                </label>
              ))}
            </div>
          )}
          <button
            onClick={(evt) => {
              evt.preventDefault();
              setShowAddShipping((prev) => !prev);
            }}
          >
            {showAddShipping ? 'Remove' : 'Add new shipping'}
          </button>
          {showAddShipping ? (
            <AddressForm
              formState={formInput.shipping}
              setFormState={setFormInput}
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
            value={formInput.method}
            onChange={(evt) => handleMethodSelect(evt)}
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
          <div>
  <input
    type="radio"
    id="sameAsShipping"
    name="sameAsShipping"
    value="yes"
    checked={sameAsShipping}
    onChange={(evt) => handleSameAsShipping(evt)}
  />
  <label htmlFor="sameAsShipping">Yes</label>

  <input
    type="radio"
    id="notSameAsShipping"
    name="sameAsShipping"
    value="no"
    checked={sameAsShipping}
    onChange={(evt) => handleSameAsShipping(evt)}
  />
  <label htmlFor="notSameAsShipping">No</label>
</div>
          {showChoicesForBilling && existingAddresses ? (
            <div>
              {existingAddresses.map((address, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={index}
                    onChange={(evt) => {
                      handleCheckbox(evt, 'billing');
                    }}
                    checked={formInput.billing === address}
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
              setShowAddBilling((prev) => !prev);
            }}
          >
            {showAddBilling ? 'Remove' : 'Add new billing'}
          </button>
          {showAddBilling ? (
            <AddressForm
              formState={formInput.billing}
              setFormState={setFormInput}
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
    );
}