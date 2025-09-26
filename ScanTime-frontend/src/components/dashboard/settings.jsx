import { useMutation, useQueryClient } from "@tanstack/react-query"
import { mode } from "crypto-js";
import { useForm } from "react-hook-form";
import { createPositionApi, updatePositionApi } from "../../services/position";

import "../../settings.css";
import { useState } from "react";

export default function Settings() {
    const queryClient = useQueryClient()
    const positions = queryClient.getQueryData(["positions"])

    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const createPositionForm = useForm({
        mode: "onChange"
    });
    const createPositionMutation = useMutation({
        mutationFn: (body) => createPositionApi(body),
        onSuccess: (data, variable, context) => {
            queryClient.invalidateQueries(["positions"]);
            const message = data.message;

            if(message == "create position successfully"){
                queryClient.invalidateQueries(["positions"]);
                setSuccessMessage('la creation du position est success')
                setIsUpdatePosition(null);
                
            } else{
                setErrorMessage("cette position déjà créé, tu peut modifier elle");
                console.log(message)
            }

            createPositionForm.reset();
            updatePositionForm.reset();
            setTimeout(
                ()=>{
                    setErrorMessage(null);
                    setSuccessMessage(null);
                }, 2000
            );

        }
    })
    const createForm = (e) => {
        createPositionMutation.mutate(e)
        createPositionForm.reset()
    }

    const [isUpdatePosition, setIsUpdatePosition] = useState(null);
    const updatePositionForm = useForm()

    const drissi = (item) => {
        setIsUpdatePosition(item);
        createPositionForm.reset();
        updatePositionForm.reset({
            'name': item.name,
            'salaryHour': item.salaryHour,
            'arrivalTime': item.arrivalTime
        });
    }

    const updatePositionMutation = useMutation({
        mutationFn: (variables) => updatePositionApi(variables.id, variables.body), 
        onSuccess: (data, variable, context)=>{
            const message = data.message;
            if(message == "updated position successfully"){
                setSuccessMessage('la modification du position est success')
                setIsUpdatePosition(null);
                queryClient.invalidateQueries(["positions"]);
                
            } else{
                setErrorMessage("cette postion n'est pas");
            }

            createPositionForm.reset();
            updatePositionForm.reset();

            setTimeout(
                ()=>{
                    setErrorMessage(null);
                    setSuccessMessage(null);
                }, 2000
            );

            console.log('update position message', message);

        }
    })


    const updateForm = (e) => {
        console.log('upgrade postion', e);
        console.log('id position', isUpdatePosition.id);
        updatePositionMutation.mutate({id: isUpdatePosition.id, body: e});
    }

    const cancelUpdatePosition = () => {
        createPositionForm.reset();
        updatePositionForm.reset();
        setIsUpdatePosition(null);
    }


    return <div className="containerPosition">
        <h1>Paramètres de l'Entreprise</h1>

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

        <div className="createPosition">
            <p className="title">{isUpdatePosition ? "Modifier" : "Ajouter un Nouveau"} Poste</p>
            {
                !isUpdatePosition ? <form onSubmit={createPositionForm.handleSubmit(createForm)}>
                    <div>
                        <div>
                            <input type="text" {...createPositionForm.register('name', {
                                required: { value: true, message: 'le nom du poste est obligie' }
                            })}
                                placeholder="Entez le nom du poste"
                            />
                        </div>

                        <div>
                            <input type="number" min='0' {...createPositionForm.register('salaryHour', {
                                required: { value: true, message: 'Salaire horaire  est obligie' }
                            })}
                                placeholder="Salaire horaire (1H)"
                            />
                        </div>

                        <div>
                            <input type="time" min='0' {...createPositionForm.register('arrivalTime', {
                                required: { value: true, message: "le temps d'entre est obligie" }
                            })}
                            />
                        </div>
                    </div>
                    <div className="errors">
                        {createPositionForm.formState.errors.name && <p style={{ color: '#DC2626', gridColumn: "1/2" }}>{createPositionForm.formState.errors.name.message}</p>}
                        {createPositionForm.formState.errors.salaryHour && <p style={{ color: '#DC2626', gridColumn: "2/3" }}>{createPositionForm.formState.errors.salaryHour.message}</p>}
                        {createPositionForm.formState.errors.arrivalTime && <p style={{ color: '#DC2626', gridColumn: "3/4" }}>{createPositionForm.formState.errors.arrivalTime.message}</p>}
                    </div>
                    <button type="submit" >Ajouter</button>
                </form>
                    : <form onSubmit={updatePositionForm.handleSubmit(updateForm)}>
                        <div>
                            <div>
                                <input type="text" {...updatePositionForm.register('name', {
                                    required: { value: true, message: 'le nom du poste est obligie' }
                                })}
                                    placeholder="Entez le nom du poste"
                                />
                            </div>

                            <div>
                                <input type="number" min='0' {...updatePositionForm.register('salaryHour', {
                                    required: { value: true, message: 'Salaire horaire  est obligie' }
                                })}
                                    placeholder="Salaire horaire (1H)"
                                />
                            </div>

                            <div>
                                <input type="time" min='0' {...updatePositionForm.register('arrivalTime', {
                                    required: { value: true, message: "le temps d'entre est obligie" }
                                })}
                                />
                            </div>
                        </div>
                        <div className="buttons">
                            <button type="submit" >Update</button>
                            <button onClick={() => cancelUpdatePosition()} >Annuler</button>
                        </div>
                    </form>

            }

        </div>





        <div className="showPostions">
            <p className="title">Postes Existants</p>
            <div>
                {
                    positions.map((item, index) => {
                        return <div className="showPostion" key={index}>
                            <div className="infos">
                                <p><span>nom:</span> {item.name}</p>
                                <p><span>salaire horaire:</span> {item.salaryHour}</p>
                                <p><span>time d'entre:</span> {item.arrivalTime}</p>
                            </div>
                            <div className="buttons">
                                <button className="updatebtn" onClick={() => drissi(item)}>update</button>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    </div>
}