<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .email-header {
            /* background: linear-gradient(90deg, #0d6efd, #0a58ca); */
            padding: 5px;
            text-align: center;
            color: #fff;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .email-body {
            padding: 25px;
            line-height: 1.6;
        }
        .email-body p {
            margin-bottom: 15px;
            font-size: 15px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #0d6efd;
            color: #fff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 15px;
            transition: background 0.3s ease;
        }
        .btn:hover {
            background: #0b5ed7;
        }
        .email-footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
            background: #fafafa;
        }
        .verifycode{
          background-color: #0d6efd ; 
          padding: 10px 30px;
          display: block;
          font-size: 20px;
          border-radius: 5px;
          width: 100px;
          margin: auto;
          letter-spacing: 5px;
          color:white;
          font-weight: 600;
        }
        @media (max-width: 600px) {
            .email-body {
                padding: 15px;
            }
            .btn {
                width: 100%;
                display: block;
                text-align: center;
            }
        }
        

    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
          <img src="{{ asset('storage/emailIcon/scanTime.jpg') }}" alt="ddd" height="50px" />
        </div>
        <div class="email-body">
            <p>Hello,</p>
            <p>Thank you for registering with us! Please verify your email address by clicking the button below. This link will expire in 120 secondes.</p>
            <p style="text-align: center;">
                <span class="verifycode">{{ $verifyCode }}</span>
            </p>
            <p>If you did not create an account, no further action is required.</p>
            <p>Regards,<br><strong>{{ config('app.name') }}</strong></p>
        </div>
        <div class="email-footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
