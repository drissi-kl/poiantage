import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CryptoJS from "crypto-js";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";


import { loginApi } from "../../services/auth";



export default function Login() {
    // controleRoute function determines the routes allow if token exists and the routes don't allow if token not exsists
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage]=useState('');
    const navigate = useNavigate();

    const changingInput=()=>{
      setErrorMessage('')
    }
    
    const {handleSubmit, register, formState, reset}=useForm({
      mode: "all"
    });
    const {errors, isValid, isSubmitting, isDirty }=formState;
    
    const loginMutation = useMutation({
        mutationFn: (body)=>loginApi(body),
        onSuccess:(data, variable, context)=>{
            const message = data.message;
            console.log(data)
            if(message == "Your account isn't active. Please check your email to validate it."){
                setErrorMessage("Votre compte n'est pas actif. Veuillez vérifier votre email pour le valider.");
                setTimeout(
                    ()=>navigate("/verification-code", {state: {email: variable.email}})
                    , 3000
                )

            }else if(message == "email or password not correct" ){
                setErrorMessage("Adresse e-mail ou mot de passe invalide.");
                reset({email: variable.email, password:''});

            }else if(message == "Login successful."){
                document.cookie = `token=${data.token}; path=/; max-age= ${60*60*18}`;

                // queryClient.setQueryData(['user'], data.user);
                // queryClient.setQueryData(['notifications'], data.notifications || []);

                navigate('/dashboard');
            }
        }
    })
    
    const sendForm=(data)=>{
        loginMutation.mutate(data)
    }

    useEffect(() => {
        document.title = "Connexion | ScanTime";
        return () => {
            document.title = "ScanTime";
        }}, []
    );



  return (
    <div className="login-container">
        <div className="login-card">
            <div className="login-header">
                <h2>Connexion</h2>
            </div>

        {errorMessage && <div className="alert alert-error"> {errorMessage} </div>}

        <form onSubmit={handleSubmit(sendForm)} className="login-form">
          <div className="form-group1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email',
                {
                  pattern: {value :/^[A-Za-z]{1,20}[0-9]{0,6}@[A-Za-z]{4,10}\.[A-Za-z]{2,5}$/, message:"L'email est invalide"},
                  required: {value : true, message:"L'email est obligatiore"}
                }
              )}
              className={errors.email ? "error" : ""}
              placeholder="Entrez votre email"
              onChange={()=>changingInput()}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group1">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              {...register('password',{
                required: {value: true, message: "le mot de pass est obligatiore"}
              })}
              className={errors.password ? "error" : ""}
              placeholder="Entrez votre mot de passe"
              onChange={()=>changingInput()}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
           
          </div>

          <button
            type="submit"
            disabled={ isSubmitting}
            className="login-button"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>

          <div className="login-footer">
            <span>
              Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link>
            </span>
          </div>
        </form>
      </div>
      <div className="login-background">
        <img
          src="/images/QR Code.gif"
          alt="QR Code Animé en Arrière-plan"
          className="background-gif pulse-animation"
        />
      </div>
    </div>
  );
}