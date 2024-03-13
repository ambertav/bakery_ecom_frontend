import axios from '../../utilities/axiosConfig';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { renderInput } from '@/utilities/formUtilities';
import { FormData } from '../../../types/types';

export default function ProductCreate() {
  const router = useRouter();
  const [formInput, setFormInput] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    image: '',
    price: 1,
    stock: 1,
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      const response = await axios.post('product/create', formInput, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating product: ', error);
    }
  };
  
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
