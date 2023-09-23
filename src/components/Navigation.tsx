import { UserAuth } from '@/app/context/AuthContext';

function Navigation () {
    const { user } = UserAuth();
    return (
        <nav>
            <h1>This is the navigation bar</h1>
        </nav>
    )
}

export default Navigation;