import { ChangeEvent, FormEvent, Dispatch } from 'react';
import { renderInput } from '@/utilities/formUtilities';
import { FormInput } from '../../types/types';

interface UserAccessProps {
  title: string;
  errorMessage: string;
  formInput: FormInput;
  handleChange: Dispatch<ChangeEvent<HTMLInputElement>>;
  handleUserSubmit: (formInput: FormInput) => Promise<void>;
}

export default function UserAccessForm({
  title,
  errorMessage,
  formInput,
  handleChange,
  handleUserSubmit,
}: UserAccessProps) {
  const onSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    await handleUserSubmit(formInput);
  };

  return (
    <main>
      <h1>{title.charAt(0).toUpperCase() + title.slice(1)}</h1>
      <span>{errorMessage && errorMessage}</span>
      <form onSubmit={onSubmit}>
        {title === 'signup' && (
          <>
            {renderInput('name', 'Name', 'text', formInput, handleChange)}
            {renderInput('email', 'Email', 'email', formInput, handleChange)}
            {renderInput(
              'password',
              'Password',
              'password',
              formInput,
              handleChange
            )}
            {renderInput(
              'confirm_password',
              'Confirm Password',
              'password',
              formInput,
              handleChange
            )}
          </>
        )}
        {title === 'login' && (
          <>
            {renderInput('email', 'Email', 'email', formInput, handleChange)}
            {renderInput(
              'password',
              'Password',
              'password',
              formInput,
              handleChange
            )}
          </>
        )}
        <input type="submit" className="submit" value="Submit" />
      </form>
    </main>
  );
}
