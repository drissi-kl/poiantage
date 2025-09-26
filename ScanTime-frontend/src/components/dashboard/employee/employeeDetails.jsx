import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateEmployeeApi } from "../../../services/employee";
import { createExpTimeApi, deleteExpTimeApi, getExpTimeApi } from '../../../services/exceptionTime';
import { createTimeOffApi } from '../../../services/scan';
// import { defaultImg } from "/images/defaultImg.webp"

export default function EmployeeDetails({employee, closeEmployeeDetails}){
    const queryClient = useQueryClient();
    
    // get position from cache for show it in update select position
    const [positions, setPotions]=useState(queryClient.getQueryData(["positions"]));
    
    
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    const daysName = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]; 
    
// update employee logic #######################################
    const [isUpdate, setIsUpdate]= useState(false); // for update data of employee(boolean)
    const updateEmployee=useForm({
        defaultValues:{salaryHour: employee.employee.salaryHour || 0 }
    });
    const updateFormDateMutation = useMutation({
        mutationFn:(data)=>updateEmployeeApi(employee.id, data),
        onSuccess:(data, variable, context)=>{
            queryClient.invalidateQueries(["employees"]);
            closeEmployeeDetails();
        }
    })
    const updateformDate = (e) => {
        updateFormDateMutation.mutate(e);
    }
// update employee logic #######################################


// exception time logic #######################################
    const [isExpTime, setIsExpTime]= useState(false); // for take an employee a exceptional time(boolean)
    const storeExpTime=useForm({mode: 'onChange'});
    const exceptionalTimeMutation = useMutation({
        mutationFn:(body) => createExpTimeApi(body),
        onSuccess:(data, variable, context)=>{
            const message = data.message;
            if(message == "create exceptional time for employee successfuly"){
                setSuccessMessage(message);
                queryClient.invalidateQueries(["exceptionTime"]);
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
// exception time logic #######################################


// show all exception time of an employee logic
    const [isExpTimeUpdate, setIsExpTimeUpdate]= useState(false); // this for show all exceptional time has this employee
    const {data: expTimeEmp} = useQuery({
        queryKey: ["exceptionTime"],
        queryFn: ()=>getExpTimeApi(employee.employee.id)
    })

            console.log('expTimeEmp', expTimeEmp)

    

// show all exception time of an employee logic

// delete exception time of an employee logic
    const deleteExpTimeMutation = useMutation({
        mutationFn: (id)=>deleteExpTimeApi(id),
        onSuccess: (data, variable, context)=>{
            console.log('data', data);
            console.log('variable', variable);
            if(data.message == "delete exceptional time for employee successfully"){
                queryClient.invalidateQueries(['exceptionTime']);
                setSuccessMessage('supprimer ce temps exceptionnelle success');
                setTimeout(
                    ()=>setSuccessMessage(null), 2000
                )
            } else {
                setErrorMessage("la supprition ne fait pas");
                setTimeout(
                    ()=>setErrorMessage(null), 2000
                )
            }
        }
    })

    const deleteExpTime= (e) =>{
        deleteExpTimeMutation.mutate(e);
    }
// delete exception time of an employee logic

// time off logic #######################################
    const [isTimeOff, setIsTimeOff]= useState(false); // for take an employee a time off payed for vacation or sick(boolean)
    const timeOffForm = useForm();
    const timeOffMutation= useMutation({
        mutationFn: (data)=>createTimeOffApi(data.id, data.body),
        onSuccess: (data, variable, context)=>{
            console.log(data);
            console.log(variable);
            setIsTimeOff(false);
            timeOffForm.reset();
            queryClient.invalidateQueries(["employees"]);
        }
    })
    const timeOff = (e) => {
        timeOffMutation.mutate({id: employee.id, body: e})

    }
// time off logic #######################################




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
                    {(isUpdate || isExpTime || isTimeOff) && <div className='backDetails'>
                        <button onClick={()=>{
                            setIsExpTime(false);
                            setIsUpdate(false);
                            setIsTimeOff(false);
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
                            {
                                !isExpTimeUpdate? <>
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

                                    <button className="save" type='submit'  >save</button>
                                    <button className="save" type='button' onClick={()=>setIsExpTimeUpdate(true)}>has {expTimeEmp.expTime.length} exceptional Time</button>
                                </form>
                            </>
                            : <div className='showExcTime'>
                                {
                                    expTimeEmp.expTime.map((item, index)=>{return <div key={index}>
                                        <p>{item.dayName}</p>
                                        <p>{item.arrivalTime}</p>
                                        <button onClick={()=>deleteExpTime(item.id)}>delete</button>
                                    </div> })
                                }

                                <button className="save" onClick={()=>setIsExpTimeUpdate(false)}>back</button>
                            </div>
                            }
                           
                        </div>
                        // for create a time off (conge) here its template ########################################################################
                        :isTimeOff ? <div  className="timeOff">

                            <h1 className="title">Demande de Congé</h1>
                            <form onSubmit={timeOffForm.handleSubmit(timeOff)} method="post" >
                                <div>
                                    <label htmlFor="typeConge">type de conge</label>
                                    <select {...timeOffForm.register('type')} id="typeConge">
                                        <option value="vacation">vacance</option>
                                        <option value="sick">malade</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="startDate">Date de Début:</label>
                                    <input type="date" {...timeOffForm.register('startDate')} placeholder="date de debut" id="startDate" />
                                </div>

                                <div>
                                    <label htmlFor="endDate">Date de Début:</label>
                                    <input type="date" {...timeOffForm.register('endDate')} placeholder="date de debut" id="endDate" />
                                </div>

                                <div className="buttons">
                                    <button className="confirmBtn" type="submit" >confirme</button>
                                </div>
                            </form>

                        </div>
                        // for create a time off (conge) here its template ########################################################################
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
                <button className="timeOffBtn" onClick={(e)=>{
                    e.stopPropagation();  
                    setIsExpTime(false);
                    setIsUpdate(false);
                    setIsTimeOff(true);              
                }} >Congé</button>
        
                <button className="expTimeBtn" onClick={(e)=>{
                    e.stopPropagation();  
                    setIsUpdate(false);    
                    setIsTimeOff(false);          
                    setIsExpTime(true);
                }} > exp time</button>

                <button className="updateBtn" onClick={(e)=>{
                    setIsExpTime(false);
                    setIsTimeOff(false);
                    setIsUpdate(true);
                    e.stopPropagation(); 
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