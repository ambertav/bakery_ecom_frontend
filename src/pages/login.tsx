import axios from '../utilities/axiosConfig';
import { useRouter } from 'next/router';
import { FormInput } from '../../types/types';
import Link from 'next/link';

import Access from '@/components/Access';

export default function Login() {
  const router = useRouter();

  const userLogin = async (formInput: FormInput) => {
    const submitBody = {
      email: formInput.email,
      password: formInput.password,
      localStorageCart: JSON.parse(localStorage.getItem('cart') || '[]'),
    };

    try {
      const response = await axios.post('user/login', submitBody, {
        headers: { 'Content-Type': 'application/json' },
      });
      // redirect to main page
      if (response.status === 200) {
        localStorage.removeItem('cart'); // removes items from cart once created in database
        router.push('/');
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      <Access handleSubmit={userLogin} resource="user" />
      <p>
        Don't have an account?
        <br />
        <Link href="/signup">Signup</Link> now
      </p>
    </>
  );
}
