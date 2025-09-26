import axios from "axios";
import { getToken } from "../utilities/utilities";

const customAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers:{
        // 'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})


customAPI.interceptors.request.use(
    (request)=>{
        const token = getToken();
        if(token){
            request.headers.Authorization= `Bearer ${token}`;
        }
        return request;
    }
)

customAPI.interceptors.response.use(
    (response)=>{
        return response;
    },

    (error)=>{
        throw error
    }
)

export default customAPI;

