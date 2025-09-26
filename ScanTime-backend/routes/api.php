<?php

use App\Http\Controllers\API\AppController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DirectorAuthController;
use App\Http\Controllers\API\EmployeeAuthController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\ExceptionalTimeController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\PositionController;
use App\Http\Controllers\API\ScanController;
use App\Http\Middleware\isDirector;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// autu routes
Route::controller(AuthController::class)->group(function(){
    Route::post('/login', [AuthController::class,'login']);
    Route::post('/registry', [AuthController::class,'registry']);
    Route::post('/verify_account', [AuthController::class,'verify_account']);
});
Route::middleware('auth:sanctum')->controller(AuthController::class)
->group(function(){
    Route::get('/logout', 'logout');
    Route::get('/loggedUser', 'loggedUser');
});
// autu routes

// app routes
Route::middleware('auth:sanctum')->controller(AppController::class)
->group(function(){
    Route::get('/employees', 'index')->middleware('isDirector');
    Route::get('/employees/{id}', 'show')->middleware('isDirector');
    Route::put('/update/{id}', 'update')->middleware("forUpdate");
    Route::delete('/employees/{id}', 'destroy')->middleware('isDirector');
});
// app routes

// scan route
Route::middleware(['auth:sanctum', 'isDirector'])->controller(ScanController::class)
->group(function(){
    Route::post('/scans', 'store');
    Route::post('/timeOff/{id}', 'timeOff');
    Route::get('/checkAbsent', 'checkAbsent');
    Route::post('/holidays', 'holidays');
});
// scan route

// notification route
Route::middleware(['auth:sanctum', 'isDirector'])->controller(NotificationController::class)
->group(function(){
    Route::get('/readNotification/{id}', 'read');
});
// notification route

// postion route
Route::middleware(['auth:sanctum','isDirector'])->controller(PositionController::class)
// Route::controller(PositionController::class)
->group(function(){
    Route::get('/positions', 'index');
    Route::post('/positions', 'store');
    Route::put('/positions/{id}', 'update');
    Route::delete('/positions/{id}', 'destroy');
});
// postion route


// exceptional time route
// middleware(['auth:sanctum', 'isDirector'])->
Route::middleware(['auth:sanctum', 'isDirector'])->controller(ExceptionalTimeController::class)->group(function(){
    Route::get('/exceptionalTime', 'index');
    Route::get('/exceptionalTime/{id}', 'show');
    Route::post('/exceptionalTime', 'store');
    Route::put('/exceptionalTime/{id}', 'update');
    Route::delete('/exceptionalTime/{id}', 'destroy');
});

// exceptional time route

