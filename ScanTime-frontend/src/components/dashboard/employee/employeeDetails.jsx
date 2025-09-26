import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateEmployeeApi } from "../../../services/employee";
import { createExpTimeApi } from '../../../services/exceptionTime';
// import { defaultImg } from "/images/defaultImg.webp"

export default function EmployeeDetails({employee, closeEmployeeDetails}){
    // console.log(employee)
    const queryClient = useQueryClient();
    const [isUpdate, setIsUpdate]= useState(false);

    const [isExpTime, setIsExpTime]= useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // get position from cache for show it in update select position
    const [positions, setPotions]=useState(queryClient.getQueryData(["positions"]));
    const updateEmployee=useForm({
        defaultValues:{salaryHour: employee.employee.salaryHour || 0 }
    });
    
    const daysName = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    const updateFormDateMutation = useMutation({
        mutationFn:(data)=>updateEmployeeApi(employee.id, data),
        onSuccess:(data, variable, context)=>{
            queryClient.invalidateQueries(["employees"]);
            // console.log("data",data);
            closeEmployeeDetails();
        }
    })
    const updateformDate = (e) => {
        console.log("updateEmployee", e);
        updateFormDateMutation.mutate(e);
    }


    const storeExpTime=useForm({mode: 'onChange'});
    const exceptionalTimeMutation = useMutation({
        mutationFn:(body) => createExpTimeApi(body),
        onSuccess:(data, variable, context)=>{
            const message = data.message;
            if(message == "create exceptional time for employee successfuly"){
                setSuccessMessage(message);
                setTimeout(
                    ()=>{setErrorMessage(null); setSuccessMessage(null)}
                    , 2000
                )
            } else if(message.match(/^this employee has already exceptional time in day/g)[0]){
                setErrorMessage(`cet employé a déjà un temps exceptionnel dans la journée ${variable.dayName}`);
                setTimeout(
                    ()=>{setErrorMessage(null); setSuccessMessage(null)}
                    , 2000
                )
            }
            console.log("data", data);
            console.log("variable", variable);
        }
    })
    const expTimeFormData = (e)=>{
        e.employee_id= employee.employee.id;
        console.log('storeExpTime', e);
        exceptionalTimeMutation.mutate(e)
        setIsExpTime(false);
        storeExpTime.reset()
    }
    

    useEffect(
        ()=>{
            const handleKeydown = (e)=>{
                if(e.key == "Escape"){
                    closeEmployeeDetails();
                }
            };

            document.addEventListener('keydown', handleKeydown);
            return document.removeEventListener('keydown', handleKeydown);
        },[]
    )
    



    return <div className="employeeDetails" onClick={(e)=>{closeEmployeeDetails()}}>
        <div >
            <h2>les information d'employee</h2>
            <div className='message'>
                {
                    errorMessage && <p className='errorMessage'>
                        {errorMessage}  
                    </p>
                }
            
                {
                    successMessage && <p className='successMessage'>
                        {successMessage} 
                    </p>
                }

                
            </div>
            <div className="displayData" onClick={(e)=>{e.stopPropagation()}}>
                <div className="left-side">
                    <div className="image">
                        <img src="/images/defaultImg.webp" alt="not found" />
                    </div>
                    <div className="name">
                        <p className="title">nom complet:</p>
                        <p className="value">{employee.name}</p>
                    </div>
                </div>

                <div className="rigth-side">
                    {(isUpdate || isExpTime) && <div className='backDetails'>
                        <button onClick={()=>{
                            setIsExpTime(false);
                            setIsUpdate(false);
                            storeExpTime.reset();
                            updateEmployee.reset();
                        }} >
                            <FaArrowLeft/>
                        </button>

                    </div>}

                    {isUpdate ? <form onSubmit={updateEmployee.handleSubmit(updateformDate)} method="post">
                            <div className="postForm">
                                <label htmlFor="Postion">Postion</label>
                                <select {...updateEmployee.register('position_id')} defaultValue={ employee.employee.position_id } id="Postion">
                                    {
                                        positions.map((position, index)=><option key={index} value={position.id}  >{position.name}</option>)
                                    }
                                </select>
                            </div>

                            <div className="salaryForm">
                                <label htmlFor="salaryHour">Salaire Horaire (DH)</label>
                                <input type="number" {...updateEmployee.register('salaryHour')} placeholder="Salaire Horaire" id="salaryHour" />
                            </div>

                            <button className="save">save</button>
                        </form>
                        : isExpTime? <div className='exceptionalTime'>
                            <p className='description'>
                                Il définit une heure de début personnalisée pour un employé un jour spécifique 
                                afin que son scan ne soit pas marqué en retard.
                            </p>
                            
                            <form onSubmit={storeExpTime.handleSubmit(expTimeFormData)}  >
                                <div className="dayName">
                                    <label htmlFor="day">jour</label>
                                    <select {...storeExpTime.register('dayName')} id="day">
                                        {
                                            daysName.map((day, index)=><option key={index} value={day} > {day} </option>)
                                        }
                                    </select>
                                </div>

                                <div className="arrivalTime">
                                    <label htmlFor="arrivalTime">heure de début</label>
                                    <input type="time" {...storeExpTime.register('arrivalTime', {
                                        required: {value: true, message: " determiner le temps d'enter"}
                                    })} id="arrivalTime" />
                                    {
                                        storeExpTime.formState.errors?.arrivalTime && <p style={{color: '#c62828'}}>
                                            {storeExpTime.formState.errors.arrivalTime.message}
                                        </p>
                                    }
                                </div>

                                <button className="save"  >save</button>
                            </form>
                        </div>
                        :<div>
                            <div className="email">
                                <p className="title" >Email:</p>
                                <p className="value">{employee.email}</p>
                            </div>
                            <div className="poste">
                                <p className="title" >Poste:</p>
                                <p className="value">{employee.employee.position.name}</p>
                            </div>
                            <div className="arrivalHour">
                                <p className="title" >Heure d'Arrivée:</p>
                                <p className="value">{employee.employee.position.arrivalTime}</p>
                            </div>
                            <div className="hourSalary">
                                <p className="title" >Salaire Horaire:</p>
                                <p className="value">{employee.employee.salaryHour} DH</p>
                            </div>
                            <div className="posteSalary">
                                <p className="title" >Salaire du Poste:</p>
                                <p className="value">{employee.employee.position.salaryHour} DH</p>
                            </div>
                        </div>


                    }
                </div>
                

            </div>
            <div className="buttons" onClick={(e)=>{e.stopPropagation()}}>
                <button className="expTime" onClick={(e)=>{
                    e.stopPropagation()  
                    setIsExpTime(true)
                    setIsUpdate(false)              
                    console.log('expTime');
                }} > exp time</button>

                <button className="updateBtn" onClick={(e)=>{
                    console.log('update'); 
                    setIsUpdate(true);
                    setIsExpTime(false)
                    e.stopPropagation()  
                }}>update</button>

                <button className="closeBtn" onClick={(e)=>{
                    e.stopPropagation();
                    console.log('close');
                    closeEmployeeDetails();
                }}>ferme</button>
            </div>





        </div>
    </div>
}