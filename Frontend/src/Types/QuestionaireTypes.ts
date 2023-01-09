/* eslint-disable @typescript-eslint/no-empty-interface */
export interface QuestionaireStepProps {
  handleNextStep: () => void;
  saveQuestionairsData: (
    key: string,
    data: any,
    moreThanOneRecord?: object
  ) => any;
  handlePreviousStep?: () => void;
  handleShowSection?: (isShow: boolean) => void;
  age?: any;
  patientdata?: any;
}

export type QuestionaireListType = {
  id: string;
  serial_no: string;
  patient_id: string;
  patient_name: string;
  program_id: string;
  program_name: string;
  dob: string;
  contact_no: string;
};

export interface QuestionaireResponse {
  success: boolean;
  message: string;
  errors?: object;
}
export interface FallingScreenType {
  fall_in_one_year: string;
  number_of_falls: string;
  injury: string;
  physical_therapy: string;
  unsteady_todo_things: string;
  blackingout_from_bed: string;
  assistance_device: string;
  date_of_service: string;
  completed: any;
}

export interface DepressionType {
  feltdown_depressed_hopeless: string;
  little_interest_pleasure: string;
  trouble_sleep: string;
  tired_little_energy: string;
  poor_over_appetite: string;
  feeling_bad_failure: string;
  trouble_concentrating: string;
  slow_fidgety: string;
  suicidal_thoughts: string;
  problem_difficulty: string;
  comments: string;
}

export interface GeneralHealthType {
  pain_felt: string;
  get_social_emotional_support: string;
  stress_problem: string;
  health_level: string;
  mouth_and_teeth: string;
  feeling_caused_distress: string;
}
export interface PhysicalActivityType {
  days_of_exercise: string;
  mins_of_exercise: string;
  exercise_intensity: string;
  does_not_apply: string;
}

export interface LdctType {
  cancer_symptoms: string;
  no_of_packs_year: string;
  current_quit_smoker: string;
}

export interface CognitiveAssessmentType {
  year_recalled: string;
  month_recalled: string;
  hour_recalled: string;
  reverse_count: string;
  reverse_month: string;
  address_recalled: string;
}

export interface GeneralAssessmentType {
  imp_handwash_start_date: Date;
  imp_handwash_end_date: Date;
  und_handwash_start_date: Date;
  und_handwash_end_date: Date;
  washwithsoap_start_date: Date;
  washwithsoap_end_date: Date;
  und_washhands_start_date: Date;
  und_washhands_end_date: Date;
  turnoff_faucet_start_date: Date;
  turnoff_faucet_end_date: Date;
  understand_faucet_start_date: Date;
  understand_faucet_end_date: Date;
  plain_soap_usage_start_date: Date;
  plain_soap_usage_end_date: Date;
  bar_or_liquid_start_date: Date;
  bar_or_liquid_end_date: Date;
  uips_start_date: Date;
  uips_end_date: Date;
  no_soap_condition_start_date: Date;
  no_soap_condition_end_date: Date;
  understand_hand_sanitizer_start_date: Date;
  understand_hand_sanitizer_end_date: Date;
  is_taking_medication: string;
  reason_for_not_taking_medication: string;
  is_consuming_tobacco: string;
  quitting_tobacco: string;
  physical_exercises: string;
  physical_exercise_level: string;
  prescribed_medications: [];
}

export interface MonthlyAssessmentType {
  respiratory_symptoms: string;
  urinary_system: string;
  gastrointestinal_system: string;
  cardiovascular_symptoms: string;
  appointment_schedule_with_pcp: string;
  refused_appoinment_with_pcp: string;
  last_pcp_visit: Date;
  in_er_since_last_pcp_visit: string;
  hospitalized_since_last_pcp_visit: string;
  any_question_about_medications: string;
  need_medication_refills: string;
}

export interface ImmunizationType {
  flu_vaccine_recieved: string;
  flu_vaccine_refused: string;
  flu_vaccine_script_given: string;
  flu_vaccine_recieved_at: string;
  flu_vaccine_recieved_on: string;
  pneumococcal_vaccine_recieved: string;
  pneumococcal_prevnar_recieved_on: string;
  pneumococcal_prevnar_recieved_at: string;
  pneumococcal_ppsv23_recieved_on: string;
  pneumococcal_ppsv23_recieved_at: string;
  pneumococcal_vaccine_refused: string;
  pneumococcal_vaccine_script_given: string;
  comments: string;
}
export interface ScreeningType {
  mammogram_done: string;
  mammogram_refused: string;
  mammogram_script: string;
  mammogram_done_on: string;
  mammogram_done_at: string;
  next_mommogram: string;
  mommogram_report_reviewed: string;
  colonoscopy_done: string;
  colonoscopy_script: string;
  colonoscopy_refused: string;
  colon_test_type: string;
  colonoscopy_done_on: string;
  colonoscopy_done_at: string;
  next_colonoscopy: string;
  fit_done_on: Date;
  fit_done_at: string;
  next_fit: string;
  cologuard_done_on: Date;
  cologuard_done_at: string;
  next_cologuard: string;
  colonoscopy_report_reviewed: string;
  colonoscopy_test: string;
  fit_test: string;
  cologuard_test: string;
  fit_report_reviewed: string;
  cologuard_report_reviewed: string;
  comments: string;
}
export interface CholesterolType {
  ldl_in_last_12months?: string;
  patient_has_ascvd?: string;
  active_diabetes?: string;
  ldlvalue_190ormore?: string;
  pure_hypercholesterolemia?: string;
  statin_prescribed?: string;
  statintype_dosage?: string;
  medical_reason_for_nostatin0?: string;
  medical_reason_for_nostatin1?: string;
  medical_reason_for_nostatin2?: string;
  medical_reason_for_nostatin3?: string;
  medical_reason_for_nostatin4?: string;
  medical_reason_for_nostatin5?: string;
  diabetes_patient_age?: string;
  ldl_range_in_past_two_years?: string;
  ldl_value?: string;
  ldl_date?: string;
}

export interface DiabetesType {
  diabetec_patient: string;
  fbs_in_year: string;
  fbs_value: any;
  fbs_date: string;
  hba1c_value: string;
  hba1c_date: string;
  diabetec_eye_exam: string;
  diabetec_eye_exam_report: string;
  eye_exam_doctor: string;
  eye_exam_facility: string;
  eye_exam_date: string;
  eye_exam_report_reviewed: string;
  diabetec_ratinopathy: string;
  ratinavue_ordered: string;
  urine_microalbumin: string;
  urine_microalbumin_date: string;
  urine_microalbumin_report: string;
  urine_microalbumin_ordered: string;
  urine_microalbumin_inhibitor: string;
  urine_microalbumin_value: string;
  ckd_stage_4: string;
}

export interface BpAssessmentType {
  bp_value: string;
  bp_date: string;
}

export interface WeightAssessmentType {
  bmi_value: string;
  followup_withnutritionist: string;
}
export interface NutritionType {
  fruits_vegs: number;
  whole_grain_food: number;
  high_fat_food: number;
  sugar_beverages: number;
}
export interface SeatBeltType {
  wear_seat_belt: string;
}

export interface AlcoholUseType {
  days_of_alcoholuse: string;
  drinks_per_day: any;
  drinks_per_occasion: any;
  average_usage: string;
  drink_drive_yes: string;
}
export default interface BpAssesmentType {
  bp_value: string;
  bp_date: Date;
}

export interface TobaccoUseType {
  smoked_in_thirty_days: string;
  smoked_in_fifteen_years: string;
  smokeless_product_use: string;
  average_smoking_years: any;
  average_packs_per_day: any;
  average_packs_per_year: any;
  quit_tobacco: string;
  perform_ldct: string;
  patient_age: number;
}

export interface OtherProviderType {
  other_provider_beside_pcp: string;
  full_name: string;
  speciality: string;
}
export interface MiscellaneousType {
  height: number;
  weight: number;
  time_spent: any;
  asprin_use: string;
  high_blood_pressure: string;
  behavioral_counselling: string;
}
export interface PhysicalExamType {
  general: string;
  eyes: string;
  neck: string;
  lungs: string;
  heart: string;
  neuro: string;
  extremeties: string;
  gi: string;
  ears: string;
  nose: string;
  throat: string;
  skin: string;
  oral_cavity: string;
  ms: string;
}
export interface COPDType {
  Cough: any;
  phlegum_in_chest: any;
  tight_chest: any;
  breathless: any;
  limited_activities: any;
  lung_condition: any;
  sound_sleep: any;
  energy_level: any;
  total_assessment_score: any;
  smoking_cessation_start_date: any;
  smoking_cessation_end_date: any;
  copd_medication_start_date: any;
  copd_medication_end_date: any;
  supplemental_oxygen_start_date: any;
  supplemental_oxygen_end_date: any;
  self_mgmt_start_date: any;
  self_mgmt_end_date: any;
  tirgger_exacerbations_start_date: any;
  tirgger_exacerbations_end_date: any;
  exacerbations_symptoms_start_date: any;
  exacerbations_symptoms_end_date: any;
  followup_imp_start_date: any;
  followup_imp_end_date: any;
  imp_of_vaccine_start_date: any;
  imp_of_vaccine_end_date: any;
  safe_physical_activity_start_date: any;
  safe_physical_activity_end_date: any;
  group_support_start_date: any;
  group_support_end_date: any;
}
export interface ObesityType {
  gained_weight: any;
  lost_weight: any;
  bmi: any;
  awareness_about_bmi_start_date: any;
  awareness_about_bmi_end_date: any;
  need_of_weight_loss_start_date: any;
  need_of_weight_loss_end_date: any;
  imp_of_healthy_weight_start_date: any;
  imp_of_healthy_weight_end_date: any;
  imp_of_healthy_eating_start_date: any;
  imp_of_healthy_eating_end_date: any;
  diet_assist_start_date: any;
  diet_assist_end_date: any;
  moderate_activity_inaweek_start_date: any;
  moderate_activity_inaweek_end_date: any;
  referred_dietician_start_date: any;
  referred_dietician_end_date: any;
}
export interface CongestiveHeartFailureType {
  follow_up_cardio: string;
  freq_recom_cardio: string;
  not_following_cardio: string;
  echocardiogram: string;
  no_echocardiogram: string;
  ge_chf_start_date: string;
  ge_chf_end_date: string;
  ui_smoke_cessation_start_date: string;
  ui_smoke_cessation_end_date: string;
  ui_sodium_diet_start_date: string;
  ui_sodium_diet_end_date: string;
  ui_fluid_restriction_start_date: string;
  ui_fluid_restriction_end_date: string;
  uid_weight_monitoring_start_date: string;
  uid_weight_monitoring_end_date: string;
  rs_excerbation_start_date: string;
  rs_excerbation_end_date: string;
  ri_adherence_start_date: string;
  ri_adherence_end_date: string;
  seek_help_start_date: string;
  seek_help_end_date: string;
}

export interface CKDType {
  key?: any;
  bp_day: any;
  systolic_day: any;
  diastolic_day: any;
  ak_ckd_start_date?: any;
  ak_ckd_end_date?: any;
  ur_kidney_disease_start_date?: any;
  ur_kidney_disease_end_date?: any;
  uih_bp_start_date?: any;
  uih_bp_end_date?: any;
  self_mgmt_start_date?: any;
  self_mgmt_end_date?: any;
  ria_mitigate_risk_start_date?: any;
  ria_mitigate_risk_end_date?: any;
  ui_smoking_cessation_start_date?: any;
  ui_smoking_cessation_end_date?: any;
  uidbp_normalbp_start_date?: any;
  uidbp_normalbp_end_date?: any;
  rid_medication_start_date?: any;
  rid_medication_end_date?: any;
  adm_dietary_start_date?: any;
  adm_dietary_end_date?: any;
  mbshr_diabetes_start_date?: any;
  mbshr_diabetes_end_date?: any;
  tmh_weight_start_date?: any;
  tmh_weight_end_date?: any;
  thp_strategy_start_date?: any;
  thp_strategy_end_date?: any;
  thp_adjust_ckd_start_date?: any;
  thp_adjust_ckd_end_date?: any;
  hba1c?: any;
  egfr_result_one_start_date?: any;
  egfr_result_one_report?: any;
  egfr_result_two_start_date?: any;
  egfr_result_two_report?: any;
}
export interface HyperCholestrolemiaType {
  statin_intensity: string;
  assesment_done: string;
  ldl_goal: string;
  ur_hyperlipidemia_start_date: Date;
  ur_hyperlipidemia_end_date: Date;
  el_cardio_start_date: Date;
  el_cardio_end_date: Date;
  ui_controlling_start_date: Date;
  ui_controlling_end_date: Date;
  ue_exercise_start_date: Date;
  ue_exercise_end_date: Date;
}
export interface CaregiverAssesmentType {
  every_day_activities: string;
  medications: string;
  adls: string;
}
export interface Hypertension {
  key?: any;
  bp_day?: any;
  systolic_day?: any;
  diastolic_day?: any;
  reason_for_no_bp?: any;
  effect_start_date?: any;
  effect_end_date?: any;
  imp_bp_monitoring_start_date?: any;
  imp_bp_monitoring_end_date?: any;
  relation_start_date?: any;
  relation_end_date?: any;
  imp_of_medication_start_date?: any;
  imp_of_medication_end_date?: any;
  adopt_lifestyle_start_date?: any;
  adopt_lifestyle_end_date?: any;
  quit_smoking_alcohol_start_date?: any;
  quit_smoking_alcohol_end_date?: any;
  adopt_dietary_start_date?: any;
  adopt_dietary_end_date?: any;
  maintain_weight_start_date?: any;
  maintain_weight_end_date?: any;
  moderate_exercise_start_date?: any;
  moderate_exercise_end_date?: any;
  regular_pcp_folloup_start_date?: any;
  regular_pcp_folloup_end_date?: any;
}
export interface DiabetesMellitusType {
  hb_result: string;
  result_month: string;
  hba1c_script:string;
  name_of_doctor: string;
  name_of_facility: string;
  checkup_date: string;
  eye_examination: string;
  diabetic_nephropathy: string;
  report_available: string;
  report_requested: string;
  diabetic_nephropathy_result: string;
  diabetic_nephropathy_date: string;
  retinavue_ordered: string;
  eye_examination_script: string;
  diabetic_nephropathy_not_conducted: string;
  diabetic_inhibitors: string;
  nephropathy_patient_has: string;
  imp_blood_glucose_start_date: string;
  imp_blood_glucose_end_date: string;
  und_hypoglycemia_hyperglycemia_start_date: string;
  und_hypoglycemia_hyperglycemia_end_date: string;
  recognize_signs_symptoms_start_date: string;
  recognize_signs_symptoms_end_date: string;
  reduce_complications_start_date: string;
  reduce_complications_end_date: string;
  und_imp_of_quit_smoking_start_date: string;
  und_imp_of_quit_smoking_end_date: string;
  maintain_healthy_weight_start_date: string;
  maintain_healthy_weight_end_date: string;
  engage_physical_activity_start_date: string;
  engage_physical_activity_end_date: string;
  maintain_a_healthy_diet_start_date: string;
  maintain_a_healthy_diet_end_date: string;
  und_foot_care_start_date: string;
  und_foot_care_end_date: string;
}
