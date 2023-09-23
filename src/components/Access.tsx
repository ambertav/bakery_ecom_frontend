import { FormData } from "../../types/types";
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';

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

    };

    const handleSubmit = async (evt: FormEvent) => {

    }

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
