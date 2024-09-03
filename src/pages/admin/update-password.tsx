import axios from '@/utilities/axiosConfig';
import { FormInput } from '../../../types/types';
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Access from '@/components/Access';

export default function UpdatePasswordAndLogin() {
  const router = useRouter();

  const adminUpdatePassword = async (formInput: FormInput) => {
    const submitBody = {
      email: formInput.email,
      employeeId: formInput.employeeId,
      oldPassword: formInput.oldPassword,
      password: formInput.password,
      pin: formInput.pin,
    };

    try {
      const response = await axios.post('admin/update-password/', submitBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) router.push('/fulfillment');
    } catch (error: any) {
      if (error.response.status === 401) toast.success('Invalid credentials');

      console.error(error);
    }
  };

  return (
    <>
      <Access handleSubmit={adminUpdatePassword} resource="admin" />
      <ToastContainer autoClose={false} position="top-center" />
    </>
  );
}
