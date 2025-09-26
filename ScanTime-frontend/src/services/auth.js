import axios from "axios";
import customAPI from "./customAPI";


const loginApi = async (body) => {
    try{
        const response = await customAPI.post('/login', body);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in login api function ')
    }
}

const registerApi = async (body) => {
    try{
        const response = await customAPI.post('/registry', body);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in register api function ')
    }
}

const verifyApi = async (body)=>{
    try{
        const response = await customAPI.post(`/verify_account`, body);
        return response.data;
    } catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in verify api function ');
    }
}

const loggedUserApi = async ()=>{
    try{
        const response = await customAPI.get(`/loggedUser`);
        return response.data;
    } catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in loggedUser api function ');
    }
}

const logoutApi = async () =>{
    try{
        const response = await customAPI.get('/logout');
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in logout api function ');
    }
}

export {loginApi, registerApi, verifyApi, logoutApi, loggedUserApi }






