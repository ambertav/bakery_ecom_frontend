import Link from 'next/link';
import { ProductType } from '../../types/types';

interface InventoryProps {
  product: ProductType;
}

export default function InventoryItem({ product }: InventoryProps) {
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
            {product.portions.map((portion) => (
              <tr>
                <td>{portion.size}</td>
                <td>{portion.optimalStock}</td>
                <td>{portion.stock}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}
