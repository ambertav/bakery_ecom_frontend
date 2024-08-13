import Link from 'next/link';
import { ProductType } from '../../types/types';

interface InventoryProps {
  product: ProductType;
}

export default function InventoryItem({ product }: InventoryProps) {
  return (
    <>
      <li>
        <p>{product.id}</p>
        <p>{product.name}</p>
        {product.portions.map((portion) => (
          <ul>
            <li>
              {portion.size}: {portion.stock}
            </li>
          </ul>
        ))}
        <Link href={`/products/${product.id}`}>View</Link>
        <br />
        <Link href={`/products/${product.id}/edit`}>Edit</Link>
      </li>
    </>
  );
}
