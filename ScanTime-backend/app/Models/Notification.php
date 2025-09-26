<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory, SoftDeletes;

    protected $table="notifications";
    protected $fillable = ['employee_id', 'director_id', 'title', 'content', 'read_at'];

    public function director(){
        return $this->belongsTo(User::class, 'director_id');
    }

    public function employee(){
        return $this->belongsTo(User::class, 'employee_id');
    }
}
