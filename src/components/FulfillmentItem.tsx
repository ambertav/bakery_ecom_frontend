import { OrderType } from '../../types/types';

interface FulFillmentProps {
  order: OrderType;
}

export default function FulfillmentItem({ order }: FulFillmentProps) {
  return (
    <tr>
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
