import { useState } from 'react';
import { FormData } from '../../../types/types';
import ProductForm from '@/components/ProductForm';

export default function ProductCreate() {
    const [ formInput, setFormInput ] = useState<FormData>({
        name: '',
        description: '',
        category: '',
        image: '',
        price: 1,
        stock: 1,
    });
    
    return (
        <>
            <ProductForm formInput={formInput} setFormInput={setFormInput} id={''} isLoading={false} setIsLoading={null}/>
        </>
    );
}
