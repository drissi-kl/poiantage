import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { createLeaveRequestApi } from "../../../services/scan"



export default function LeaveRequest({closeLeaveRequest}){
    const queryClient=useQueryClient();

    const {handleSubmit, register } = useForm();
    
    const leaveRequestMutation= useMutation({
        mutationFn: (body)=>createLeaveRequestApi(body),
        onSuccess: (data, variable, context)=>{
            console.log(data);
            console.log(variable);
            closeLeaveRequest();
            queryClient.invalidateQueries(["employees"]);
        }
    })
    
    const LeaveRequestForm = (e) => {
        console.log('dates', e);
        leaveRequestMutation.mutate(e);

    }


    return <div className="leaveRequest">
        <div className="container">
            <h1 className="title">Demande de Congé</h1>
            <p className="attentionMessage" >
                Cette procédure s'applique à tous les employés, alors attention.
            </p>
            <form onSubmit={handleSubmit(LeaveRequestForm)} method="post" >
                <div>
                    <label htmlFor="startDate">Date de Début:</label>
                    <input type="date" {...register('startDate')} placeholder="date de debut" id="startDate" />
                </div>

                <div>
                    <label htmlFor="endDate">Date de Début:</label>
                    <input type="date" {...register('endDate')} placeholder="date de debut" id="endDate" />
                </div>

                <div className="buttons">
                    <button className="confirmBtn" type="submit" >confirme</button>
                    <button className="closeBtn" type="button" onClick={()=>closeLeaveRequest()}  >fermer</button>
                </div>
            </form>
        </div>
    </div>

}















