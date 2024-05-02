import { createUserWithEmailAndPassword, UserCredential, User } from '@firebase/auth';
import { auth } from '../app/firebase/firebaseConfig';

import Access from '@/components/Access';

export default function Signup () {

    async function signup (email : string, password : string) : Promise<User | null> {
        try {
            const userCredential : UserCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser : User | null = userCredential.user;
            return newUser;
        } catch (error : any) {
            throw error;
        }
    }
      
    return (
        <Access method={signup} url='user/signup' resource='user' />
    );
}