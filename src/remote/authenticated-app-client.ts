import axios from "axios";

export const authAppClient = axios.create({
    baseURL: 'http://ec2-54-71-28-118.us-west-2.compute.amazonaws.com:3000',
    headers: {
        'Accept': "application/json",
    }
});

authAppClient.interceptors.request.use(
    (request) => {
        if(request.headers){
            request.headers['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`
        }

        return request;
    }
)
