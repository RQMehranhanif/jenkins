export default interface FallingScreenType {
  fall_in_one_year: string;
  number_of_falls: string;
  injury: string;
  physical_therapy: string;
  unsteady_todo_things: string;
  blackingout_from_bed: string;
  assistance_device: string;
  date_of_service: string;
}

export default interface DepressionType {
  fall_in_one_year: string;
  number_of_falls: string;
  injury: string;
  physical_therapy: string;
  unsteady_todo_things: string;
  blackingout_from_bed: string;
  assistance_device: string;
  date_of_service: string;
}

export default interface GeneralHealthType {
  pain_felt: string;
  get_social_emotional_support: string;
  stress_problem: string;
  health_level: string;
  mouth_and_teeth: string;
  feeling_caused_distress: string;
}

export default interface LdctType {
  cancer_symptoms: string;
  no_of_packs_year: string;
  current_quit_smoker: string;
}

export default interface CognitiveAssessmentType {
  year_recalled: string;
  month_recalled: string;
  hour_recalled: string;
  reverse_count: string;
  reverse_month: string;
  address_recalled: string;
}

export default interface GeneralAssessmentType {
  imp_handwash_start_date: string;
  imp_handwash_end_date: string;
}

export default interface ImmunizationType {
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
export default interface ScreeningType {
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
  colonoscopy_report_reviewed: string;
  comments: string;
}
export default interface CholesterolType {
  ldl_in_last_12months: string;
  patient_has_ascvd: string;
  active_diabetes: string;
  ldlvalue_190ormore: string;
  pure_hypercholesterolemia: string;
  statin_prescribed: string;
  statintype_dosage: string;
  medical_reason_for_nostatin0: string;
  medical_reason_for_nostatin1: string;
  medical_reason_for_nostatin2: string;
  medical_reason_for_nostatin3: string;
  medical_reason_for_nostatin4: string;
  medical_reason_for_nostatin5: string;
  diabetes_patient_age: string;
  ldl_range_in_past_two_years: string;
  ldl_value: string;
  ldl_date: string;
}

export default interface DiabetesType {
  diabetec_patient: string;
  fbs_in_year: string;
  fbs_value: string;
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
  ckd_stage_4: string;
}

export default interface WeightAssessmentType {
  bmi_value: string;
  followup_withnutritionist: string;
}
export default interface NutritionType {
  fruits_vegs: number;
  whole_grain_food: number;
  high_fat_food: number;
  sugar_beverages: number;
}
export default interface SeatBeltType {
  wear_seal_belt: string;
}

export default interface AlcoholUseType {
  days_of_alcoholuse: number;
  drinks_per_day: number;
  drinks_per_occasion: number;
  average_usage: string;
  drink_drive_yes: string;
}
export default interface BpAssesmentType {
  bp_value: string;
  bp_date: Date;
}

export default interface TobaccoUseType {
  smoked_in_thirty_days: string;
  average_smoking_years: number;
  average_packs_per_day: number;
  average_packs_per_year: number;
  quit_tobacco: string;
}

export default interface OtherProviderType {
  other_provider_beside_pcp: string;
  full_name: string;
  speciality: string;
}
export default interface MiscellaneousType {
  height: number;
  weight: number;
  time_spent: any;
  asprin_use: string;
  high_blood_pressure: string;
  behavioral_counselling: string;
}
export default interface PhysicalExamType {
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
