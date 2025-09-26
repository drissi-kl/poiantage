import axios from "axios"
import customAPI from "./customAPI";

const getAllEmployeeApi = async ()=>{
    try{
        const response = await customAPI.get(`/employees`);
        return response.data.users;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists problem in getAllEmployeeApi api')
    }
}

const getEmployeeApi = async (id)=>{
    try{
        const response = await customAPI.get(`/employees/${id}`);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists problem in getEmployeeApi api')
    }
}

const createEmployeeApi = async (body)=>{
    try{
        const response = await customAPI.post(`/registry`, body);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists problem in createEmployeeApi api')
    }
}

const updateEmployeeApi = async (id, body)=>{
    try{
        const response = await customAPI.post(`/update/${id}?_method=PUT`, body);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists problem in updateEmployeeApi api')
    }
}

const deleteEmployeeApi = async (id)=>{
    try{
        const response = await customAPI.delete(`/employees/${id}`);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists problem in deleteEmployeeApi api')
    }
}

export {getAllEmployeeApi, getEmployeeApi, createEmployeeApi, updateEmployeeApi, deleteEmployeeApi }






















