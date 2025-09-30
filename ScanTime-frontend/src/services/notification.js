import axios from "axios"
import customAPI from "./customAPI";

const readNotificationApi = async (id)=>{
    try{
        const response = await customAPI.get(`/readNotification/${id}`);
        return response.data;

    }catch(error){
        if(axios.isAxiosError(error)){
            throw error;
        }
        throw new Error('exists problem in readNotification api')
    }
}


export {readNotificationApi  }