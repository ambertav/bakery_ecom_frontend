import { useRouter } from 'next/navigation';
import { useAuth } from '../app/firebase/AuthContext';
import Link from 'next/link';

function Navigation() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  // using router to push query params to cause load on products page with category filter applied
  const handleParams = (category: string) => {
    const query = { category: category };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/products?${queryString}`);
  };

  return (
    <nav>
      <ul>
        <li>
          Browse Bakery
          <ul>
            <li>
              <a onClick={() => router.push('/products')}>All Products</a>
            </li>
            <li>
              <a onClick={() => handleParams('cake')}>Cakes</a>
            </li>
            <li>
              <a onClick={() => handleParams('cupcake')}>Cupcakes</a>
            </li>
            <li>
              <a onClick={() => handleParams('pie')}>Pies</a>
            </li>
            <li>
              <a onClick={() => handleParams('cookie')}>Cookies</a>
            </li>
            <li>
              <a onClick={() => handleParams('donut')}>Donuts</a>
            </li>
            <li>
              <a onClick={() => handleParams('pastry')}>Pastries</a>
            </li>
          </ul>
        </li>

        {!isAdmin && (
            <li>
            <Link href="/cart">Cart</Link>
            </li>
        )}

        {user && (
            <>
                {isAdmin && (
                    <>
                        <li>
                        <Link href="/products/create">Add Products</Link>
                        </li>
                        <li><Link href='/fulfillment'>Fulfillment</Link></li>
                    </>
                )}
                {!isAdmin && (
                    <li>
                    <Link href="/account">Account</Link>
                    </li>
                )}
            <li>
              <Link href="/logout">Logout</Link>
            </li>
            </>
        )}
        
        {!user && (
          <>
            <li>
              <Link href="/signup">Signup</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
