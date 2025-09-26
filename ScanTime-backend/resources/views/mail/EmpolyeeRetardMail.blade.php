@php
    use Carbon\Carbon;
    use App\Models\ExceptionalTime;
    Carbon::setLocale('fr');
    $now = Carbon::now();


@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification de retard d'employé</title>
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
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
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
        @media (max-width: 600px) {
            table {
                display: block;
                overflow-x: auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Notification de retard d'employé</h2>
        </div>
        
        <div class="content">
            <p>cher(e) {{ $employee->user->name }},</p>
            
            <p>Cet e-mail a pour but de vous informer de vos récents retards au travail.</p>
            
            <div class="highlight">
                <p>Veuillez vous rappeler que la ponctualité est une attente importante pour tous les employés de notre entreprise.</p>
            </div>
            
            <p>Vos arrivées tardives ont été enregistrées comme suit:</p>
            <p>Heure prévue : {{ $employee->position->arrivalTime }}</p>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Arrivée réelle</th>
                        <th>En retard par</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($retards as $retard)
                        <tr>
                            <td>{{ Carbon::parse($retard->created_at)->format('Y-m-d') }}</td>
                            <td>{{ Carbon::parse($retard->created_at)->format('H:i:s') }}</td>
                            <td class="urgent">
                                @php
                                    $arrivalTime = Carbon::parse($employee->position->arrivalTime);
                                    $exceptionalTime = ExceptionalTime::where('employee_id', $employee->id)
                                        ->where('dayName', Carbon::parse($retard->created_at)->isoFormat('dddd'))
                                        ->first();
                                    
                                    if($exceptionalTime){
                                        $arrivalTime = Carbon::parse($exceptionalTime->arrivalTime);
                                    }
                                    $arrivalTime->setDate($now->year, $now->month, $now->day);
                                    echo $now->diffInMinutes($arrivalTime);

                                @endphp
                                Min
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            
            <div class="info-box">
                <p><strong>Employee Details:</strong></p>
                <p>Name: {{ $employee->user->name }}</p>
                <p>Email: {{ $employee->user->email }}</p>
                <p>Position: {{ $employee->position->name }}</p>
             
            </div>
            
            <p>Selon la politique de notre entreprise, une ponctualité constante est attendue de tous les employés. Des retards répétés peuvent entraîner des mesures supplémentaires comme décrit dans le manuel de l'employé.</p>
            
            <p>{{ '$companyName' }}</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>&copy; {{ date('Y') }} {{ '$companyName' }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>












