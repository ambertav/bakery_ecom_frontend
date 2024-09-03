import axios from '@/utilities/axiosConfig';
import { FormInput } from '../../../types/types';
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Access from '@/components/Access';

export default function Login() {
  const router = useRouter();

  const adminLogin = async (formInput: FormInput) => {
    const submitBody = {
      employeeId: formInput.employeeId,
      password: formInput.password,
      pin: formInput.pin,
    };

    try {
      const response = await axios.post('admin/login/', submitBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) router.push('/fulfillment');
    } catch (error: any) {
      if (error.response.status === 403) {
        toast.success(
          'Your password is expired, you will be redirected to update your password',
          {
            onClose: () => {
              router.push('/admin/update-password');
            },
          }
        );
      } else if (error.response.status === 401) {
        toast.success('Invalid credentials');
      }
      console.error(error);
    }
  };

  return (
    <>
      <Access handleSubmit={adminLogin} resource="admin" />
      <ToastContainer autoClose={false} position="top-center" />
    </>
  );
}
