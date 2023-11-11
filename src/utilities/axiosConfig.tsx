import axios from 'axios'
import { auth } from '../app/firebase/firebaseConfig';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000/api/',
    withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
    try {
        const user = auth.currentUser;

        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    } catch (error) {
        console.error('Error fetching token:', error);
        return config;
    }
});

export default instance;