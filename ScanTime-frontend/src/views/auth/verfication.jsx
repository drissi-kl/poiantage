import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

import { useForm } from "react-hook-form";
import { verifyApi } from "../../services/auth";
import { useMutation } from "@tanstack/react-query";


export default function VerificationCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const email = location.state?.email || "";
  
  useEffect(() => {
      document.title = "Code de Vérification | ScanTime";
      return () => {
        document.title = "ScanTime";
      };
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value && !/^[0-9]$/.test(value)){
      return null;
    }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
    setErrorMessage(null);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const verifyCodeMutation = useMutation({
    mutationFn: (vefCode)=>verifyApi(vefCode),
    onSuccess: (data, variable, context)=>{
      console.log('outside mutation')
      const message = data.message;
      console.log(message)
      if(message === "Your account has been verified."){
        setSuccessMessage("Votre compte a été vérifié.")
        document.cookie = `token=${data.token}; path=/; max-age= ${60*60*24}`;
        setTimeout(()=>{
            navigate('/dashboard');
          }, 2000
        )
      }else if(message === "This code has expired. A new one has been sent to your email."){
        setErrorMessage("Ce code a expiré. Un nouveau a été envoyé à votre email.");
        setIsSubmitting(false)

      }else if(message === "Incorrect code. Please check your email for the correct one."){
        setErrorMessage("Code incorrect. Veuillez vérifier votre e-mail pour le bon.");
        setIsSubmitting(false)
      }
    }
  })






  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setErrorMessage("Veuillez entrer un code à 6 chiffres");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    const data = {verifyCode : fullCode, email: email}
    console.log('verife', data )

    verifyCodeMutation.mutate(data);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Entrez le Code de Vérification</h2>
          <p className="verification-instructions">
            Nous avons envoyé un code à 6 chiffres à <strong>{email}</strong>
          </p>
        </div>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="verification-form">
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="code-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting ? "Vérification..." : "Vérifier le Code"}
          </button>

          <div className="login-footer">
            <span>
              <Link to="/" className="text-button">
                Retour à la connexion
              </Link>
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