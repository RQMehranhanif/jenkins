<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\SuperBillCodesController;
use Illuminate\Http\Request;
use App\Models\Questionaires;
use App\Models\Patients;
use App\Models\Doctors;
use App\Models\Diagnosis;
use App\Models\Programs;
use App\Models\User;
use App\Models\SuperBillCodes;
use Validator,Session,Config,PDF,Auth,Storage;
use Carbon\Carbon;

class CareplanController extends Controller
{
    protected $view = "reports.";
    protected $singular = "Questionaire Survey";

    public function index(Request $request,$id)
    {
        try {
            $data = $this->awvCareplanReport($id);
            $response = array('success'=>true, 'data'=>$data);
        } catch (\Exceptional $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());
        }
        
        return response()->json($response);
    }


    /* Returning data with outcomes on behalf of formdata from the program 
    ** against the serial no*/
    private function awvCareplanReport($id)
    { //return "rizwan";
        $row = Questionaires::with('patient:id,first_name,mid_name,last_name,gender,age,dob', 'program:id,name,short_name','clinic:id,name,short_name')->where('id', $id)->first()->toArray();
        $questions_answers = json_decode($row['questions_answers'], true);

        $doctor = User::where(['role' => 21, 'id' => $row['doctor_id']])->select('first_name', 'mid_name', 'last_name', 'id')->first();

        if (!empty($doctor)) {
            $row['doctor'] = @$doctor['first_name'] . ' ' . @$doctor['mid_name'] . ' ' . @$doctor['last_name'];
        }

        if (Auth::id()) {
            $signer = User::where(['role' => 21, 'id' => Auth::id()])->select('id')->first();
            if ($signer){
                $row['signer_doctor'] = $signer['id'];
            }
        }

        $primary_care_physician = Patients::with('doctor:id,first_name,last_name')->where('id', $row['patient_id'])->first()->toArray();
        if (!empty($primary_care_physician['doctor'])) {
            $row['primary_care_physician'] = $primary_care_physician['doctor']['name'];
        }

        $nextYeardue = Carbon::create($row['date_of_service'])->addYear(1)->format('m/d/Y');

        // PHYSICAL HEALTH - FALL SCREENING
        $fallScreeningOutcomes = $this->fallscreening($questions_answers['fall_screening']?? []);

        // DEPRESSION PHQ-9 Outcome
        $depression_OutComes = $this->depressionphq_9($questions_answers['depression_phq9'] ?? []);
        
        /* General health screening careplan including
        ** HIGH STRESS, GENERAL HEALTH SOCIAL AND EMOTIONAL SUPPORT, PAIN */
        $general_health_screening = $this->generalhealthscreening($questions_answers['high_stress']??[], $questions_answers['general_health']??[], $questions_answers['social_emotional_support']??[], $questions_answers['pain']??[]);

        
        // High Stress
        $high_stress = $general_health_screening['high_stress'] ?? [];
        
        // General Health
        $general_health = $general_health_screening['general_health'] ?? [];
        
        // Social/Emotional Supoort
        $social_emotional_support = $general_health_screening['social_emotional_support'] ?? [];
       
        // Pain
        $pain = $general_health_screening['pain'] ?? [];

        // COGNITIVE ASSESSMENT
        $cognitiveOutcomes = $this->cognitive_assessment($questions_answers['cognitive_assessment']?? []);


        /* Physical Activity Careplan */
        $physicalActivitiesOutComes = $this->physical_activity($questions_answers['physical_activities']?? []);


        // ALCOHOL USE Careplan
        $alcoholOutComes = $this->alcohol_use_screening($questions_answers['alcohol_use'] ?? [], $row);

        // TOBACOO USE OUTCOMES FILTER
        $tobaccoOutComes = $this->tobacco_use_screening($questions_answers['tobacco_use'] ?? []);

        // SEATBELT TEXT Filter
        $seatBelt = [];
        $seatBelt['outcome'] = (@$questions_answers['seatbelt_use']['wear_seat_belt'] == "Yes") ? 'Patient always uses seatbelt in the car.' : 'Patient counseled on the use of seat belt in the car.';
        $seatBelt['flag'] = (@$questions_answers['seatbelt_use']['wear_seat_belt'] == "No") ? true : false;

        // IMMUNIZATION
        $immunizationOutcomes = $this->immunization_screening($questions_answers['immunization'] ?? []);

        // SCREENING
        $screeningOutcomes = $this->screening($questions_answers['screening'] ?? [], $row);

        // DIABETES
        $diabetesOutcomes = $this->diabetes_screening($questions_answers['diabetes'] ?? []);

        // CHOLESTEROL ASSESSMENT
        $cholesterol_outcome = $this->cholesterol_screening($questions_answers['cholesterol_assessment'] ?? []);

        /* Blooad Pressure and Weight Screening */
        $bp_and_weight = $this->bp_and_weight_screening($questions_answers['bp_assessment'] ?? [], $questions_answers['weight_assessment'] ?? []);

        // BP ASSESSMENT
        $bpAssessment = $bp_and_weight['bp_assessment'] ?? [];
        
        // WEIGHT ASSESSMENT
        $weightAssessment = $bp_and_weight['weight_assessment'] ?? [];

        $miscellaneous = [];
        $height = $weigth = '';
        if (!empty($questions_answers['misc'])) {
            $miscellaneous = $questions_answers['misc'];
            $height = $questions_answers['misc']['height'] ?? "";
            $weigth = $questions_answers['misc']['weight'] ?? "";
        } else if (!empty($questions_answers['miscellaneous'])) {
            $miscellaneous = $questions_answers['miscellaneous'];
        }

        $data = [
            'page_title' => 'AWV Care plan',
            'row' => $row,
            'height' => $height,
            'weight' => $weigth,
            'next_year_due' => $nextYeardue,
            'fall_screening' => $fallScreeningOutcomes ?? [],
            'depression_out_comes' => $depression_OutComes ?? [],
            'high_stress' => $high_stress ?? [],
            'general_health' => $general_health ?? [],
            'social_emotional_support' => $social_emotional_support ?? [],
            'pain' => $pain ?? [],
            'cognitive_assessment' => $cognitiveOutcomes ?? [],
            'physical_out_comes' => $physicalActivitiesOutComes ?? [],
            'alcohol_out_comes' => $alcoholOutComes ?? [],
            'tobacco_out_comes' => $tobaccoOutComes ?? [],
            'seatbelt_use' => $seatBelt ?? [],
            'immunization' => $immunizationOutcomes ?? [],
            'screening' => $screeningOutcomes ?? [],
            'diabetes' => $diabetesOutcomes ?? [],
            'cholesterol_assessment' => $cholesterol_outcome ?? [],
            'bp_assessment' => $bpAssessment ?? [],
            'weight_assessment' => $weightAssessment ?? [],
            'miscellaneous' => $miscellaneous ?? []
        ];

        return $data;
    }



    public function ccmCareplanReport($id)
    {
        $row = Questionaires::with('patient:id,first_name,mid_name,last_name,gender,age,dob', 'program:id,name,short_name', 'monthlyAssessment')->where('id', $id)->first()->toArray();
        $questions_answers = json_decode($row['questions_answers'], true);
        $patient = $row['patient'];
        $program = $row['program'];
        $dateofService = $row['date_of_service'];

        $primary_care_physician = Patients::with('doctor:id,first_name,last_name')->where('id', $row['patient_id'])->first()->toArray();
        if (!empty($primary_care_physician['doctor'])) {
            $row['primary_care_physician'] = $primary_care_physician['doctor']['name'];
        }

        //Fall Screening
        $fallScreeningOutcomes = $this->fallscreening($questions_answers);

        //Depression
        $depression_OutComes = $this->depressionphq_9($questions_answers);

        // Cognitive Assesment 
        $cognitiveOutcomes = $this->cognitive_assessment($questions_answers);

        // Caregiver Assesment
        $caregiver_assesment_outcomes = $this->caregiverAssesment($questions_answers);

        // Other Provider
        $other_providers_outcome = $this->otherProvider($questions_answers);

        //Immunization
        $immunization = $this->immunization_screening($questions_answers);

        //General Assesment
        $general_assessment_outcomes = $this->generalAssesment($questions_answers);

        // Monthly Assessment
        $monthly_assessment_outcomes = $row['monthly_assessment'] ? json_decode($row['monthly_assessment']['monthly_assessment']) : [];

        //Screening
        $screening = $this->screening($questions_answers, $row);

        //Hypercholestrolemia
        $hypercholestrolemia_outcomes = [];
        if (!empty($questions_answers['hypercholestrolemia'])) {
            $hypercholestrolemia = $questions_answers['hypercholestrolemia'];

            $assesment_done = !empty($hypercholestrolemia['assesment_done']) ? $hypercholestrolemia['assesment_done'] : "";
            $statin_intensity = !empty($hypercholestrolemia['statin_intensity']) ? $hypercholestrolemia['statin_intensity'] : "";
            $ldl_goal = !empty($hypercholestrolemia['ldl_goal']) ? $hypercholestrolemia['ldl_goal'] : "";

            $ur_hyperlipidemia_start_date = !empty($hypercholestrolemia['ur_hyperlipidemia_start_date']) ? $hypercholestrolemia['ur_hyperlipidemia_start_date'] : "";
            $ur_hyperlipidemia_end_date = !empty($hypercholestrolemia['ur_hyperlipidemia_end_date']) ? $hypercholestrolemia['ur_hyperlipidemia_end_date'] : "";
            $ur_hyperlipidemia_status = $this->calculateStatus($ur_hyperlipidemia_start_date, $ur_hyperlipidemia_end_date);
            $el_cardio_start_date = !empty($hypercholestrolemia['el_cardio_start_date']) ? $hypercholestrolemia['el_cardio_start_date'] : "";
            $el_cardio_end_date = !empty($hypercholestrolemia['el_cardio_end_date']) ? $hypercholestrolemia['el_cardio_end_date'] : "";
            $el_cardio_status = $this->calculateStatus($el_cardio_start_date, $el_cardio_end_date);
            $ui_controlling_start_date = !empty($hypercholestrolemia['ui_controlling_start_date']) ? $hypercholestrolemia['ui_controlling_start_date'] : "";
            $ui_controlling_end_date = !empty($hypercholestrolemia['ui_controlling_end_date']) ? $hypercholestrolemia['ui_controlling_end_date'] : "";
            $ui_controlling_status = $this->calculateStatus($ui_controlling_start_date, $ui_controlling_end_date);
            $ue_exercise_start_date = !empty($hypercholestrolemia['ue_exercise_start_date']) ? $hypercholestrolemia['ue_exercise_start_date'] : "";
            $ue_exercise_end_date = !empty($hypercholestrolemia['ue_exercise_end_date']) ? $hypercholestrolemia['ue_exercise_end_date'] : "";
            $ue_exercise_status = $this->calculateStatus($ue_exercise_start_date, $ue_exercise_end_date);




            $hypercholestrolemia_outcomes['ur_hyperlipidemia_start_date'] = $ur_hyperlipidemia_start_date;
            $hypercholestrolemia_outcomes['ur_hyperlipidemia_end_date'] = $ur_hyperlipidemia_end_date;
            $hypercholestrolemia_outcomes['ur_hyperlipidemia_status'] = $ur_hyperlipidemia_status;
            $hypercholestrolemia_outcomes['el_cardio_start_date'] = $el_cardio_start_date;
            $hypercholestrolemia_outcomes['el_cardio_end_date'] = $el_cardio_end_date;
            $hypercholestrolemia_outcomes['el_cardio_status'] = $el_cardio_status;
            $hypercholestrolemia_outcomes['ui_controlling_start_date'] = $ui_controlling_start_date;
            $hypercholestrolemia_outcomes['ui_controlling_end_date'] = $ui_controlling_end_date;
            $hypercholestrolemia_outcomes['ui_controlling_status'] = $ui_controlling_status;
            $hypercholestrolemia_outcomes['ue_exercise_start_date'] = $ue_exercise_start_date;
            $hypercholestrolemia_outcomes['ue_exercise_end_date'] = $ue_exercise_end_date;
            $hypercholestrolemia_outcomes['ue_exercise_status'] = $ue_exercise_status;
            if ($statin_intensity == "Yes" && $ldl_goal == "Yes") {
                $hypercholestrolemia_outcomes['prognosis'] = "Patient has a good prognosis as patient is on moderate to high intensity statin and his LDL is at goal.";
            } elseif ($statin_intensity == "Yes" && $ldl_goal == "No") {
                $hypercholestrolemia_outcomes['prognosis'] = "Patient has a fair prognosis as patient is on moderate to high intensity statin but his LDL is not at goal";
            } elseif ($statin_intensity == "No" && $ldl_goal == "Yes") {
                $hypercholestrolemia_outcomes['prognosis'] = "Patient has a fair prognosis as he is not on Statin but his LDL is at goal";
            } elseif ($statin_intensity == "No" && $ldl_goal == "No") {
                $hypercholestrolemia_outcomes['prognosis'] = "Patient has poor prognosis as he is not on moderate to high intensity statin and his LDL is not at goal";
            } else if ($assesment_done == "Yes") {
                $hypercholestrolemia_outcomes['prognosis'] = "Hypercholesterolemia assessment has already performed";
            }
        }

        //Diabetes
        $diabetes_outcome = [];
        if (!empty($questions_answers['diabetes_mellitus'])) {
            $diabetes = $questions_answers['diabetes_mellitus'];

            $eye_examination = !empty($diabetes['eye_examination']) ? $diabetes['eye_examination'] : "";
            $diabetic_nephropathy = !empty($diabetes['diabetic_nephropathy']) ? $diabetes['diabetic_nephropathy'] : "";
            $name_of_doctor = !empty($diabetes['name_of_doctor']) ? $diabetes['name_of_doctor'] : "";
            $name_of_facility = !empty($diabetes['name_of_facility']) ? $diabetes['name_of_facility'] : "";
            $checkup_date = !empty($diabetes['checkup_date']) ? $diabetes['checkup_date'] : "";
            $report_available = !empty($diabetes['report_available']) ? $diabetes['report_available'] : "";
            $report_requested = !empty($diabetes['report_requested']) ? $diabetes['report_requested'] : "";
            $retinavue_ordered = !empty($diabetes['retinavue_ordered']) ? $diabetes['retinavue_ordered'] : "";
            $eye_examination_script = !empty($diabetes['eye_examination_script']) ? $diabetes['eye_examination_script'] : "";
            $diabetic_nephropathy_date = !empty($diabetes['diabetic_nephropathy_date']) ? $diabetes['diabetic_nephropathy_date'] : "";
            $diabetic_nephropathy_result = !empty($diabetes['diabetic_nephropathy_result']) ? $diabetes['diabetic_nephropathy_result'] : "";
            $diabetic_nephropathy_not_conducted = !empty($diabetes['diabetic_nephropathy_not_conducted']) ? $diabetes['diabetic_nephropathy_not_conducted'] : "";
            $diabetic_inhibitors = !empty($diabetes['diabetic_inhibitors']) ? $diabetes['diabetic_inhibitors'] : "";
            $nephropathy_patient_has = !empty($diabetes['nephropathy_patient_has']) ? $diabetes['nephropathy_patient_has'] : "";

            if ($eye_examination == "Yes" && $report_available == "Yes") {
                $diabetes_outcome['eyeexam_careplan'] = "Diabetic Eye Examination done on " . $checkup_date . " by Dr. " . $name_of_doctor . " Report is available in patient's chart";
            } elseif ($eye_examination == "Yes" && $report_available == "No" && $report_requested == "Yes") {
                $diabetes_outcome['eyeexam_careplan'] = "Report is requested from " . $name_of_doctor . "'s office for eye examination on " . $checkup_date;
            }

            if ($diabetic_nephropathy == "Yes") {
                $diabetes_outcome['nephro_careplan'] = "Urine for Microalbumin is " . $diabetic_nephropathy_result . " on " . $diabetic_nephropathy_date;
            } elseif ($diabetic_nephropathy == "No") {

                $nephroReason = "";
                switch ([$diabetic_inhibitors, $ckdStage]) {
                    case ($diabetic_inhibitors == 'ACE Inhibitor' || $diabetic_inhibitors == 'ARB'):
                    $nephroReason = "patient is on ".$diabetic_inhibitors;
                    break;
                    
                    case ($diabetic_inhibitors == 'None' && $ckdStage == "ckd_stage_4"):
                    $nephroReason = "patient has CKD Stage 4";
                    break;
                    
                    case ($diabetic_inhibitors == 'None' && $ckdStage == "patient_see_nephrologist"):
                    $nephroReason = 'patient sees the Nephrologist';
                    break;
                    
                    default:
                    # code...
                    break;
                }
                $diabetes_outcome['nephro_careplan'] = "Patient has not been tested for Microalbumin in last 6 months because " . $nephroReason;
                if ($nephroReason == "") {
                    $diabetes_outcome['nephro_careplan'] = "Patient has not been tested for Microalbumin in last 6 months and no Reason is provided.";
                }
            }


            $imp_blood_glucose_start_date = !empty($diabetes['imp_blood_glucose_start_date']) ? $diabetes['imp_blood_glucose_start_date'] : "";
            $imp_blood_glucose_end_date = !empty($diabetes['imp_blood_glucose_end_date']) ? $diabetes['imp_blood_glucose_end_date'] : "";
            $imp_blood_glucose_status = $this->calculateStatus($imp_blood_glucose_start_date, $imp_blood_glucose_end_date);
            $und_hypoglycemia_hyperglycemia_start_date = !empty($diabetes['und_hypoglycemia_hyperglycemia_start_date']) ? $diabetes['und_hypoglycemia_hyperglycemia_start_date'] : "";
            $und_hypoglycemia_hyperglycemia_end_date = !empty($diabetes['und_hypoglycemia_hyperglycemia_end_date']) ? $diabetes['und_hypoglycemia_hyperglycemia_end_date'] : "";
            $und_hypoglycemia_hyperglycemia_status = $this->calculateStatus($und_hypoglycemia_hyperglycemia_start_date, $und_hypoglycemia_hyperglycemia_end_date);
            $recognize_signs_symptoms_start_date = !empty($diabetes['recognize_signs_symptoms_start_date']) ? $diabetes['recognize_signs_symptoms_start_date'] : "";
            $recognize_signs_symptoms_end_date = !empty($diabetes['recognize_signs_symptoms_end_date']) ? $diabetes['recognize_signs_symptoms_end_date'] : "";
            $recognize_signs_symptoms_status = $this->calculateStatus($recognize_signs_symptoms_start_date, $recognize_signs_symptoms_end_date);
            $reduce_complications_start_date = !empty($diabetes['reduce_complications_start_date']) ? $diabetes['reduce_complications_start_date'] : "";
            $reduce_complications_end_date = !empty($diabetes['reduce_complications_end_date']) ? $diabetes['reduce_complications_end_date'] : "";
            $reduce_complications_status = $this->calculateStatus($reduce_complications_start_date, $reduce_complications_end_date);
            $und_imp_of_quit_smoking_start_date = !empty($diabetes['und_imp_of_quit_smoking_start_date']) ? $diabetes['und_imp_of_quit_smoking_start_date'] : "";
            $und_imp_of_quit_smoking_end_date = !empty($diabetes['und_imp_of_quit_smoking_end_date']) ? $diabetes['und_imp_of_quit_smoking_end_date'] : "";
            $und_imp_of_quit_smoking_status = $this->calculateStatus($und_imp_of_quit_smoking_start_date, $und_imp_of_quit_smoking_end_date);
            $maintain_healthy_weight_start_date = !empty($diabetes['maintain_healthy_weight_start_date']) ? $diabetes['maintain_healthy_weight_start_date'] : "";
            $maintain_healthy_weight_end_date = !empty($diabetes['maintain_healthy_weight_end_date']) ? $diabetes['maintain_healthy_weight_end_date'] : "";
            $maintain_healthy_weight_status = $this->calculateStatus($maintain_healthy_weight_start_date, $maintain_healthy_weight_end_date);
            $engage_physical_activity_start_date = !empty($diabetes['engage_physical_activity_start_date']) ? $diabetes['engage_physical_activity_start_date'] : "";
            $engage_physical_activity_end_date = !empty($diabetes['engage_physical_activity_end_date']) ? $diabetes['engage_physical_activity_end_date'] : "";
            $engage_physical_activity_status = $this->calculateStatus($engage_physical_activity_start_date, $engage_physical_activity_end_date);
            $maintain_a_healthy_diet_start_date = !empty($diabetes['maintain_a_healthy_diet_start_date']) ? $diabetes['maintain_a_healthy_diet_start_date'] : "";
            $maintain_a_healthy_diet_end_date = !empty($diabetes['maintain_a_healthy_diet_end_date']) ? $diabetes['maintain_a_healthy_diet_end_date'] : "";
            $maintain_a_healthy_diet_status = $this->calculateStatus($maintain_a_healthy_diet_start_date, $maintain_a_healthy_diet_end_date);
            $und_foot_care_start_date = !empty($diabetes['und_foot_care_start_date']) ? $diabetes['und_foot_care_start_date'] : "";
            $und_foot_care_end_date = !empty($diabetes['und_foot_care_end_date']) ? $diabetes['und_foot_care_end_date'] : "";
            $und_foot_care_status = $this->calculateStatus($und_foot_care_start_date, $und_foot_care_end_date);



            $diabetes_outcome['imp_blood_glucose_start_date'] = $imp_blood_glucose_start_date;
            $diabetes_outcome['imp_blood_glucose_end_date'] = $imp_blood_glucose_end_date;
            $diabetes_outcome['imp_blood_glucose_status'] = $imp_blood_glucose_status;
            $diabetes_outcome['und_hypoglycemia_hyperglycemia_start_date'] = $und_hypoglycemia_hyperglycemia_start_date;
            $diabetes_outcome['und_hypoglycemia_hyperglycemia_end_date'] = $und_hypoglycemia_hyperglycemia_end_date;
            $diabetes_outcome['und_hypoglycemia_hyperglycemia_status'] = $und_hypoglycemia_hyperglycemia_status;
            $diabetes_outcome['recognize_signs_symptoms_start_date'] = $recognize_signs_symptoms_start_date;
            $diabetes_outcome['recognize_signs_symptoms_end_date'] = $recognize_signs_symptoms_end_date;
            $diabetes_outcome['recognize_signs_symptoms_status'] = $recognize_signs_symptoms_status;
            $diabetes_outcome['reduce_complications_start_date'] = $reduce_complications_start_date;
            $diabetes_outcome['reduce_complications_end_date'] = $reduce_complications_end_date;
            $diabetes_outcome['reduce_complications_status'] = $reduce_complications_status;
            $diabetes_outcome['und_imp_of_quit_smoking_start_date'] = $und_imp_of_quit_smoking_start_date;
            $diabetes_outcome['und_imp_of_quit_smoking_end_date'] = $und_imp_of_quit_smoking_end_date;
            $diabetes_outcome['und_imp_of_quit_smoking_status'] = $und_imp_of_quit_smoking_status;
            $diabetes_outcome['maintain_healthy_weight_start_date'] = $maintain_healthy_weight_start_date;
            $diabetes_outcome['maintain_healthy_weight_end_date'] = $maintain_healthy_weight_end_date;
            $diabetes_outcome['maintain_healthy_weight_status'] = $maintain_healthy_weight_status;
            $diabetes_outcome['engage_physical_activity_start_date'] = $engage_physical_activity_start_date;
            $diabetes_outcome['engage_physical_activity_end_date'] = $engage_physical_activity_end_date;
            $diabetes_outcome['engage_physical_activity_status'] = $engage_physical_activity_status;
            $diabetes_outcome['maintain_a_healthy_diet_start_date'] = $maintain_a_healthy_diet_start_date;
            $diabetes_outcome['maintain_a_healthy_diet_end_date'] = $maintain_a_healthy_diet_end_date;
            $diabetes_outcome['maintain_a_healthy_diet_status'] = $maintain_a_healthy_diet_status;
            $diabetes_outcome['und_foot_care_start_date'] = $und_foot_care_start_date;
            $diabetes_outcome['und_foot_care_end_date'] = $und_foot_care_end_date;
            $diabetes_outcome['und_foot_care_status'] = $und_foot_care_status;
        }

        //COPD
        $copd_outcomes = [];
        if (!empty($questions_answers['copd_assessment'])) {
            $copd_assessment = $questions_answers['copd_assessment'];

            $cough = !empty($copd_assessment['cough']) ? $copd_assessment['cough'] : "";
            $phlegum_in_chest = !empty($copd_assessment['phlegum_in_chest']) ? $copd_assessment['phlegum_in_chest'] : "";
            $tight_chest = !empty($copd_assessment['tight_chest']) ? $copd_assessment['tight_chest'] : "";
            $breathless = !empty($copd_assessment['breathless']) ? $copd_assessment['breathless'] : "";
            $limited_activities = !empty($copd_assessment['limited_activities']) ? $copd_assessment['limited_activities'] : "";
            $lung_condition = !empty($copd_assessment['lung_condition']) ? $copd_assessment['lung_condition'] : "";
            $sound_sleep = !empty($copd_assessment['sound_sleep']) ? $copd_assessment['sound_sleep'] : "";
            $energy_level = !empty($copd_assessment['energy_level']) ? $copd_assessment['energy_level'] : "";
            $smoking_cessations_start_date = !empty($copd_assessment['smoking_cessation_start_date']) ? $copd_assessment['smoking_cessation_start_date'] : "";
            $smoking_cessations_end_date = !empty($copd_assessment['smoking_cessation_end_date']) ? $copd_assessment['smoking_cessation_end_date'] : "";
            $smoking_cessations_status = $this->calculateStatus($smoking_cessations_start_date, $smoking_cessations_end_date);

            $copd_medication_start_date = !empty($copd_assessment['copd_medication_start_date']) ? $copd_assessment['copd_medication_start_date'] : "";
            $copd_medication_end_date = !empty($copd_assessment['copd_medication_end_date']) ? $copd_assessment['copd_medication_end_date'] : "";
            $copd_medication_status = $this->calculateStatus($copd_medication_start_date, $copd_medication_end_date);

            $supplemental_oxygen_start_date = !empty($copd_assessment['supplemental_oxygen_start_date']) ? $copd_assessment['supplemental_oxygen_start_date'] : "";
            $supplemental_oxygen_end_date = !empty($copd_assessment['supplemental_oxygen_end_date']) ? $copd_assessment['supplemental_oxygen_end_date'] : "";
            $supplemental_oxygen_status = $this->calculateStatus($supplemental_oxygen_start_date, $supplemental_oxygen_end_date);

            $self_mgmt_start_date = !empty($copd_assessment['self_mgmt_start_date']) ? $copd_assessment['self_mgmt_start_date'] : "";
            $self_mgmt_end_date = !empty($copd_assessment['self_mgmt_end_date']) ? $copd_assessment['self_mgmt_end_date'] : "";
            $self_mgmt_status = $this->calculateStatus($self_mgmt_start_date, $self_mgmt_end_date);



            $tirgger_exacerbations_start_date = !empty($copd_assessment['tirgger_exacerbations_start_date']) ? $copd_assessment['tirgger_exacerbations_start_date'] : "";
            $tirgger_exacerbations_end_date = !empty($copd_assessment['tirgger_exacerbations_end_date']) ? $copd_assessment['tirgger_exacerbations_end_date'] : "";
            $tirgger_exacerbations_status = $this->calculateStatus($tirgger_exacerbations_start_date, $tirgger_exacerbations_end_date);

            $exacerbations_symptoms_start_date = !empty($copd_assessment['exacerbations_symptoms_start_date']) ? $copd_assessment['exacerbations_symptoms_start_date'] : "";
            $exacerbations_symptoms_end_date = !empty($copd_assessment['exacerbations_symptoms_end_date']) ? $copd_assessment['exacerbations_symptoms_end_date'] : "";
            $exacerbations_symptoms_status = $this->calculateStatus($exacerbations_symptoms_start_date, $exacerbations_symptoms_end_date);

            $followup_imp_start_date = !empty($copd_assessment['followup_imp_start_date']) ? $copd_assessment['followup_imp_start_date'] : "";
            $followup_imp_end_date = !empty($copd_assessment['followup_imp_end_date']) ? $copd_assessment['followup_imp_end_date'] : "";
            $followup_imp_status = $this->calculateStatus($followup_imp_start_date, $followup_imp_end_date);

            $imp_of_vaccine_start_date = !empty($copd_assessment['imp_of_vaccine_start_date']) ? $copd_assessment['imp_of_vaccine_start_date'] : "";
            $imp_of_vaccine_end_date = !empty($copd_assessment['imp_of_vaccine_end_date']) ? $copd_assessment['imp_of_vaccine_end_date'] : "";
            $imp_of_vaccine_status = $this->calculateStatus($imp_of_vaccine_start_date, $imp_of_vaccine_end_date);

            $safe_physical_activity_start_date = !empty($copd_assessment['safe_physical_activity_start_date']) ? $copd_assessment['safe_physical_activity_start_date'] : "";
            $safe_physical_activity_end_date = !empty($copd_assessment['safe_physical_activity_end_date']) ? $copd_assessment['safe_physical_activity_end_date'] : "";
            $safe_physical_activity_status = $this->calculateStatus($safe_physical_activity_start_date, $safe_physical_activity_end_date);

            $group_support_start_date = !empty($copd_assessment['group_support_start_date']) ? $copd_assessment['group_support_start_date'] : "";
            $group_support_end_date = !empty($copd_assessment['group_support_end_date']) ? $copd_assessment['group_support_end_date'] : "";
            $group_support_status = $this->calculateStatus($group_support_start_date, $group_support_end_date);

            $total_assessment_score = !empty($copd_assessment['total_assessment_score']) ? $copd_assessment['total_assessment_score'] : "";

            $copd_outcomes['careplan'] = 'Patient’s total score on the COPD Assessment Test (CAT™) was '.$total_assessment_score.' on date of assessment. ';

            if ($total_assessment_score < 10) {
                $copd_outcomes['prognosis'] = "Prognosis is Good";
            } elseif ($total_assessment_score >= 10 && $total_assessment_score <= 20) {
                $copd_outcomes['porgnosis'] = "Prognosis is Fair";
            } elseif ($total_assessment_score > 20 && $total_assessment_score <= 30) {
                $copd_outcomes['prognosis'] = "Prognosis is Poor";
            } elseif ($total_assessment_score > 30) {
                $copd_outcomes['prognosis'] = "Prognosis is Very high risk";
            }

            /* if ($cough <= 1) {
                $copd_outcomes['cough'] = "Patient cough sometimes.";
            } elseif ($cough <= 3) {
                $copd_outcomes['cough'] = "Mild coughing.";
            } else {
                $copd_outcomes['cough'] = "Patient cough all the time.";
            }

            if ($phlegum_in_chest <= 1) {
                $copd_outcomes['phlegum_in_chest'] = "Patient has no phlegum at all.";
            } elseif ($cough <= 3) {
                $copd_outcomes['phlegum_in_chest'] = "Patient sometimes feels phlegum in his chest.";
            } else {
                $copd_outcomes['phlegum_in_chest'] = "Patient's chest is full of phlegum.";
            }

            if ($tight_chest <= 1) {
                $copd_outcomes['tight_chest'] = "Chest does not feel tight.";
            } elseif ($cough <= 3) {
                $copd_outcomes['tight_chest'] = "Chest feel tight sometimes.";
            } else {
                $copd_outcomes['tight_chest'] = "Chest feel tight all the time.";
            }

            if ($breathless <= 1) {
                $copd_outcomes['breathless'] = "Patient never feels breathless after walking up to a hill.";
            } elseif ($cough <= 3) {
                $copd_outcomes['breathless'] = "Patient sometimes feels breathless after walking up to a hill.";
            } else {
                $copd_outcomes['breathless'] = "Patient feels very breathless after walking up to a hill.";
            }

            if ($limited_activities <= 1) {
                $copd_outcomes['limited_activities'] = "Not limited doing activities at home.";
            } elseif ($cough <= 3) {
                $copd_outcomes['limited_activities'] = "Sometimes limited doing activities at home.";
            } else {
                $copd_outcomes['limited_activities'] = "Very limited doing activities at home.";
            }

            if ($lung_condition <= 1) {
                $copd_outcomes['lung_condition'] = "Confident leaving home despite lung condition.";
            } elseif ($cough <= 3) {
                $copd_outcomes['lung_condition'] = "Sometimes limited doing activities at home.";
            } else {
                $copd_outcomes['lung_condition'] = "Very limited doing activities at home.";
            }

            if ($sound_sleep <= 1) {
                $copd_outcomes['sound_sleep'] = "Patient sleep soundly.";
            } elseif ($cough <= 3) {
                $copd_outcomes['sound_sleep'] = "Patient sometimes could not sleep soundly because of lung condition.";
            } else {
                $copd_outcomes['sound_sleep'] = "Could not sleep soundly because of lung condition.";
            }

            if ($energy_level <= 1) {
                $copd_outcomes['energy_level'] = "Patient has lots of energy.";
            } elseif ($cough <= 3) {
                $copd_outcomes['energy_level'] = "Patient sometimes has no energy.";
            } else {
                $copd_outcomes['energy_level'] = "Patient has no energy at all.";
            } */

            $copd_outcomes['smoking_cessation_start_date'] = $smoking_cessations_start_date;
            $copd_outcomes['smoking_cessation_end_date'] = $smoking_cessations_end_date;
            $copd_outcomes['smoking_cessations_status'] = $smoking_cessations_status;

            $copd_outcomes['copd_medication_start_date'] = $copd_medication_start_date;
            $copd_outcomes['copd_medication_end_date'] = $copd_medication_end_date;
            $copd_outcomes['copd_medication_status'] = $copd_medication_status;


            $copd_outcomes['supplemental_oxygen_start_date'] = $supplemental_oxygen_start_date;
            $copd_outcomes['supplemental_oxygen_end_date'] = $supplemental_oxygen_end_date;
            $copd_outcomes['supplemental_oxygen_status'] = $supplemental_oxygen_status;


            $copd_outcomes['self_mgmt_start_date'] = $self_mgmt_start_date;
            $copd_outcomes['self_mgmt_end_date'] = $self_mgmt_end_date;
            $copd_outcomes['self_mgmt_status'] = $self_mgmt_status;

            $copd_outcomes['tirgger_exacerbations_start_date'] = $tirgger_exacerbations_start_date;
            $copd_outcomes['tirgger_exacerbations_end_date'] = $tirgger_exacerbations_end_date;
            $copd_outcomes['tirgger_exacerbations_status'] = $tirgger_exacerbations_status;

            $copd_outcomes['exacerbations_symptoms_start_date'] = $exacerbations_symptoms_start_date;
            $copd_outcomes['exacerbations_symptoms_end_date'] = $exacerbations_symptoms_end_date;
            $copd_outcomes['exacerbations_symptoms_status'] = $exacerbations_symptoms_status;

            $copd_outcomes['followup_imp_start_date'] = $followup_imp_start_date;
            $copd_outcomes['followup_imp_end_date'] = $followup_imp_end_date;
            $copd_outcomes['followup_imp_status'] = $followup_imp_status;

            $copd_outcomes['imp_of_vaccine_start_date'] = $imp_of_vaccine_start_date;
            $copd_outcomes['imp_of_vaccine_end_date'] = $imp_of_vaccine_end_date;
            $copd_outcomes['imp_of_vaccine_status'] = $imp_of_vaccine_status;

            $copd_outcomes['safe_physical_activity_start_date'] = $safe_physical_activity_start_date;
            $copd_outcomes['safe_physical_activity_end_date'] = $safe_physical_activity_end_date;
            $copd_outcomes['safe_physical_activity_status'] = $safe_physical_activity_status;

            $copd_outcomes['group_support_start_date'] = $group_support_start_date;
            $copd_outcomes['group_support_end_date'] = $group_support_end_date;
            $copd_outcomes['group_support_status'] = $group_support_status;
        }

        //ckd
        $ckd_outcomes = [];
        if (!empty($questions_answers['ckd_assesment'])) {
            $ckd_assessment = $questions_answers['ckd_assesment'];
            $ak_ckd_start_date = !empty($ckd_assessment['ak_ckd_start_date']) ? $ckd_assessment['ak_ckd_start_date'] : "";
            $ak_ckd_end_date = !empty($ckd_assessment['ak_ckd_end_date']) ? $ckd_assessment['ak_ckd_end_date'] : "";
            $ak_ckd_status = $this->calculateStatus($ak_ckd_start_date, $ak_ckd_end_date);
            $ur_kidney_disease_start_date = !empty($ckd_assessment['ur_kidney_disease_start_date']) ? $ckd_assessment['ur_kidney_disease_start_date'] : "";
            $ur_kidney_disease_end_date = !empty($ckd_assessment['ur_kidney_disease_end_date']) ? $ckd_assessment['ur_kidney_disease_end_date'] : "";
            $ur_kidney_disease_status = $this->calculateStatus($ur_kidney_disease_start_date, $ur_kidney_disease_end_date);
            $uih_bp_start_date = !empty($ckd_assessment['uih_bp_start_date']) ? $ckd_assessment['uih_bp_start_date'] : "";
            $uih_bp_end_date = !empty($ckd_assessment['uih_bp_end_date']) ? $ckd_assessment['uih_bp_end_date'] : "";
            $uih_bp_status = $this->calculateStatus($uih_bp_start_date, $uih_bp_end_date);
            $ria_mitigate_risk_start_date = !empty($ckd_assessment['ria_mitigate_risk_start_date']) ? $ckd_assessment['ria_mitigate_risk_start_date'] : "";
            $ria_mitigate_risk_end_date = !empty($ckd_assessment['ria_mitigate_risk_end_date']) ? $ckd_assessment['ria_mitigate_risk_end_date'] : "";
            $ria_mitigate_status = $this->calculateStatus($ria_mitigate_risk_start_date, $ria_mitigate_risk_end_date);
            $ui_smoking_cessation_start_date = !empty($ckd_assessment['ui_smoking_cessation_start_date']) ? $ckd_assessment['ui_smoking_cessation_start_date'] : "";
            $ui_smoking_cessation_end_date = !empty($ckd_assessment['ui_smoking_cessation_end_date']) ? $ckd_assessment['ui_smoking_cessation_end_date'] : "";
            $ui_smoking_status = $this->calculateStatus($ui_smoking_cessation_start_date, $ui_smoking_cessation_end_date);
            $uidbp_normalbp_start_date = !empty($ckd_assessment['uidbp_normalbp_start_date']) ? $ckd_assessment['uidbp_normalbp_start_date'] : "";
            $uidbp_normalbp_end_date = !empty($ckd_assessment['uidbp_normalbp_end_date']) ? $ckd_assessment['uidbp_normalbp_end_date'] : "";
            $uidbp_normalbp_status = $this->calculateStatus($uidbp_normalbp_start_date, $uidbp_normalbp_end_date);
            $rid_medication_start_date = !empty($ckd_assessment['rid_medication_start_date']) ? $ckd_assessment['rid_medication_start_date'] : "";
            $rid_medication_end_date = !empty($ckd_assessment['rid_medication_end_date']) ? $ckd_assessment['rid_medication_end_date'] : "";
            $rid_medication_status = $this->calculateStatus($rid_medication_start_date, $rid_medication_start_date);
            $adm_dietary_start_date = !empty($ckd_assessment['adm_dietary_start_date']) ? $ckd_assessment['adm_dietary_start_date'] : "";
            $adm_dietary_end_date = !empty($ckd_assessment['adm_dietary_end_date']) ? $ckd_assessment['adm_dietary_end_date'] : "";
            $adm_dietary_status = $this->calculateStatus($adm_dietary_start_date, $adm_dietary_end_date);
            $mbshr_diabetes_start_date = !empty($ckd_assessment['mbshr_diabetes_start_date']) ? $ckd_assessment['mbshr_diabetes_start_date'] : "";
            $mbshr_diabetes_end_date = !empty($ckd_assessment['mbshr_diabetes_end_date']) ? $ckd_assessment['mbshr_diabetes_end_date'] : "";
            $mbshr_diabetes_status = $this->calculateStatus($mbshr_diabetes_start_date, $mbshr_diabetes_end_date);
            $tmh_weight_start_date = !empty($ckd_assessment['tmh_weight_start_date']) ? $ckd_assessment['tmh_weight_start_date'] : "";
            $tmh_weight_end_date = !empty($ckd_assessment['tmh_weight_end_date']) ? $ckd_assessment['tmh_weight_end_date'] : "";
            $tmh_weight_status = $this->calculateStatus($tmh_weight_start_date, $tmh_weight_end_date);
            $thp_strategy_start_date = !empty($ckd_assessment['thp_strategy_start_date']) ? $ckd_assessment['thp_strategy_start_date'] : "";
            $thp_strategy_end_date = !empty($ckd_assessment['thp_strategy_end_date']) ? $ckd_assessment['thp_strategy_end_date'] : "";
            $thp_strategy_status = $this->calculateStatus($thp_strategy_start_date, $thp_strategy_end_date);
            $thp_adjust_ckd_start_date = !empty($ckd_assessment['thp_adjust_ckd_start_date']) ? $ckd_assessment['thp_adjust_ckd_start_date'] : "";
            $thp_adjust_ckd_end_date = !empty($ckd_assessment['thp_adjust_ckd_end_date']) ? $ckd_assessment['thp_adjust_ckd_end_date'] : "";
            $thp_adjust_status = $this->calculateStatus($thp_adjust_ckd_start_date, $thp_adjust_ckd_end_date);
            $egfr_result_one_start_date = !empty($ckd_assessment['egfr_result_one_start_date']) ? $ckd_assessment['egfr_result_one_start_date'] : "";
            $egfr_result_one_report = !empty($ckd_assessment['egfr_result_one_report']) ? $ckd_assessment['egfr_result_one_report'] : "";
            $egfr_result_two_start_date = !empty($ckd_assessment['egfr_result_two_start_date']) ? $ckd_assessment['egfr_result_two_start_date'] : "";
            $egfr_result_two_report = !empty($ckd_assessment['egfr_result_two_report']) ? $ckd_assessment['egfr_result_two_report'] : "";



            for ($i = 1; $i <= sizeof($ckd_assessment['bp']); $i = $i + 1) {
                $date = ($ckd_assessment['bp'][$i])['bp_day'];
                $systolic = ($ckd_assessment['bp'][$i])['systolic_day'];
                $diastolic = ($ckd_assessment['bp'][$i])['diastolic_day'];
                $result[] = "Patient bp is " . $systolic . "/" . $diastolic . " on " . $date;
            }

            $ckd_outcomes['result'] = $result;

            for ($i = 1; $i <= sizeof($ckd_assessment['bp']); $i = $i + 1) {
                $systolics[] = ($ckd_assessment['bp'][$i])['systolic_day'];
                $diastolics[] = ($ckd_assessment['bp'][$i])['diastolic_day'];
            }
            $systolic_count = count($systolics);
            $diastolic_count = count($diastolics);

            $systolic_total = 0;
            foreach ($systolics as $item) {
                $systolic_total += $item;
            }

            $diastolic_total = 0;
            foreach ($diastolics as $item) {
                $diastolic_total += $item;
            }

            $systolic_final = $systolic_total / $systolic_count;
            $diastolic_final = $diastolic_total / $diastolic_count;


            if ($systolic_final <= 130 && $diastolic_final <= 80) {
                $ckd_outcomes['prognosis'] = "Good : BP Average Below 130/80";
            } elseif ($systolic_final > 130 && $diastolic_final > 80) {
                $ckd_outcomes['prognosis'] = "Fair : Average BP between 130-139/80-89";
            } elseif ($systolic_final >= 140 && $diastolic_final >= 90) {
                $ckd_outcomes['prognosis'] = "Poor : BP averaging above 140/90";
            }



            $ckd_outcomes['ak_ckd_start_date'] = $ak_ckd_start_date;
            $ckd_outcomes['ak_ckd_end_date'] = $ak_ckd_end_date;
            $ckd_outcomes['ak_ckd_status'] = $ak_ckd_status;
            $ckd_outcomes['ur_kidney_disease_start_date'] = $ur_kidney_disease_start_date;
            $ckd_outcomes['ur_kidney_disease_end_date'] = $ur_kidney_disease_end_date;
            $ckd_outcomes['ur_kidney_disease_status'] = $ur_kidney_disease_status;
            $ckd_outcomes['uih_bp_start_date'] = $uih_bp_start_date;
            $ckd_outcomes['uih_bp_end_date'] = $uih_bp_end_date;
            $ckd_outcomes['uih_bp_status'] = $uih_bp_status;
            $ckd_outcomes['ria_mitigate_risk_start_date'] = $ria_mitigate_risk_start_date;
            $ckd_outcomes['ria_mitigate_risk_end_date'] = $ria_mitigate_risk_end_date;
            $ckd_outcomes['ria_mitigate_status'] = $ria_mitigate_status;
            $ckd_outcomes['ui_smoking_cessation_start_date'] = $ui_smoking_cessation_start_date;
            $ckd_outcomes['ui_smoking_cessation_end_date'] = $ui_smoking_cessation_end_date;
            $ckd_outcomes['ui_smoking_status'] = $ui_smoking_status;
            $ckd_outcomes['uidbp_normalbp_start_date'] = $uidbp_normalbp_start_date;
            $ckd_outcomes['uidbp_normalbp_end_date'] = $uidbp_normalbp_end_date;
            $ckd_outcomes['uidbp_normalbp_status'] = $uidbp_normalbp_status;
            $ckd_outcomes['rid_medication_start_date'] = $rid_medication_start_date;
            $ckd_outcomes['rid_medication_end_date'] = $rid_medication_end_date;
            $ckd_outcomes['rid_medication_status'] = $rid_medication_status;
            $ckd_outcomes['adm_dietary_start_date'] = $adm_dietary_start_date;
            $ckd_outcomes['adm_dietary_end_date'] = $adm_dietary_end_date;
            $ckd_outcomes['adm_dietary_status'] = $adm_dietary_status;
            $ckd_outcomes['mbshr_diabetes_start_date'] = $mbshr_diabetes_start_date;
            $ckd_outcomes['mbshr_diabetes_end_date'] = $mbshr_diabetes_end_date;
            $ckd_outcomes['mbshr_diabetes_status'] = $mbshr_diabetes_status;
            $ckd_outcomes['tmh_weight_start_date'] = $tmh_weight_start_date;
            $ckd_outcomes['tmh_weight_end_date'] = $tmh_weight_end_date;
            $ckd_outcomes['tmh_weight_status'] = $tmh_weight_status;
            $ckd_outcomes['thp_strategy_start_date'] = $thp_strategy_start_date;
            $ckd_outcomes['thp_strategy_end_date'] = $thp_strategy_end_date;
            $ckd_outcomes['thp_strategy_status'] = $thp_strategy_status;
            $ckd_outcomes['thp_adjust_ckd_start_date'] = $thp_adjust_ckd_start_date;
            $ckd_outcomes['thp_adjust_ckd_end_date'] = $thp_adjust_ckd_end_date;
            $ckd_outcomes['thp_adjust_status'] = $thp_adjust_status;
        }

        //Hypertension
        $hypertension_outcomes = [];
        if (!empty($questions_answers['hypertension'])) {
            $hypertension = $questions_answers['hypertension'];
            $effect_start_date = !empty($hypertension['effect_start_date']) ? $hypertension['effect_start_date'] : "";
            $effect_end_date = !empty($hypertension['effect_end_date']) ? $hypertension['effect_end_date'] : "";
            $effect_status = $this->calculateStatus($effect_start_date, $effect_end_date);
            $imp_bp_monitoring_start_date = !empty($hypertension['imp_bp_monitoring_start_date']) ? $hypertension['imp_bp_monitoring_start_date'] : "";
            $imp_bp_monitoring_end_date = !empty($hypertension['imp_bp_monitoring_end_date']) ? $hypertension['imp_bp_monitoring_end_date'] : "";
            $imp_bp_monitoring_status = $this->calculateStatus($imp_bp_monitoring_start_date, $imp_bp_monitoring_end_date);
            $relation_start_date = !empty($hypertension['relation_start_date']) ? $hypertension['relation_start_date'] : "";
            $relation_end_date = !empty($hypertension['relation_end_date']) ? $hypertension['relation_end_date'] : "";
            $relation_status = $this->calculateStatus($relation_start_date, $relation_end_date);
            $imp_of_medication_start_date = !empty($hypertension['imp_of_medication_start_date']) ? $hypertension['imp_of_medication_start_date'] : "";
            $imp_of_medication_end_date = !empty($hypertension['imp_of_medication_end_date']) ? $hypertension['imp_of_medication_end_date'] : "";
            $imp_of_medication_status = $this->calculateStatus($imp_of_medication_start_date, $imp_of_medication_end_date);
            $adopt_lifestyle_start_date = !empty($hypertension['adopt_lifestyle_start_date']) ? $hypertension['adopt_lifestyle_start_date'] : "";
            $adopt_lifestyle_end_date = !empty($hypertension['adopt_lifestyle_end_date']) ? $hypertension['adopt_lifestyle_end_date'] : "";
            $adopt_lifestyle_status = $this->calculateStatus($adopt_lifestyle_start_date, $adopt_lifestyle_end_date);
            $quit_smoking_alcohol_start_date = !empty($hypertension['quit_smoking_alcohol_start_date']) ? $hypertension['quit_smoking_alcohol_start_date'] : "";
            $quit_smoking_alcohol_end_date = !empty($hypertension['quit_smoking_alcohol_end_date']) ? $hypertension['quit_smoking_alcohol_end_date'] : "";
            $quit_smoking_alcohol_status = $this->calculateStatus($quit_smoking_alcohol_start_date, $quit_smoking_alcohol_end_date);
            $adopt_dietary_start_date = !empty($hypertension['adopt_dietary_start_date']) ? $hypertension['adopt_dietary_start_date'] : "";
            $adopt_dietary_end_date = !empty($hypertension['adopt_dietary_end_date']) ? $hypertension['adopt_dietary_end_date'] : "";
            $adopt_dietary_status = $this->calculateStatus($adopt_dietary_start_date, $adopt_dietary_end_date);
            $maintain_weight_start_date = !empty($hypertension['maintain_weight_start_date']) ? $hypertension['maintain_weight_start_date'] : "";
            $maintain_weight_end_date = !empty($hypertension['maintain_weight_end_date']) ? $hypertension['maintain_weight_end_date'] : "";
            $maintain_weight_status = $this->calculateStatus($maintain_weight_start_date, $maintain_weight_end_date);
            $moderate_exercise_start_date = !empty($hypertension['moderate_exercise_start_date']) ? $hypertension['moderate_exercise_start_date'] : "";
            $moderate_exercise_end_date = !empty($hypertension['moderate_exercise_end_date']) ? $hypertension['moderate_exercise_end_date'] : "";
            $moderate_exercise_status = $this->calculateStatus($moderate_exercise_start_date, $moderate_exercise_end_date);
            $regular_pcp_folloup_start_date = !empty($hypertension['regular_pcp_folloup_start_date']) ? $hypertension['regular_pcp_folloup_start_date'] : "";
            $regular_pcp_folloup_end_date = !empty($hypertension['regular_pcp_folloup_end_date']) ? $hypertension['regular_pcp_folloup_end_date'] : "";
            $regular_pcp_folloup_status = $this->calculateStatus($regular_pcp_folloup_start_date, $regular_pcp_folloup_end_date);




            $hypertension_outcomes['effect_start_date'] = $effect_start_date;
            $hypertension_outcomes['effect_end_date'] = $effect_end_date;
            $hypertension_outcomes['effect_status'] = $effect_status;
            $hypertension_outcomes['imp_bp_monitoring_start_date'] = $imp_bp_monitoring_start_date;
            $hypertension_outcomes['imp_bp_monitoring_end_date'] = $imp_bp_monitoring_end_date;
            $hypertension_outcomes['imp_bp_monitoring_status'] = $imp_bp_monitoring_status;
            $hypertension_outcomes['relation_start_date'] = $relation_start_date;
            $hypertension_outcomes['relation_end_date'] = $relation_end_date;
            $hypertension_outcomes['relation_status'] = $relation_status;
            $hypertension_outcomes['imp_of_medication_start_date'] = $imp_of_medication_start_date;
            $hypertension_outcomes['imp_of_medication_end_date'] = $imp_of_medication_end_date;
            $hypertension_outcomes['imp_of_medication_status'] = $imp_of_medication_status;
            $hypertension_outcomes['adopt_lifestyle_start_date'] = $adopt_lifestyle_start_date;
            $hypertension_outcomes['adopt_lifestyle_end_date'] = $adopt_lifestyle_end_date;
            $hypertension_outcomes['adopt_lifestyle_status'] = $adopt_lifestyle_status;
            $hypertension_outcomes['quit_smoking_alcohol_start_date'] = $quit_smoking_alcohol_start_date;
            $hypertension_outcomes['quit_smoking_alcohol_end_date'] = $quit_smoking_alcohol_end_date;
            $hypertension_outcomes['quit_smoking_alcohol_status'] = $quit_smoking_alcohol_status;
            $hypertension_outcomes['adopt_dietary_start_date'] = $adopt_dietary_start_date;
            $hypertension_outcomes['adopt_dietary_end_date'] = $adopt_dietary_end_date;
            $hypertension_outcomes['adopt_dietary_status'] = $adopt_dietary_status;
            $hypertension_outcomes['maintain_weight_start_date'] = $maintain_weight_start_date;
            $hypertension_outcomes['maintain_weight_end_date'] = $maintain_weight_end_date;
            $hypertension_outcomes['maintain_weight_status'] = $maintain_weight_status;
            $hypertension_outcomes['moderate_exercise_start_date'] = $moderate_exercise_start_date;
            $hypertension_outcomes['moderate_exercise_end_date'] = $moderate_exercise_end_date;
            $hypertension_outcomes['moderate_exercise_status'] = $moderate_exercise_status;
            $hypertension_outcomes['regular_pcp_folloup_start_date'] = $regular_pcp_folloup_start_date;
            $hypertension_outcomes['regular_pcp_folloup_end_date'] = $regular_pcp_folloup_end_date;
            $hypertension_outcomes['regular_pcp_folloup_status'] = $regular_pcp_folloup_status;

            // dd($hypertension);
            for ($i = 1; $i <= sizeof($hypertension['bp']); $i = $i + 1) {
                $date = ($hypertension['bp'][$i])['bp_day'];
                $systolic = ($hypertension['bp'][$i])['systolic_day'];
                $diastolic = ($hypertension['bp'][$i])['diastolic_day'];
                $hyper_result[] = "Patient bp is " . $systolic . "/" . $diastolic . " on " . $date;
            }

            $hypertension_outcomes['result'] = $hyper_result;

            for ($i = 1; $i <= sizeof($hypertension['bp']); $i++) {
                $hp_systolics[] = $hypertension['bp'][$i]['systolic_day'];
                $hp_diastolics[] = $hypertension['bp'][$i]['diastolic_day'];
            }

            $hp_systolics_count = count($hp_systolics);
            $hp_diastolics_count = count($hp_diastolics);

            $hp_systolic_total = 0;
            foreach ($hp_systolics as $item) {
                $hp_systolic_total += $item;
            }

            $hp_diastolic_total = 0;
            foreach ($hp_diastolics as $item) {
                $hp_diastolic_total += $item;
            }
            $hp_systolic_final = $hp_systolic_total / $hp_systolics_count;
            $hp_diastolic_final = $hp_diastolic_total / $hp_diastolics_count;

            if ($hp_systolic_final <= 130 && $hp_diastolic_final <= 80) {
                $hypertension_outcomes['prognosis'] = "Good : BP Average Below 130/80";
            } elseif ($hp_systolic_final > 130 && $hp_diastolic_final > 80) {
                $hypertension_outcomes['prognosis'] = "Fair : Average BP between 130-139/80-89";
            } elseif ($hp_systolic_final >= 140 && $hp_diastolic_final >= 90) {
                $hypertension_outcomes['prognosis'] = "Poor : BP averaging above 140/90";
            }
        }
        
        //OBESITY
        $obesity_outcomes = [];
        if (!empty($questions_answers['obesity'])) {
            $obesity = $questions_answers['obesity'];

            $awareness_about_bmi_start_date = !empty($obesity['awareness_about_bmi_start_date']) ? $obesity['awareness_about_bmi_start_date'] : "";
            $awareness_about_bmi_end_date = !empty($obesity['awareness_about_bmi_end_date']) ? $obesity['awareness_about_bmi_end_date'] : "";
            $awareness_about_bmi_status = $this->calculateStatus($awareness_about_bmi_start_date, $awareness_about_bmi_end_date);
            $need_of_weight_loss_start_date = !empty($obesity['need_of_weight_loss_start_date']) ? $obesity['need_of_weight_loss_start_date'] : "";
            $need_of_weight_loss_end_date = !empty($obesity['need_of_weight_loss_end_date']) ? $obesity['need_of_weight_loss_end_date'] : "";
            $need_of_weight_loss_status = $this->calculateStatus($need_of_weight_loss_start_date, $need_of_weight_loss_end_date);
            $imp_of_healthy_weight_start_date = !empty($obesity['imp_of_healthy_weight_start_date']) ? $obesity['imp_of_healthy_weight_start_date'] : "";
            $imp_of_healthy_weight_end_date = !empty($obesity['imp_of_healthy_weight_end_date']) ? $obesity['imp_of_healthy_weight_end_date'] : "";
            $imp_of_healthy_weight_status = $this->calculateStatus($imp_of_healthy_weight_start_date, $imp_of_healthy_weight_end_date);
            $imp_of_healthy_eating_start_date = !empty($obesity['imp_of_healthy_eating_start_date']) ? $obesity['imp_of_healthy_eating_start_date'] : "";
            $imp_of_healthy_eating_end_date = !empty($obesity['imp_of_healthy_eating_end_date']) ? $obesity['imp_of_healthy_eating_end_date'] : "";
            $imp_of_healthy_eating_status = $this->calculateStatus($imp_of_healthy_eating_start_date, $imp_of_healthy_eating_end_date);
            $diet_assist_start_date = !empty($obesity['diet_assist_start_date']) ? $obesity['diet_assist_start_date'] : "";
            $diet_assist_end_date = !empty($obesity['diet_assist_end_date']) ? $obesity['diet_assist_end_date'] : "";
            $diet_assist_status = $this->calculateStatus($diet_assist_start_date, $diet_assist_end_date);
            $moderate_activity_inaweek_start_date = !empty($obesity['moderate_activity_inaweek_start_date']) ? $obesity['moderate_activity_inaweek_start_date'] : "";
            $moderate_activity_inaweek_end_date = !empty($obesity['moderate_activity_inaweek_end_date']) ? $obesity['moderate_activity_inaweek_end_date'] : "";
            $moderate_activity_inaweek_status = $this->calculateStatus($moderate_activity_inaweek_start_date, $moderate_activity_inaweek_end_date);
            $referred_dietician_start_date = !empty($obesity['referred_dietician_start_date']) ? $obesity['referred_dietician_start_date'] : "";
            $referred_dietician_end_date = !empty($obesity['referred_dietician_end_date']) ? $obesity['referred_dietician_end_date'] : "";
            $referred_dietician_status = $this->calculateStatus($referred_dietician_start_date, $referred_dietician_end_date);
            $bmi = !empty($obesity['bmi']) ? $obesity['bmi'] : "";

            if ($bmi >= 25 && $bmi <= 29.9) {
                $obesity_outcomes['prognosis'] = "Good : BMI has improved since last visit, currently in overweight range, patient is working on diet and exercise";
            } elseif ($bmi >= 30 && $bmi <= 34.9) {
                $obesity_outcomes['prognosis'] = " Fair : BMI unchanged since last visit, currently in obese range, patient is working on diet and exercise";
            } elseif ($bmi >= 35 && $bmi <= 39.9) {
                $obesity_outcomes['prognosis'] = "Fair : BMI improved since last visit, currently in obese range, patient is working on diet and exercise";
            } elseif ($bmi >= 40) {
                $obesity_outcomes['prognosis'] = "Poor : BMI in Obesity Class 2 or morbidly obese range";
            }





            $obesity_outcomes['awareness_about_bmi_start_date'] = $awareness_about_bmi_start_date;
            $obesity_outcomes['awareness_about_bmi_end_date'] = $awareness_about_bmi_end_date;
            $obesity_outcomes['awareness_about_bmi_status'] = $awareness_about_bmi_status;
            $obesity_outcomes['need_of_weight_loss_start_date'] = $need_of_weight_loss_start_date;
            $obesity_outcomes['need_of_weight_loss_end_date'] = $need_of_weight_loss_end_date;
            $obesity_outcomes['need_of_weight_loss_status'] = $need_of_weight_loss_status;
            $obesity_outcomes['imp_of_healthy_weight_start_date'] = $imp_of_healthy_weight_start_date;
            $obesity_outcomes['imp_of_healthy_weight_end_date'] = $imp_of_healthy_weight_end_date;
            $obesity_outcomes['imp_of_healthy_weight_status'] = $imp_of_healthy_weight_status;
            $obesity_outcomes['imp_of_healthy_eating_start_date'] = $imp_of_healthy_eating_start_date;
            $obesity_outcomes['imp_of_healthy_eating_end_date'] = $imp_of_healthy_eating_end_date;
            $obesity_outcomes['imp_of_healthy_eating_status'] = $imp_of_healthy_eating_status;
            $obesity_outcomes['diet_assist_start_date'] = $diet_assist_start_date;
            $obesity_outcomes['diet_assist_end_date'] = $diet_assist_end_date;
            $obesity_outcomes['diet_assist_status'] = $diet_assist_status;
            $obesity_outcomes['moderate_activity_inaweek_start_date'] = $moderate_activity_inaweek_start_date;
            $obesity_outcomes['moderate_activity_inaweek_end_date'] = $moderate_activity_inaweek_end_date;
            $obesity_outcomes['moderate_activity_inaweek_status'] = $moderate_activity_inaweek_status;
            $obesity_outcomes['referred_dietician_start_date'] = $referred_dietician_start_date;
            $obesity_outcomes['referred_dietician_end_date'] = $referred_dietician_end_date;
            $obesity_outcomes['referred_dietician_status'] = $referred_dietician_status;
        }

        //CHF
        $chf_outcomes = [];
        if (!empty($questions_answers['cong_heart_failure'])) {
            $chf = $questions_answers['cong_heart_failure'];

            $ge_chf_start_date = !empty($chf['ge_chf_start_date']) ? $chf['ge_chf_start_date'] : "";
            $ge_chf_end_date = !empty($chf['ge_chf_end_date']) ? $chf['ge_chf_end_date'] : "";
            $ge_chf_status = $this->calculateStatus($ge_chf_start_date, $ge_chf_end_date);
            $ui_smoke_cessation_start_date = !empty($chf['ui_smoke_cessation_start_date']) ? $chf['ui_smoke_cessation_start_date'] : "";
            $ui_smoke_cessation_end_date = !empty($chf['ui_smoke_cessation_end_date']) ? $chf['ui_smoke_cessation_end_date'] : "";
            $ui_smoke_cessation_status = $this->calculateStatus($ui_smoke_cessation_start_date, $ui_smoke_cessation_end_date);
            $ui_sodium_diet_start_date = !empty($chf['ui_sodium_diet_start_date']) ? $chf['ui_sodium_diet_start_date'] : "";
            $ui_sodium_diet_end_date = !empty($chf['ui_sodium_diet_end_date']) ? $chf['ui_sodium_diet_end_date'] : "";
            $ui_sodium_diet_status = $this->calculateStatus($ui_sodium_diet_start_date, $ui_sodium_diet_end_date);
            $ui_fluid_restriction_start_date = !empty($chf['ui_fluid_restriction_start_date']) ? $chf['ui_fluid_restriction_start_date'] : "";
            $ui_fluid_restriction_end_date = !empty($chf['ui_fluid_restriction_end_date']) ? $chf['ui_fluid_restriction_end_date'] : "";
            $ui_fluid_restriction_status = $this->calculateStatus($ui_fluid_restriction_start_date, $ui_fluid_restriction_end_date);
            $uid_weight_monitoring_start_date = !empty($chf['uid_weight_monitoring_start_date']) ? $chf['uid_weight_monitoring_start_date'] : "";
            $uid_weight_monitoring_end_date = !empty($chf['uid_weight_monitoring_end_date']) ? $chf['uid_weight_monitoring_end_date'] : "";
            $uid_weight_monitoring_status = $this->calculateStatus($uid_weight_monitoring_start_date, $uid_weight_monitoring_end_date);
            $rs_excerbation_start_date = !empty($chf['rs_excerbation_start_date']) ? $chf['rs_excerbation_start_date'] : "";
            $rs_excerbation_end_date = !empty($chf['rs_excerbation_end_date']) ? $chf['rs_excerbation_end_date'] : "";
            $rs_excerbation_status = $this->calculateStatus($rs_excerbation_start_date, $rs_excerbation_end_date);
            $ri_adherence_start_date = !empty($chf['ri_adherence_start_date']) ? $chf['ri_adherence_start_date'] : "";
            $ri_adherence_end_date = !empty($chf['ri_adherence_end_date']) ? $chf['ri_adherence_end_date'] : "";
            $ri_adherence_status = $this->calculateStatus($ri_adherence_start_date, $ri_adherence_end_date);
            $seek_help_start_date = !empty($chf['seek_help_start_date']) ? $chf['seek_help_start_date'] : "";
            $seek_help_end_date = !empty($chf['seek_help_end_date']) ? $chf['seek_help_end_date'] : "";
            $seek_help_status = $this->calculateStatus($seek_help_start_date, $seek_help_end_date);

            $follow_up_cardio = !empty($chf['follow_up_cardio']) ? $chf['follow_up_cardio'] : "";
            $echocardiogram = !empty($chf['echocardiogram']) ? $chf['echocardiogram'] : "";
            $freq_recom_cardio = !empty($chf['freq_recom_cardio']) ? $chf['freq_recom_cardio'] : "";
            $no_echocardiogram = !empty($chf['no_echocardiogram']) ? $chf['no_echocardiogram'] : "";


            if ($follow_up_cardio == "No" && $echocardiogram == "No") {
                if ($no_echocardiogram == "patient_refused") {
                    $chf_outcomes['no_echodiogram'] = "Patient did not receive an echocardiogram in the last 1 year. Patient refused to get echocardiogram at this time. Patient advised in detail on the possible complications of not following up regularly to evaluate heart function";
                } elseif ($no_echocardiogram == "patient_adviced") {
                    $chf_outcomes['no_echodiogram'] = "Patient did not receive an echocardiogram in the last 1 year and was advised on the importance of echocardiograms done every 1-2 years to evaluate heart function in patients with CHF. Patient agrees to get echocardiogram done.";
                }
                $chf_outcomes['careplan'] = "Patient is not following up per recommendation, advised to set up and appointment with Cardiologist. " . $chf_outcomes['no_echodiogram'];
                $chf_outcomes['prognosis'] = "Poor – Patient is not having regular follow up, and not getting regular echocardiograms";
            } elseif ($follow_up_cardio == "No" && $echocardiogram == "Yes") {
                $chf_outcomes['careplan'] = "Patient received an echocardiogram in the last 1 year. Patient advised on importance of echocardiograms done every 1-2 years to evaluate heart function in patients with CHF.";
                $chf_outcomes['careplan'] = "Patient is not following up per recommendation, advised to set up and appointment with Cardiologist";
                $chf_outcomes['prognosis'] = "Patient is not having regular follow up but following up for regular echocardiograms";
            } elseif ($follow_up_cardio == "Yes" && $echocardiogram == "No") {
                if ($no_echocardiogram == "patient_refused") {
                    $chf_outcomes['patient_refused'] = "Patient did not receive an echocardiogram in the last 1 year. Patient refused to get echocardiogram at this time. Patient advised in detail on the possible complications of not following up regularly to evaluate heart function";
                } elseif ($no_echocardiogram == "patient_adviced") {
                    $chf_outcomes['patient_refused'] = "Patient did not receive an echocardiogram in the last 1 year and was advised on the importance of echocardiograms done every 1-2 years to evaluate heart function in patients with CHF. Patient agrees to get echocardiogram done.";
                }
                $chf_outcomes['careplan'] = "Patient follows up with their cardiologist as recommended. " . $chf_outcomes['patient_refused'];
                $chf_outcomes['prognosis'] = "Fair – Patient is having regular follow up but not following up for regular echocardiograms.";
            } elseif ($follow_up_cardio == "Yes" && $echocardiogram == "Yes") {
                $chf_outcomes['careplan'] = "Patient received an echocardiogram in the last 1 year. Patient advised on importance of echocardiograms done every 1-2 years to evaluate heart function in patients with CHF.";
                $chf_outcomes['careplan'] = "Patient follows up with their cardiologist as recommended. ";
                $chf_outcomes['prognosis'] = "Good -- Patient is having regular follow up and echocardiograms and compliant to treatment";
            }



            $chf_outcomes['ge_chf_start_date'] = $ge_chf_start_date;
            $chf_outcomes['ge_chf_end_date'] = $ge_chf_end_date;
            $chf_outcomes['ge_chf_status'] = $ge_chf_status;
            $chf_outcomes['ui_smoke_cessation_start_date'] = $ui_smoke_cessation_start_date;
            $chf_outcomes['ui_smoke_cessation_end_date'] = $ui_smoke_cessation_end_date;
            $chf_outcomes['ui_smoke_cessation_status'] = $ui_smoke_cessation_status;
            $chf_outcomes['ui_sodium_diet_start_date'] = $ui_sodium_diet_start_date;
            $chf_outcomes['ui_sodium_diet_end_date'] = $ui_sodium_diet_end_date;
            $chf_outcomes['ui_sodium_diet_status'] = $ui_sodium_diet_status;
            $chf_outcomes['ui_fluid_restriction_start_date'] = $ui_fluid_restriction_start_date;
            $chf_outcomes['ui_fluid_restriction_end_date'] = $ui_fluid_restriction_end_date;
            $chf_outcomes['ui_fluid_restriction_status'] = $ui_fluid_restriction_status;
            $chf_outcomes['uid_weight_monitoring_start_date'] = $uid_weight_monitoring_start_date;
            $chf_outcomes['uid_weight_monitoring_end_date'] = $uid_weight_monitoring_end_date;
            $chf_outcomes['uid_weight_monitoring_status'] = $uid_weight_monitoring_status;
            $chf_outcomes['rs_excerbation_start_date'] = $rs_excerbation_start_date;
            $chf_outcomes['rs_excerbation_end_date'] = $rs_excerbation_end_date;
            $chf_outcomes['rs_excerbation_status'] = $rs_excerbation_status;
            $chf_outcomes['ri_adherence_start_date'] = $ri_adherence_start_date;
            $chf_outcomes['ri_adherence_end_date'] = $ri_adherence_end_date;
            $chf_outcomes['ri_adherence_status'] = $ri_adherence_status;
            $chf_outcomes['seek_help_start_date'] = $seek_help_start_date;
            $chf_outcomes['seek_help_end_date'] = $seek_help_end_date;
            $chf_outcomes['seek_help_status'] = $seek_help_status;
        }


        /* Return Diagnosis to show only Disease section in monthlyCareplan */
        $patient_diseases = [
            "Depression" => false,
            "CongestiveHeartFailure" => false,
            "ChronicObstructivePulmonaryDisease" => false,
            "CKD" => false,
            "DiabetesMellitus" => false,
            "Hypertensions" => false,
            "Obesity" => false,
            "Hypercholesterolemia" => false,
            "anemia" => false,
            "hyperthyrodism" => false,
            "asthma" => false,
        ];

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
                $key = array_keys($data)[0];
                $patient_diseases[$key] = true;
            }
        }

        $response = [
            'row' => $row,
            'fall_screening' => $fallScreeningOutcomes ?? [],
            'depression_out_comes' => $depression_OutComes ?? [],
            'cognitive_assessment' => $cognitiveOutcomes ?? [],
            'caregiver_assesment_outcomes' => $caregiver_assesment_outcomes ?? [],
            'other_providers_outcome' => $other_providers_outcome ?? [],
            'hypercholestrolemia_outcomes' => $hypercholestrolemia_outcomes ?? [],
            'general_assessment_outcomes' => $general_assessment_outcomes ?? [],
            'monthly_assessment_outcomes' => $monthly_assessment_outcomes ?? [],
            'screening' => $screening ?? [],
            'immunization' => $immunization ?? [],
            'ckd_outcomes' => $ckd_outcomes ?? [],
            'copd_outcomes' => $copd_outcomes ?? [],
            'diabetes_outcome' => $diabetes_outcome ?? [],
            'hypertension_outcomes' => $hypertension_outcomes ?? [],
            'obesity_outcomes' => $obesity_outcomes ?? [],
            'chf_outcomes' => $chf_outcomes ?? [],
            'chronic_disease'=>$patient_diseases ?? [],
        ];
        return response()->json($response);
    }


    /* Fall screening Careplan */
    private function fallscreening($fallscreening)
    {
        $fallScreeningOutcomes = [];
        if (!empty($fallscreening)) {

            $fallinpastYear = !empty($fall_screening['fall_in_one_year']) ? $fall_screening['fall_in_one_year'] : "";
            $noOfFall = !empty($fall_screening['number_of_falls']) ? $fall_screening['number_of_falls'] : 0;
            $fallInjury = !empty($fall_screening['injury']) ? $fall_screening['injury'] : '';
            $physicalTherapy = !empty($fall_screening['physical_therapy']) ? $fall_screening['physical_therapy'] : '';
            $blackingOut = !empty($fall_screening['blackingout_from_bed']) ? $fall_screening['blackingout_from_bed'] : '';
            $assistanceDevice = !empty($fall_screening['assistance_device']) ? $fall_screening['assistance_device'] : '';
            $unsteady = !empty($fall_screening['unsteady_todo_things']) ? $fall_screening['unsteady_todo_things'] : '';

            /* Outcome  */
            $blacking_out = "";
            if ($blackingOut == "Yes" && $unsteady == "Yes") {
                $blacking_out = 'Patient feels blacking out and is unsteady with ambulation';
            } else if ($blackingOut == "Yes" && $unsteady == "No") {
                $blacking_out = 'Patient feels blacking out';
            } else if ($blackingOut == "No" && $unsteady == "Yes") {
                $blacking_out = 'Patient is unsteady with ambulation';
            }

            $use_assistance_device = "";
            if ($blacking_out != "" && $assistanceDevice != "" && $assistanceDevice != 'None') {
                $use_assistance_device = ', will continue to use ' . $assistanceDevice . ' for mobilization. ';
            } else if ($blacking_out == "" && $assistanceDevice != "" && $assistanceDevice != 'None') {
                $use_assistance_device = 'Patient is using ' . $assistanceDevice . ' for mobilization. ';
            } else if ($assistanceDevice != "" && $assistanceDevice == 'None') {
                $use_assistance_device = '. Patient is not using any assistive device';
            }


            $physical_therapy_refferal = "";
            if ($physicalTherapy != "") {
                if ($physicalTherapy == 'Referred') {
                    $physical_therapy_refferal = "Physical therapy referral for muscle strengthening, gain training & balance, and home safety checklist provided.";
                } else if ($physicalTherapy == 'Already receiving') {
                    $physical_therapy_refferal = "Already receiving physical therapy.";
                } else {
                    $physical_therapy_refferal = "Patient refused Physical therapy.";
                }
            }


            if ($fallinpastYear == 'Yes') {
                $number_of_fall = $noOfFall != 0 ? $noOfFall . ' fall in the last 1 year' : '';
                $fall_with_injury = $fallInjury != "" ? ', with injury. ' : 'with no injury. ';
                $fallScreeningOutcomes['outcome'] = $number_of_fall . $fall_with_injury . $blacking_out . $use_assistance_device . $physical_therapy_refferal;
            } else {
                $fallScreeningOutcomes['outcome'] = 'No fall in last 1 year. ' . $blacking_out . $use_assistance_device . $physical_therapy_refferal;
            }
        }

        return $fallScreeningOutcomes;
    }


    /* Depression Careplan */
    private function depressionphq_9($depression)
    {
        $depression_OutComes = [];
        if (!empty($depression)) {
            $depression_score = array_sum($depression);

            if ($depression_score == 0) {
                $depression_OutComes['severity'] = "Depression PHQ9 score is ".$depression_score.". Patient is not depressed";
            } elseif ($depression_score > 0 && $depression_score <= 4) {
                $depression_OutComes['severity'] = "Depression PHQ9 score is ".$depression_score.". Minimal depression";
            } elseif ($depression_score > 4 && $depression_score <= 9) {
                $depression_OutComes['severity'] = "Depression PHQ9 score is ".$depression_score.". Mild depression";
            } elseif ($depression_score > 9 && $depression_score <= 14) {
                $depression_OutComes['severity'] = "Depression PHQ9 score is ".$depression_score.". Moderate depression";
            } elseif ($depression_score > 14 && $depression_score <= 20) {
                $depression_OutComes['severity'] = "Depression PHQ9 score is ".$depression_score.". Moderately Severe depression";
            } elseif ($depression_score > 20 && $depression_score <= 27) {
                $depression_OutComes['severity'] = "Depression PHQ9 score is ".$depression_score.". Severe depression";
            }

            if ($depression_score > 9) {
                $depression_OutComes['referrals'] = "Referred to Mental Health Professional.";
                $depression_OutComes['referrals1'] = "Referred to BHI program.";
                $depression_OutComes['flag'] = true;
            }
        }
        return $depression_OutComes;
    }


    /* General Health Careplan */
    private function generalhealthscreening($highstress, $general_health, $social_emotional_support, $pain)
    {
        $careplan_outcome = [];

        /* For High Stress */
        if (!empty($highstress)) {
            $stressLevel = $highstress['stress_problem'];

            switch ($stressLevel) {
                case 'Always':
                case 'Often':
                    $high_stress['outcome'] = $stressLevel . ': Options for therapy discussed with patient.';
                    break;

                case 'Never or Rarely':
                    $high_stress['outcome'] = 'Never or rarely';
                    break;

                case 'Sometimes':
                    $high_stress['outcome'] = $stressLevel;
                    break;
                default:
                    $high_stress['outcome'] = "";
                    break;
            }

            $careplan_outcome['high_stress'] = $high_stress;
        }

        /* For general health Screening */
        if (!empty($general_health)) {

            $general_health['health_level'] = (!empty($general_health['health_level'])) ? $general_health['health_level'] . ' for age' : '';
            $general_health['mouth_and_teeth'] = (!empty($general_health['mouth_and_teeth'])) ? $general_health['mouth_and_teeth'] : '';
            $general_health['feelings_cause_distress'] = (!empty($general_health['feeling_caused_distress'])) ? $general_health['feeling_caused_distress'] : '';

            if ($general_health['health_level'] == 'Poor' || $general_health['mouth_and_teeth'] == 'Poor' || $general_health['feelings_cause_distress'] == 'Yes') {
                $general_health['flag'] = true;
            }

            $careplan_outcome['general_health'] = $general_health;
        }

        /* For Social and Emotional Supoort */
        if (!empty($social_emotional_support)) {
            $supportLevel = (!empty($social_emotional_support)) ? $social_emotional_support['get_social_emotional_support'] : '';
            $social_emotional_support['outcome'] = "";

            if ($supportLevel != "") {
                switch ($supportLevel) {
                    case 'Always':
                        $social_emotional_support['outcome'] = $supportLevel . ' available.';
                        break;

                    default:
                        $social_emotional_support['outcome'] = $supportLevel . ' available: Options for therapy discussed with patient.';
                        break;
                }
            }

            $careplan_outcome['social_emotional_support'] = $social_emotional_support;
        }

        /* For Pain Screening */
        if (!empty($pain)) {
            $painLevel = (!empty($pain)) ? $pain['pain_felt'] : '';
            $pain['outcome'] = $painLevel;
            if ($painLevel == 'Alot') {
                $pain['outcome'] = $pain['outcome'] . ': Pain management considered.';
            }

            $careplan_outcome['pain'] = $pain;
        }

        return $careplan_outcome;
    }


    /* Cognitive Assessment Careplan */
    private function cognitive_assessment($cognitive_assessment) 
    {
        $cognitiveOutcomes = [];
        if (!empty($cognitive_assessment)) {

            $yearRecalled = $monthRecalled = $hourRecalled = $reverseCount = $reverseMonth = $addressRecalled = 0;

            if (!empty($cognitive_assessment['year_recalled'])) {
                $yearRecalled = $cognitive_assessment['year_recalled'] == 'incorrect' ? 4 : 0;
            }

            if (!empty($cognitive_assessment['month_recalled'])) {
                $monthRecalled = $cognitive_assessment['month_recalled'] == 'incorrect' ? 3 : 0;
            }

            if (!empty($cognitive_assessment['hour_recalled'])) {
                $hourRecalled = $cognitive_assessment['hour_recalled'] == 'incorrect' ? 3 : 0;
            }

            if (!empty($cognitive_assessment['reverse_count'])) {
                $reverseCount = ($cognitive_assessment['reverse_count']) == '1 error' ? 2 : (($cognitive_assessment['reverse_count'] == 'more than 1 error') ? 4 : 0);
            }

            if (!empty($cognitive_assessment['reverse_month'])) {
                $reverseMonth = ($cognitive_assessment['reverse_month']) == '1 error' ? 2 : (($cognitive_assessment['reverse_month'] == 'more than 1 error') ? 4 : 0);
            }

            if (!empty($cognitive_assessment['address_recalled'])) {
                $errorArray = Config::get('constants')['error_options_c'];
                foreach ($errorArray as $key => $value) {
                    if ($cognitive_assessment['address_recalled'] == $value) {
                        $addressRecalled = (int)$key;
                    }
                }
            }

            $cogScore = $yearRecalled + $monthRecalled + $hourRecalled + $reverseCount + $reverseMonth + $addressRecalled;

            if ($cogScore <= 7) {
                $cognitiveOutcomes['outcome'] = 'Referral not necessary at present.';
            } elseif ($cogScore >= 8 && $cogScore <= 9) {
                $cognitiveOutcomes['outcome'] = 'Probably refer.';
            } elseif ($cogScore >= 10 && $cogScore <= 28) {
                $cognitiveOutcomes['outcome'] = 'Referral provided';
            }
        }

        return $cognitiveOutcomes;
    }


    /* Physical Activity Screening */
    private function physical_activity($physical_activities)
    {
        $physicalActivitiesOutComes = [];
        if (!empty($physical_activities)) {
            if (!empty($physical_activities['does_not_apply'])) {
                $physicalActivitiesOutComes['outcome'] = 'Not Applicable, N/A, Patient is unable to perform exercise due to medical issue';
            } else {
                $totalMinuts = @$physical_activities['days_of_exercise'] * @$physical_activities['mins_of_exercise'];
                $intensity = !empty($physical_activities['exercise_intensity']) ? $physical_activities['exercise_intensity'] : "";
    
                $highIntensityArray = ['moderate', 'heavy', 'veryheavy'];
    
                if ($totalMinuts >= 150 && in_array($intensity, $highIntensityArray)) {
                    $physicalActivitiesOutComes['outcome'] = 'Patient is exercising as per recommendation. CDC guidelines for physical activity given.';
                } else {
                    $physicalActivitiesOutComes['outcome'] = 'Patient counseled to exercise - recommended 150 minutes of moderate activity per week. CDC guidelines for physical activity provided.';
                    // $physicalActivitiesOutComes['flag'] = true;
                }
            }
        }

        return $physicalActivitiesOutComes;
    }


    /* Alcohol Use screening */
    private function alcohol_use_screening($alcohol_usage, $row)
    {
        $alcoholOutComes = [];
        if (!empty($alcohol_usage)) {
            $drinksPerWeek = (int)@$alcohol_usage['days_of_alcoholuse'] * (int)@$alcohol_usage['drinks_per_day'];
            $drinksPerCccasion = (int)@$alcohol_usage['drinks_per_occasion'];
    
            $heavyDrinks = $bingDrinks = 0;
            $gender = $row['patient']['gender'];
            if ($gender == "Male") {
                $heavyDrinks = $drinksPerWeek > 15 ? true : false;
                $bingDrinks = $drinksPerCccasion > 5 ? true : false;
            } else {
                $heavyDrinks = $drinksPerWeek > 8 ? true : false;
                $bingDrinks = $drinksPerCccasion > 4 ? true : false;
            }
    
            if ($heavyDrinks && $bingDrinks) {
                $alcoholOutComes['outcome'] = "Patient is a heavy and a binge drinker. Counseled and dietary guidelines for alcohol provided.";
            } elseif ($heavyDrinks && !$bingDrinks) {
                $alcoholOutComes['outcome'] = "Patient is a heavy drinker. Counseled and dietary guidelines for alcohol provided.";
            } elseif (!$heavyDrinks && $bingDrinks) {
                $alcoholOutComes['outcome'] = "Patient is a binge drinker. Counseled and dietary guidelines for alcohol provided.";
            } else {
                $alcoholOutComes['outcome'] = "Patient is not accustomed to heavy and binge drinking. Counseled and dietary guidelines for alcohol provided.";
            }
    
            /* if ($heavyDrinks || $bingDrinks) {
                $alcoholOutComes['flag'] = true;
            } */
        }

        return $alcoholOutComes;
    }


    /* Tobacoo screening */
    private function tobacco_use_screening($tobacco_usage)
    {
        $tobaccoOutComes = [];
        if (!empty($tobacco_usage)) {
            $ldctCounseling = "";

            $averagePacksperYear = !empty($tobacco_usage['average_packs_per_year']) ? $tobacco_usage['average_packs_per_year'] : 0;
            $performLdct = (!empty($tobacco_usage['perform_ldct']) && $tobacco_usage['perform_ldct'] == "Yes" ? true : false);

            /* LDCT OUTCOME */
            if ($averagePacksperYear >= 30) {
                if ($performLdct) {
                    $tobaccoOutComes['ldct_counseling'] = "referral sent to KRMC for LDCT";
                } /*else {
                    $tobaccoOutComes['ldct_counseling'] = "Patient refused LDCT";
                }*/
            } else {
                $tobaccoOutComes['ldct_counseling'] = "Patient does not use tobacco, LDCT not applicable";
            }

            /* QUIT TOBACCO OUTCOME*/
            $quitTobacoo = "";
            $acceptQuittobacco = !empty($tobacco_usage['quit_tobacco']) ? $tobacco_usage['quit_tobacco'] : '';
            $tobacooAlternate = $tobacco_usage['tobacoo_alternate'] ?? '';
            $tobacooAlternateQty = !empty($tobacco_usage['tobacoo_alternate_qty']) ? $tobacco_usage['tobacoo_alternate_qty'] : "";
            if ($acceptQuittobacco == 'Yes' && $tobacooAlternate != "Refused") {
                $tobaccoOutComes['quit_tobacoo'] = 'Tobacco screening and cessation counseling perfomred. CDC guidelines given,' . ($tobacooAlternate != "" ? $tobacooAlternate : '') . ($tobacooAlternateQty != "" ? ' ' . $tobacooAlternateQty . ' started' : '');
            } elseif ($acceptQuittobacco == 'Yes' && $tobacooAlternate == "Refused") {
                $tobaccoOutComes['quit_tobacoo'] = 'Tobacco screening and cessation counseling perfomred. CDC guidelines given, Refused to start any other tobacoo alternate';
            } elseif ($acceptQuittobacco == 'No') {
                $tobaccoOutComes['quit_tobacoo'] = 'Patient is not interested in quitting tobacco use. ';
            }

            if ($averagePacksperYear >= 30 && !$performLdct) {
                $tobaccoOutComes['flag'] = true;
            }
        }

        return $tobaccoOutComes;
    }


    /* Immunization screening careplan */
    private function immunization_screening($immunization)
    {
        $immunizationOutcomes = [];
        if (!empty($immunization)) {
            $refusedFluVaccine = !empty($immunization['flu_vaccine_refused']) && $immunization['flu_vaccine_refused'] == 'Yes' ? true : false;
            $scriptFluVaccine = !empty($immunization['flu_vaccine_script_given']) ? $immunization['flu_vaccine_script_given'] : "";
            $recievedFluvaccineOn = !empty($immunization['flu_vaccine_recieved_on']) ? $immunization['flu_vaccine_recieved_on'] : "";
            $recievedFluvaccine = !empty($immunization['flu_vaccine_recieved']) ? $immunization['flu_vaccine_recieved'] : "";
            $recievedFluvaccineAt = !empty($immunization['flu_vaccine_recieved_at']) ? $immunization['flu_vaccine_recieved_at'] : "";

            if ($refusedFluVaccine) {
                $immunizationOutcomes['flu_vaccine'] = "Patient refused flu vaccine";
            } else if ($recievedFluvaccine != "" && $recievedFluvaccine == 'Yes') {
                $immunizationOutcomes['flu_vaccine'] = "Received flu vaccine " . ($recievedFluvaccineOn != "" ? "on " . $recievedFluvaccineOn : "") . ($recievedFluvaccineAt != "" ? " at " . $recievedFluvaccineAt : "");
            } else if (!$refusedFluVaccine && $recievedFluvaccine == "No") {
                $immunizationOutcomes['flu_vaccine'] = "Patient did not received flu vaccine.";
            }

            if ($scriptFluVaccine == "Yes") {
                $immunizationOutcomes['flu_vaccine_script'] = "Script given for flu vaccine";
            } else if ($scriptFluVaccine  == "No") {
                $immunizationOutcomes['flu_vaccine_script'] = "Script for flu vaccine is not provided.";
            }



            $refusedPneumococcalVaccine = !empty($immunization['pneumococcal_vaccine_refused']) && $immunization['pneumococcal_vaccine_refused'] == "Yes" ? true : false;
            $pneumococcalVaccine_received = !empty($immunization['pneumococcal_vaccine_recieved']) && $immunization['pneumococcal_vaccine_recieved'] == "Yes" ? true : false;
            
            $prevnarRecieved_on = !empty($immunization['pneumococcal_prevnar_recieved_on']) ? $immunization['pneumococcal_prevnar_recieved_on'] : "";
            $prevnarRecieved_at = !empty($immunization['pneumococcal_prevnar_recieved_at']) ? $immunization['pneumococcal_prevnar_recieved_at'] : "";

            $ppsvRecieved_on = !empty($immunization['pneumococcal_ppsv23_recieved_on']) ? $immunization['pneumococcal_ppsv23_recieved_on'] : "";
            $ppsvRecieved_at = !empty($immunization['pneumococcal_ppsv23_recieved_at']) ? $immunization['pneumococcal_ppsv23_recieved_at'] : "";

            $scriptPneumococcalVaccine = !empty($immunization['pneumococcal_vaccine_script_given']) && $immunization['pneumococcal_vaccine_script_given'] == "Yes" ? true : false;

            if ($refusedPneumococcalVaccine) {
                $immunizationOutcomes['pneumococcal_vaccine'] = "Patient refused Pneumococcal vaccine";
            } elseif ($pneumococcalVaccine_received) {
                if ($prevnarRecieved_on == "" && $ppsvRecieved_on == "") {
                    $immunizationOutcomes['pneumococcal_vaccine'] = 'Pneumococcal vaccine received';
                } else {
                    if (!empty($prevnarRecieved_on)) {
                        $immunizationOutcomes['pneumococcal_vaccine'] = "Received Prevnar 13 on " . $prevnarRecieved_on . ' at ' .$prevnarRecieved_at;
                    }

                    if (!empty($ppsvRecieved_on)) {
                        if (isset($immunizationOutcomes['pneumococcal_vaccine'])) {
                            $immunizationOutcomes['pneumococcal_vaccine'] .= ". Received PPSV 33 on " . $ppsvRecieved_on . ' at ' .$ppsvRecieved_at;
                        } else {
                            $immunizationOutcomes['pneumococcal_vaccine'] = "Received PPSV 33 on " . $ppsvRecieved_on . ' at ' .$ppsvRecieved_at;
                        }
                    }
                }
            }

            if ($scriptPneumococcalVaccine) {
                $immunizationOutcomes['pneumococcal_vaccine_script'] = "Script given for Prevnar 13 / PPSV 23";
            }


            $fluNextDue = $lastFluVaccine = '';
            if (!empty($recievedFluvaccineOn)) {
                $fluVaccineDate = $recievedFluvaccineOn;
                $monthYear = explode('/', $fluVaccineDate);

                $current_month = Carbon::now()->format('m');
                $current_Year = Carbon::now()->format('Y');

                $lastFluVaccine = $this->diffinMonths($monthYear, '1');

                $fluNextDue = Carbon::createFromDate($monthYear[1], $monthYear[0])->startOfMonth()->addMonth(12)->format('m/Y');

                $next_flu_vaccine = explode('/', $fluNextDue);


                if ($lastFluVaccine > 12 && $current_Year >= $next_flu_vaccine[1]) {

                    $flu_months = ['1', '2', '3', '4', '8', '9', '10', '11', '12'];
                    if (in_array($current_month, $flu_months)) {
                        $fluNextDue = Carbon::create()->startOfMonth()->month($current_month)->year($current_Year)->format('m/Y');
                    } else {
                        $fluNextDue = Carbon::create()->startOfMonth()->month(8)->year($current_Year)->format('m/Y');
                    }
                }

                $immunizationOutcomes['nextFluVaccine'] = $fluNextDue;
            }

            $fluNextDue = $lastFluVaccine = '';


            if ($lastFluVaccine >= 12) {
                $immunizationOutcomes['flag'] = true;
            }
        }

        return $immunizationOutcomes;
    }


    /* Screening Care plan */
    private function screening($screening, $row)
    {
        $screeningOutcomes = [];

        if (!empty($screening)) {
            /* MAMMOGRAM */
            $refused_mammogram = !empty($screening['mammogram_refused']) && $screening['mammogram_refused'] == "Yes" ? true : false;
            $mammogram_done = !empty($screening['mammogram_done']) && $screening['mammogram_done'] == "Yes" ? true : false;
            $script_mammogram = !empty($screening['mammogram_script']) && $screening['mammogram_script'] == "Yes" ? true : false;
            $next_mammogram = !empty($screening['next_mommogram']) ? $screening['next_mommogram'] : "";
            $lastMammogramDiff = '';

            $patientAge = $row['patient']['age'];
            $gender = $row['patient']['gender']; 

            if ($patientAge < 76 && strtoupper($gender) != "MALE") {
                if ($refused_mammogram) {
                    $screeningOutcomes["mammogram"] = "Refused Mammogram";
                } elseif ($mammogram_done) {
                    $mammogram_on = !empty($screening['mammogram_done_on']) ? $screening['mammogram_done_on'] : "";
                    $mammogram_at = !empty($screening['mammogram_done_at']) ? $screening['mammogram_done_at'] : "";
                    $mammogram_report_reviewed = !empty($screening['mommogram_report_reviewed']) && $screening['mommogram_report_reviewed'] == 1 ? "Report reviewed" : "";
                    $screeningOutcomes["mammogram"] = "Mammogram done on " . $mammogram_on . ($mammogram_at != "" ? " at " . $mammogram_at : " ") . '. ' . $mammogram_report_reviewed;

                    if ($mammogram_on != "") {
                        $monthYear = explode('/', $mammogram_on);
                        $lastMammogramDiff = $this->diffinMonths($monthYear, '2');
                    }
                }

                if ($refused_mammogram || !$mammogram_done || $lastMammogramDiff > 27) {
                    $screeningOutcomes["mammogaram_flag"] = true;
                }

                if (!empty($next_mammogram)) {
                    $screeningOutcomes["next_mammogram"] = "Next Mammogram due on " . $next_mammogram;
                    $screeningOutcomes["next_mammogram_date"] = $next_mammogram;
                }

                if ($script_mammogram) {
                    $screeningOutcomes["mammogram_script"] = "Script given for the Screening Mammogram";
                }
            } else {
                $screeningOutcomes["mammogram"] = 'N/A due to age';
                if ($gender == "Male") {
                    $screeningOutcomes["mammogram"] = 'Not Eligible';
                }
            }



            /* COLONOSCOPY */
            $refused_colonoscopy = !empty($screening['colonoscopy_refused']) && $screening['colonoscopy_refused'] == "Yes" ? true : false;
            $colonoscopy_done = !empty($screening['colonoscopy_done']) && $screening['colonoscopy_done'] == "Yes" ? true : false;
            $script_colonoscopy = !empty($screening['colonoscopy_script']) && $screening['colonoscopy_script'] == "Yes" ? true : false;
            $next_colonoscopy = !empty($screening['next_colonoscopy']) ? $screening['next_colonoscopy'] : "";
            $testType = !empty($screening['colon_test_type']) ? $screening['colon_test_type'] : "";
            $colonoscopy_on = "";
            
            if ($patientAge < 77) {
                if ($refused_colonoscopy) {
                    $screeningOutcomes["colonoscopy"] = "Refused Colonoscopy & FIT Test";
                } elseif ($colonoscopy_done) {
                    $colonoscopy_on = !empty($screening['colonoscopy_done_on']) ? $screening['colonoscopy_done_on'] : "";
                    $colonoscopy_at = !empty($screening['colonoscopy_done_at']) ? $screening['colonoscopy_done_at'] : "";
                    $colonoscopy_report_reviewed = !empty($screening['colonoscopy_report_reviewed']) && $screening['colonoscopy_report_reviewed'] == 1 ? "Report reviewed" : "";
                    if ($testType != "") {
                        $screeningOutcomes["colonoscopy"] = $testType . " done on " . $colonoscopy_on . ($colonoscopy_at != "" ? " at " . $colonoscopy_at : " ") . ' ' . $colonoscopy_report_reviewed;
                    }
                }

                if (!empty($next_colonoscopy)) {
                    $screeningOutcomes["next_colonoscopy"] = "Next " . $testType . " due on " . $next_colonoscopy;
                    $screeningOutcomes["test_type"] = $testType;
                    $screeningOutcomes["next_col_fit_guard"] = $next_colonoscopy;
                }

                if ($script_colonoscopy) {
                    $screeningOutcomes["colonoscopy_script"] = "Script given for the Screening Colonoscopy";
                }


                $lastTestExpired = false;
                if ($testType != "") {
                    if ($colonoscopy_on != "") {
                        $monthYear = explode('/', $colonoscopy_on);
                        $lastTestDiff = $this->diffinMonths($monthYear, '3');

                        if ($testType == 'Colonoscopy') {
                            $lastTestExpired = ($lastTestDiff > 120 ? true : false);
                        } elseif ($testType == 'Fit Test') {
                            $lastTestExpired = ($lastTestDiff > 12 ? true : false);
                        } elseif ($testType == 'Cologuard') {
                            $lastTestExpired = ($lastTestDiff > 24 ? true : false);
                        }
                    }
                }

                if (($refused_colonoscopy || !$colonoscopy_done || $lastTestExpired)) {
                    $screeningOutcomes["colo_flag"] = true;
                }
            } else {
                $screeningOutcomes["colonoscopy"] = 'N/A due to age';
            }
        }

        return $screeningOutcomes;
    }


    /* Diabetes Screening */
    private function diabetes_screening($diabatesScreening)
    {
        $diabetesOutcomes = [];
        if (!empty($diabatesScreening)) {
            $diabetec_patient = !empty($diabatesScreening['diabetec_patient']) ? $diabatesScreening['diabetec_patient'] : false;
            $fbs_in_year = !empty($diabatesScreening['fbs_in_year']) && $diabatesScreening['fbs_in_year'] == "Yes" ? true : false;
            $fbs_value = !empty($diabatesScreening['fbs_value']) ? (int)$diabatesScreening['fbs_value'] : '';
            $fbs_date = !empty($diabatesScreening['fbs_date']) ? $diabatesScreening['fbs_date'] : '';
            $hba1c_value = !empty($diabatesScreening['hba1c_value']) ? $diabatesScreening['hba1c_value'] : '';
            $hba1c_date = !empty($diabatesScreening['hba1c_date']) ? $diabatesScreening['hba1c_date'] : '';

            /* FASTING BLOOD SUGAR (FBS) SECTION */
            if ($diabetec_patient == 'No') {
                if (!$fbs_in_year || $fbs_value == '') {
                    $diabetesOutcomes['diabetes'] = "Fasting Blood Sugar ordered";
                    // $diabetesOutcomes['flag'] = true;
                } else {
                    if (!empty($fbs_value) && !empty($fbs_date)) {
                        $current_Date = Carbon::now()->floorMonth();
                        $dateMonthArray = explode('/', $fbs_date);
                        $month_fbs = $dateMonthArray[0];
                        $year_fbs = $dateMonthArray[1];

                        $date_format = Carbon::createFromDate($year_fbs, $month_fbs)->startOfMonth();
                        $lastfbs_monthdiff = $current_Date->diffInMonths($date_format, '4');

                        if ($lastfbs_monthdiff > 12) {
                            $diabetesOutcomes['diabetes'] = 'Patient Fasting Blood Sugar is ' . $fbs_value . ' on ' . $fbs_date . '. FBS ordered. ';
                        } elseif ($hba1c_value != "" && $hba1c_date != "") {
                            $current_Date = Carbon::now()->floorMonth();
                            $dateMonthArray = explode('/', $hba1c_date);
                            $month_hba1c = $dateMonthArray[0];
                            $year_hba1c = $dateMonthArray[1];
                            $date_format = Carbon::createFromDate($year_hba1c, $month_hba1c)->startOfMonth();

                            $lasthba1c_monthdiff = $current_Date->diffInMonths($date_format, '5');

                            if ($lasthba1c_monthdiff > 6) {
                                $diabetesOutcomes['diabetes'] = 'Patient Fasting Blood Sugar is ' . $fbs_value . ' on ' . $fbs_date . '. HBA1C ordered';
                            } else {
                                if ($hba1c_value <= 5.6) {
                                    $diabetesOutcomes['diabetes'] = 'Patient Fasting Blood Sugar is ' . $fbs_value . ' on ' . $fbs_date . '. Patient HBA1C is ' . $hba1c_value . ' on ' . $hba1c_date;
                                } elseif ($hba1c_value > 5.6 && $hba1c_value <= 6.4) {
                                    $diabetesOutcomes['diabetes'] = 'Patient Fasting Blood Sugar is ' . $fbs_value . ' on ' . $fbs_date . '. Patient HBA1C is ' . $hba1c_value . ' on ' . $hba1c_date . ' will monitor HBA1C';
                                } elseif ($hba1c_value >= 6.5 && $hba1c_value <= 6.9) {
                                    $diabetesOutcomes['diabetes'] = 'HBA1C is ' . $hba1c_value . '. Patient has new onset DM. Urine Microalbuminemia and Eye examination ordered.';
                                } elseif ($hba1c_value >= 6.9 && $hba1c_value <= 8.5) {
                                    $diabetesOutcomes['diabetes'] = 'HBA1C is ' . $hba1c_value . '. Patient has new onset DM. Urina Microalbuminemia and Eye examination ordered. “Notify Doctor” ';
                                } elseif ($hba1c_value >= 8.5) {
                                    $diabetesOutcomes['diabetes'] = 'HBA1C is ' . $hba1c_value . '. Patient has new onset DM. Urina Microalbuminemia and Eye examination ordered. Referred to Diabetic Clinic for intensive Diabetic control. ';
                                    if ($fbs_value > 110) {
                                        $diabetesOutcomes['flag'] = true;
                                    }
                                }

                                if ($hba1c_value >= 6.5) {
                                    $diabetesOutcomes['is_diabetic'] = 'Yes';
                                }
                            }

                            if (!($lasthba1c_monthdiff > 6)) {
                                $nextHba1c_date = Carbon::createFromDate($year_hba1c, $month_hba1c)->startOfMonth()->addMonth(6)->format('m/Y');
                                $diabetesOutcomes['next_hba1c_date'] = $nextHba1c_date;
                            }
                        } else {
                            if ($fbs_value > 100) {
                                $diabetesOutcomes['diabetes'] = 'Patient Fasting Blood Sugar is ' . $fbs_value . ' on ' . $fbs_date . '. HBA1C ordered.';
                            } else {
                                $diabetesOutcomes['diabetes'] = 'Patient Fasting Blood Sugar is ' . $fbs_value . ' on ' . $fbs_date . '.';
                            }
                        }
                        $nextFbs_date = Carbon::createFromDate($year_fbs, $month_fbs)->startOfMonth()->addMonth(12)->format('m/Y');
                        $diabetesOutcomes['next_fbs_date'] = $nextFbs_date;
                    }

                }
            } elseif ($diabetec_patient == 'Yes') {    //HBA1C SECTION
                if ($hba1c_value != "" && $hba1c_date != "") {
                    $current_Date = Carbon::now()->floorMonth();
                    $dateMonthArray = explode('/', $hba1c_date);
                    $month = $dateMonthArray[0];
                    $year = $dateMonthArray[1];

                    $date_format = Carbon::createFromDate($year, $month)->startOfMonth();

                    $lasthba1c_monthdiff = $current_Date->diffInMonths($date_format, '6');

                    if ($lasthba1c_monthdiff > 6) {
                        $diabetesOutcomes['diabetes'] = 'HBA1C ordered';
                        $diabetesOutcomes['flag'] = true;
                    } elseif ($hba1c_value != "") {
                        if ($hba1c_value >= 8.5) {
                            $diabetesOutcomes['diabetes'] = 'HBA1C is ' . $hba1c_value . '. Referred to Diabetic Clinic for intensive Diabetic control. ';
                            $diabetesOutcomes['flag'] = true;
                        } else {
                            $diabetesOutcomes['diabetes'] = 'HBA1C is ' . $hba1c_value . ($hba1c_date != "" ? ' on '.$hba1c_date :"").'. Controlled';
                        }
                    } else {
                        $diabetesOutcomes['diabetes'] = 'HBA1C ordered.';
                    }

                    $nextHba1c_date = Carbon::createFromDate($year, $month)->startOfMonth()->addMonth(6)->format('m/Y');
                    $diabetesOutcomes['next_hba1c_date'] = $nextHba1c_date;
                    $diabetesOutcomes['is_diabetic'] = 'Yes';
                }
            }

            if ($diabetec_patient == 'Yes' || ($diabetec_patient == 'No' && $hba1c_value >= 6.5)) {
                /* Dibetes EYE EXAM */
                $diabetec_eye_exam = !empty($diabatesScreening['diabetec_eye_exam']) && $diabatesScreening['diabetec_eye_exam'] == "Yes" ? true : false;
                $diabetec_eye_exam_report = !empty($diabatesScreening['diabetec_eye_exam_report']) ? $diabatesScreening['diabetec_eye_exam_report'] : '';
                $eye_exam_doctor = !empty($diabatesScreening['eye_exam_doctor']) ? ' by Dr.' . $diabatesScreening['eye_exam_doctor'] : '';
                $eye_exam_date = !empty($diabatesScreening['eye_exam_date']) ? $diabatesScreening['eye_exam_date'] : '';
                $eye_exam_facility = !empty($diabatesScreening['eye_exam_facility']) ? $diabatesScreening['eye_exam_facility'] : '';
                $diabetec_eye_exam_reviewed = !empty($diabatesScreening['eye_exam_report_reviewed']) && $diabatesScreening['eye_exam_report_reviewed'] == "1" ? true : false;
                $diabetec_diabetec_ratinopathy = !empty($diabatesScreening['diabetec_ratinopathy']) && $diabatesScreening['diabetec_ratinopathy'] == "Yes" ? true : false;
                $ratinavueordered = !empty($diabatesScreening['ratinavue_ordered']) ? $diabatesScreening['ratinavue_ordered'] : '';

                if (!$diabetec_eye_exam) {
                    if ($ratinavueordered == 'Yes') {
                        $diabetesOutcomes['diabetec_eye_exam'] = 'Ratinavue Ordered';
                    } elseif ($ratinavueordered == 'No') {
                        $diabetesOutcomes['diabetec_eye_exam'] = 'Script given for Eye Examination';
                    }
                    $diabetesOutcomes['eye_exam_flag'] = true;
                } else {

                    $last_performed = "";
                    if ($eye_exam_date != "" && $eye_exam_facility == "") {
                        $last_performed = 'Last perfomed on ' . $eye_exam_date;
                    } else if ($eye_exam_date == "" && $eye_exam_facility != "") {
                        $last_performed = 'Last perfomed at ' . $eye_exam_facility;
                    } else if ($eye_exam_date != "" && $eye_exam_facility != "") {
                        $last_performed = 'Last perfomed on ' . $eye_exam_date . ' at ' . $eye_exam_facility;
                    }

                    if ($diabetec_eye_exam_report == "report_available") {
                        $diabetesOutcomes['diabetec_eye_exam'] = $last_performed . $eye_exam_doctor . '. ' . ($diabetec_eye_exam_reviewed ? 'Report reviewed' : "") . " " . ($diabetec_diabetec_ratinopathy ? 'and shows Diabetic Retinopathy' : "and shows No Diabetec Retinopathy");
                    } elseif ($diabetec_eye_exam_report == "report_requested") {
                        $diabetesOutcomes['diabetec_eye_exam'] = $last_performed != "" ? $last_performed . ', Report requested.' : 'Report Requested';
                    } elseif ($diabetec_eye_exam_report == "patient_call_doctor") {
                        $diabetesOutcomes['diabetec_eye_exam'] = 'Patient will call with the name of the doctor to request report';
                    }

                    if ($diabetec_eye_exam_report != "report_available") {
                        $diabetesOutcomes['eye_exam_flag'] = true;
                    }
                }


                /* Diabetes NEPHROPATHY */
                $urine_microalbumin = !empty($diabatesScreening['urine_microalbumin']) ? $diabatesScreening['urine_microalbumin'] : '';
                $urine_microalbumin_ordered = !empty($diabatesScreening['urine_microalbumin_ordered']) ? $diabatesScreening['urine_microalbumin_ordered'] : '';
                $urine_microalbumin_date = !empty($diabatesScreening['urine_microalbumin_date']) ? $diabatesScreening['urine_microalbumin_date'] : '';
                $urine_microalbumin_report = !empty($diabatesScreening['urine_microalbumin_report']) ? $diabatesScreening['urine_microalbumin_report'] : '';
                $urine_microalbumin_value = !empty($diabatesScreening['urine_microalbumin_value']) ? $diabatesScreening['urine_microalbumin_value'] : '';

                $ace_inhibitor = !empty($diabatesScreening['urine_microalbumin_inhibitor']) ? $diabatesScreening['urine_microalbumin_inhibitor'] : '';
                $ckd_stage_4 = !empty($diabatesScreening['ckd_stage_4']) ? $diabatesScreening['ckd_stage_4'] : '';

                $urine_forMicroalbumin = $inhibitors = '';


                if (!empty($urine_microalbumin)) {
                    if ($urine_microalbumin == 'Yes') {
                        if ($urine_microalbumin_value != "") {
                            $urine_forMicroalbumin = 'Urine for Microalbumin is ' . $urine_microalbumin_value. ' on ' . $urine_microalbumin_date.'. Report is' .$urine_microalbumin_report ;
                        } else {
                            $urine_forMicroalbumin = 'Urine for Microalbumin is performed on '. $urine_microalbumin_date.'. Report is '.$urine_microalbumin_report;
                        }
                    } else {
                        if ($urine_microalbumin_ordered != "") {
                            if ($urine_microalbumin_ordered == 'Yes') {
                                $urine_forMicroalbumin = "Urine for Micro-albumin ordered. ";
                            } else {
                                $urine_forMicroalbumin = "Patient refused urine for Micro-albuminemia. ";
                            }
                        }

                        if ($ace_inhibitor != "") {
                            if ($ace_inhibitor != "none") {
                                $ace_inhibitor = array_search($ace_inhibitor, Config::get('constants')['inhibitor']);
                                $inhibitors = 'Patient is receiving ' . $ace_inhibitor . ' therapy.';
                            } else {
                                $inhibitors = 'Patient ' . ($ckd_stage_4 == "ckd_stage_4" ? 'has CKD Stage 4' : "sees a Nephrologist");
                            }
                        }
                    }

                    $diabetesOutcomes['nepropathy'] = $urine_forMicroalbumin . '' . $inhibitors;
                }

                if ($urine_microalbumin && $urine_microalbumin_ordered && $ckd_stage_4 != "patient_see_nephrologist") {
                    $diabetesOutcomes['nephropathy_flag'] = true;
                }
            }
        }

        return $diabetesOutcomes;
    }


    private function cholesterol_screening($cholesterolAssessment)
    {
        $cholesterol_outcome = [];
        if (!empty($cholesterolAssessment)) {
            $ldlValue = !empty($cholesterolAssessment['ldl_value']) ? $cholesterolAssessment['ldl_value'] : '';
            $lastLDLdate = !empty($cholesterolAssessment['ldl_date']) ? $cholesterolAssessment['ldl_date'] : '';
            $lipidProfile = !empty($cholesterolAssessment['ldl_in_last_12months']) ? $cholesterolAssessment['ldl_in_last_12months'] : '';
            $useStatin = !empty($cholesterolAssessment['statin_prescribed']) ? $cholesterolAssessment['statin_prescribed'] : '';
            $statinDosage = !empty($cholesterolAssessment['statintype_dosage']) ? $cholesterolAssessment['statintype_dosage'] : '';
            $activeDiabetes = !empty($cholesterolAssessment['active_diabetes']) ? $cholesterolAssessment['active_diabetes'] : '';
            $ldlinPasttwoyears = !empty($cholesterolAssessment['ldl_range_in_past_two_years']) ? $cholesterolAssessment['ldl_range_in_past_two_years'] : '';

            if ($ldlValue != "") {
                $cholesterol_outcome['ldl_result'] = 'Patient LDL is ' . $ldlValue . ' mg/dL' . ($lastLDLdate != '' ? ' on ' . $lastLDLdate . '.' : '');
            }

            if ($lipidProfile != '' && $lipidProfile == 'No') {
                $cholesterol_outcome['outcome'] = "Ordered Fasting Lipid Profile";
            } elseif ($ldlinPasttwoyears != "" && $ldlinPasttwoyears == 'No') {
                $cholesterol_outcome['outcome'] = "Documented medical reason for not being on statin therapy is most recent fasting or direct LDL-C<70 mg/dL";
            } elseif ($activeDiabetes != "" && $activeDiabetes == 'No') {
                $cholesterol_outcome['outcome'] = "Patient was screened for requirement of statin therapy and does not require a statin prescription at this time.";
            } else {
                if ($useStatin != '') {
                    if ($useStatin == 'Yes') {
                        $cholesterol_outcome['outcome'] = 'Patient is receiving statin therapy with ' . $statinDosage . ' as prescribed by PCP';
                    } else {
                        $reasonFornoStatin = '';
                        $reasonArray = $depressionArray = Config::get('constants')['statin_medical_reason'];
                        foreach ($reasonArray as $key => $value) {
                            if (!empty($cholesterolAssessment['medical_reason_for_nostatin' . $key])) {
                                $reasonFornoStatin .= $cholesterolAssessment['medical_reason_for_nostatin' . $key] . ', ';
                            }
                        }

                        if ($reasonFornoStatin != '') {
                            $cholesterol_outcome['outcome'] = 'Documented medical reason for not being on statin therapy is ' . $reasonFornoStatin . '.';
                        } else {
                            $cholesterol_outcome['outcome'] = 'Counseled and started statin therapy for cardiovascular disease';
                        }
                    }
                }
            }

            if ($lastLDLdate != '') {
                $lastLDLdate = $cholesterolAssessment['ldl_date'];
                $monthYear = explode('/', $lastLDLdate);
                $ldlNextDue = Carbon::createFromDate($monthYear[1], $monthYear[0])->startOfMonth()->addMonth(12)->format('m/Y');
                $cholesterol_outcome['ldl_next_due'] = $ldlNextDue;
            }
        }

        return $cholesterol_outcome;
    }


    /* Bp and Weight Assessment  */
    private function bp_and_weight_screening($bp_assessment, $weight_assessment)
    {
        $outcome = [];
        if (!empty($bp_assessment)) {
            $bpAssessment = [];
            $bp_value = !empty($bp_assessment['bp_value']) ? explode('/', $bp_assessment['bp_value']) : '';
            $bp_date = !empty($bp_assessment['bp_date']) ? $bp_assessment['bp_date'] : '';

            if ($bp_value != '') {
                $systolic_bp = $bp_value['0'] ?? "";
                $diastolic_bp = $bp_value['1'] ?? "";

                if ($systolic_bp != "" && $diastolic_bp != "") {
                    $bpAssessment['bp_result'] = 'Patient BP is ' . $bp_assessment['bp_value'] . ($bp_date != "" ? ' on ' . $bp_date . '.' : '.');
    
    
                    if ($systolic_bp <= 120 && $diastolic_bp <= 80) {
                        $bpAssessment['outcome'] = 'Patient BP is controlled.';
                    } else if ($systolic_bp > 120 && $diastolic_bp <= 80) {
                        $bpAssessment['outcome'] = 'Systolic BP is raised while diastolic in controlled.';
                    } else if ($systolic_bp <= 120 && $diastolic_bp > 80) {
                        $bpAssessment['outcome'] = 'Systolic BP is controlled while diastolic in raised.';
                    } elseif ($systolic_bp > 120 && $diastolic_bp > 80) {
                        $bpAssessment['outcome'] = 'Blood pressure is raised, patient counseled regarding monitoring and control.';
                    }
    
                    if ($systolic_bp > 120 || $diastolic_bp > 80) {
                        $bpAssessment['flag'] = true;
                    }
                }
            }

            $outcome['bp_assessment'] = $bpAssessment;
        }

        if (!empty($weight_assessment)) {
            $weightAssessment = [];
            $bmi_value = !empty($weight_assessment['bmi_value']) ? $weight_assessment['bmi_value'] : '';

            if (!empty($bmi_value)) {
                $nutritionist_referral = !empty($weight_assessment['followup_withnutritionist']) ? $weight_assessment['followup_withnutritionist'] : '';

                $weightAssessment['bmi_result'] = 'Patient BMI is ' . $weight_assessment['bmi_value'] . '.';

                if ($bmi_value >= 30) {
                    $referred_nutrionist = '';
                    if ($nutritionist_referral == 'Yes') {
                        $referred_nutrionist = 'Patient referred to the Nutritionist.';
                    } else {
                        $referred_nutrionist = 'Patient refused Nutritionist referral.';
                    }
                    $weightAssessment['outcome'] = 'Dietary Guidelines summary 2020-2025 and CDC guidelines for physical activity provided to Patient. Counseled regarding Healthy eating and exercise. ' . $referred_nutrionist . ', advised to follow up with the PCP.';
                } elseif ($bmi_value > 25 && $bmi_value < 30) {
                    $weightAssessment['outcome'] = 'Patient is over weight.';
                } elseif ($bmi_value > 15 && $bmi_value < 25) {
                    $weightAssessment['outcome'] = 'Patient has ideal BMI.';
                } elseif ($bmi_value < 15) {
                    $weightAssessment['outcome'] = 'Patient is underweight.';
                }
            }

            
            $outcome['weight_assessment'] = $weightAssessment;
        }

        return $outcome;
    }


    /* GENERAL ASSESEMENT */
    private function generalAssesment($questions_answers)
    {
        // General Assessment
        $general_assessment_outcomes = [];
        if (!empty($questions_answers['general_assessment'])) {
            $general_assessment = $questions_answers['general_assessment'];

            $taking_medications = !empty($general_assessment['is_taking_medication']) && $general_assessment['is_taking_medication'] == "Yes" ? true : false;
            $tobacco_consumption = !empty($general_assessment['is_consuming_tobacco']) && $general_assessment['is_consuming_tobacco'] == "Yes" ? true : false;
            $quitting_tobacco = !empty($general_assessment['quitting_tobacco']) && $general_assessment['quitting_tobacco'] == "Yes" ? true : false;
            $reason_medication = $general_assessment['reason_for_not_taking_medication'] ?? '';
            $physical_exercise = $general_assessment['physical_exercises'] ?? '';
            $physical_exercise_intensity = $general_assessment['physical_exercise_level'] ?? '';
            $prescribed_medications = $general_assessment['prescribed_medications'] ?? '';
            
            $imp_handwash_start_date = $general_assessment['imp_handwash_start_date'] ?? '';
            $imp_handwash_end_date = $general_assessment['imp_handwash_end_date'] ?? '';
            $imp_handwash_status = $this->calculateStatus($imp_handwash_start_date, $imp_handwash_end_date) ?? '';
            
            $und_handwash_start_date = $general_assessment['und_handwash_start_date'] ?? '';
            $und_handwash_end_date = $general_assessment['und_handwash_end_date'] ?? '';
            $und_handwash_status = $this->calculateStatus($und_handwash_start_date, $und_handwash_end_date) ?? '';

            $washwithsoap_start_date = $general_assessment['washwithsoap_start_date'] ?? '';
            $washwithsoap_end_date = $general_assessment['washwithsoap_end_date'] ?? '';
            $washwithsoap_status = $this->calculateStatus($washwithsoap_start_date, $washwithsoap_end_date) ?? '';
            
            $und_washhands_start_date = $general_assessment['und_washhands_start_date'] ?? '';
            $und_washhands_end_date = $general_assessment['und_washhands_end_date'] ?? '';
            $und_washhands_status = $this->calculateStatus($und_washhands_start_date, $und_washhands_end_date) ?? '';
            
            $turnoff_faucet_start_date = $general_assessment['turnoff_faucet_start_date'] ?? '';
            $turnoff_faucet_end_date = $general_assessment['turnoff_faucet_end_date'] ?? '';
            $turnoff_faucet_status = $this->calculateStatus($turnoff_faucet_start_date, $turnoff_faucet_end_date) ?? '';
            
            $understand_faucet_start_date = $general_assessment['understand_faucet_start_date'] ?? '';
            $understand_faucet_end_date = $general_assessment['understand_faucet_end_date'] ?? '';
            $understand_faucet_status = $this->calculateStatus($understand_faucet_start_date, $understand_faucet_end_date) ?? '';
            
            $plain_soap_usage_start_date = $general_assessment['plain_soap_usage_start_date'] ?? '';
            $plain_soap_usage_end_date = $general_assessment['plain_soap_usage_end_date'] ?? '';
            $plain_soap_usage_status = $this->calculateStatus($plain_soap_usage_start_date, $plain_soap_usage_end_date) ?? '';
            
            $bar_or_liquid_start_date = $general_assessment['bar_or_liquid_start_date'] ?? '';
            $bar_or_liquid_end_date = $general_assessment['bar_or_liquid_end_date'] ?? '';
            $bar_or_liquid_status = $this->calculateStatus($bar_or_liquid_start_date, $bar_or_liquid_end_date) ?? '';
            
            $uips_start_date = $general_assessment['uips_start_date'] ?? '';
            $uips_end_date = $general_assessment['uips_end_date'] ?? '';
            $uips_status = $this->calculateStatus($uips_start_date, $uips_end_date) ?? '';
            
            $no_soap_condition_start_date = $general_assessment['no_soap_condition_start_date'] ?? '';
            $no_soap_condition_end_date = $general_assessment['no_soap_condition_end_date'] ?? '';
            $no_soap_condition_status = $this->calculateStatus($no_soap_condition_start_date, $no_soap_condition_end_date) ?? '';
            
            $understand_hand_sanitizer_start_date = $general_assessment['understand_hand_sanitizer_start_date'] ?? '';
            $understand_hand_sanitizer_end_date = $general_assessment['understand_hand_sanitizer_end_date'] ?? '';
            $understand_hand_sanitizer_status = $this->calculateStatus($understand_hand_sanitizer_start_date, $understand_hand_sanitizer_end_date) ?? '';

            /* Everyday activities */
            if (!$taking_medications) {
                $medicationsList = '';
                if ($prescribed_medications != '') {
                    $medicationsList = implode(',' , $prescribed_medications);
                }
                $general_assessment_outcomes['is_taking_medication'] = "Medication reconciliation was performed and patient is not taking ".$medicationsList.' as prescribed because ' . $reason_medication.'.';
            } else {
                $general_assessment_outcomes['is_taking_medication'] = "Medication reconciliation was performed, and patient is taking all medications as prescribed.";
            }

            if (!$tobacco_consumption) {
                $general_assessment_outcomes['is_consuming_tobacco'] = "The patient is not consuming tobacco";
            } else {
                if (!$quitting_tobacco) {
                    $general_assessment_outcomes['is_consuming_tobacco'] = "The patient is consuming tobacco and not interested in quitting";
                } else {
                    $general_assessment_outcomes['is_consuming_tobacco'] = "The patient is consuming tobacco and interested in quitting";
                }
            }

            if ($physical_exercise <= 2) {
                $general_assessment_outcomes['physical_exercises'] = "Low engagement in physical excercises";
            } elseif ($physical_exercise <= 5) {
                $general_assessment_outcomes['physical_exercises'] = "Moderate engagement in physical excercises";
            } else {
                $general_assessment_outcomes['physical_exercises'] = "Regular engagement in physical excercises";
            }

            if ($physical_exercise_intensity <= 20) {
                $general_assessment_outcomes['physical_exercise_level'] = "The patient is engaging in low intensity physical excercise";
            } elseif ($physical_exercise <= 40) {
                $general_assessment_outcomes['physical_exercise_level'] = "The patient is engaging in moderate intensity physical excercise";
            } else {
                $general_assessment_outcomes['physical_exercise_level'] = "The patient is engaging in high intensity physical excercise";
            }

            $general_assessment_outcomes['imp_handwash_start_date'] = $imp_handwash_start_date;
            $general_assessment_outcomes['imp_handwash_end_date'] = $imp_handwash_end_date;
            $general_assessment_outcomes['imp_handwash_status'] = $imp_handwash_status;

            $general_assessment_outcomes['und_handwash_start_date'] = $und_handwash_start_date;
            $general_assessment_outcomes['und_handwash_end_date'] = $und_handwash_end_date;
            $general_assessment_outcomes['und_handwash_status'] = $und_handwash_status;
            
            $general_assessment_outcomes['washwithsoap_start_date'] = $washwithsoap_start_date;
            $general_assessment_outcomes['washwithsoap_end_date'] = $washwithsoap_end_date;
            $general_assessment_outcomes['washwithsoap_status'] = $washwithsoap_status;
            
            $general_assessment_outcomes['und_washhands_start_date'] = $und_washhands_start_date;
            $general_assessment_outcomes['und_washhands_end_date'] = $und_washhands_end_date;
            $general_assessment_outcomes['und_washhands_status'] = $und_washhands_status;
            
            $general_assessment_outcomes['turnoff_faucet_start_date'] = $turnoff_faucet_start_date;
            $general_assessment_outcomes['turnoff_faucet_end_date'] = $turnoff_faucet_end_date;
            $general_assessment_outcomes['turnoff_faucet_status'] = $turnoff_faucet_status;
            
            $general_assessment_outcomes['understand_faucet_start_date'] = $understand_faucet_start_date;
            $general_assessment_outcomes['understand_faucet_end_date'] = $understand_faucet_end_date;
            $general_assessment_outcomes['understand_faucet_status'] = $understand_faucet_status;
            
            $general_assessment_outcomes['plain_soap_usage_start_date'] = $plain_soap_usage_start_date;
            $general_assessment_outcomes['plain_soap_usage_end_date'] = $plain_soap_usage_end_date;
            $general_assessment_outcomes['plain_soap_usage_status'] = $plain_soap_usage_status;
            
            $general_assessment_outcomes['bar_or_liquid_start_date'] = $bar_or_liquid_start_date;
            $general_assessment_outcomes['bar_or_liquid_end_date'] = $bar_or_liquid_end_date;
            $general_assessment_outcomes['bar_or_liquid_status'] = $bar_or_liquid_status;
            
            $general_assessment_outcomes['uips_start_date'] = $uips_start_date;
            $general_assessment_outcomes['uips_end_date'] = $uips_end_date;
            $general_assessment_outcomes['uips_status'] = $uips_status;
            
            $general_assessment_outcomes['no_soap_condition_start_date'] = $no_soap_condition_start_date;
            $general_assessment_outcomes['no_soap_condition_end_date'] = $no_soap_condition_end_date;
            $general_assessment_outcomes['no_soap_condition_status'] = $no_soap_condition_status;
            
            $general_assessment_outcomes['understand_hand_sanitizer_start_date'] = $understand_hand_sanitizer_start_date;
            $general_assessment_outcomes['understand_hand_sanitizer_end_date'] = $understand_hand_sanitizer_end_date;
            $general_assessment_outcomes['understand_hand_sanitizer_status'] = $understand_hand_sanitizer_status;
        }

        return $general_assessment_outcomes;
    }


    //CAREGIVER ASSESEMENT
    public function caregiverAssesment($questions_answers)
    {
        $caregiver_assesment_outcomes = [];
        if (!empty($questions_answers['caregiver_assessment'])) {
            $caregiver_assesment = $questions_answers['caregiver_assessment'];

            $needHelp = !empty($caregiver_assesment['every_day_activities']) && $caregiver_assesment['every_day_activities'] == "Yes" ? true : false;
            $medications_help = !empty($caregiver_assesment['medications']) && $caregiver_assesment['medications'] == "Yes" ? true : false;
            $adls = !empty($caregiver_assesment['adls']) && $caregiver_assesment['adls'] == "Yes" ? true : false;
            $adls_no = !empty($caregiver_assesment['adls_no']) && $caregiver_assesment['adls_no'] == "Yes" ? true : false;
            $wife_help = @$caregiver_assesment['your_help_wife'] ?? '';
            $live_with_patient = @$caregiver_assesment['live_patient'] ?? '';
            /* Everyday activities */
            if (!$needHelp) {
                $caregiver_assesment_outcomes['every_day_activities'] = "No need of anyone else for every day activities";
            } else {
                $caregiver_assesment_outcomes['every_day_activities'] = "Need someone else for every day activities";
            }
            if (!$medications_help) {
                $caregiver_assesment_outcomes['medications'] = "No need for help to take medications";
            } else {
                if (!$adls && !$adls_no) {
                    $caregiver_assesment_outcomes['medications'] = "Need help to take medications but no care giver and not referred to home health";
                } elseif (!$adls && $adls_no) {
                    $caregiver_assesment_outcomes['medications'] = "Need help to take medications but no care giver, referred to home health";
                } else {
                    $caregiver_assesment_outcomes['medications'] = "Need help to take medications from "  . $wife_help;
                }
            }
        }
        return $caregiver_assesment_outcomes;
    }

    //OTHER PROVIDER
    public function otherProvider($questions_answers)
    {
        //Other Providers
        $other_providers_outcome = [];
        if (!empty($questions_answers['other_provider'])) {
            $other_provider = $questions_answers['other_provider'];

            $otherProvider = !empty($other_provider['other_provider_beside_pcp']) && $other_provider['other_provider_beside_pcp'] == "Yes" ? true : false;
            $provider_name = $other_provider['full_name'];
            $speciality = $other_provider['speciality'];

            /* Everyday activities */
            if (!$otherProvider) {
                $other_providers_outcome['other_provider_beside_pcp'] = "The patient is not seeing any Provider other beside PCP";
            } else {
                $other_providers_outcome['other_provider_beside_pcp'] = "The patient is seeing " . $provider_name . " having spciality in " . $speciality;
            }
        }
        return $other_providers_outcome;
    }


    private function calculateStatus($startDate, $endDate)
    {
        $status = "Not Started";
        if (!empty($startDate) && !empty($endDate)) {
            $status = "Completed";
        } elseif (!empty($startDate) && empty($endDate)) {
            $status = "Started";
        }
        return $status;
    }



    /* Filled Questionnaire */
    public function filledQuestionnaire(Request $request, $id)
    {
        try {
            $row = Questionaires::with('patient:id,first_name,mid_name,last_name,gender,age,dob', 'program:id,name,short_name')->where('id', $id)->first()->toArray();
            $questions_answers = json_decode($row['questions_answers'], true);
            $patient = $row['patient'];
            $program = $row['program'];
            $dateofService = $row['date_of_service'];
            $serialno = $row['serial_no'];
    
            if (!empty($questions_answers['depression_phq9'])) {
                $depressionArray = Config::get('constants')['depression_phq_9'];
                foreach ($questions_answers['depression_phq9'] as $key => $value) {
                    $depressionValue = array_search($value, $depressionArray);
                    if ($key != "problem_difficulty" && $key != "comments") {
                        $questions_answers['depression_phq9'][$key] = $depressionValue;
                    }
                }
            }
    
            $data = [
                'page_title' => 'Patient Survey Report' ?? [],
                'patient' => $patient ?? [],
                'program' => $program ?? [],
                'questionaire' => $questions_answers ?? [],
                'serial_no' => $serialno ?? '',
                'date_of_service' => $dateofService,
                'created_at' => $row['created_at']
            ];

            $response = array('success'=>true, 'data'=>$data);
        } catch (\Exception $e) {
            
            $response = array('success'=>false,'message'=>$e->getMessage());
        }

        return response()->json($response);
    }


    /* Calculate difference in MONTHS */
    private function diffinMonths($monthYear, $add)
    {
        $now = Carbon::now();
        $fluVaccineDate = Carbon::createFromDate($monthYear[1], $monthYear[0])->startOfMonth();
        $diffinMonths = Carbon::parse($fluVaccineDate)->diffInMonths($now);
        return $diffinMonths;
    }

    /* Calculate difference in YEARS */
    private function diffinYears($monthYear)
    {
        $now = Carbon::now();
        $fluVaccineDate = Carbon::createFromDate($monthYear[1], $monthYear[0])->startOfMonth();
        $diffinMonths = Carbon::parse($fluVaccineDate)->diffInYears($now);
        return $diffinMonths;
    }

    public function downloadCareplanpdf($request,$id)
    {
        ini_set('max_execution_time', 120);
        $data = $this->awvCareplanReport($id);
        
        /* Getting superbill codes from superbill Controller */
        $codes = (new SuperBillCodesController)->index($request, $id)->getData();
        $superBillData = [];
        
        foreach ($codes->data as $key => $value) {
            if ($key == "codes") {
                $superBillData[$key] = json_decode(json_encode($value), true);
            } else {
                $superBillData[$key] = $value;
            }
        }
        $data['superBilldata'] = $superBillData;

        $pdf = PDF::loadView($this->view.'analytics-pdf-report',$data);
        $headers = array(
            'Content-Type: application/pdf',
        );

        return $pdf->download('awv-care-plan.pdf', $headers);
    }

    public function saveSignature(Request $request, $id)
    {
        $doctor_id = $request->doctor_id;

        try {
            $current_Date = Carbon::now()->toDateTimeString();
            
            $data = [
                'doctor_id' => $doctor_id,
                'signed_date' => $current_Date,
            ];
    
            Questionaires::where('id',$id)->update($data);
            $response = array('success'=>true,'message'=>'Signed Successfully');
        } catch (\Exception $e) {
            $response = array('success'=>false,'message'=>$e->getMessage());
        }

        return response()->json($response);
        
    }


    public function checkCareplanHtml(Request $request, $id)
    {
        $data = $this->awvCareplanReport($id);
        $codes = (new SuperBillCodesController)->index($request, $id)->getData();
        $superBillData = [];
        
        foreach ($codes->data as $key => $value) {
            if ($key == "codes") {
                $superBillData[$key] = json_decode(json_encode($value), true);
            } else {
                $superBillData[$key] = $value;
            }
        }
        $data['superBilldata'] = $superBillData;
        return view($this->view.'analytics-pdf-report',$data);
    }
}
