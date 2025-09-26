<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExceptionalTime extends Model
{
    use HasFactory;

    protected $table = "exceptional_times";

    protected $fillable = [
        'employee_id',
        'arrivalTime',
        'dayName'
    ];
}
