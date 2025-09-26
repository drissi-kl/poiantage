<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Position;
use App\Models\Scan;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class AppController extends Controller
{   
    public function index()
    {
        try{
            // for get list of all users
            $users=User::where('role', 'employee')->with('employee')->get();
            
            // add list scans of all employee exists
            foreach($users as $user){
                if($user->employee != null){
                    $user->employee->load('scans');
                    $user->employee->load('position');
                }
            }

            // return json contain a message and list of employee
            return response()->json([
                'message'=>'all employee',
                'users'=>$users
            ]);

        }catch(Exception $e){
            // Catch any exception and return a JSON response with the error message and status code
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);        
        }
    }

    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {
        try{
            $user = User::find($id);
            if($user){
                if($user->role == 'employee'){
                    $user->load('employee');
                    $user->employee->load('scans');
                    $user->employee->load('position');
                    // $user->scans=Scan::where('employee_id', $user->employee->id)->get();
                    // $user->position=Position::where('id', $user->employee->position_id)->get();
                }
                return response()->json([
                    'message'=>'this user exists',
                    'user'=>$user
                ]);
            } else {
                return response()->json([
                    'message'=>'this user not exists'
                ]);
            }

        } catch (Exception $e){
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        try{
            $formfield=$request->all();
            $user = User::find($id);
            if($user){
                $new_password = $request->input('new_password');
                if($new_password){
                    $formfield["password"] = Hash::make($request->input('new_password'));
                }
                
                unset($formfield['profile']);
                if($request->hasFile('profile')){
                    $profileName = time().'.'. $request->file('profile')->extension();
                    $formfield['profile']=asset('/storage/'.$request->file('profile')->storeAs('', $profileName, 'public'));
                }
                
                $user->fill($formfield);
                
                $user->save();

                if($user->role == 'employee'){
                    $empolyee = Employee::where('user_id', $user->id)->first();
                    // if($request->has('QRcode')){
                    //     $formfield['QRcode'] = $request->input('QRcode');
                    // }
                    if($request->input('salaryHour')==""){
                        unset($formfield['salaryHour']);
                    }
                    $empolyee->fill($formfield);
                    $empolyee->save();      
                    $user->load('employee');
                    $user->scans=Scan::where('employee_id',$empolyee->id)->get();
                }

                return response()->json([
                    'message'=>"update $user->role successfully",
                ]);
            } else {
                return response()->json([
                    'message'=>'this user not exists',
                ]);                
            }


        } catch (Exception $e) {
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);
        }
    }

    public function destroy($id)
    {
        try{
            $user = User::find($id);
            if($user){
                $user->delete();
            //     if($user->role == 'employee'){
            //         Employee::where('user_id', $user->id)->first()->delete();
            //     }
                return response()->json([
                'message'=> "delete $user->role successfully"
            ]);
            }
            // return response()->json([
            //     'message'=>'this user not exists'
            // ]);

        }catch(Exception $e){
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);
        }
    }

}