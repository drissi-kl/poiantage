import { isAxiosError } from "axios";
import customAPI from "./customAPI";





const createExpTimeApi = async (data) => {
    try{
        const response = await customAPI.post(`/exceptionalTime`, data);
        return response.data;
    }catch(error){
        if(isAxiosError(error)){
            throw error;
        }
        throw new Error('exists problem in createExpTimeApi function');
    }
}

const getExpTimeApi = async (id) => {
    try{
        const response = await customAPI.get(`/exceptionalTime/${id}`);
        return response.data;
    }catch(error){
        if(isAxiosError(error)){
            throw error;
        }
        throw new Error('exists problem in createExpTimeApi function');
    }
}

const deleteExpTimeApi = async (id) => {
    try{
        const response = await customAPI.delete(`/exceptionalTime/${id}`);
        return response.data;
    }catch(error){
        if(isAxiosError(error)){
            throw error;
        }
        throw new Error('exists problem in deleteExpTimeApi function');
    }
}

export {createExpTimeApi, getExpTimeApi, deleteExpTimeApi  }






























