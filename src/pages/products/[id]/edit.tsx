import axios from '../../../utilities/axiosConfig';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FormInput, PortionType } from '../../../../types/types';
import ProductForm from '@/components/ProductForm';

export default function ProductEdit() {
  const router = useRouter();

  const [formInput, setFormInput] = useState<FormInput>({});
  const [productId, setProductId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayFile, setDisplayFile] = useState<string>('');

  const { id } = router.query;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`product/${id}`);
        if (response.status === 200) {
          // destructuring to get product details without id as in formData type
          const { id, image, ...productData } = response.data.product;

          // storing id for use in edit page's axios request
          setProductId(id as string);
          setDisplayFile(image);

          // setting form state to product details, to render values in edit form
          setFormInput({
            ...productData,
            // converting category to uppercase
            category: productData.category.toUpperCase(),
            price: response.data.product.portions.find(
              (portion: PortionType) => portion.size === 'whole'
            )?.price,
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
        displayFile={displayFile}
        setDisplayFile={setDisplayFile}
      />
    </>
  );
}
