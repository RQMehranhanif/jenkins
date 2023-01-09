<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Questionaires;

class CcmMonthlyAssessment extends Model
{
    use HasFactory,SoftDeletes;
    protected $casts = ['monthly_assessment','array'];

    protected $fillable = ['questionnaire_id', 'serial_no', 'patient_id', 'program_id', 'monthly_assessment'];
}
