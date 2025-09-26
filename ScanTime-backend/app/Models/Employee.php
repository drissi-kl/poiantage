<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    public $table='employees';

    public $fillable=[
        "user_id",
        "QRcode",
        "salaryHour",
        "position_id"
    ];

    public function scans(){
        return $this->hasMany(Scan::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function position(){
        return $this->belongsTo(Position::class);
    }

}
