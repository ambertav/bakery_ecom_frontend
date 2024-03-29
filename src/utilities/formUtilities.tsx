import { ChangeEvent, Dispatch } from 'react';
import { FormInput } from '../../types/types';

export const renderInput = (
  name: string,
  label: string,
  type: string = 'text',
  formInput: FormInput,
  handleChange:
    | Dispatch<
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLTextAreaElement>
        | ChangeEvent<HTMLSelectElement>
      >
    | Dispatch<ChangeEvent<HTMLInputElement>>
) => {
    
  // creating additional attributes contingent on type of input
  let additionalAttributes: {
    [key: string]:
      | string
      | ((event: React.KeyboardEvent<HTMLInputElement>) => void);
  } = {};

  // number type attributes, for create product form

    if (name === 'stock') {
        additionalAttributes.min = '0';
      // prevents user from typing in a decimal point
      additionalAttributes.onKeyPress = (
        evt: React.KeyboardEvent<HTMLInputElement>
      ) => {
        if (evt.key === '.') evt.preventDefault();
      };
    }

  if (name === 'price') {
    additionalAttributes.step = '0.01';
    additionalAttributes.min = '1';
  }

  return (
    <div key={name}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formInput[name]}
        onChange={handleChange}
        required={true}
        {...additionalAttributes}
      />
    </div>
  );
};
