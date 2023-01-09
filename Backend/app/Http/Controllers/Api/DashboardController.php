<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserCollection;
use App\Models\Questionaires;
use App\Models\Patients;
use App\Models\User;
use App\Models\Programs;
use App\Models\Clinic;
use App\Models\Insurances;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Auth,Validator,Hash,DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /*
    onlick call function + passing variable


    questionaire?
        awv_pending_population=1
        awv_completed_total=1
        awv_pending_A12=1
        awv_completed_A12=1
        awv_completed_total=1
        activeUsers=1

        group_c=1
        group_A1=1
        group_A2=1



    Patients?
        group_b=1
        totalPopulation=1


    Schedule?
        total_refused=1
        total_scheduled=1
        total_scheduled_A2=1
        total_scheduled_A1=1


    */
    public function index(Request $request)
    {   //$note['role'] = @$roles[$note['role']];
        $per_page = Config('constants.perpage_showdata');


        try {
            $doctor_id = $request->get('doctor_id') ?? '';
            $insurance_id = $request->get('insurance_id') ?? '';
            $clinic_id = $request->get('clinic_id') ?? '';
            $program_id = $request->get('program_id') ?? '';




/* menu bar Api */



            $doctor_data = User::select('id','first_name','mid_name','Last_name')->where('role',21)->get()->toArray();
            $insurance_data = Insurances::select('id','name','short_name')->get()->toArray();
            $program_data = Programs::select('id','name','short_name')->get()->toArray();
            $clinic_data = Clinic::select('id','name','short_name')->get()->toArray();



/* menu bar Api */
            $from = Carbon::now()->subMonths(6);
            $to = Carbon::now()->subMonths(12);



        //$total['totalPopulation'] = Patients::withTrashed();
	    $total['totalPopulation'] = Patients::where('deleted_at', '=', Null);
        //$total['totalPopulation'] = Questionaires::get();

            if(!empty($doctor_id)){
                $total['totalPopulation']->where('doctor_id',$doctor_id);
            }
            if(!empty($insurance_id)){
                $total['totalPopulation']->where('insurance_id',$insurance_id);
            }
            if(!empty($clinic_id)){
                $total['totalPopulation']->where('clinic_id',$clinic_id);
            }

            $total['totalPopulation'] = $total['totalPopulation']->count();


            //$total['awv_completed'] = Questionaires::get()->count();



            $group_A1 = Questionaires::where("created_at",">", $from);

            if(!empty($doctor_id)){
                $group_A1->where('doctor_id',$doctor_id);
            }
            if(!empty($program_id)){
                $group_A1->where('program_id',$program_id);
            }
            if(!empty($clinic_id)){
                $group_A1->where('clinic_id',$clinic_id);
            }
         if(!empty($insurance_id)){
                $group_A1->where('insurance_id',$insurance_id);
            }

            $group_A1 = $group_A1->get()->toArray();
            $total['group_a1'] = count($group_A1);





            $group_A2 = Questionaires::whereBetween('created_at', [$to, $from]);
            if(!empty($doctor_id)){
                $group_A2->where('doctor_id',$doctor_id);
            }
            if(!empty($program_id)){
                $group_A2->where('program_id',$program_id);
            }
            if(!empty($clinic_id)){
                $group_A2->where('clinic_id',$clinic_id);
            }
	       if(!empty($insurance_id)){
                $group_A2->where('insurance_id',$insurance_id);
            }

            $group_A2 = $group_A2->get()->toArray();
            $total['group_a2'] = count($group_A2);


            $total['activeUsers'] = $total['group_a1'] + $total['group_a2'];




            $total['group_b'] = Patients::whereColumn('address','!=','change_address')->orWhereColumn('doctor_id','!=','change_doctor_id')->orWhereNotNull('dod');//->get()->count();
            if(!empty($doctor_id)){
                $total['group_b']->where('doctor_id',$doctor_id);
            }
            if(!empty($insurance_id)){
                $total['group_b']->where('insurance_id',$insurance_id);
            }
            if(!empty($clinic_id)){
                $total['group_b']->where('clinic_id',$clinic_id);
            }
            $total['group_b'] = $total['group_b']->get()->count();







            $total['group_c']=Questionaires::where("created_at","<", $to);
            if(!empty($doctor_id)){
                $total['group_c']->where('doctor_id',$doctor_id);
            }
            if(!empty($program_id)){
                $total['group_c']->where('program_id',$program_id);
            }
            if(!empty($clinic_id)){
                $total['group_c']->where('clinic_id',$clinic_id);
            }

            $total['group_c'] = $total['group_c']->get()->count();






            $total['awv_completed_total'] = Questionaires::where(['status' => 'Pre-screening completed']);
            if(!empty($doctor_id)){
                $total['awv_completed_total']->where('doctor_id',$doctor_id);
            }
            if(!empty($program_id)){
                $total['awv_completed_total']->where('program_id',$program_id);
            }
            if(!empty($clinic_id)){
                $total['awv_completed_total']->where('clinic_id',$clinic_id);
            }

            $total['awv_completed_total'] =$total['awv_completed_total']->count();



            if($total['awv_completed_total'] != 0 && $total['totalPopulation'] != 0 ) 
            {
                $total['awv_completed_population_per'] = $total['awv_completed_total']/$total['totalPopulation']*100;
            }else{
                $total['awv_completed_population_per'] = 0;
            }

            //completed AWV

            $group_A1_completed = array_filter($group_A1,function($item){
                return $item['status'] != "Pre-screening pending";
            });
            $count_A1_completed = count( $group_A1_completed); 




            $group_A2_completed = array_filter($group_A2,function($item){
                return $item['status'] != "Pre-screening pending";
            });
            $count_A2_completed = count( $group_A2_completed);
            $total['awv_completed_A12'] =  $count_A1_completed + $count_A2_completed ;


            if($total['awv_completed_A12'] != 0 && $total['activeUsers'] != 0) 
            {
                $total['awv_completed_A12_per'] = $total['awv_completed_A12']/$total['activeUsers']*100;
            }else{
                $total['awv_completed_A12_per'] = 0;
            }




            // incompleted AWV 
            $group_A1_pending = array_filter($group_A1,function($item){
                return $item['status'] != "Pre-screening completed";
            });
            $count_A1_pending = count( $group_A1_pending); 


            $group_A2_pending = array_filter($group_A2,function($item){
                return $item['status'] != "Pre-screening completed";
            });
            $count_A2_pending = count( $group_A2_pending);


            $total['awv_pending_A12'] =  $count_A1_pending + $count_A2_pending ;


            if($total['awv_pending_A12'] != 0 && $total['activeUsers'] != 0 ) 
            {
                $total['awv_pending_A12_per'] = $total['awv_pending_A12']/$total['activeUsers']*100;
            }else{
                 $total['awv_pending_A12_per'] = 0;
            }



            $total['awv_pending_population'] = Questionaires::where(['status' => 'Pre-screening pending']);
            if(!empty($doctor_id)){
                $total['awv_pending_population']->where('doctor_id',$doctor_id);
            }
            if(!empty($program_id)){
                $total['awv_pending_population']->where('program_id',$program_id);
            }
            if(!empty($clinic_id)){
                $total['awv_pending_population']->where('clinic_id',$clinic_id);
            }

            $total['awv_pending_population'] = $total['awv_pending_population']->count();

//return response()->json($total['totalPopulation']);



            if($total['awv_pending_population'] != 0 && $total['totalPopulation'] != 0) 
            {
                $total['awv_pending_population_per'] = 100-$total['awv_completed_population_per'];//$total['awv_pending_population']/$total['totalPopulation']*100;
            }else{
                $total['awv_pending_population_per'] = 0 ;
            }


            $total_scheduled_A1 = Schedule::where("last_visit",">", $from);
            if(!empty($doctor_id)){
                $total_scheduled_A1->where('doctor_id',$doctor_id);
            }
            if(!empty($program_id)){
                $total_scheduled_A1->where('program_id',$program_id);
            }
            if(!empty($clinic_id)){
                $total_scheduled_A1->where('clinic_id',$clinic_id);
            }
            if(!empty($insurance_id)){
                $total_scheduled_A1->where('insurance_id',$insurance_id);
            }
            $total_scheduled_A1 =$total_scheduled_A1->get()->toArray();



            $total_scheduled_A2 =Schedule::whereBetween('last_visit', [$to, $from]);//->get();
            if(!empty($doctor_id)){
                $total_scheduled_A2->where('doctor_id',$doctor_id);
            }
            if(!empty($program_id)){
                $total_scheduled_A2->where('program_id',$program_id);
            }
            if(!empty($clinic_id)){
                $total_scheduled_A2->where('clinic_id',$clinic_id);
            }
            if(!empty($insurance_id)){
                $total_scheduled_A2->where('insurance_id',$insurance_id);
            }
            $total_scheduled_A2 =$total_scheduled_A2->get()->toArray();
            $total['total_scheduled_A12'] = count($total_scheduled_A1) + count($total_scheduled_A2);






            $total['total_scheduled'] = Schedule::all();//->count();
            if(!empty($doctor_id)){
                $total['total_scheduled']->where('doctor_id',$doctor_id);
            }
            if(!empty($program_id)){
                $total['total_scheduled']->where('program_id',$program_id);
            }
            if(!empty($clinic_id)){
                $total['total_scheduled']->where('clinic_id',$clinic_id);
            }
            if(!empty($insurance_id)){
                $total['total_scheduled']->where('insurance_id',$insurance_id);
            }
            $total['total_scheduled'] = $total['total_scheduled']->count();





            //$total['total_refused'] = Questionaires::where("created_at",">", $to)->get()->count();
            //$total['total_refused'] = Questionaires::where("created_at","<", $to)->onlyTrashed();
            //$total['total_refused'] = Questionaires::where("status", "");

            $total['total_refused'] = Schedule::onlyTrashed();
            if(!empty($doctor_id)){
                $total['total_refused']->where('doctor_id',$doctor_id);
            }
            if(!empty($program_id)){
                $total['total_refused']->where('program_id',$program_id);
            }
            if(!empty($clinic_id)){
                $total['total_refused']->where('clinic_id',$clinic_id);
            }
            $total['total_refused'] =$total['total_refused']->count();





            //last_visit
            if (empty($total))
            {
                $total = 0;
               $response = [
                'success' => true,
                'message' => 'Sorry Dashboard Data Not Found',
                'data' => $total,
                'doctor_data' => $doctor_data,
                'insurance_data' => $insurance_data,
                'program_data' => $program_data,
                'clinic_data' => $clinic_data
                ];
            }

            $response = [
                'success' => true,
                'message' => 'Dashboard Data Found Successfully',
		        'perpage_showdata' =>$per_page,
                'data' => $total,
                'doctor_data' => $doctor_data,
                'insurance_data' => $insurance_data,
                'program_data' => $program_data,
                'clinic_data' => $clinic_data
            ];
        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage()); 
        }
        return response()->json($response);
    }
}