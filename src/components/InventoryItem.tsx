import {
  useState,
  useEffect,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  FormInput,
  ProductType,
  UpdatedPortionsState,
} from '../../types/types';
import { renderInput } from '@/utilities/formUtilities';

interface InventoryProps {
  product: ProductType;
  updatedPortions: UpdatedPortionsState;
  setUpdatedPortions: Dispatch<SetStateAction<UpdatedPortionsState>>;
}

export default function InventoryItem({
  product,
  updatedPortions,
  setUpdatedPortions,
}: InventoryProps) {
    const params = useSearchParams();
    const { user } = useAuth();
  const [incomingInput, setIncomingInput] = useState<FormInput>({});
  const [deductInput, setDeductInput] = useState<FormInput>({});

  useEffect(() => {
    if (params?.get('generate-report') === 'true') {
        if (Object.keys(updatedPortions).length !== 0) {
          const newStockFormInput: FormInput = {};
    
          // construct stockFormInput to auto populate incoming stock
            // when updatedPortions is not empty {}
            // i.e generate report param
          for (const [productId, portions] of Object.entries(updatedPortions)) {
            if (Number(productId) === product.id) {
              for (const [portionId, stock] of Object.entries(portions)) {
                newStockFormInput[`stock-${portionId}-incoming`] = stock as string;
              }
            }
          }
    
          setIncomingInput(newStockFormInput);
        }
    }
  }, [updatedPortions, product.id]);

  const handleChange = (portionId : number, value : number) => {
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

  const handleIncomingChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const portionId = Number(evt.target.name.split('-')[1]);
    const value = Number(evt.target.value);

    const portion = product.portions.find((portion) => portion.id === portionId);

    if (!portion) return;

    setIncomingInput((prev) => ({
      ...prev,
      [evt.target.name]: value,
    }));

    setDeductInput((prev) => {
        const { [`stock-${portionId}-deduct`]: _, ...rest } = prev;
        return rest;
      });

    return handleChange(portionId, value);
  }

  const handleDeductChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const portionId = Number(evt.target.name.split('-')[1]);
    const value = Number(evt.target.value);

    const portion = product.portions.find((portion) => portion.id === portionId);

    if (!portion) return;

    setDeductInput((prev) => ({
      ...prev,
      [evt.target.name]: value,
    }));

    setIncomingInput((prev) => {
        const { [`stock-${portionId}-incoming`]: _, ...rest } = prev;
        return rest;
      });

    return handleChange(portionId, 0 - value);
  }

  return (
    <tr>
      <td>
        <p>
          <Link href={`/products/${product.id}`}>View</Link>
        </p>
        {user?.isAdmin && user?.role != 'general' && (
        <p>
          <Link href={`/products/${product.id}/edit`}>Edit</Link>
        </p>
        )}
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
              {!params?.get('generate-report') && <th>Deduct Stock</th>}
            </tr>
          </thead>
          <tbody>
            {product.portions.map((portion, index) => (
              <tr key={index}>
                <td>{portion.size}</td>
                <td>{portion.optimalStock}</td>
                <td>{portion.stock}</td>
                <td key={`incoming-${portion.id}`}>
                  {renderInput(
                    `stock-${portion.id}-incoming`,
                    '',
                    'number',
                    incomingInput,
                    handleIncomingChange
                  )}
                </td>
                {!params?.get('generate-report') &&
                <>
                <td key={`deduct-${portion.id}`}>
                  {renderInput(
                    `stock-${portion.id}-deduct`,
                    '',
                    'number',
                    deductInput,
                    handleDeductChange,
                    { max : portion.stock }
                  )}
                </td>
                </>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}
