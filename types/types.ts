export interface User {
    name : string;
    isAdmin : boolean;
}

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
    portions: PortionType[];
}

export interface PortionType {
    id: number;
    size: string;
    optimalStock: number;
    stock: number;
    price: number;
    soldOut: boolean;
}

export interface ProductProps {
    product: ProductType;
    page: string;
}

export interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        image: string;
    };
    price: number;
    portion: {
        id: number;
        size: string;
        price: number;
    }
    quantity: number;
    orderId: number | null;
}

export interface ShoppingCart extends Array<CartItem> {}

export interface AddressType {
    id?: number;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    default?: boolean;
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
    cartItems?: CartItem[];
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

export interface UpdatedPortionsState {
    [productId: number]: {
        [portionId: number]: number
    };
}