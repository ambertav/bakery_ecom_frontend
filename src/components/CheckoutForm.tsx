import { useState, Dispatch, ChangeEvent, MouseEvent } from 'react';
import AddressForm from './AddressForm';

import { CheckoutFormInput, AddressType } from '../../types/types';

interface CheckoutFormProps {
  formInput: CheckoutFormInput;
  setFormInput: Dispatch<React.SetStateAction<CheckoutFormInput>>;
  existingAddresses: AddressType[];
  onSubmit: () => void;
  isProcessing: boolean;
}

export default function CheckoutForm({
  formInput,
  setFormInput,
  existingAddresses,
  onSubmit,
  isProcessing,
}: CheckoutFormProps) {
  // controls render of new address form for shipping
  const [showAddShipping, setShowAddShipping] = useState<boolean>(false);

  // controls render of new address form for billing
  const [showAddBilling, setShowAddBilling] = useState<boolean>(false);

  // sets billing same as shipping
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(false);

  // controls render of list of choices of user's existing addresses
  const [showChoicesForBilling, setShowChoicesForBilling] =
    useState<boolean>(false);

  // for rendering shipping/delivery and billing sections
  const [currentSection, setCurrentSection] = useState<1 | 2>(1);

  const handleCheckbox = (
    evt: ChangeEvent<HTMLInputElement>,
    role: 'shipping' | 'billing'
  ) => {
    // role -> enum of string options indicating type of address

    // if checkbox checked...
    if (evt.target.checked && existingAddresses) {
      // update formInput by using string value of role to determine which address to update
      setFormInput((prev) => ({
        ...prev,
        [role]: existingAddresses[parseInt(evt.target.value)],
      }));

      // auto close the corresponding section's address form
      role === 'shipping' ? setShowAddShipping(false) : setShowAddBilling(false)

      // if checkbox unchecked...
    } else {
      // clear formInput by setting corresponding address to empty object
      setFormInput((prev) => ({
        ...prev,
        [role]: {} as AddressType,
      }));
    }
  };

  const handleMethodSelect = (evt: ChangeEvent<HTMLSelectElement>) => {
    setFormInput((prev) => ({
      ...prev,
      method: evt.target.value,
    }));
  };

  const handleShowForm = (evt : MouseEvent<HTMLButtonElement>, formType : 'shipping' | 'billing') => {
    // sets show add address form for a particular section
    // clears the corresponding info from the formInput
        // to prevent mix up from existing address info fields and from new address input fields

    if (formType === 'shipping') {
        setShowAddShipping(true);
        setFormInput((prev) => ({
            ...prev,
            shipping: {} as AddressType,
        }));
    } else if (formType === 'billing') {
        setShowAddBilling(true);
        setFormInput((prev) => ({
            ...prev,
            billing: {} as AddressType,
        }));
    }
  }

  const handleSameAsShipping = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // updates billing address with shipping address info
    evt.preventDefault();
    if (evt.target.value === 'yes') {
      setSameAsShipping(true);
      setFormInput((prev) => ({
        ...prev,
        billing: prev?.shipping,
      }));
      setShowChoicesForBilling(false);
      setShowAddBilling(false);
    } else {
      setSameAsShipping(false);
      setShowChoicesForBilling(true);
    }
  };

  const handleSubmit = async () => {
    onSubmit();
  };

  const renderShippingSection = () => {
    return (
      <>
        <div>
          <h3>Shipping Address</h3>
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
          {!showAddShipping && (
            <button onClick={(evt) => handleShowForm(evt, 'shipping')}>
              Add new address
            </button>
          )}
          {showAddShipping && (
            <>
              <button onClick={() => setShowAddShipping(false)}>X</button>
              <AddressForm
                formState={formInput.shipping}
                setFormState={setFormInput}
              />
            </>
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
        <button onClick={() => setCurrentSection(2)}>Next</button>
      </>
    );
  };

  const renderBillingSection = () => {
    return (
      <>
        <div>
          <h3>Billing Address</h3>
          <p>is Billing same as shipping?</p>
          <div>
            <input
              type="radio"
              id="sameAsShipping"
              name="sameAsShipping"
              value="yes"
              checked={sameAsShipping === true}
              onChange={(evt) => handleSameAsShipping(evt)}
            />
            <label htmlFor="sameAsShipping">Yes</label>

            <input
              type="radio"
              id="notSameAsShipping"
              name="sameAsShipping"
              value="no"
              checked={sameAsShipping === false}
              onChange={(evt) => handleSameAsShipping(evt)}
            />
            <label htmlFor="notSameAsShipping">No</label>
          </div>
          {showChoicesForBilling && existingAddresses && (
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
          )}
          {!showAddBilling && (
            <button onClick={(evt) => handleShowForm(evt, 'billing')}>
              Add new address
            </button>
          )}
          {showAddBilling && (
            <>
              <button onClick={() => setShowAddBilling(false)}>X</button>
              <AddressForm
                formState={formInput.billing}
                setFormState={setFormInput}
              />
            </>
          )}
        </div>
        <button onClick={() => setCurrentSection(1)}>Previous</button>
        <input
          type="submit"
          value={isProcessing ? 'Processing...' : 'Continue to Payment'}
        />
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {currentSection === 1 && renderShippingSection()}
      {currentSection === 2 && renderBillingSection()}
    </form>
  );
}
