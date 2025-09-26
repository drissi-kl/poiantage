@php
 use Carbon\Carbon;
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Absence Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: #ffffff;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #e9ecef;
        }
        .header h2 {
            margin: 0;
            color: #2c3e50;
        }
        .content {
            padding: 25px;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
        }
        .highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
        .urgent {
            color: #e74c3c;
            font-weight: bold;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
        }
        .info-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #3498db;
        }
        .contact-info {
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px dashed #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Notification d'absence</h2>
        </div>
        
        <div class="content">
            <p>Dear {{ $employee->user->name }},</p>
            
            <p>Nous avons remarqué que vous étiez absent du travail pendant jours à partir du {{ Carbon::now()->subDays(2)->format('Y-m-d') }} sans préavis.</p>
            
            <div class="highlight">
                <p>
                    Selon notre politique d'entreprise, tous les employés doivent signaler 
                    leurs absences à l'avance ou dès que possible.
                </p>
            </div>
            
            <p>Vous devez nous contacter pour expliquer la raison de votre absence:</p>
            
            <div class="info-box">
                <p><strong>Veuillez appeler immédiatement:</strong></p>
                <p>Gestionnaire: name of manager</p>
                <p>Tel : <span class="urgent">{{ '06XXXXXXX' }}</span></p>
                <p>Département : Ressources Humaines</p>
            </div>
            
            <p>Employee details:</p>
            <ul>
                <li>Nom : {{ $employee->user->name }}</li>
                <li>Position: {{ $employee->position->name }}</li>
                <li>Date d'absence: {{ Carbon::now()->subDays(3)->format('Y-m-d') }} a {{ Carbon::now()->format('Y-m-d') }}</li>
                <!-- <li>Nombre de jours: {{ 5 }}</li> -->
            </ul>
            
            <p>Le fait de ne pas nous contacter concernant cette absence peut entraîner des mesures disciplinaires comme indiqué dans le manuel de l'employé.</p>
            
            <div class="contact-info">
                <p>Si vous avez déjà signalé cette absence, veuillez ignorer cet avis.</p>
                <p>Sincèrement,<br>
                Département des ressources humaines<br>
                {{ '$companyName' }}</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Ceci est une notification automatique. Veuillez ne pas répondre à cet email..</p>
            <p>&copy; {{ date('Y') }} {{ '$companyName' }}. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>




