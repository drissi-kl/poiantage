<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function read(Request $request, $id){
        try{
            $notification = Notification::find($id);
            $notification->read_at = Carbon::now();
            $notification->save();
            return response()->json([
                'message'=>'read notification successfully'
            ]);
        } catch ( Exception $e){
            return response()->json([
                'message'=>$e->getMessage(),
                'error'=>'exists error'
            ]);
        }
    }
}
