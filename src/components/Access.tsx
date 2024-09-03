import { FormInput } from '../../types/types';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';

import AdminAccessForm from './AdminAccessForm';
import UserAccessForm from './UserAccessForm';
import { validateForm } from '@/utilities/formUtilities';

// type for signup and login props
interface AccessProps {
  handleSubmit: (formInput: FormInput) => Promise<void>;
  resource: string;
}

export default function Access({ handleSubmit, resource }: AccessProps) {
  const router = useRouter();
  const [formInput, setFormInput] = useState<FormInput>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const prepareSubmission = async (formInput: FormInput) => {
    setErrorMessage('');

    // form validations based on uri path
    if (router.pathname === '/signup') {
      const message = await validateForm(formInput, ['password']);
      if (message) return setErrorMessage(message);
    }

    if (router.pathname === '/admin/signup') {
      let message = await validateForm(formInput, [
        'password',
        'pin',
        'employerCode',
      ]);
      if (message) return setErrorMessage(message);
    } else if (router.pathname === '/admin/update-password') {
      let message = await validateForm(formInput, ['password']);
      if (message) return setErrorMessage(message);
    }

    // invoke axios calls
    await handleSubmit(formInput);
  };

  return (
    <>
      {resource === 'user' && (
        <UserAccessForm
          title={router.pathname.substring(1)}
          errorMessage={errorMessage}
          formInput={formInput}
          handleChange={handleChange}
          handleUserSubmit={prepareSubmission}
        />
      )}
      {resource === 'admin' && (
        <AdminAccessForm
          path={router.pathname}
          errorMessage={errorMessage}
          formInput={formInput}
          handleChange={handleChange}
          handleAdminSubmit={prepareSubmission}
        />
      )}
    </>
  );
}
