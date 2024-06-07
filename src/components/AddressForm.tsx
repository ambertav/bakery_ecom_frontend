import { useState, useEffect } from 'react';
import { renderInput } from '@/utilities/formUtilities';
import { AddressType, FormInput } from '../../types/types';

interface AddressFormProps {
    // formInput.shipping | formInput.billing to spread into this formState
    inputtedAddress: AddressType;
    // invokes func in checkoutForm to update submission state with user's input
    onChange: (section : 'shipping' | 'billing', field : string, value : string) => void;
    // saves which section the component is rendering in
    section: 'shipping' | 'billing';
}

export default function AddressForm({ inputtedAddress, section, onChange } : AddressFormProps) {
  const [formState, setFormState] = useState<FormInput>({});

  useEffect(() => {
    // if user navigates back and forth between shipping and billing sections
        // spread inputtedAddress to address form state that inputs aren't lost
    if (Object.keys(inputtedAddress).length !== 0) {
        setFormState({...inputtedAddress});
    }
  }, []);

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // updates corresponding state based on which form is being changed
    const { name, value } = evt.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    onChange(section, name, value);
  }

  return (
    <>
        {renderInput('firstName', 'First Name', 'text', formState, handleInputChange)}
        {renderInput('lastName', 'Last Name', 'text', formState, handleInputChange)}
        {renderInput('street', 'Street', 'text', formState, handleInputChange)}
        {renderInput('city', 'City', 'text', formState, handleInputChange)}
        {renderInput('state', 'State', 'text', formState, handleInputChange)}
        {renderInput('zip', 'Zip', 'text', formState, handleInputChange)}
    </>
  );
}
