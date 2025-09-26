<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\ExceptionalTime;
use Exception;
use Illuminate\Http\Request;

class ExceptionalTimeController extends Controller
{
    public function index(){
        try{
            $expTime = ExceptionalTime::all();
            return response()->json([
                'message'=>"all exceptional time",
                'allExceptionalTime'=>$expTime
            ]); 
            
        } catch (Exception $e){
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);    
        }
    }

    public function store(Request $request){
        try{
            $formfield = $request->validate([
                'employee_id'=>'required|numeric',
                'arrivalTime'=>'required|date_format:H:i',
                'dayName'=>'required|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi,Dimanche'
            ]);

     
            $employee = Employee::find($formfield['employee_id']);
            if($employee == null){
                return response()->json([
                    'message'=>'not exists any employee has this id',
                ]);            
            }

            $expIfExists = ExceptionalTime::where('dayName', $formfield['dayName'])
            ->where('employee_id', $formfield['employee_id'])->first();
            if($expIfExists){
                return response()->json([
                'message'=>"this employee has already exceptional time in day $request->dayName",
                'exceptionTime'=>$expIfExists
                ]);
            }

            ExceptionalTime::create($formfield);
            return response()->json([
                'message'=>"create exceptional time for employee successfuly",
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);

        }
    }


    public function update(Request $request, $id){
        try{
            $formfield = $request->validate([
                'arrivalTime'=>'date_format:H:i',
                'dayName'=>'string'
            ]);

            $expTime = ExceptionalTime::find($id);
            $expTime->fill($formfield);
            $expTime->save();
            return response()->json([
                'message'=>"update exceptional time for employee successfuly",
            ]); 
            
        } catch (Exception $e){
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);    
        }
    }

    public function destroy($id){
        try{
            $expTime = ExceptionalTime::find($id);
            $expTime->delete();
            return response()->json([
                'message'=>"delete exceptional time for employee successfuly",
            ]); 
            
        } catch (Exception $e){
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);    
        }     
    }

}
