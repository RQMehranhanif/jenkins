<?php



namespace App\Models;



use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\User;
use App\Models\Insurances;
use App\Models\Questionaires;
use App\Models\SurgicalHistory;
use App\Models\Diagnosis;
use App\Models\Medications;





class Patients extends Model

{

   use HasFactory,SoftDeletes;

   protected $appends = ['name'];

   protected $fillable = ['identity','last_name','first_name','mid_name','doctor_id','insurance_id','contact_no','cell','dob','age','gender','address','address_2','city','state','zipCode','email','dod','family_history','disease','created_user','change_doctor_id','change_address','clinic_id'];


   public function getNameAttribute()
   {
      return $this->first_name. ' ' .$this->mid_name.' '.$this->last_name;
   }

   public function doctor()
   {
      return $this->belongsTo(User::class,'doctor_id','id');   
   }

   public function diagnosis()
   {
      return $this->hasmany(Diagnosis::class,'patient_id','id');   
   }

   public function medication()
   {
      return $this->hasmany(Medications::class,'patient_id','id');   
   }

   public function surgical_history()
   {
      return $this->hasmany(SurgicalHistory::class,'patient_id','id',);   
   }

   public function insurance()
   {
      return $this->belongsTo(Insurances::class,'insurance_id','id');   
   }

   public function questionServey(){

      return $this->belongsTo(Questionaires::class,'question_id','id');   

   }

   /*  public function surgicalHistoryData(){

      return $this->belongsTo(Questionaires::class,'patient_id','id');   

   } */

   

}

