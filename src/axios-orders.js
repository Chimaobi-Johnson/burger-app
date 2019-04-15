import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-app-fa446.firebaseio.com/'
});

export default instance;