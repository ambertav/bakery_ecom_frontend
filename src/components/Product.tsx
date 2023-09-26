import Link from 'next/link';
import { ProductType } from '../../types/types';

interface ProductProps {
    product: ProductType;
    page: string;
}

export default function Product (props: ProductProps) {
    return (
        <>
            {props.page === 'index' ? (
            <li>
                <Link href={`/products/${props.product.id}`}>
                        <p>{props.product.name}</p>
                        <img src={props.product.image} alt={props.product.name} />
                        <p>{props.product.price}</p>
                </Link>
            </li>
        ) : (
            <li>
                <p>{props.product.name}</p>
                <img src={props.product.image} alt={props.product.name} />
                <p>{props.product.description}</p>
                <p>{props.product.price}</p>
            </li>
            )
        }
        </>
    );
}