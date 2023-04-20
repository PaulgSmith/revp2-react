
import axios from "axios";

export const appClient = axios.create({
    baseURL: 'http://ec2-54-71-28-118.us-west-2.compute.amazonaws.com:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});
