import axios from './axiosConfig';
import { ChangeEvent, Dispatch } from 'react';
import { AddressType, FormInput } from '../../types/types';

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
    | Dispatch<ChangeEvent<HTMLInputElement>>,
    additionalProps: Record<string, any> = {},
) => {
  // creating additional attributes contingent on type of input
  let additionalAttributes: {
    [key: string]:
      | string
      | ((event: React.KeyboardEvent<HTMLInputElement>) => void);
  } = {};

  // number type attributes, for create product form

  if (name.split('-')[0] === 'stock') {
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

  if (name === 'pin' || name === 'confirm_pin') {
    additionalAttributes.minLength = '5';
    additionalAttributes.maxLength = '5';
  }

  if (name === 'zip') {
    additionalAttributes.pattern = '[0-9]{5}';
    additionalAttributes.title = 'Enter a valid 5 digit zip code';
  }

  return (
    <div key={name}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={
          typeof formInput[name] === 'string' ||
          typeof formInput[name] === 'number'
            ? formInput[name]
            : ''
        }
        onChange={handleChange}
        required={true}
        {...additionalAttributes}
        {...additionalProps}
      />
    </div>
  );
};

export const validateForm = async (
  formInput: FormInput,
  validations: string[]
): Promise<string | null> => {
  const { password, confirm_password, pin, confirm_pin, employer_code } =
    formInput;
  let validationMessage: string | undefined = undefined;

  for (const validation of validations) {
    switch (validation) {
      case 'password':
        validationMessage = passwordVerification(
          password as string,
          confirm_password as string
        );
        break;
      case 'pin':
        validationMessage = pinVerification(
          pin as string,
          confirm_pin as string
        );
        break;
      case 'employerCode':
        validationMessage = await employerCodeVerification(
          employer_code as string
        );
        break;
      default:
        break;
    }

    if (validationMessage) return validationMessage;
  }

  return null; // all validations passed
};

// form validation helpers
function passwordVerification(
  password: string,
  confirm: string
): string | undefined {
  if (password !== confirm) return 'Passwords do not match';

  // return undefined when passwords match
  return undefined;
}

function pinVerification(pin: string, confirm: string): string | undefined {
  if (pin !== confirm) return 'Pins do not match';

  // return undefined when pins match
  return undefined;
}

const employerCodeVerification = async (
  code: string
): Promise<string | undefined> => {
  try {
    const response = await axios.post('/admin/validate-code/', { code });
    if (response.status === 200) return undefined;
  } catch (error) {
    console.error('Error validating employeer code');
    return 'Invalid employer code. Cannot create admin';
  }
};

export const addressValidation = (address: AddressType): boolean => {
  // if all fields are filled out, returns true
  // if all or some fields are not filled out / missing, returns false
  return !!(
    address.firstName &&
    address.lastName &&
    address.street &&
    address.city &&
    address.state &&
    address.zip
  );
};
