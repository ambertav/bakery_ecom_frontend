import axios from 'axios';
import { FormData, ErrorResponse } from "../../types/types";
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, getIdToken, UserCredential, User } from '@firebase/auth';
import { auth } from '../app/firebase/firebaseConfig';

function isAxiosError(error: any) : error is import('axios').AxiosError {
    return error.response !== undefined;
}

async function signup (email : string, password : string) {
    try {
        const userCredential : UserCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log (userCredential)
        const newUser : User | null = userCredential.user;
        console.log(newUser)
        return newUser;
    } catch (error) {
        console.log('Error signing up: ', error);
        return null;
    }
}

export default function Access () {
    const router = useRouter();
    const [ formInput, setFormInput ] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    const [ errorMessage, setErrorMessage ] = useState<string>('');
    const url = 'http://127.0.0.1:5000/';


    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        console.log(formInput.name)
        setFormInput((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSubmit = async (evt: FormEvent) => {
        evt.preventDefault();
        // condition to update url path based on signup and login
        let specificPath: string = router.pathname === '/signup' ? 'signup' : 'login';
        // password match
        if (formInput.confirm_password && formInput.password !== formInput.confirm_password) return setErrorMessage('Passwords do not match');
        try {
            // signup user with firebase
            const newUser = await signup(formInput.email, formInput.password);
            console.log(newUser)
            try {
                if (newUser) {
                    // get token
                    const token = await getIdToken(newUser);
                    // send token and user name to backend
                    const response = await axios.post(url + 'user/' + specificPath, formInput.name, {
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    // redirect to main page
                    if (response.status === 201) router.push('/');
                }
                if (!newUser) console.error
            } catch (error) {
                if (isAxiosError(error) && error.response) {
                    if (error.code === 'auth/email-already-in-use') setErrorMessage('Email already in use');
                    else console.error('Error creating user:', error);
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
            <h1>{router.pathname === '/signup' ? 'Sign Up' : 'Login'}</h1>
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
