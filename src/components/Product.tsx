import Link from 'next/link';
import { ProductProps } from '../../types/types';


export default function Product ({ product, page } : ProductProps) {
    const soldOut = product.portions.every((portion) => portion.soldOut);

    return (
        <>
            {page === 'index' && (
                <li>
                    <Link href={`/products/${product.id}`}>
                            <p>{product.name}</p>
                            <img src={product.image} alt={product.name} />
                            {soldOut && (
                                <p>Sold out! Come back again tomorrow</p>
                            )}
                    </Link>
                </li>
            )}
            {page === 'show' && (
                <li>
                    <p>{product.name}</p>
                    <img src={product.image} alt={product.name} />
                    <p>{product.description}</p>
                    {soldOut && (
                        <p>Sold out! Come back again tomorrow</p>
                    )}
                </li>
            )}
        </>
    );
}