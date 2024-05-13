import { ChangeEvent, FormEvent, Dispatch } from 'react';
import { renderInput } from '@/utilities/formUtilities';
import { FormInput } from '../../types/types';

interface UserAccessProps {
    title : string;
    errorMessage : string;
    formInput : FormInput;
    handleChange : Dispatch<ChangeEvent<HTMLInputElement>>
    handleAdminSubmit : (formInput: FormInput) => Promise<void>;
}

export default function AdminAccess ({ title, errorMessage, formInput, handleChange, handleAdminSubmit } : UserAccessProps) {

    const onSubmit = async (evt: FormEvent) => {
        evt.preventDefault();
        await handleAdminSubmit(formInput);
    }

    return (
        <main>
            <h1>{title}</h1>
            <span>{errorMessage && errorMessage}</span>
            <form onSubmit={onSubmit}>
                {title === 'Admin Signup' && (
                    <>
                        {renderInput('name', 'Name', 'text', formInput, handleChange)}
                        {renderInput('email', 'Email', 'email', formInput, handleChange)}
                        {renderInput('password', 'Password', 'password', formInput, handleChange)}
                        {renderInput('confirm_password', 'Confirm Password', 'password', formInput, handleChange)}
                        {renderInput('pin', 'Pin', 'password', formInput, handleChange)}
                        {renderInput('confirm_pin', 'Confirm Pin', 'password', formInput, handleChange)}
                        {renderInput('employer_code', 'Employer Code', 'text', formInput, handleChange)}
                    </>
                )}
                {title === 'Admin Login' && (
                    <>
                        {renderInput('email', 'Email', 'email', formInput, handleChange)}
                        {renderInput('password', 'Password', 'password', formInput, handleChange)}
                        {renderInput('employeeId', 'Employee ID', 'text', formInput, handleChange)}
                        {renderInput('pin', 'Pin', 'password', formInput, handleChange)}
                    </>
                )}
                {title === 'Admin Update-pin' && (
                    <>
                        {renderInput('email', 'Email', 'email', formInput, handleChange)}
                        {renderInput('password', 'Password', 'password', formInput, handleChange)}
                        {renderInput('employeeId', 'Employee ID', 'text', formInput, handleChange)}
                        {renderInput('oldPin', 'Previous Pin', 'password', formInput, handleChange)}
                        {renderInput('pin', 'New Pin', 'password', formInput, handleChange)}
                        {renderInput('confirm_pin', 'Confirm Pin', 'password', formInput, handleChange)}
                   </>
                )}
                <input type="submit" className="submit" value='Submit' />
            </form>
        </main>
    );
}