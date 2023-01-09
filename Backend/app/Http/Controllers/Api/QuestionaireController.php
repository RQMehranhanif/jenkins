<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\CareplanController;
use Illuminate\Http\Request;
use App\Models\Questionaires;
use App\Models\Patients;
use App\Models\Doctors;
use App\Models\Diagnosis;
use App\Models\Programs;
use App\Models\User;
use App\Models\SuperBillCodes;
use App\Models\CcmMonthlyAssessment;
use Validator,Config,Auth;
use Carbon\Carbon;

class QuestionaireController extends Controller
{
    protected $singular = "Questionaire Survey";
    protected $plural = "Questionaire Surveys";
    protected $action = "/dashboard/questionaires-survey";
    protected $view = "questionaries.";
    protected $per_page = '';
	
    public function __construct(){
	    $this->per_page = Config('constants.perpage_showdata');
	}


    public function index(Request $request)
    {
        try {
            $from = Carbon::now()->subMonths(6);
            $to = Carbon::now()->subMonths(12);

            $data = [
                'singular' => $this->singular,
                'page_title' => $this->plural.' List',
                'action'   => $this->action
            ];

            $doctor_id = $request->input("doctor_id") ?? '';
            $patient_id = $request->input("patient_id") ?? '';
            $clinic_id = $request->input("clinic_id") ?? '';
            $insurance_id = $request->input("insurance_id") ?? '';

            $activeUsers = $request->input("activeUsers") ?? '';
            $awv_completed_total = $request->input("awv_completed_total") ?? '';
            $awv_completed_A12 = $request->input("awv_completed_A12") ?? '';
            $awv_pending_A12 = $request->input("awv_pending_A12") ?? '';
            $awv_pending_population = $request->input("awv_pending_population") ?? '';
            $group_a1 = $request->input("group_A1") ?? '';
            $group_a2 = $request->input("group_A2") ?? '';
            $group_c = $request->input("group_c") ?? '';
            
            $query = Questionaires::with('patient.insurance','patient.diagnosis','user','program:id,name,short_name')->orderBy('id','desc');
            
            if (!empty($group_c)) {
                $group_c = $query->where("created_at","<", $to);
            }

            if (!empty($group_a2)) 
            {
                //$query = $query->where(['status' => 'Pre-screening completed']);
                $query = $query->whereBetween('created_at', [$to, $from]);
            }

            if (!empty($group_a1)) {
                //$query = $query->where(['status' => 'Pre-screening completed']);
                $query = $query->where("created_at",">", $from);
            }

            if (!empty($activeUsers)) {
                //$query = $query->where(['status' => 'Pre-screening completed']);
                $query = $query->where("created_at",">", $to);
            }

            if (!empty($awv_completed_total)) {
                $query = $query->where(['status' => 'Pre-screening completed']);
            }

            if (!empty($awv_pending_population)) {
                $query = $query->where(['status' => 'Pre-screening pending']);
            }

            if (!empty($awv_completed_A12)) {
                $query = $query->where("status","Pre-screening completed")->where("created_at",">", $to);
            }

            if (!empty($awv_pending_A12)) {
                $query = $query->where("status","!=","Pre-screening completed")->where("created_at",">", $to);
            }
            
            if(!empty($doctor_id)){
                $query->where('doctor_id',$doctor_id);
            }

            if(!empty($insurance_id)){
                $query->where('insurance_id',$insurance_id);
            }

            if(!empty($clinic_id)){
                $query->where('clinic_id',$clinic_id);
            }

            if(!empty($patient_id)){
                $query->where('patient_id',$patient_id);
            }

            // return response()->json($query->get()->toArray());
            if ($request->has('search') && !empty($request->input('search'))) {
                $search = $request->get('search');
                // $query = $query->where('first_name', 'like', '%' . $search . '%');

                $query = $query->whereHas('patient', function($q) use ($search) {
                    $q->where('first_name', 'like', '%' . $search . '%')
                    ->orWhere('last_name', 'like', '%' . $search . '%');
                });
            }

            $query = $query->paginate($this->per_page);
            $total = $query->total();
            $current_page = $query->currentPage();
            $query = $query->toArray();


            $list = [];

            if(!empty($query['data'])){
                foreach ($query['data'] as $key => $value) {
                    /* Chronic Diseases Array */
                    $patient_diseases = [
                        "Depression" => "false",
                        "CongestiveHeartFailure" => "false",
                        "ChronicObstructivePulmonaryDisease" => "false",
                        "CKD" => "false",
                        "DiabetesMellitus" => "false",
                        "Hypertensions" => "false",
                        "Obesity" => "false",
                        "Hypercholesterolemia" => "false",
                        "anemia" => "false",
                        "hyperthyrodism" => "false",
                        "asthma" => "false",
                    ];

                    $chronic_diseases = Config::get('constants')['chronic_diseases'];

                    /* Patient diagnosis for ccm */
                    $patientDiagnosis = $value['patient']['diagnosis'] ?? [];
                    if (!empty($patientDiagnosis)) {
                        foreach ($patientDiagnosis as $key1 => $value1) {
                            $condition_id = strtoupper(explode(' ', $value1['condition'])[0]);
                            $disease_status = $value1['status'];
        
                            $data = array_filter($chronic_diseases, function ($item) use ($condition_id, $disease_status) {
                                if ($disease_status == 'ACTIVE' || $disease_status == 'active') {
                                    return in_array($condition_id, $item);
                                }
                            });
                            
                            if ($data) {
                                $disease_name = array_keys($data)[0];
                                $patient_diseases[$disease_name] = "true";
                            }
                        }
                    }

                    $list[] = [
                        'id' => $value['id'],
                        'serial_no' => $value['serial_no'],
                        'patient_id' => $value['patient_id'],
                        'patient_name' => $value['patient']['name'],
                        'patient_age' => $value['patient']['age'],
                        'patient_gender' => $value['patient']['gender'],
                        'program_id' => $value['program_id'],
                        'program_name' => $value['program']['short_name'],
                        'dob' => date('m/d/Y',strtotime($value['patient']['dob'])) ?? '',
                        'contact_no' => $value['patient']['contact_no'] ?? '',
                        'date_of_service' => date('m/d/Y',strtotime($value['date_of_service'])) ?? '',
                        'insurance_name' => $value['patient']['insurance']['name'] ?? "",
                        'status' => $value['status'],
                        'diagnosis' => (object)$patient_diseases ?? [],
                    ];
                }
            }

            $response = [
                'success' => true,
                'message' => 'Questionaire Data Retrived Successfully',
                'current_page' => $current_page,
                'total_records' => $total,
                'per_page'   => $this->per_page,
                'data' => $list
            ];

        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());
        }

        return response()->json($response);
    }





    /* Store Questionnaire in database */

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(),
                [
                'patient_id' => 'required',
                'program_id'  => 'required',
                'date_of_service' => 'required'
                ],

                [
                    'patient_id.required' => 'Please Select a Patient.',
                    'program_id.required' => 'Please Select a Program.',
                    'date_of_service.required' => 'Please Select Date of service.'
                ]
            );

            if($validator->fails()) {
                $error = $validator->getMessageBag()->first();
                return response()->json(['success'=>false,'errors'=>$error]);
            };

            $input = $request->all();
            $question = [];
            $not_needed = ['patient_id', 'program_id', 'date_of_service', 'monthly_assessment'];

            foreach ($input as $key => $value) {
                if (!in_array($key, $not_needed)) {
                    $question[$key] = $input[$key] ?? [];
                }
            }

            $data = [
                'questions_answers' => json_encode($question),
                'date_of_service' => Carbon::parse($input['date_of_service'])->toDateString(),
            ];

            $program = Programs::find($input['program_id'])->toArray();

            $lastProgramEntry = Questionaires::where('program_id',$input['program_id'])->orderBy('id','desc')->first();

            if(!empty($lastProgramEntry)){

                $number = explode('-', $lastProgramEntry['serial_no'])[1];

                $newNumber = (int)$number+1;

                $serialNo = $program['short_name'].'-'.$newNumber;

            }else{
                $serialNo = $program['short_name'].'-1001';
            }

            /*rizwan start*/

            $patient_data = patients::where('id',$input['patient_id'])->orderBy('id','Desc')->first();

            $clinic_info = $patient_data->clinic_id;
            $insurance_info = $patient_data->insurance_id;

            /*rizwan end*/

            $row = [

                'program_id' => $input['program_id'],
                'patient_id' => $input['patient_id'],

                /*rizwan start*/
                'clinic_id' => $clinic_info,
                'insurance_id' => $insurance_info,
                /*rizwan end*/

                'serial_no' => $serialNo,
                'date_of_service' => Carbon::parse($input['date_of_service']),
                'questions_answers' => json_encode($question),
                'created_user' => 1,
            ];

            $record = Questionaires::create($row);
            $this->saveCodes($record['id'], $question, $input['patient_id']);

            $monthly_response = "";
            if ($input['program_id'] == "2") {
                // STORE MONTHLY ASSESSMENT
                $monthly_response = $this->storeMonthlyAssessment($serialNo, $record['id'], $input['patient_id'], $input['program_id'],$input);
            }

            $response = array('success'=>true,'message'=>$this->singular.' Added Successfully', 'questionnaire_id'=> $record['id'], 'monthly_assessment'=>$monthly_response);

        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());
        }

        return response()->json($response);

    }



    /* Fetch Questionnaire to edit */
    public function edit(Request $request, $id)
    {
        try {
            $row = Questionaires::with('patient', 'monthlyAssessment')->find($id)->toArray();

            $questions_answers = json_decode($row['questions_answers'], true);

            $path = $row['program_id'] === 1 ? 'awv' : 'ccm';
            
            $patient_diseases = [
                "Depression" => "false",
                "CongestiveHeartFailure" => "false",
                "ChronicObstructivePulmonaryDisease" => "false",
                "CKD" => "false",
                "DiabetesMellitus" => "false",
                "Hypertensions" => "false",
                "Obesity" => "false",
                "Hypercholesterolemia" => "false",
                "anemia" => "false",
                "hyperthyrodism" => "false",
                "asthma" => "false",
            ];

            if ($row['program_id'] == 2) {

                $patientDiagnosis = Diagnosis::where('patient_id', $row['patient_id'])->get()->toArray();
                $chronic_diseases = Config::get('constants')['chronic_diseases'];
                $arrayofChronic = [];
                
                foreach ($patientDiagnosis as $key => $value) {
                    $condition_id = strtoupper(explode(' ', $value['condition'])[0]);
                    $disease_status = $value['status'];

                    $data = array_filter($chronic_diseases, function ($item) use ($condition_id, $disease_status) {
                        if ($disease_status == 'ACTIVE' || $disease_status == 'active') {
                            return in_array($condition_id, $item);
                        }
                    });
                    
                    if ($data) {
                        $disease_name = array_keys($data)[0];
                        $patient_diseases[$disease_name] = "true";
                        
                        if (!in_array($disease_name, $arrayofChronic)) {
                            $arrayofChronic[] = $disease_name;
                        }
                    }
                }
    

                $lastMonthlyAssessment = $row['monthly_assessment'] ? json_decode($row['monthly_assessment']['monthly_assessment'], true) : [];
                $questions_answers['monthly_assessment'] = $lastMonthlyAssessment;
            }

            $data = [
                'row' => $row,
                'path' => $path,
                'list' => $questions_answers,
                'diagnosis' => (object)$patient_diseases
            ];

            $response = array('success'=>true, 'data'=>$data);

        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());
        }

        return response()->json($response);
    }


    /* Update Existing Questionnaire */
    public function update(Request $request, $id)
    {
        try {
            /* Validation */
            $validator = Validator::make($request->all(),
                [
                    'patient_id' => 'required',
                    'program_id'  => 'required',
                    'date_of_service' => 'required'
                ],
                [
                    'patient_id.required' => 'Please Select a Patient.',
                    'program_id.required' => 'Please Select a Program.',
                    'date_of_service.required' => 'Please Select Date of service.'
                ]
            );

            if($validator->fails()) {
                $error = $validator->getMessageBag()->first();
                return response()->json(['success'=>false,'errors'=>$error]);
            };

            $input = $request->all();
            
            $question = [];
            $not_needed = ['patient_id', 'program_id', 'date_of_service'];
            $questionnaireData = Questionaires::where(['id'=>$id, 'patient_id'=>$input['patient_id'], 'program_id'=>$input['program_id']])->first();
            $questionnaire = json_decode($questionnaireData['questions_answers'], true);
    
            foreach ($input as $key => $value) {
                if (!in_array($key, $not_needed)) {
                    $questionnaire[$key] = $input[$key] ?? [];
                }
            }

            $data = [
                'date_of_service' => Carbon::parse($input['date_of_service'])->toDateString() ?? '',
                'questions_answers' => json_encode($questionnaire)
            ];
            
            Questionaires::where('id', $id)->update($data);

            if ($input['program_id'] == "2" && !empty($input['monthly_assessment'])) {
                $monthlyAssesment = CcmMonthlyAssessment::where('questionnaire_id', $id)->latest('id')->first();
                
                if ($monthlyAssesment) {
                    $currentMonth = Carbon::now()->format('m');
                    $lastAssessmentMonth = Carbon::parse($monthlyAssesment->created_at)->format('m');

                    if ($lastAssessmentMonth == $currentMonth) {
                        $updateColumn = [
                            'monthly_assessment' => json_encode($input['monthly_assessment'])
                        ];
                        CcmMonthlyAssessment::where('id', $monthlyAssesment->id)->update($updateColumn);
                    } else {
                        $insertData = [
                            'questionnaire_id' => $monthlyAssesment->questionnaire_id,
                            'serial_no' => $monthlyAssesment->serial_no,
                            'patient_id' => $monthlyAssesment->patient_id,
                            'program_id' => $monthlyAssesment->program_id,
                            'monthly_assessment' => json_encode($input['monthly_assessment']),
                        ];
                        CcmMonthlyAssessment::create($insertData);
                    }
                } else {
                    $insertData = [
                        'questionnaire_id' => $id,
                        'serial_no' => $questionnaireData['serial_no'],
                        'patient_id' => $input['patient_id'],
                        'program_id' => $input['program_id'],
                        'monthly_assessment' => json_encode($input['monthly_assessment']),
                    ];
                    CcmMonthlyAssessment::create($insertData);
                }
            }

            $check = $this->saveCodes($id, $questionnaire, $input['patient_id']);

            $response = [
                'success' => true,
                'message' => 'Questionaire Data Updated Successfully',
                'check' => $check,
            ];
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }

        return response()->json($response);
    }


    /* Delete Existing Questionnaire */
    public function destroy(Request $request, $id)
    {

        try {

            $note = Questionaires::find($id);

            $note->delete();

            $response = array('success' => true, 'message' => $this->singular . ' Deleted!');

        } catch (\Exception $e) {

            $response = array('success' => false, 'message' => $e->getMessage());

        }

        return response()->json($response);

    }


    /* Get Program */
    public function getProgramms(Request $request)
    {
        try {
            $input = $request->all();
            $lastAwv = [];
            $lastCcm = [];


            $patient_diseases = [
                "Depression" => "false",
                "CongestiveHeartFailure" => "false",
                "ChronicObstructivePulmonaryDisease" => "false",
                "CKD" => "false",
                "DiabetesMellitus" => "false",
                "Hypertensions" => "false",
                "Obesity" => "false",
                "Hypercholesterolemia" => "false",
                "anemia" => "false",
                "hyperthyrodism" => "false",
                "asthma" => "false",
            ];

            /* FOR CCM */
            if ($input['program_id'] == 2) {

                $alreadyPerformedCCM = Questionaires::where('patient_id', $input['patient_id'])->where('program_id', 2)->select('id')->orderBy('id', 'desc')->first();
                
                $awvData = Questionaires::where('patient_id', $input['patient_id'])->where('program_id', 1)->orderBy('id', 'desc')->first();
                if (!empty($awvData))
                    $awvData->toArray();

                $lastAwv = !empty($awvData) ? json_decode($awvData['questions_answers'], true) : [];

                $patientDiagnosis = Diagnosis::where('patient_id', $input['patient_id'])->get()->toArray();

                $chronic_diseases = Config::get('constants')['chronic_diseases'];
                
                $arrayofChronic = [];
                foreach ($patientDiagnosis as $key => $value) {
                    $condition_id = strtoupper(explode(' ', $value['condition'])[0]);
                    $disease_status = $value['status'];

                    $data = array_filter($chronic_diseases, function ($item) use ($condition_id, $disease_status) {
                        if ($disease_status == 'ACTIVE' || $disease_status == 'active') {
                            return in_array($condition_id, $item);
                        }
                    });

                    if ($data) {
                        $key = array_keys($data)[0];
                        $patient_diseases[$key] = "true";

                        if (!in_array($key, $arrayofChronic)) {
                            $arrayofChronic[] = $key;
                        }
                    }
                }

                if (count($arrayofChronic) < 2) {
                    return response()->json(['success' => false, 'errors' => 'Patient is not eligible for CCM']);
                }
            }

            /* FOR AWV */
            if ($input['program_id'] == 1) {

                /* Get last CCM data if it is performed before AWV to show data of common screen */
                $awvData = Questionaires::where('patient_id', $input['patient_id'])->where('program_id', 2)->orderBy('id', 'desc')->first();
                if (!empty($awvData))
                    $awvData->toArray();

                $lastccm = !empty($awvData) ? json_decode($awvData['questions_answers'], true) : [];

                /* Checking the date of service of last performed AWV to calculate the eligibility criteria */
                $last_awv = Questionaires::where('patient_id', $input['patient_id'])->where('program_id', 1)->select('date_of_service')->orderBy('id', 'desc')->first();
                if ($last_awv) {
                    $last_awv = Carbon::parse($last_awv['date_of_service']);
                    $diffYears = \Carbon\Carbon::now()->diffInYears($last_awv);

                    if ($diffYears <= 1) {
                        return response()->json(['success' => false, 'errors' => 'AWV is already performed for this patient']);
                    }
                }
            }

            $response = [
                'success' => true,
                'awv_data' => $lastAwv,
                'ccm_id' => $alreadyPerformedCCM['id'] ?? '',
                'diagnosis' => (object)$patient_diseases
            ];

            return response()->json($response);
        } catch (\Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
    }
  
    private function saveCodes($questionId, $questions, $patienId='')
    {
        // $questionId = $record['id'];
        // $questions = json_decode($record,true);

        $patientDiagnosis = Diagnosis::where('patient_id', $patienId)->get()->toArray();
        $patientDiagnosis = array_column($patientDiagnosis, 'condition');
        $depressionBipolar = [  
                                "F32.A",
                                "F32.0",
                                "F32.1",
                                "F32.2",
                                "F32.3",
                                "F32.4",
                                "F32.5",
                                "F32.81",
                                "F32.89",
                                "F32.9",
                                "F31.0",
                                "F31.10",
                                "F31.11",
                                "F31.12",
                                "F31.13",
                                "F31.2",
                                "F31.30",
                                "F31.31",
                                "F31.32",
                                "F31.4",
                                "F31.5",
                                "F31.60",
                                "F31.61",
                                "F31.62",
                                "F31.63",
                                "F31.64",
                                "F31.70",
                                "F31.71",
                                "F31.72",
                                "F31.73",
                                "F31.74",
                                "F31.75",
                                "F31.76",
                                "F31.77",
                                "F31.78",
                                "F31.81",
                                "F31.89",
                                "F31.9",
                            ];

        $depressionCodeMatched = array_intersect($patientDiagnosis, $depressionBipolar);

        $codes = [];

        foreach ($questions as $type => $value) {
            $row = $questions[$type];
            switch ($type) {
                case 'fall_screening':
                    if(!empty($patienId)){
                        $patient = Patients::find($patienId)->toArray();
                        $fallInYear = @$row['fall_in_one_year'] ?? '';
                        $noOfFalls = @$row['number_of_falls'] ?? '';
                        $noOfInjuries = @$row['injury'] ?? '';
    
                        $codes[] = [
                            'G0402' => $patient['age'] == 65 ? "true" : "false",
                            'G0438' => $patient['age'] == 66 ? "true" : "false",
                            'G0439' => $patient['age'] >= 67 ? "true" : "false",
                            '1100F' => ($noOfFalls == "More then one" || $noOfInjuries == "Yes")  ? "true" : "false",
                            '1101F' => ($fallInYear == "No" || ($fallInYear == "One" && $noOfInjuries == "One"))  ? "true" : "false",
                            '3288F' => ($noOfFalls == "One" || $noOfFalls == "More then one")  ? "true" : "false",
                        ];
                    }
                    break;


                case 'depression_phq9':
                    $depression_score = array_sum($row);

                    $codes[] = [
                        'G8510' => $depression_score < 9 ? "true" : "false",
                        'G8431' => $depression_score > 9 ? "true" : "false",
                        'G9717' => !empty($depressionCodeMatched) ? "true" : "false",
                    ];
                    break;
    
                case 'immunization':
                    $prevanarRecieved = @$row['pneumococcal_vaccine_recieved'] ?? '';
                    $fluRecieved =      @$row['flu_vaccine_recieved'] ?? '';
                    $prevanarRefused =  @$row['pneumococcal_vaccine_refused'] ?? '';
                    $fluVaccineRecieved = @$row['flu_vaccine_recieved_on'] ?? '';
                    $fluVaccineRefused = @$row['flu_vaccine_refused'] ?? '';
                    
                    $codes[] = [
                        //'4040' => $prevanarRecieved =="yes" && $fluVaccineRecieved !="" ? "true" : "false",
                        '4040' => $fluRecieved =="Yes" && $fluVaccineRecieved !="" ? "true" : "false",
                        'G8482' => $fluRecieved =="Yes" ? "true" : "false",
                        'G8483' => $fluVaccineRefused =="Yes"  ? "true" : "false",
                    ];
                    break;
                
                case 'screening':
                    $mammogramDone = @$row['mammogram_done'] ?? '';
                    $colonoscopyDone = @$row['colonoscopy_done'] ?? '';
                    $colonoscopyReportReviewed = @$row['colonoscopy_report_reviewed'] ?? '';
                    $codes[] = [
                        'G9899' => $mammogramDone =="Yes"  ? "true" : "false",
                        '3017F' => $colonoscopyDone =="Yes" && $colonoscopyReportReviewed =="Yes" ? "true" : "false",
                    ];
                    break;
    
                case 'diabetes':
                    $hba1cValue = @$row['hba1c_value'] ?? '';
                    $diabetecEyeExam = @$row['diabetec_eye_exam'] ?? '';
                    $eyeExamReportReviewed = @$row['eye_exam_report_reviewed'] ?? '';
                    $urineMicroalbuminInhibitor = @$row['urine_microalbumin_inhibitor'] ?? '';
                    $ckdStage4 = @$row['ckd_stage_4'] ?? '';
                    $urineMicroalbuminReport = @$row['urine_microalbumin_report'] ?? '';
                    $codes[] = [
                        '3044F' => $hba1cValue < 7 ? "true" : "false",
                        '3046F' => $hba1cValue > 9 ? "true" : "false",
                        '3051F' => $hba1cValue >= 7 && $hba1cValue < 8 ? "true" : "false",
                        '3052F' => $hba1cValue >= 8 && $hba1cValue <= 9 ? "true" : "false",
                        '2022F' => $eyeExamReportReviewed == 1 ? "true" : "false",
                        'G8506' => $urineMicroalbuminInhibitor == 'ARB' || $urineMicroalbuminInhibitor == 'ACE Inhibitor' ? "true" : "false",
                        '3066F' => $ckdStage4 == 'CKD Stage 4' ? "true" : "false",
                        '3060F' => $urineMicroalbuminReport == 'Positive' ? "true" : "false",
                        '3061F' => $urineMicroalbuminReport == 'Negative' ? "true" : "false",
                    ];
                    break;
    
                case 'cholesterol':
                    $statintypeDosage = @$row['statintype_dosage'] ?? '';
                    $medicalReasonForNostatin1 = @$row['medical_reason_for_nostatin1'] ?? '';
                    $codes[] = [
                        'G9664' => $statintypeDosage!='' ? "true" : "false",
                        'G9781' => $medicalReasonForNostatin1=='yes' ? "true" : "false",
                    ];
                    break;
    
                case 'bp_assessment':
                    $bpValue = @$row['bp_value'] ?? '';
                    $bp_value = explode("/",$bpValue);
                    
                    $codes[] = [
                        'G8752' => (isset($bp_value[0]) && $bp_value[0] <140) ? "true" : "false",
                        'G8754' => (isset($bp_value[1]) && $bp_value[1] <90 )? "true" : "false",
                    ];
                    break;
    
                case 'tobacco_use':
                    $avgPackPerYear = @$row['average_packs_per_year'] ?? '';           
                    $codes[] = [
                        '4004F' => $avgPackPerYear > 1 ? "true" : "false",
                        //else condtion
                        '1036F' => $avgPackPerYear == 0 ? "true" : "false",
                    ];
                    break;

                case 'cognitive_assessment':
                
                    $ca1 = @$row['year_recalled'] ?? '';
                    $ca2 = @$row['month_recalled'] ?? '';
                    $ca3 = @$row['hour_recalled'] ?? '';
                    $ca4 = @$row['reverse_count'] ?? '';
                    $ca5 = @$row['reverse_month'] ?? '';
                    $ca6 = @$row['address_recalled'] ?? '';
                    if($ca1 != "" || $ca2 != "" || $ca3 != "" || $ca4 != "" || $ca5 != "" || $ca6 != "")
                    {
                        $abc = '1122';
                    }
                    else{
                          $abc = '1234';
                    }
                        $codes[] = [
                        '99483' =>  $abc == '1122' ? "true" : "false",
                        
                    ];
                    break;

                case 'weight_assessment':
                    $bmiValue = @$row['bmi_value'] ?? '';
                    
                    $avgPackPerYear = @$row['average_packs_per_year'] ?? '';           
                    $codes[] = [
                        'G8420' => $bmiValue > '18.5' && $bmiValue < '25' ? "true" : "false",
                        'G8417' => $bmiValue >= '25' ? "true" : "false",
                        'G8418' => $bmiValue <= '18.5' ? "true" : "false",
                        //else condtion
                        'G8422' => $bmiValue == '' ? "true" : "false",
                    ];
                    break;
                case 'misc':
                    $timeSpent = @$row['time_spent'] ?? '';
                    $asprinUse = @$row['asprin_use'] ? true : false;
                    $behavioralCounselling = @$row['behavioral_counselling'] ? true : false;
                    $highBloodPressure = @$row['high_blood_pressure'] ? true : false;
                    
                    if ($timeSpent || $asprinUse || $behavioralCounselling || $highBloodPressure) {
                        $codes[] = [ '99497(33)' => "true"];
                    } else {
                        $codes[] = [ '99497(33)' => "false"];
                    }
                    break;
    
                default:
                    // code...
                    break;
            }
        }

        


        // DEFINE DEFUALT CODES 
        $defaultcodes = [
            'G8420' => "false",
            'G8417' => "false",
            'G8418' => "false",
            'G8422' => "false",
            'G8752' => "false",
            'G8754' => "false",
            '4004F' => "false",
            '1036F' => "false",
            'G8510' => "false",
            'G8431' => "false",
            'G9717' => "false",
            '1100F' => "false",
            '3288F' => "false",
            '1101F' => "false",
            '4040'  => "false",
            'G8482' => "false",
            'G8483' => "false",
            '3017F' => "false",
            'G9711' => "false",
            'G9899' => "false",
            'G9708' => "false",
            '3044F' => "false",
            '3046F' => "false",
            '3051F' => "false",
            '3052F' => "false",
            '2024F' => "false",
            '3072F' => "false",
            '2022F' => "false",
            '3060F' => "false",
            '3061F' => "false",
            '3066F' => "false",
            'G8506' => "false",
            'G8598' => "false",
            'G9724' => "false",
            'G9664' => "false",
            'G9781' => "false",
            '3066F' => "false",
            '3060F' => "false",
            'G9664' => "false",
            'G9781' => "false",
            '99213' => "false",
            '99214' => "false",
            '99441' => "false",
            '99442' => "false",
            '99443' => "false",
            'G0101' => "false",
            'G0091' => "false",
            'G0402' => "false",
            '99397' => "false",
            'G0439' => "false",
            '99395' => "false",
            '99396' => "false",
            'G0442' => "false",
            'G0446' => "false",
            '99497(33)' => "false",
            'G0444' => "false",
            '99495' => "false",
            '99496' => "false",
            '1111F' => "false",
            '99483' => "false",
        ];

        $superBill = SuperBillCodes::where('question_id',$questionId)->first();
        $defaultcodes = !empty($superBill)?json_decode($superBill['codes'],true):$defaultcodes;

        if(!empty($codes)){
            foreach ($codes as $key => $value) {
                foreach($value as $code => $status) {
                    if(array_key_exists($code, $defaultcodes)){
                        $defaultcodes[$code] = $status;
                    }
                }

            }
        }

        if(empty($superBill)){
            $data = ['question_id'=>$questionId,'codes'=>json_encode($defaultcodes), 'created_user'=>Auth::id()];
            SuperBillCodes::create($data);
        }else{
            SuperBillCodes::where('question_id',$questionId)->update(['codes'=>json_encode($defaultcodes)]);
        }
    }


    /* Store monthly assessment section from ccm program */
    private function storeMonthlyAssessment($serial_no, $questionnaireId, $patientId, $programId, $questionnaireData)
    {
        $monthlyAssessment = $questionnaireData['monthly_assessment'] ?? [];
        if (!empty($monthlyAssessment)) {
            $row = [
                'questionnaire_id' => $questionnaireId ?? "",
                'serial_no' => $serial_no ?? "",
                'patient_id' => $patientId ?? "",
                'program_id' => $programId ?? "",
                'monthly_assessment' => json_encode($monthlyAssessment),
                'created_at' => Carbon::now(),
            ];
            $response = CcmMonthlyAssessment::create($row);
            return $response;
        }
    }
}
