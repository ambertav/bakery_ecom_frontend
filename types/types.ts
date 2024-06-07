export interface FormInput {
    [fieldName: string]: string | number | boolean;
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

export interface CheckoutFormInput {
    shipping: AddressType;
    method: string;
    billing: AddressType;
  }

export interface OrderType {
    id: number;
    totalPrice: number;
    date: string;
    items?: CartItem[];
    task?: TaskType;
    status: string;
    deliveryMethod: string;
    paymentStatus: string;
    address?: AddressType;
}

export interface TaskType {
    id: number;
    adminName: string | null;
    order_id: number;
    assignedAt: string | null;
    completedAt: string | null;
}