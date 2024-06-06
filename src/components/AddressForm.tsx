import { useState, useEffect } from 'react';
import { renderInput } from '@/utilities/formUtilities';
import { FormInput } from '../../types/types';

export default function AddressForm() {
  const [formState, setFormState] = useState<FormInput>({});

  useEffect(() => {
    function clearInput() {
      setFormState({});
    }
    clearInput();
  }, []);

  function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    // updates corresponding state based on which form is being changed
    const { name, value } = evt.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
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
