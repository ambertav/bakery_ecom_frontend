import { ChangeEvent, FormEvent, Dispatch } from 'react';
import { renderInput } from '@/utilities/formUtilities';
import { FormInput } from '../../types/types';

interface UserAccessProps {
  path: string;
  errorMessage: string;
  formInput: FormInput;
  handleChange: Dispatch<ChangeEvent<HTMLInputElement>>;
  handleAdminSubmit: (formInput: FormInput) => Promise<void>;
}

export default function AdminAccessForm({
  path,
  errorMessage,
  formInput,
  handleChange,
  handleAdminSubmit,
}: UserAccessProps) {
  // determines the title and content of the page based on the path
  const titleMap: { [key: string]: string } = {
    '/admin/signup': 'Admin Signup',
    '/admin/login': 'Admin Login',
    '/admin/update-password': 'Admin Update Password',
  };

  const title = titleMap[path] || '';

  const onSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    await handleAdminSubmit(formInput);
  };

  return (
    <main>
      <h1>{title}</h1>
      <span>{errorMessage && errorMessage}</span>
      <form onSubmit={onSubmit}>
        {title === 'Admin Signup' && (
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
            {renderInput('pin', 'Pin', 'password', formInput, handleChange)}
            {renderInput(
              'confirm_pin',
              'Confirm Pin',
              'password',
              formInput,
              handleChange
            )}
            {renderInput(
              'employer_code',
              'Employer Code',
              'text',
              formInput,
              handleChange
            )}
          </>
        )}
        {title === 'Admin Login' && (
          <>
            {renderInput(
              'employeeId',
              'Employee ID',
              'text',
              formInput,
              handleChange
            )}
            {renderInput(
              'password',
              'Password',
              'password',
              formInput,
              handleChange
            )}
            {renderInput('pin', 'Pin', 'password', formInput, handleChange)}
          </>
        )}
        {title === 'Admin Update Password' && (
          <>
            {renderInput('email', 'Email', 'email', formInput, handleChange)}
            {renderInput(
              'employeeId',
              'Employee ID',
              'text',
              formInput,
              handleChange
            )}
            {renderInput('pin', 'Pin', 'password', formInput, handleChange)}
            {renderInput(
              'oldPassword',
              'Old Password',
              'password',
              formInput,
              handleChange
            )}
            {renderInput(
              'password',
              'New Password',
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
        <input type="submit" className="submit" value="Submit" />
      </form>
    </main>
  );
}
