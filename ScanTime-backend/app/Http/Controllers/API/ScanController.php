<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\EmployeeAbsentMail;
use App\Mail\EmpolyeeRetardMail;
use App\Models\Employee;
use App\Models\ExceptionalTime;
use App\Models\Notification;
use App\Models\Position;
use App\Models\Scan;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\Builder;

class ScanController extends Controller
{

    private function sendEmail(Employee $employee){
        $mailer = new EmpolyeeRetardMail( $employee);
        Mail::to($employee->user->email)->send($mailer);
    }

    // absentInMonth() function calculates the number of days the employee was delayed.
    private function retardInMonth(Employee $employee){
        $date = Carbon::now();
        $scans = Scan::where('employee_id', $employee->id)
        ->whereYear('created_at', $date->year)
        ->whereMonth('created_at', $date->month)
        ->where('enRetard', true)
        ->count();      

        if($scans>3){
            $this->sendEmail( $employee );
            $directors = User::where('role', 'director')->get();
            $user = $employee->user;
            foreach($directors as $director){
                Notification::create([
                    'title'=>'Notification au directeur',
                    'content'=>"L'employé $user->name a $scans retards ce mois-ci.",
                    'employee_id'=>$user->id,
                    'director_id'=>$director->id
                ]);
            }
        }
        return $scans;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return Scan::all();
        // return response()->json([
        //             'session'=>session()->get('activeUser')
        //         ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $today = Carbon::today()->format('Y-m-d');
        $now = Carbon::now();
        $formfields = $request->all();
        
        $user = User::where('email', $request->input('email'))->first();
        if(!$user){
            $email = $request->input('email');
            return response()->json([
                'message'=>"not exists any user has this email $email"
            ]);
        }
        $employee = Employee::where('user_id', $user->id)->first();
        if ($employee) {
            $scan = Scan::where('employee_id', $employee->id)
                ->whereDate('created_at', $today)->get();
            $nbrScan = count($scan);

            if($nbrScan == 0) {
                $formfields['state'] = 'arrivalTime';
            } elseif ($nbrScan == 1) {
                $formfields['state'] = 'beforeBreak';
            } elseif ($nbrScan == 2) {
                $formfields['state'] = 'afterBreak';
            } elseif ($nbrScan == 3) {
                $formfields['state'] = 'departureTime';
            } else {
                return response()->json([
                    'message' => 'this scan not allowed'
                ]);
            }

            // for retard
            Carbon::setLocale('fr');
            $arrivalToday = Carbon::createFromFormat('H:i:s', $employee->position->arrivalTime);
            $exceptionalTime = ExceptionalTime::where('employee_id', $employee->id)
            ->where('dayName', Carbon::now()->isoFormat('dddd'))
            ->first();
            if($exceptionalTime){
                $arrivalToday = Carbon::parse($exceptionalTime->arrivalTime);
            }
            $arrivalToday->setDate($now->year, $now->month, $now->day);

            // this condition cheks if employee lates greater than 5 minutes
            // about $nbrScan == 0 in condition for determine late only in arrival time
            $isLate = $arrivalToday->diffInMinutes($now, false)>5 && $nbrScan == 0;
            if( $isLate ){
                $formfields['enRetard']=true;
            }
            // for retard
            
            $formfields['employee_id'] = $employee->id;
            $formfields['created_at'] = $now;
            $formfields['updated_at'] = $now;
            $cur_scan = Scan::create($formfields);
            $user->load('employee');
            $user->scan = $cur_scan;

            if( $isLate ){
                // absentInMonth() function calculates the number of days the employee was delayed.
                $this->retardInMonth($employee);
            }
            return response()->json([
                'message' => 'created scan successfully',
                'user' => $user,
                'scanNumbre' => $nbrScan + 1,
                'scan'=>$cur_scan
            ]);
        } else {
            return response()->json([
                'message' => 'this employee not exists'
            ]);
        }
    }

    public function timeOff(Request $request, $id)
    {
        try {
            Carbon::setLocale('fr');

            $startDate = Carbon::parse($request->input('startDate'));
            $endDate   = Carbon::parse($request->input('endDate'));
            $employee = Employee::where('user_id', $id)->first();
            
            $existScan = Scan::where("employee_id", $employee->id)
            ->whereBetween('created_at', [$startDate, $endDate])->get();
            if(count($existScan)>0){
                return response()->json([
                    'message'=>"create time off rejected"
                ]);
            }
            
            $dayNumber = $startDate->diffInDays($endDate) ;
            $scansList = [];
            for ($i = 0; $i <= $dayNumber; $i++) {
                $date = $startDate->copy()->addDays($i);
                if($date->translatedFormat("l") != 'dimanche'){
                    for($j = 0; $j < 4; $j++){
                        array_push($scansList, [
                            'employee_id' => $employee->id,
                            'created_at'  => $date->format('Y-m-d'),
                            'updated_at'  => $date->format('Y-m-d'),
                            'state'       => $request->input('type'),
                        ]);
                    }
                }
            }
            Scan::insert($scansList);
            return response()->json([
                'message'=>"create time off successful"
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ]);
        }
    }

    // this function for knows when employee absent if he was absent three days or more or not
    // if he was absent three consecutive days for send email to him
    public function sendAbsenceAlerts(){
        $now = Carbon::now();
        $startDate = $now->copy()->subDays(2)->startOfDay();
        $endDate = $now->endOfDay();

        $absents = Scan::selectRaw('employee_id, count(employee_id) as total_absents')
        ->where('state','absent')
        ->whereBetween('created_at',[$startDate, $endDate])
        ->groupBy('employee_id')
        ->having('total_absents', '>=', 3)
        ->get();


        foreach($absents as $absent){
            $employee = Employee::find($absent->employee_id)->load('user');
            $mailer = new EmployeeAbsentMail($employee);
            Mail::to($employee->user->email)->send($mailer);
        }

    }



    public function checkAbsent(){
        try{
            $now = Carbon::now();
            $absentEmployees = Employee::whereHas('scans', function(Builder $query ){
                $query->whereDate('created_at', Carbon::today() );
            }, 0)->get(); 
    
            $scans = [];
            $absentsEmployees = [];
            foreach($absentEmployees as $absentEmployee){
                $user = User::find($absentEmployee->user_id);
                $user->load('employee');
                $user->employee->load('position');
                $absentsEmployees[]=$user;
                for($i=0; $i<4; $i++){
                    $scans[]=[
                        'employee_id'=>$absentEmployee->id,
                        'created_at'=> $now,
                        'updated_at'=> $now,
                        'state'=> 'absent'
                    ];
                }
            }
            if(!empty($scans)){
                Scan::insert($scans);
                $this->sendAbsenceAlerts();
            }
            return response()->json([
                'message'=>'absent registry successfully',
                'absentsEmployees'=>$absentsEmployees
            ]);
        } catch(Exception $e){
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);
        }

    }


    public function holidays(Request $request){
        try{
            $startDate = Carbon::parse($request->input('startDate'));
            $endDate = Carbon::parse($request->input('endDate'));
            $empNotSelected = $request->input('employees');
            $employees = Employee::whereNotIn('id', $empNotSelected)->get();
            $nbrDays = $startDate->diffInDays($endDate)+1;
            
            $scans = [];
            for($i=0; $i<$nbrDays; $i++){
                foreach( $employees as $employee ){
                    //  this for create 4 for any day belongs to holidays interval for all employess
                    for($j = 0; $j < 4; $j++){
                        $scans[]=[
                            'employee_id'=>$employee->id,
                            'state'=>'holidays',
                            'created_at'=> $startDate->copy()->addDays($i),
                            'updated_at'=> $startDate->copy()->addDays($i)
                        ];
                    }
                }
            }
            // return $scans;
            Scan::insert($scans);
            return response()->json([
                'message'=>'ok'
            ]);
        } catch(Exception $e){
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exist error'
            ]);  
        }
    }


}
