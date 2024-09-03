import { ReactNode } from 'react';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { CartContextProvider } from './CartContext';
import Navigation from './Navigation';
import Footer from './Footer';

interface NestedLayoutProps {
    children: ReactNode;
}

export default function LayoutComponent ({ children } : NestedLayoutProps) {
    return (
        <AuthContextProvider>
            <Navigation />
                <CartContextProvider>
                    { children }
                </CartContextProvider>
            <Footer />
        </AuthContextProvider>
    );
}