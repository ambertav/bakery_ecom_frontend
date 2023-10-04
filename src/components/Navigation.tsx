import { useAuth } from '../app/firebase/AuthContext';
import Link from 'next/link';

function Navigation () {
    const { user } = useAuth();
    return (
        <nav>
            <ul>
                 <Link href='/products'>Browse Bakery</Link>
                {user ? (
                    <>
                        <Link href='/account'>Account</Link>
                        <Link href='/cart'>Cart</Link>
                        <Link href='/logout'>Logout</Link>
                    </>
                ) : (
                    <>
                        <Link href='/signup'>Signup</Link>
                        <Link href='/login'>Login</Link>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;