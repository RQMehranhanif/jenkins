<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Patients;

class Insurances extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = ['name','short_name','created_user'];
}
