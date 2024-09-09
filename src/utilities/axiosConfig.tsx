import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000/api/',
    withCredentials: true,
});

instance.interceptors.response.use(response => {
    return response;
}, async error => {
    const { config, response } = error;
    const originalRequest = config;

    if (response && response.status === 401) {
        if (response.data && response.data.error === 'Invalid token') {
            await axios.get('http://127.0.0.1:5000/api/user/logout');
            window.location.href = '/';
            return Promise.reject(error);
        } else if (response.data && response.data.error === 'Token expired') {
            try {
                await axios.get('http://127.0.0.1:5000/api/user/refresh', {
                    withCredentials: true,
                });
                return instance(originalRequest);
    
            } catch (error) {
                console.log(error);
            }
        }
    }
});


export default instance;