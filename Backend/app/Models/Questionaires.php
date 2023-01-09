<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Patients;
use App\Models\Clinic;
use App\Models\Programs;
use App\Models\User;
use App\Models\SuperBillCodes;
use App\Models\CcmMonthlyAssessment;
use App\Models\Insurances;

class Questionaires extends Model
{
    use HasFactory,SoftDeletes;
    protected $casts = ['questions_answers','array'];
    protected $fillable = ['patient_id', 'program_id', 'clinic_id', 'insurance_id', 'serial_no', 'questions_answers', 'date_of_service', 'created_user', 'doctor_id','status_id','status'];

    public function patient()
    {
        return $this->belongsTo(Patients::class,'patient_id');
    }

    public function program()
    {
        return $this->belongsTo(Programs::class,'program_id');   
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class,'clinic_id');   
    }

    public function user()
    {
        return $this->belongsTo(User::class,'doctor_id');   
    }

    public function superBill()
    {
        return $this->belongsTo(SuperBillCodes::class,'id','question_id');
    }

    public function monthlyAssessment()
    {
        return $this->hasOne(CcmMonthlyAssessment::class,'questionnaire_id','id')->latest();
    }
}

