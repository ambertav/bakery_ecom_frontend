import { CartItem } from '../../types/types';

interface CartItemProps {
  item: CartItem;
}

export default function Item({ item }: CartItemProps) {
  return (
    <div>
      <p>{item.product.name}</p>
      <img src={item.product.image} alt={item.product.name} />
      <p>Serving Size: {item.portion.size}</p>
      <p>${(item.price).toFixed(2)}</p>
      {item.quantity > 1 && <p>${item.portion.price} each</p>}
      <p>Quantity: {item.quantity}</p>
    </div>
  );
}
