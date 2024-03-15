import axios from '../../../utilities/axiosConfig';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FormData } from '../../../../types/types';
import ProductForm from '@/components/ProductForm';

export default function ProductEdit() {
  const router = useRouter();
  
  const [formInput, setFormInput] = useState<FormData>({});
  const [productId, setProductId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = router.query;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`product/${id}`);
        if (response.status === 200) {
          // destructuring to get product details without id as in formData type
          const { id, ...productData } = response.data.product;

          // storing id for use in edit page's axios request
          setProductId(id as string);

          // setting form state to product details, to render values in edit form
          setFormInput({
            ...productData,
            // converting category to uppercase
            category: productData.category.toUpperCase(),
          });
        }
      } catch (error) {
        console.error('Error fetching product details: ', error);
      } finally {
        timeout = setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchProduct();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <ProductForm
        formInput={formInput}
        setFormInput={setFormInput}
        id={productId}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </>
  );
}
