import { BounceLoader } from 'react-spinners'; 

export default function LoadingSpinner () {
    return (
        <div>
            <BounceLoader 
                color='red'
                size={30}
            />
            <p>Loading...</p>
        </div>
    );
}
