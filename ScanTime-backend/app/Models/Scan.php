<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Scan extends Model
{
    use HasFactory, SoftDeletes;

    public $table='scans';

    public $fillable=[
        'employee_id',
        'state',
        'created_at',
        'updated_at',
        'enRetard'
    ];

    public $timestamps = false;

    public function employees(){
        return $this->belongsTo(Employee::class);
    }

}