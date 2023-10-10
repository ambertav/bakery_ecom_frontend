import { signInWithEmailAndPassword, UserCredential, User } from '@firebase/auth';
import { auth } from '../app/firebase/firebaseConfig';
import Link from 'next/link';

import Access from '@/components/Access';


export default function Login () {

    async function login (email : string, password : string) {
        try {
            const userCredential : UserCredential = await signInWithEmailAndPassword(auth, email, password);
            const currentUser : User | null = userCredential.user;
            return currentUser;
        } catch (error) {
            console.error('Error logging in: ', error);
            return null;
        }
    }    

    return  (
        <>
            <Access method={login} />  
            <p>Don't have an account? 
                <br />
                <Link href='/signup'>Signup</Link> now
            </p>
        </>
    );
}
