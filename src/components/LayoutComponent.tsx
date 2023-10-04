import { ReactNode } from 'react';
import { AuthContextProvider } from '@/app/firebase/AuthContext';
import Navigation from './Navigation';
import Footer from './Footer';

interface NestedLayoutProps {
    children: ReactNode;
}

export default function LayoutComponent ({ children } : NestedLayoutProps) {
    return (
        <AuthContextProvider>
            <Navigation />
                { children }
            <Footer />
        </AuthContextProvider>
    );
}