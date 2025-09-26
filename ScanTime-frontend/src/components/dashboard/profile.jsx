import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import '../../profile.css';
import { updateEmployeeApi } from "../../services/employee";

export default function Profile(){
    const queryClient = useQueryClient();
    const userActive = queryClient.getQueryData(["loggedUser"]).user;
    console.log(userActive);

    const [isUpdate, setIsUpdate]=useState(false);
    const [imageName, setImageName]=useState('');

    const updateProfileForm = useForm();
    const currentFile = updateProfileForm.watch("profile");
    useEffect(
        ()=>{
            currentFile && setImageName(currentFile[0]?.name)
        }, [currentFile]
    )

    const updateProfileMutation = useMutation({
        mutationFn: (data)=>updateEmployeeApi(data.id, data.body),
        onSuccess: (data, variable, context)=>{
            console.log('data', data);
            console.log('variable', variable);
            queryClient.invalidateQueries(["loggedUser"]);
            setIsUpdate(false);
            setImageName('');
            updateProfileForm.reset();
        }
    })
      
    const updateProfile = (p) => {
        const body = new FormData();
        if(p.profile[0]){
            body.append('profile', p.profile[0]);
        }
        if(p.password){
            body.append('new_password', p.password);
        }

        const data = {id: userActive.id, body: body};
       
        updateProfileMutation.mutate(data);
    }


    return <div className="profile">

        <div className="headProfile">
            <h1>Paramètres du Compte</h1>
            <div className="buttons">
                {
                    isUpdate?<button onClick={()=>{setIsUpdate(false)}} >Annuler</button>
                    :<button onClick={()=>{setIsUpdate(true)}} >Modifier Profile</button>
                }
            </div>
        </div>

        <div className="bodyProfile">
            <div className="leftSide">
                <div className="image">
                    <img src={userActive.profile || '/images/defaultImg.webp'} alt="" />
                </div>
            </div>

            {
                isUpdate? <form onSubmit={updateProfileForm.handleSubmit(updateProfile)}  className="rightSideForm" encType="multipart/form-data" >
                    <div>
                        <label htmlFor="passwordLabel" className="passwordLabel">Password</label>
                        <input type="password" id="passwordLabel" {...updateProfileForm.register('password')} />
                    </div>

                    <div>
                        <label htmlFor="passwordConfirmerLabel" className="passwordConfirmerLabel">Confirmer Password</label>
                        <input type="password" id="passwordConfirmerLabel" {...updateProfileForm.register('passwordConfirmed',{
                            validate: (value)=>{ return value == updateProfileForm.getValues('password') || "les mots de passe ne correspondent pas" }
                        })} />
                        {
                            updateProfileForm.formState.errors.passwordConfirmed && <p>{updateProfileForm.formState.errors.passwordConfirmed.message}</p>
                        }
                    </div>

                    <div>
                        <label htmlFor="imageLabel" className="imageLabel">
                            <span><AiOutlineCloudUpload /></span>Image {(imageName?.length>30)?imageName.substr(0,30)+'...':imageName}
                        </label>
                        <input type="file" id="imageLabel" className="imageForm" {...updateProfileForm.register('profile')} />
                    </div>

                    <button className="" type="submit">Modifier</button>
                </form>
                : <div className="rightSide">
                    <div>
                        <p className="title">Nom Complet: </p>
                        <p className="value">{userActive.name}</p>
                    </div>
        
                    <div>
                        <p className="title">Adresse Email: </p>
                        <p className="value">{userActive.email}</p>
                    </div>
        
                    <div>
                        <p className="title">Rôle: </p>
                        <p className="value">{userActive.role}</p>
                    </div>

                    {
                        userActive.role == 'employee' && <div>
                            <p className="title">Position: </p>
                            <p className="value">{userActive.position.name}</p>                       
                        </div>
                    }
                </div>
            }
        </div>
    </div>
}









