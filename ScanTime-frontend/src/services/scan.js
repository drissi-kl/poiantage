import axios, { isAxiosError } from "axios";
import customAPI from "./customAPI"


const getAllScanApi = async ()=>{
    try{
        const response = await customAPI.get(`/scans`);
        return response.data;
    } catch (error){
        if(isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in getAllScanApi api function')
    }
}


const getScanApi = async (id)=>{
    try{
        const response = await customAPI.get(`/scans/id`);
        return response.data;
    } catch (error){
        if(isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in getScanApi api function')
    }
}

const createScanApi = async (body)=>{
    try{
        const response = await customAPI.post(`/scans`, body);
        return response.data;
    } catch (error){
        if(isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in createScanApi api function')
    }
}

const createLeaveRequestApi= async (body)=>{
    try{
        const response = await customAPI.post(`/holidays`, body);
        return response.data;
    }catch(error){
        if(isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in createLeaveRequest api function')
    }
}

const checkAbsenceApi = async ()=>{
    try{
        const response = await customAPI.get(`checkAbsent`);
        return response.data;
    } catch(error){
        if(isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in checkAbsenceApi function');
    }
}

const createTimeOffApi = async (id, body) =>{
    try{
        const response = await customAPI.post(`/timeOff/${id}`, body);
        return response.data;
    }catch (error){
        if(isAxiosError(error)){
            throw error;
        }
        throw new Error('exists error in checkAbsenceApi function');        
    }
}

export { getAllScanApi, getScanApi, createScanApi, createLeaveRequestApi, checkAbsenceApi, createTimeOffApi  }






