import axios from '../utilities/axiosConfig';
import { FormInput } from "../../types/types";
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { User } from '@firebase/auth';
import { handleFirebaseAuthErrors } from '../utilities/errors';

import AdminAccess from './AdminAccess';
import UserAccess from './UserAccess';
import { validateForm } from '@/utilities/formUtilities';

// type for signup and login props
interface AccessProps {
    method: (email: string, password: string) => Promise<User | null>;
    url: string;
    resource: string;
  }

export default function Access ({ method, url, resource } : AccessProps) {
    const router = useRouter();
    const [ formInput, setFormInput ] = useState<FormInput>({});
    const [ errorMessage, setErrorMessage ] = useState<string>('');

    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        setFormInput((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleUserSubmit = async (formInput : FormInput) => {
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
            localStorageCart: JSON.parse(localStorage.getItem('cart') || '[]')
         }

        try {
            // signup or login user with firebase
            const user = await method(formInput.email as string, formInput.password as string);
            try {
                if (user) {
                    const response = await axios.post(url, submitBody, { 
                        headers: { 'Content-Type': 'application/json' },
                    });
                    // redirect to main page
                    if (response.status === 201 || response.status === 200)  {
                        localStorage.removeItem('cart'); // removes items from cart once created in database
                        router.push('/');
                    }
                }
            } catch (error : any) {
                console.error(error);
            }
        } catch (error : any) {
            setErrorMessage(handleFirebaseAuthErrors(error));
        }
    }

    const handleAdminSubmit = async (formInput : FormInput) => {
        setErrorMessage('');

        // password match for signup
        if (router.pathname === '/admin/signup') {
            let message = await validateForm(formInput, ['password', 'pin', 'employerCode'])
            if (message) return setErrorMessage(message);
        }
    
        const submitBody = {
            name: router.pathname === '/admin/signup' ? formInput.name : '',
            pin: router.pathname === '/admin/signup' ? formInput.pin : '',
            employerCode: router.pathname === '/admin/signup' ? formInput.employerCode : '',
        };

        try {
            // signup or login user with firebase
            const admin = await method(formInput.email as string, formInput.password as string);
            try {
                if (admin) {
                    const response = await axios.post(url, submitBody, { 
                        headers: { 'Content-Type': 'application/json' },
                    });
                    // redirect to main page
                    if (response.status === 201 || response.status === 200)  {
                        console.log(response.data.message);
                        console.log(response.data.employeeId);
                    }
                }
            } catch (error : any) {
                console.error(error);
            }
        } catch (error : any) {
            setErrorMessage(handleFirebaseAuthErrors(error));
        }
    }

    return (
        <>
            {resource === 'user' && (
                <UserAccess title={router.pathname.substring(1)} errorMessage={errorMessage} formInput={formInput} handleChange={handleChange} handleUserSubmit={handleUserSubmit} />
            )}
            {resource === 'admin' && (
                <AdminAccess title={router.pathname.substring(1).split('/').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} errorMessage={errorMessage} formInput={formInput} handleChange={handleChange} handleAdminSubmit={handleAdminSubmit} />
            )}
        </>
    );
}
