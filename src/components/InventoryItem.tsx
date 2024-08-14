import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import {
  FormInput,
  ProductType,
  UpdatedPortionsState,
} from '../../types/types';
import { renderInput } from '@/utilities/formUtilities';

interface InventoryProps {
  product: ProductType;
  setUpdatedPortions: Dispatch<SetStateAction<UpdatedPortionsState>>;
}

export default function InventoryItem({
  product,
  setUpdatedPortions,
}: InventoryProps) {
  const [stockFormInput, setStockFormInput] = useState<FormInput>({});

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const portionId = Number(evt.target.name.split('-')[1]);
    const value = Number(evt.target.value);

    setStockFormInput((prev) => ({
      ...prev,
      [evt.target.name]: value,
    }));

    setUpdatedPortions((prev) => {
      // find the index of the existing product entry
      const productEntry = prev[product.id];

      // if the product id is not found, create entry with portion id and new stock value
      if (!productEntry) {
        return {
          ...prev,
          [product.id]: {
            [portionId]: value,
          },
        };
      } else {
        // if found and the incoming portion id and value is the same as current stock, remove from state
        if (
          value ===
          product.portions.find((portion) => portion.id === portionId)?.stock
        ) {
          // destructure to extract and remove portion id from nested
          const { [portionId]: deletedKey, ...rest } = productEntry;

          // if product.id is now an empty {}
          if (Object.keys(rest).length === 0) {
            // destructure to extract and remove product.id from state
            const { [product.id]: deletedKey, ...rest } = prev;
            return rest;
          } else {
            return {
              ...prev,
              [product.id]: rest,
            };
          }
        } else {
          return {
            ...prev,
            [product.id]: {
              ...productEntry,
              [portionId]: value,
            },
          };
        }
      }
    });
  };

  return (
    <tr>
      <td>
        <p>
          <Link href={`/products/${product.id}`}>View</Link>
        </p>
        <p>
          <Link href={`/products/${product.id}/edit`}>Edit</Link>
        </p>
      </td>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>
        <table>
          <thead>
            <tr>
              <th>Size</th>
              <th>Optimal Stock</th>
              <th>Actual Stock</th>
              <th>Incoming Stock</th>
            </tr>
          </thead>
          <tbody>
            {product.portions.map((portion, index) => (
              <tr key={index}>
                <td>{portion.size}</td>
                <td>{portion.optimalStock}</td>
                <td>{portion.stock}</td>
                <td key={portion.id}>
                  {renderInput(
                    `stock-${portion.id}`,
                    '',
                    'number',
                    stockFormInput,
                    handleChange
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}
