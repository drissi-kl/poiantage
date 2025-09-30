import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { createLeaveRequestApi } from "../../../services/scan"
import { useEffect, useState } from "react";



export default function LeaveRequest({employees, closeLeaveRequest}){
    const queryClient=useQueryClient();

    const {handleSubmit, register } = useForm();
    
    const leaveRequestMutation= useMutation({
        mutationFn: (body)=>createLeaveRequestApi(body),
        onSuccess: (data, variable, context)=>{

            closeLeaveRequest();
            queryClient.invalidateQueries(["employees"]);
        }
    })
    
    const LeaveRequestForm = (e) => {
        e.employees = empList;
        leaveRequestMutation.mutate(e);

    }

    
    // selection employees logic ##################################
    const [selectionEmp, setSelectionEmp]=useState(true);
    const [empList, setEmpList]=useState([]);

    const selectionEmpsList = (id) => {
        if(!empList.includes(id)){
            setEmpList([...empList, id])
        }else{
            setEmpList(
                empList.filter((item)=>{return item != id}  )
            )
        }
    }
    // selection employees logic ##################################

    return <div className="leaveRequest">
        <div className="container">

            <h1 className="title">Demande de Jour ferie</h1>
            <p className="attentionMessage" >
                Cette procédure s'applique à tous les employés par default mais tu peut selection les employee qui tu vas donner vous cette Jour ferie, alors attention.
            </p>
            {
                selectionEmp ?  <>
                    <button className="selectionBtn" onClick={()=>setSelectionEmp(false)}>select les employees</button>
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
                </> 
                : <div className="selectionEmps">
                    <button className="selectionBtn" onClick={()=>setSelectionEmp(true)}>back</button>
                    <button className="selectionBtn" onClick={()=>setEmpList([])}>initialse</button>
                    <div className="selectionEmp" >
                        {
                            employees.map((item, index)=>{return <div className="item" key={index}>
                                <input type="checkbox"  checked = {empList.includes(item.employee.id)} id={index} onChange={()=>{selectionEmpsList(item.employee.id)}} />
                                <label htmlFor={index}>
                                    <span className="name">{item.name}</span>
                                    <span className="position">{item.employee.position.name}</span>
                                    
                                </label>
                            </div> })
                        }
                    </div>
                </div>

            }

        </div>
    </div>

}















