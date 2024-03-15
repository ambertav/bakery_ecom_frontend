import axios from '@/utilities/axiosConfig';
import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { useRouter } from 'next/router';
import { renderInput } from '@/utilities/formUtilities';
import { FormData } from '../../types/types';

import LoadingSpinner from './LoadingSpinner';

interface ProductFormProps {
  formInput: FormData;
  setFormInput: Dispatch<SetStateAction<FormData>>;
  id: string; // product id for edit url

  // to display loading spinner for edit page
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>> | null;
}

export default function ProductForm({
  formInput,
  setFormInput,
  id,
  isLoading,
  setIsLoading,
}: ProductFormProps) {
  const router = useRouter();

  const isCreate = router.pathname === '/products/create';

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // if isLoading is true, set to false after timeout
    if (isLoading) {
      timeout = setTimeout(() => {
        setIsLoading!(false);
      }, 750);
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const handleChange = async (
    evt:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    let { name, value, type } = evt.target;

    // prevents user from inputting 0 for number inputs
    if (type === 'number' && value === '0') value = '1';

    // NOTE: restriction for stock as integer added as onKeyPress in formUtilities renderInput function

    // restricts price to 2 decminal places
    if (name === 'price') {
      // split on decimal point to get access to decimal places
      const [integerPart, decimalPart] = value.split('.');

      // if decimal places exceed 2...
      // slice off third decimal and reassign  value
      if (decimalPart && decimalPart.length > 2)
        value = `${integerPart}.${decimalPart.slice(0, 2)}`;
    }

    setFormInput((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    try {
      // initialize url and method based on if form is being used for the create or edit page
      const url = isCreate ? 'product/create' : `product/${id}/update`;
      const method = isCreate ? 'post' : 'put';

      const response = await axios[method](url, formInput, {
        headers: { 'Content-Type': 'application/json' },
      });

      // direct to product show
      if (response.status === (isCreate ? 201 : 200))
        router.push(`/products/${response.data.product.id}`);
    } catch (error) {
      console.error(
        `Error ${isCreate ? 'creating' : 'updating'} product: `,
        error
      );
    }
  };

  function loaded() {
    return (
      <>
        <form onSubmit={handleSubmit}>
          {renderInput('name', 'Name', 'text', formInput, handleChange)}
          <div key={'description'}>
            <label htmlFor={'description'}>Description</label>
            <textarea
              id="description"
              name="description"
              maxLength={300}
              value={formInput.description}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div key={'category'}>
            <label htmlFor={'category'}>Category</label>
            <select
              id="category"
              name="category"
              value={formInput.category}
              onChange={handleChange}
              required={true}
            >
              <option value="">Select a category</option>
              <option value="CAKE">Cake</option>
              <option value="CUPCAKE">Cupcake</option>
              <option value="PIE">Pie</option>
              <option value="COOKIE">Cookie</option>
              <option value="DONUT">Donut</option>
              <option value="PASTRY">Pastry</option>
            </select>
          </div>
          {renderInput('image', 'Image', 'url', formInput, handleChange)}
          {renderInput('price', 'Price', 'number', formInput, handleChange)}
          {renderInput('stock', 'Stock', 'number', formInput, handleChange)}
          <input type="submit" />
        </form>
      </>
    );
  }

  function loading() {
    return <LoadingSpinner />;
  }

  return isLoading ? loading() : loaded();
}
