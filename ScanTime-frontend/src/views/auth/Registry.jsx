import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get, useForm } from "react-hook-form";
import { registerApi } from "../../services/auth";
import { useMutation } from "@tanstack/react-query";

export default function Register() {
  // controleRoute function determines the routes allow if token exists and the routes don't allow if token not exsists


  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {register, handleSubmit, formState, getValues, reset}=useForm();
  const {isLoading, isSubmitting, errors, }=formState;

  
  useEffect(() => {
      document.title = "Inscription | ScanTime";
      return () => {
      document.title = "ScanTime";
      };
  }, []);


  const registerMutation=useMutation({
    mutationFn: (body)=>registerApi(body),
    onSuccess:(data, variable, context)=>{
      const message = data.message;
      if(message == "An account with this email already exists. Please try register in instead."){
          setErrorMessage("Un compte avec cet e-mail existe déjà. Veuillez essayer de vous inscrire avec un autre.");
          reset({
            email: '',
            password: '',
            confirmPassword: ''
          })
          setTimeout(
              ()=>{
                setErrorMessage(null)
              }, 4000
          )
      } else {
        if(message == "An account with this email is registered, but is not yet active. Please check your email to activate it."){
          setErrorMessage("Un compte avec cet email est enregistré, mais n'est pas encore actif. Veuillez vérifier votre email pour l'activer.");
        }
          
        if (message == "Account created successfully. Please verify your account via the email we've sent you."){
          setSuccessMessage("Compte créé avec succès. Veuillez vérifier votre compte via l'e-mail que nous vous avons envoyé.");
        }
          
          setTimeout(
              ()=>{
                  navigate('/verification-code', {state: {email: variable.email}});
              }, 4000
          )          
      }
    }
  })

  
  const sendForm = async (e) => {
      e.role = "director";
      registerMutation.mutate(e);
  };

  const messagUnloading=()=>{
      setErrorMessage("");
      setSuccessMessage("");
  }









  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Inscription</h2>
        </div>

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(sendForm)} className="login-form">
            <div className="form-group1">
                <label htmlFor="name">Nom complet</label>
                <input
                    type="text"
                    id="name"
                    {...register('name', {
                        required:{value:true, message: "Le nom est requis"},
                        pattern:{value: /^[A-Za-z]+ [A-Za-z]+$/, message:"votre nom not valid, comme 'drissi abde'"}
                    })}
                    onChange={messagUnloading}
                    className={errors.name ? "error" : ""}
                    placeholder="Entrez votre nom complet"
                />
                {errors.name && (
                <span className="error-message">{errors.name.message}</span>
                )}
            </div>

            <div className="form-group1">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                        {...register('email',{
                                pattern: {value :/^[A-Za-z0-9][A-Za-z0-9.-_]+[A-Za-z0-9]@[A-Za-z]{4,10}\.[A-Za-z]{2,5}$/, message:"L'email est invalide"},
                                required:{value:true, message:"Email est requis"}
                            }
                        )}
                    onChange={messagUnloading}
                    className={errors.email ? "error" : ""}
                    placeholder="Entrez votre email"
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
                        required:{value:true, message:"un mot de passe est requis"},
                        minLength:{value:6, message: "Le champ doit contenir au moins 6 caractères."}
                    })}
                    onChange={messagUnloading}
                    className={errors.password ? "error" : ""}
                    placeholder="Entrez votre mot de passe"
                />
                {errors.password && (
                <span className="error-message">{errors.password.message}</span>
                )}
            </div>

            <div className="form-group1">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword', {
                        validate:(value)=>{return value === getValues('password') || 'passwonds not mutched'},
                        required:{value:true, message:"un mot de passe de confirmation est requis"},
                    })}
                    onChange={messagUnloading}
                    className={errors.confirmPassword ? "error" : ""}
                    placeholder="Confirmez votre mot de passe"
                />
                {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword.message}</span>
                )}
            </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </button>

          <div className="login-footer">
            <span>
              Vous avez déjà un compte ? <Link to="/">Se connecter</Link>
            </span>
          </div>
        </form>
      </div>
      <div className="login-background">
        <img
          src="/images/QR Code.gif"
          alt="QR Code Animé en Arrière-plan"
          className="background-gif"
        />
      </div>
    </div>
  );
}