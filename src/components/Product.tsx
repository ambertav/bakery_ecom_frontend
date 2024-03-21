import Link from 'next/link';
import { ProductProps } from '../../types/types';


export default function Product (props: ProductProps) {

    return (
        <>
            {props.page === 'index' && (
                <li>
                    <Link href={`/products/${props.product.id}`}>
                            <p>{props.product.name}</p>
                            <img src={props.product.image} alt={props.product.name} />
                            <p>{props.product.price}</p>
                    </Link>
                </li>
            )}
            {props.page === 'show' && (
                <li>
                    <p>{props.product.name}</p>
                    <img src={props.product.image} alt={props.product.name} />
                    <p>{props.product.description}</p>
                    <p>{props.product.price}</p>
                </li>
            )}
        </>
    );
}