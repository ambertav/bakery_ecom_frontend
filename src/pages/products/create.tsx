import { useState } from 'react';
import { FormInput } from '../../../types/types';
import ProductForm from '@/components/ProductForm';

export default function ProductCreate() {
  const [formInput, setFormInput] = useState<FormInput>({
    name: '',
    description: '',
    category: '',
    price: 1,
  });

  const [displayFile, setDisplayFile] = useState<string>('');

  return (
    <>
      <ProductForm
        formInput={formInput}
        setFormInput={setFormInput}
        id={''}
        isLoading={false}
        setIsLoading={null}
        displayFile={displayFile}
        setDisplayFile={setDisplayFile}
      />
    </>
  );
}
