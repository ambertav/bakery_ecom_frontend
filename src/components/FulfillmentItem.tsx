import { useAuth } from '@/app/firebase/AuthContext';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { OrderType } from '../../types/types';

interface FulFillmentProps {
  order: OrderType;
  selectedOrders: number[];
  setSelectedOrders: Dispatch<SetStateAction<number[]>>;
}

export default function FulfillmentItem({
  order,
  selectedOrders,
  setSelectedOrders,
}: FulFillmentProps) {
  const { name } = useAuth();

  const handleCheckboxChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const isChecked = evt.target.checked;

    setSelectedOrders((prev) => {
        if (isChecked)  return [...prev, order.id]
        else return prev.filter((id : number) => id !== order.id);
    });
  }

  return (
    <tr>
      <td>
        {order.status === 'pending' && (
          <input
            type="checkbox"
            checked={selectedOrders.includes(order.id)}
            onChange={handleCheckboxChange}
          />
        )}
        {order.status === 'in_progress' && (
          <>
            <button>undo</button>
            <button>complete</button>
          </>
        )}
      </td>
      <td>{order.id}</td>
      <td>
        <ul>
          {order.items!.map((i, index) => (
            <li key={index}>
              <p>{i.productId}</p>
              <p>{i.name}</p>
              <p>{i.portion}</p>
              <p>{i.quantity}</p>
            </li>
          ))}
        </ul>
      </td>
      <td>{order.status}</td>
      <td>{order.paymentStatus}</td>
      <td>{order.deliveryMethod}</td>
      <td>
        {order.address && (
          <>
            <p>
              {order.address.firstName} {order.address.lastName}
            </p>
            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state} {order.address.zip}
            </p>
          </>
        )}
      </td>
      <td>{order.date}</td>
    </tr>
  );
}
