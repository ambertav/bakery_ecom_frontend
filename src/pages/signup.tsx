import axios from '../utilities/axiosConfig';
import { useRouter } from 'next/router';
import { FormInput } from '../../types/types';
import Access from '@/components/Access';

export default function Signup() {
  const router = useRouter();

  const userSignup = async (formInput: FormInput) => {
    const submitBody = {
      name: formInput.name,
      email: formInput.email,
      password: formInput.password,
      confirm_password: formInput.confirm_password,
      localStorageCart: JSON.parse(localStorage.getItem('cart') || '[]'),
    };

    try {
      const response = await axios.post('user/signup', submitBody, {
        headers: { 'Content-Type': 'application/json' },
      });
      // redirect to main page
      if (response.status === 201) {
        localStorage.removeItem('cart'); // removes items from cart once created in database
        router.push('/');
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return <Access handleSubmit={userSignup} resource="user" />;
}
