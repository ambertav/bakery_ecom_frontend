import axios from '../utilities/axiosConfig';
import { FormData, ErrorResponse } from "../../types/types";
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { User } from '@firebase/auth';

// type for signup and login props
interface AccessProps {
    method: (email: string, password: string) => Promise<User | null>;
  }

function isAxiosError(error: any) : error is import('axios').AxiosError {
    return error.response !== undefined;
}

export default function Access (props : AccessProps) {
    const router = useRouter();
    const [ formInput, setFormInput ] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    const [ errorMessage, setErrorMessage ] = useState<string>('');

    function formVerification(password: string, confirm: string): string | undefined {
        if (password !== confirm) {
          return 'Passwords do not match';
        }
        // Return undefined when passwords match
        return undefined;
      }

    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        setFormInput((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSubmit = async (evt: FormEvent) => {
        evt.preventDefault();
        // password match for signup
        if (router.pathname === 'signup') {
            const message = formVerification(formInput.password, formInput.confirm_password);
            if (message) return setErrorMessage(message);
        }
        
        // if signup, send user name over to backend for creation, firebase_uid comes via token
        const name = router.pathname === '/signup' ? formInput.name : '';
        const localStorageCart = JSON.parse(localStorage.getItem('cart') || '[]');

        // passing in localStorageCart for cart item creation and association with user upon signup or login
        const submitBody = {
            name,
            localStorageCart,
        };

        try {
            // signup or login user with firebase
            const user = await props.method(formInput.email, formInput.password);
            try {
                if (user) {
                    const response = await axios.post('user' + router.pathname, submitBody, { 
                        headers: {
                        'Content-Type': 'application/json',
                        },
                    });
                    // redirect to main page
                    if (response.status === 201 || response.status === 200)  {
                        localStorage.removeItem('cart'); // removes items from cart once created in database
                        router.push('/');
                    }
                }
            } catch (error) {
                if (isAxiosError(error) && error.response) {
                    if (error.code === 'auth/email-already-in-use') setErrorMessage('Email already in use');
                    else console.error(error);
                }   
            }
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                const errorResponse = error.response.data as ErrorResponse;
                setErrorMessage(errorResponse.message || 'An error occurred.');
            } else {
                console.error('Error submitting the form:', error);
            }
        }
    }

    // conditionally render form inputs to resuse for signup and login pages
    function renderInput(name : string, label : string, type : string = 'text') {
        return (
            <div key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                type={type}
                id={name}
                name={name}
                value={formInput[name]}
                onChange={handleChange}
              />
            </div>
          );
    }

    return (
        <main>
            <h1>{router.pathname === '/signup' ? 'Signup' : 'Login'}</h1>
            <span>{errorMessage}</span>
            <form onSubmit={handleSubmit}>
                {router.pathname === '/signup' ? (
                    <>
                        {renderInput('name', 'Name')}
                        {renderInput('email', 'Email', 'email')}
                        {renderInput('password', 'Password', 'password')}
                        {renderInput('confirm_password', 'Confirm Password', 'password')}
                    </>
                ) : (
                    <>
                        {renderInput('email', 'Email', 'email')}
                        {renderInput('password', 'Password', 'password')}
                    </>
                )
                }
                <input type="submit" className="submit" />
            </form>
        </main>
    );
}
