import { signInWithEmailAndPassword, UserCredential, User } from '@firebase/auth';
import { auth } from '../../app/firebase/firebaseConfig';

import Access from '@/components/Access';


export default function UpdatePasswordAndLogin () {

    async function login (email : string, password : string) : Promise< User | null> {
        try {
            const userCredential : UserCredential = await signInWithEmailAndPassword(auth, email, password);
            const currentUser : User | null = userCredential.user;
            return currentUser;
        } catch (error) {
            throw error;
        }
    }    

    return  (
        <>
            <Access method={login} url='admin/update-password/'  resource='admin' />  
        </>
    );
}
