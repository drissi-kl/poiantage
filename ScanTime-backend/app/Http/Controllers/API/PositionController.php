<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Exception;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $positions = Position::all();
            return response()->json([
                'message' => 'all position',
                'position' => $positions
            ]);
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
                'message'=>'exists error'
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            $formfield=$request->validate([
                'name'=>'required|string',
                'salaryHour'=>'required|numeric',
                'arrivalTime'=>'required|date_format:H:i'
            ]);

            $existing = Position::where('name', $formfield['name'])->first();
            if($existing){
                return response()->json([
                    'message'=>'this name already used from before'
                ]);
            }
            
            Position::create($formfield);
            $positions = Position::all();
            return response()->json([
                'message' => 'create position successfully',
                'position' => $positions
            ]);

        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
                'message'=>'exists error'
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $formfield = $request->validate([
                'name'=>'required|string',
                'salaryHour'=>'required|numeric',
                'arrivalTime'=>'required'
            ]);

            $position = Position::find($id);
            if($position){
                $position->fill($formfield);
                $position->save();
                return response()->json([
                    'message' => 'updated position successfully',
                ]);                
            }
            return response()->json([
                'message' => 'this position not exists',
            ]);
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
                'message'=>'exists error'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $position = Position::find($id);
            if($position){
                $position->delete();
                return response()->json([
                    'message' => 'deleted position successfully',
                ]);                
            }
            return response()->json([
                'message' => 'this position not exists',
            ]);
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage(),
                'message'=>'exists error'
            ]);
        }
    }
}
