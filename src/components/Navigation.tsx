import { useAuth } from '../app/firebase/AuthContext';
import Link from 'next/link';

function Navigation () {
    const { user, isAdmin } = useAuth();
    return (
        <nav>
            <ul>
                <li><Link href='/products'>Browse Bakery</Link></li>
                <li><Link href='/cart'>Cart</Link></li>

                {user && isAdmin && (
                    <>
                        <li><Link href='/products/create'>Add Products</Link></li>
                        {/* <li><Link href='/fulfillment'>Fulfillment</Link></li> */}
                    </>
                )}

                {user && (
                    <>
                        <li><Link href='/account'>Account</Link></li>
                        <li><Link href='/logout'>Logout</Link></li>
                    </>
                )}

                {!user && (
                    <>
                        <li><Link href='/signup'>Signup</Link></li>
                        <li><Link href='/login'>Login</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;