<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use App\Mail\DirectorAuthMail;
use App\Models\Employee;
use App\Models\Notification;
use App\Models\Scan;
use App\Models\User;
use App\Models\Position;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    // this function for send email to director, it needs a director object as parameter
    public function sendEmail($director)
    {
        $mailer = new DirectorAuthMail($director->verifyCode);
        Mail::to($director->email)->send($mailer);
        return $director->verifyCode;
    }

    // this function for generate verifation code
    public function generateCode()
    {
        // create a code for verify account
        $randomCode = collect(range(0, 1000))->random(10)->implode('');
        $generateCode = substr($randomCode, 0, 6);
        return $generateCode;
    }

    public function registry(Request $request)
    {
        try {
            // get fields value        
            $formfield = $request->all();

            // for check this email exists or not
            $user = User::where('email', $request->input('email'))->first();
            if ($user) {
                // if this account already exists and verified
                // i think to send an email to email ower for warning
                if ($user->email_verified_at) {
                    return response()->json([
                        'message' => "An account with this email already exists. Please try register in instead.",
                    ]);
                }

                // if this account already exists but not verified, we generate a new verify code and save it 
                $user->verifyCode = $this->generateCode();
                $user->save();
                $this->sendEmail($user);
                return response()->json([
                    'message' => "An account with this email is registered, but is not yet active. Please check your email to activate it.",
                ]);
            } else {
                // add verify code to values before insert
                $formfield['verifyCode'] = $this->generateCode();
                $formfield['password'] = Hash::make($request->input('password'));
                // for create a director
                if ($formfield['role'] == 'director') {
                    $user = User::create($formfield);
                } else {
                    // when you want to create an employee but QRcode not exists in body params
                    // we cannot create employee without QRcode 
                    if (!$request->has('QRcode')) {
                        return response()->json([
                            'message' => 'send your QRcode, because is required'
                        ]);
                    }
                    if (!$request->has('position_id')) {
                        return response()->json([
                            'message' => 'send your position, because is required'
                        ]);
                    }
                    $user = User::create($formfield);
                    $formfield['user_id'] = $user->id;
                    $employee = Employee::create($formfield);
                    $user->employee = $employee;
                    $directors = User::where('role', 'director')->get();
                    foreach ($directors as $director) {
                        Notification::create([
                            'employee_id' => $user->id,
                            'director_id' => $director->id,
                            'title' => 'Notification au directeur',
                            'content' => "create employé $user->name successfully"
                        ]);
                    }
                }
                // send verify code by email
                $this->sendEmail($user);
                return response()->json([
                    'message' => "Account created successfully. Please verify your account via the email we've sent you.",
                    'user' => $user
                ]);
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'exists error',
            ]);
        }
    }

    public function verify_account(Request $request)
    {
        try {
            $getVerifyCode = $request->input('verifyCode');
            $email = $request->input('email');
            $user = User::where('email', $email)
                    ->where('verifyCode',$getVerifyCode)->first();
            if ($user) {

                // check if the verify code expired or not
                $start_date = Carbon::parse($user->updated_at);
                $cur_date = Carbon::now();
                $diff = $start_date->diffInSeconds($cur_date);
                if ($diff >= 120) {
                    $user['verifyCode'] = $this->generateCode();
                    $user->save();
                    $this->sendEmail($user);
                    return response()->json([
                        'message' => "This code has expired. A new one has been sent to your email."
                    ]);
                }

                // if this account didn't verified and verify code is valide, 
                $user->email_verified_at = Carbon::now();
                $user->verifyCode = null;
                $user->save();
                $token = $user->createToken('api_token')->plainTextToken;

                return response()->json([
                    'message' => "Your account has been verified.",
                    'token' => $token
                ]);
            } else {
                $user = User::where('email', $email)->first();
                $user['verifyCode'] = $this->generateCode();
                $user->save();
                $this->sendEmail($user);
                return response()->json([
                    'message' => "Incorrect code. Please check your email for the correct one."
                ]);
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'exists error'
            ]);
        }
    }

    public function login(Request $request)
    {
        try {
            $email = $request->email;
            $password = $request->password;

            $user = User::where('email', $email)->first();
            if ($user && Hash::check($password, $user->password)) {
                // if this account already exists but not valide, we send to this account new verify code
               
                if (is_null($user->email_verified_at)) {
                    $user->verifyCode = $this->generateCode();
                    $user->save();
                    $this->sendEmail($user);
                    return response()->json([
                        "message" => "Your account isn't active. Please check your email to validate it."
                    ]);
                }
                $token = $user->createToken('api_token')->plainTextToken;
                // return with any employee his scans
                return response()->json([
                    'message' => "Login successful.",
                    'token' => $token,
                ]);

              
            } else {
                return response()->json([
                    'message' => 'email or password not correct'
                ]);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'error' => 'exists error'
            ]);
        }
    }

    public function loggedUser(){
        $currentUser = Auth::user();
        if($currentUser->role == 'employee'){
            $currentUser->load('employee');
        }
        return response()->json([
            'user' => $currentUser
        ]);
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'message' => 'log out successfully'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'error' => 'exists error'
            ]);
        }
    }
}
