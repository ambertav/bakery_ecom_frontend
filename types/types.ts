export interface FormData {
    [fieldName: string]: string;
}

export interface ErrorResponse {
    message: string;
}

export interface ProductType {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    stock: number;
}

export interface ProductProps {
    product: ProductType;
    page: string;
}

export interface CartItem {
    id: number;
    productId: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface ShoppingCart extends Array<CartItem> {}