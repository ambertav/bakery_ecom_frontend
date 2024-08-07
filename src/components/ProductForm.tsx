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
import { FormInput } from '../../types/types';

import LoadingSpinner from './LoadingSpinner';

interface ProductFormProps {
  formInput: FormInput;
  setFormInput: Dispatch<SetStateAction<FormInput>>;
  id: string; // product id for edit url

  // to display loading spinner for edit page
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>> | null;

  // to display image
  // passed in as empty string for create page
  // passed in as product's current image string for edit page
  displayFile: string;
  setDisplayFile: Dispatch<SetStateAction<string>>;
}

export default function ProductForm({
  formInput,
  setFormInput,
  id,
  isLoading,
  setIsLoading,
  displayFile,
  setDisplayFile,
}: ProductFormProps) {
  const router = useRouter();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    // extracts file
    const file = evt.target.files![0];

    // set display and upload file state
    setDisplayFile(URL.createObjectURL(file));
    setUploadedFile(file);
  };

  const handleChange = async (
    evt:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    let { name, value, type } = evt.target;

    // prevents user from inputting 0 for number inputs
    if (name === 'price' && value === '0') value = '1';

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

      if (response.status === (isCreate ? 201 : 200)) {

        // only makes request if :
            // product was successfully created / updated as to use id in req
            // and if uploaded file is included (skips req for edit page where new image is not uploaded)
        if (uploadedFile) {
          try {
            const formData = new FormData();
            formData.append('image', uploadedFile);

            const photoResponse = await axios.post(
              `product/${response.data.product.id}/upload_photo`,
              formData,
              {
                headers: { 'Content-Type': 'multipart/form-data' },
              }
            );

          } catch (error) {
            console.error('Error uploading photo: ', error);
          }
        }

        // directs to product show page after submissions
        router.push(`/products/${response.data.product.id}`);
      }
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
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          {displayFile && (
            <img src={displayFile} alt="Uploaded" width={250} height={250} />
          )}
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            accept=".jpg,.png,.jpeg,.gif"
          />
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
          {renderInput('price', 'Price', 'number', formInput, handleChange)}
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
