export interface FormInput {
    [fieldName: string]: string | number;
}

export interface ErrorResponse {
    message: string;
}

export interface ProductType {
    id: number;
    name: string;
    description: string;
    category: string;
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
    portion: string;
    quantity: number;
    orderId: number | null;
}

export interface ShoppingCart extends Array<CartItem> {}

export interface AddressType {
    id: number;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    default: boolean;
}

export interface OrderType {
    id: number;
    totalPrice: number;
    date: string;
    status: string;
    shippingMethod: string;
    paymentStatus: string;
}