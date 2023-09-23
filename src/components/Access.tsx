import axios from 'axios';
import { FormData, ErrorResponse } from "../../types/types";
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, getIdToken, UserCredential, User } from '@firebase/auth';
import { auth } from '../app/firebase/firebaseConfig';

// type for signup and login props
interface AccessProps {
    path: string;
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
    const url = 'http://127.0.0.1:5000/user/';

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
        const submitInput = props.path === 'signup' ? formInput.name : '';
        // password match
        if (props.path === 'signup') {
            const message = formVerification(formInput.password, formInput.confirm_password);
            if (message) return setErrorMessage(message);
        }

        try {
            // signup or login user with firebase
            const user = await props.method(formInput.email, formInput.password);
            try {
                if (user) {
                    // get token
                    const token = await getIdToken(user);
                    // send token and user name to backend
                    const response = await axios.post(url + props.path, submitInput, {
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    // redirect to main page
                    if (response.status === 201 || response.status === 200) router.push('/');
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
            <h1>{props.path === 'signup' ? 'Signup' : 'Login'}</h1>
            <span>{errorMessage}</span>
            <form onSubmit={handleSubmit}>
                {props.path === 'signup' ? (
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
