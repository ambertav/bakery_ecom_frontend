import { CartItem } from '../../types/types';

interface CartItemProps {
  item: CartItem;
}

export default function CartItem({ item }: CartItemProps) {
  return (
    <div>
      <p>{item.name}</p>
      <img src={item.image} alt={item.name} />
      <p>Serving Size: {item.portion}</p>
      <p>${(item.price * item.quantity).toFixed(2)}</p>
      {item.quantity > 1 && <p>${item.price} each</p>}
      <p>Quantity: {item.quantity}</p>
    </div>
  );
}
