import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { ProductType, FormInput } from '../../types/types';
import { renderInput } from '@/utilities/formUtilities';

interface InventoryProps {
  product: ProductType;
  setUpdatedProducts: Dispatch<SetStateAction<FormInput>>;
}

export default function Inventory({
  product,
  setUpdatedProducts,
}: InventoryProps) {
  const [formInput, setFormInput] = useState<FormInput>({
    stock: product.stock,
  });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    // update state that controls input
    setFormInput({ stock: evt.target.value });

    // update state for bulk submission
    setUpdatedProducts((prev) => {
      // if the new stock value is equal to the last
      if (Number(evt.target.value) === product.stock) {
        // destructure prev to extract and remove product.id from state
        const { [product.id]: deletedKey, ...rest } = prev;

        // return the rest
        return rest;
      } else {
        // otherwise, add the product.id with the new stock value
        return {
          ...prev,
          [product.id]: evt.target.value,
        };
      }
    });
  };

  return (
    <>
      <li>
        <p>{product.id}</p>
        <p>{product.name}</p>
        <p>{product.price}</p>
        {renderInput('stock', 'Stock', 'number', formInput, handleChange)}
        <Link href={`/products/${product.id}`}>View</Link>
        <br />
        <Link href={`/products/${product.id}/edit`}>Edit</Link>
      </li>
    </>
  );
}
