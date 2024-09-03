import axios from '../utilities/axiosConfig';
import { FormInput } from '../../types/types';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { User } from '@firebase/auth';
import { handleFirebaseAuthErrors } from '../utilities/errors';

import AdminAccess from './AdminAccess';
import UserAccess from './UserAccess';
import { validateForm } from '@/utilities/formUtilities';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/contexts/AuthContext';

// type for signup and login props
interface AccessProps {
  method: (email: string, password: string) => Promise<User | null>;
  url: string;
  resource: string;
}

export default function Access({ method, url, resource }: AccessProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [formInput, setFormInput] = useState<FormInput>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSubmit = async (formInput: FormInput) => {
    setErrorMessage('');
    // password match for signup
    if (router.pathname === '/signup') {
      const message = await validateForm(formInput, ['password']);
      if (message) return setErrorMessage(message);
    }

    // if signup, send user name over to backend for creation, firebase_uid comes via token
    // passing in localStorageCart for cart item creation and association with user upon signup or login
    const submitBody = {
      name: router.pathname === '/signup' ? formInput.name : '',
      email: formInput.email,
      password: formInput.password,
      confirm_password: formInput.confirm_password,
      localStorageCart: JSON.parse(localStorage.getItem('cart') || '[]'),
    };

    try {
      try {
          const response = await axios.post(url, submitBody, {
            headers: { 'Content-Type': 'application/json' },
          });
          // redirect to main page
          if (response.status === 201 || response.status === 200) {
            localStorage.removeItem('cart'); // removes items from cart once created in database
            router.push('/');
          }
        
      } catch (error: any) {
        console.error(error);
      }
    } catch (error: any) {
      setErrorMessage(handleFirebaseAuthErrors(error));
    }
  };

  const handleAdminSubmit = async (formInput: FormInput) => {
    setErrorMessage('');

    // form validations for each path
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

    // formatting the submit body for signup, login, and update pin
        // using spread operator so that empty fields are not included unnecessarily
        // the three desired structures of submit body:
            // for signup: { name, email, password, pin, employerCode }
            // for login: { employeeId, password, pin }
            // for update-password: { email, employeeId, oldPassword, password, pin }
    const submitBody = {
        pin: formInput.pin,
        password: formInput.password,
        ...(router.pathname === '/admin/signup' && {
            name: formInput.name,
            email: formInput.email,
            employerCode: formInput.employerCode,
        }),
        ...(router.pathname === '/admin/login' && {
            employeeId: formInput.employeeId,
        }),
        ...(router.pathname === '/admin/update-password' && {
            email: formInput.email,
            employeeId: formInput.employeeId,
            oldPassword: formInput.oldPassword,
        }) 
    };

    try {
      try {
          const response = await axios.post(url, submitBody, {
            headers: { 'Content-Type': 'application/json' },
          });

          // expected http codes + what to do:
            // 201 -- for signup, display toast with received employee id and redirect to fulfilmment page on close
            // 200 -- for login, redirect to fulfillment page
            // 403 -- expired password, redirect to update password page
            // else, or 401 -- logout of firebase, display error message

          if (response.status === 201) {
            toast.success(`Your employee id is: ${response.data.employeeId}`, {
              onClose: () => {
                router.push('/admin/login');
              },
            });
          } else if (response.status === 200) {
            router.push('/fulfillment');
          }
      } catch (error: any) {
        await logout();
        if (error.response.status === 403) {
          toast.success(
            'Your password is expired, you will be redirected to update your password',
            {
              onClose: () => {
                router.push('/admin/update-password');
              },
            }
          );
        } else if (error.response.status === 401) {
          toast.success('Invalid credentials');
        }
        console.error(error);
      }
    } catch (error: any) {
      // when firebase login or sign up fails
      setErrorMessage(handleFirebaseAuthErrors(error));
    }
  };

  return (
    <>
      {resource === 'user' && (
        <UserAccess
          title={router.pathname.substring(1)}
          errorMessage={errorMessage}
          formInput={formInput}
          handleChange={handleChange}
          handleUserSubmit={handleUserSubmit}
        />
      )}
      {resource === 'admin' && (
        <>
          <AdminAccess
            path={router.pathname}
            errorMessage={errorMessage}
            formInput={formInput}
            handleChange={handleChange}
            handleAdminSubmit={handleAdminSubmit}
          />
          <ToastContainer autoClose={false} position="top-center" />
        </>
      )}
    </>
  );
}
