import { useState, useEffect, useRef } from 'react';
import { renderInput } from '@/utilities/formUtilities';
import { AddressType, FormInput } from '../../types/types';

interface AddressFormProps {
  // formInput.shipping | formInput.billing to spread into this formState
  inputtedAddress: AddressType;
  // invokes func in checkoutForm to update submission state with user's input
  onChange: (
    section: 'shipping' | 'billing',
    addressFormState: FormInput
  ) => void;
  // saves which section the component is rendering in
  section: 'shipping' | 'billing';
}

export default function AddressForm({
  inputtedAddress,
  section,
  onChange,
}: AddressFormProps) {
  const [formState, setFormState] = useState<FormInput>({});
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if user navigates back and forth between shipping and billing sections
      // spread inputtedAddress to address form state that inputs aren't lost
    if (Object.keys(inputtedAddress).length !== 0)
      setFormState({ ...inputtedAddress });

    // event listener to detect clicks outside the component
    document.addEventListener('mousedown', handleClickOutside);

    // cleans up event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputtedAddress]);

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // destructures name of field and value
    const { name, value } = evt.target;
    // updates state of address form to render value in input fields
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    // when user clicks out of component
      // update the corresponding checkoutForm state's section with addressForm state
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      onChange(section, formState);
    }
  };

  return (
    <div ref={formRef}>
      {renderInput(
        'firstName',
        'First Name',
        'text',
        formState,
        handleInputChange
      )}
      {renderInput(
        'lastName',
        'Last Name',
        'text',
        formState,
        handleInputChange
      )}
      {renderInput('street', 'Street', 'text', formState, handleInputChange)}
      {renderInput('city', 'City', 'text', formState, handleInputChange)}
      {renderInput('state', 'State', 'text', formState, handleInputChange)}
      {renderInput('zip', 'Zip', 'text', formState, handleInputChange)}
    </div>
  );
}
