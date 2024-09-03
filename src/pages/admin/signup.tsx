import axios from '@/utilities/axiosConfig';
import { FormInput } from '../../../types/types';
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Access from '@/components/Access';

export default function Signup() {
  const router = useRouter();

  const adminSignup = async (formInput: FormInput) => {
    const submitBody = {
      name: formInput.name,
      email: formInput.email,
      password: formInput.password,
      pin: formInput.pin,
      employerCode: formInput.employerCode,
    };

    try {
      const response = await axios.post('admin/signup/', submitBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201)
        toast.success(`Your employee id is: ${response.data.employeeId}`, {
          onClose: () => {
            router.push('/admin/login');
          },
        });
    } catch (error: any) {
      if (error.response.status === 401) toast.success('Invalid credentials');

      console.error(error);
    }
  };

  return (
    <>
      <Access handleSubmit={adminSignup} resource="admin" />
      <ToastContainer autoClose={false} position="top-center" />
    </>
  );
}
