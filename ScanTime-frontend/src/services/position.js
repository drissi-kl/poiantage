import axios from "axios"
import customAPI from "./customAPI";



const getAllPositionApi = async ()=>{
    try{
        const response = await customAPI.get(`/positions`);
        return response.data.position;
    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists a problem in getAllPosition api function')
    }
}

const getPositionApi = async (id)=>{
    try{
        const response = await customAPI.get(`/positions/${id}`);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists a problem in getPositionApi api function')
    }
}

const createPositionApi = async (body)=>{
    try{
        const response = await customAPI.post(`/positions`, body);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists a problem in createPositionApi api function')
    }
}

const updatePositionApi = async (id, body)=>{
    try{
        const response = await customAPI.put(`/positions/${id}`, body);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists a problem in updatePositionApi api function')
    }
}

const deletePositionApi = async (id)=>{
    try{
        const response = await customAPI.delete(`/positions/${id}`);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists a problem in deletePositionApi api function')
    }
}


export {getAllPositionApi, getPositionApi, createPositionApi, updatePositionApi, deletePositionApi    }















