import { useState, Dispatch, ChangeEvent, MouseEvent, FormEvent } from 'react';
import AddressForm from './AddressForm';
import { isEqual } from 'lodash';

import { addressValidation } from '../utilities/formUtilities';
import { CheckoutFormInput, AddressType, FormInput } from '../../types/types';

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
  const [sameAsShipping, setSameAsShipping] = useState<boolean | null>(null);

  // for rendering shipping/delivery and billing sections
  const [currentSection, setCurrentSection] = useState<1 | 2>(1);

  const handleCheckbox = (
    evt: ChangeEvent<HTMLInputElement>,
    section: 'shipping' | 'billing'
  ) => {
    // role -> enum of string options indicating type of address

    // if checkbox checked...
    if (evt.target.checked && existingAddresses) {
      // update formInput by using string value of role to determine which address to update
      setFormInput((prev) => ({
        ...prev,
        [section]: existingAddresses[parseInt(evt.target.value)],
      }));

      // auto close the corresponding section's address form
      section === 'shipping'
        ? setShowAddShipping(false)
        : setShowAddBilling(false);

      // if checkbox unchecked...
    } else {
      // clear formInput by setting corresponding address to empty object
      setFormInput((prev) => ({
        ...prev,
        [section]: {} as AddressType,
      }));
    }
  };

  const handleMethodSelect = (evt: ChangeEvent<HTMLSelectElement>) => {
    setFormInput((prev) => ({
      ...prev,
      method: evt.target.value,
    }));
  };

  const handleShowAndCloseForm = (
    evt: MouseEvent<HTMLButtonElement>,
    formType: 'shipping' | 'billing'
  ) => {
    // sets show add address form for a particular section
      // clears the corresponding info from the formInput
      // to prevent mix up from existing address info fields and from new address input fields

    if (formType === 'shipping') {
      setShowAddShipping((prev) => !prev);
      setFormInput((prev) => ({
        ...prev,
        shipping: {} as AddressType,
      }));
    } else if (formType === 'billing') {
      setShowAddBilling((prev) => !prev);
      setFormInput((prev) => ({
        ...prev,
        billing: {} as AddressType,
      }));
    }
  };

  const handleSameAsShipping = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // updates billing address with shipping address info
    if (evt.target.value === 'yes') {
      setSameAsShipping(true);
      setFormInput((prev) => ({
        ...prev,
        billing: prev?.shipping,
      }));
      setShowAddBilling(false);
    } else {
      setSameAsShipping(false);
      setFormInput((prev) => ({
        ...prev,
        billing: {} as AddressType,
      }));
    }
  };

  const handleAddressInput = (
    section: 'shipping' | 'billing',
    addressFormState: FormInput
  ) => {
    setFormInput((prev) => ({
      ...prev,
      [section]: {
        ...addressFormState,
      },
    }));
  };

  const disableNext = (currentSection: number): boolean => {
    // used to determine if next or continue to payment functions are disabled
      // needs to return false to be enabled
      // by default is disabled

    // in shipping section:
      // enables if method and shipping address passes validation
    if (currentSection === 1) {
      if (formInput.method !== '' && addressValidation(formInput.shipping))
        return false;
    }
    // in billing section:
      // enables if billing address passes validation
    else if (currentSection === 2)
      if (addressValidation(formInput.billing)) return false;

    return true;
  };

  const handleSubmit = async (evt : FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit();
  };

  const renderShippingSection = () => {
    return (
      <>
        <div>
          <h2>Shipping Address</h2>
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
                    checked={isEqual(address, formInput.shipping)}
                  />
                  {address.firstName} {address.lastName} <br />
                  {address.street} <br />
                  {address.city}, {address.state} {address.zip}
                </label>
              ))}
            </div>
          )}
          {!showAddShipping && (
            <button onClick={(evt) => handleShowAndCloseForm(evt, 'shipping')}>
              Add new address
            </button>
          )}
          {showAddShipping && (
            <>
              <button
                onClick={(evt) => handleShowAndCloseForm(evt, 'shipping')}
              >
                X
              </button>
              <AddressForm
                inputtedAddress={formInput.shipping}
                section="shipping"
                onChange={handleAddressInput}
              />
            </>
          )}
        </div>
        <div>
          <h2>Select Delivery Method</h2>
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
        <button
          disabled={disableNext(currentSection)}
          onClick={() => {
            setCurrentSection(2);
          }}
        >
          Next
        </button>
      </>
    );
  };

  const renderBillingSection = () => {
    return (
      <>
        <div>
          <div>
            <h4>Shipping Address</h4>
            {formInput.shipping.firstName} {formInput.shipping.lastName} <br />
            {formInput.shipping.street} <br />
            {formInput.shipping.city}, {formInput.shipping.state}{' '}
            {formInput.shipping.zip}
            <h4>{formInput.method} Delivery</h4>
          </div>
          <h2>Billing Address</h2>
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

          {existingAddresses.length > 0 && sameAsShipping === false && (
            <>
              <div>
                {existingAddresses
                  // filter out the selected shipping address
                  .filter((address) => !isEqual(address, formInput.shipping))
                  .map((address, index) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        value={index}
                        onChange={(evt) => {
                          handleCheckbox(evt, 'billing');
                        }}
                        checked={isEqual(address, formInput.billing)}
                      />
                      {address.firstName} {address.lastName} <br />
                      {address.street} <br />
                      {address.city}, {address.state} {address.zip}
                    </label>
                  ))}
              </div>
              {!showAddBilling && (
                <button
                  onClick={(evt) => handleShowAndCloseForm(evt, 'billing')}
                >
                  Add new address
                </button>
              )}
              {showAddBilling && (
                <>
                  <button
                    onClick={(evt) => handleShowAndCloseForm(evt, 'billing')}
                  >
                    X
                  </button>
                  <AddressForm
                    inputtedAddress={formInput.billing}
                    section="billing"
                    onChange={handleAddressInput}
                  />
                </>
              )}
            </>
          )}
        </div>
        <button onClick={() => setCurrentSection(1)}>Previous</button>
        <input
          disabled={disableNext(currentSection)}
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
