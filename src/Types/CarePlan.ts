export interface PatientType {
  doctor: any;
  date_of_service: any;
  id: string;
  last_name: string;
  first_name: string;
  mid_name: string;
  name: string;
  identity: string;
  contact_no: string;
  cell: string;
  dob: string;
  age: string;
  doctor_id: string;
  gender: string;
  disease: string;
  address: string;
  address_2: string;
  insurance_id: string;
  description: string;
  condition: string;
  status: string;
  city: string;
  state: string;
  zipCode: string;
}
export interface PatientHeightWeightNextDueType {
  height: string;
  weight: string;
  next_year_due: string;
}
export interface ProgramType {
  name: string;
  short_name: string;
}

export interface PatientRowDetailsType {
  id: string;
  serial_no: string;
  patient_id: string;
  program_id: string;
  created_user: string;
  doctor_id: string;
  signed_date: string;
  date_of_service: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  primary_care_physician: string;
}
export interface FallScreeningType {
  outcome: string;
}
export interface DepressionOutComesType {
  severity: string;
  referrals: string;
  referrals1: string;
  flag: boolean;
}
export interface HighStressType {
  outcome: string;
}
export interface GeneralHealthType {
  health_level: string;
  mouth_and_teeth: string;
  feelings_cause_distress: string;
  flag: boolean;
}
export interface SocialEmotionalSupportType {
  outcome: string;
}
export interface PainType {
  pain_felt: string;
  outcome: string;
}
export interface CognitiveAssessmentType {
  outcome: string;
}
export interface PhysicalActivityType {
  outcome: string;
  flag: boolean;
}
export interface AlcohalUseType {
  outcome: string;
  flag: boolean;
}
export interface TobaccoUseType {
  quit_tobacoo: string;
  flag: boolean;
}
export interface SeatBeltUseType {
  outcome: string;
  flag: boolean;
}
export interface ImmunizationType {
  flu_vaccine: string;
  flu_vaccine_script: string;
  pneumococcal_vaccine: string;
  pneumococcal_vaccine_script: string;
  nextFluVaccine: Date;
  flag: boolean;
}
export interface ScreeningType {
  mammogram: string;
  next_mammogram: string;
  next_mammogram_date: string;
  mammogram_script: string;
  mammogaram_flag: boolean;
  next_colonoscopy: string;
  test_type: string;
  next_col_fit_guard: string;
  colonoscopy_script: string;
  colonoscopy: string;
  colo_flag: boolean;
}
export interface DiabetesType {
  diabetes: string;
  is_diabetic: string;
  next_hba1c_date: string;
  next_fbs_date: string;
  diabetec_eye_exam: string;
  nepropathy: string;
  nephropathy_flag: boolean;
  eye_exam_flag: boolean;
  flag: boolean;
}
export interface CholestrolType {
  outcome: string;
  ldl_result: string;
  ldl_next_due: string;
}
export interface BpAssessmentType {
  flag: boolean;
  bp_result: string;
  outcome: string;
}
export interface WeightAssessmentType {
  bmi_result: string;
  outcome: string;
}

export interface CaregiverAssesmentType {
  every_day_activities: string;
  medications: string;
}

export interface OtherProviderType {
  other_provider_beside_pcp: string;
}

export interface GeneralAssessmentType {
  bar_or_liquid_end_date: string;
  bar_or_liquid_start_date: string;
  imp_handwash_end_date: string;
  imp_handwash_start_date: string;
  is_consuming_tobacco: string;
  is_taking_medication: string;
  no_soap_condition_end_date: string;
  no_soap_condition_start_date: string;
  physical_exercise_level: string;
  physical_exercises: string;
  plain_soap_usage_end_date: string;
  plain_soap_usage_start_date: string;
  turnoff_faucet_end_date: string;
  turnoff_faucet_start_date: string;
  uips_end_date: string;
  uips_start_date: string;
  und_handwash_end_date: string;
  und_handwash_start_date: string;
  und_washhands_end_date: string;
  und_washhands_start_date: string;
  understand_faucet_end_date: string;
  understand_faucet_start_date: string;
  understand_hand_sanitizer_end_date: string;
  understand_hand_sanitizer_start_date: string;
  washwithsoap_end_date: string;
  washwithsoap_start_date: string;
  imp_handwash_status: string;
  und_handwash_status: string;
  washwithsoap_status: string;
  und_washhands_status: string;
  turnoff_faucet_status: string;
  understand_faucet_status: string;
  plain_soap_usage_status: string;
  bar_or_liquid_status: string;
  uips_status: string;
  no_soap_condition_status: string;
  understand_hand_sanitizer_status: string;
  prescribed_medications: string;
}

export interface HypercholesterolemiaType {
  ur_hyperlipidemia_start_date: string;
  ur_hyperlipidemia_end_date: string;
  ur_hyperlipidemia_status: string;
  el_cardio_start_date: string;
  el_cardio_end_date: string;
  el_cardio_status: string;
  ui_controlling_start_date: string;
  ui_controlling_end_date: string;
  ui_controlling_status: string;
  ue_exercise_start_date: string;
  ue_exercise_end_date: string;
  ue_exercise_status: string;
  prognosis: string;
}

export interface HypertensionType {
  effect_start_date: string;
  effect_end_date: string;
  effect_status: string;
  imp_bp_monitoring_start_date: string;
  imp_bp_monitoring_end_date: string;
  imp_bp_monitoring_status: string;
  relation_start_date: string;
  relation_end_date: string;
  relation_status: string;
  imp_of_medication_start_date: string;
  imp_of_medication_end_date: string;
  imp_of_medication_status: string;
  adopt_lifestyle_start_date: string;
  adopt_lifestyle_end_date: string;
  adopt_lifestyle_status: string;
  quit_smoking_alcohol_start_date: string;
  quit_smoking_alcohol_end_date: string;
  quit_smoking_alcohol_status: string;
  adopt_dietary_start_date: string;
  adopt_dietary_end_date: string;
  adopt_dietary_status: string;
  maintain_weight_start_date: string;
  maintain_weight_end_date: string;
  maintain_weight_status: string;
  moderate_exercise_start_date: string;
  moderate_exercise_end_date: string;
  moderate_exercise_status: string;
  regular_pcp_folloup_start_date: string;
  regular_pcp_folloup_end_date: string;
  regular_pcp_folloup_status: string;
  result: string;
  prognosis: string;
}

export interface ObesityType {
  prognosis: string;
  awareness_about_bmi_start_date: string;
  awareness_about_bmi_end_date: string;
  awareness_about_bmi_status: string;
  need_of_weight_loss_start_date: string;
  need_of_weight_loss_end_date: string;
  need_of_weight_loss_status: string;
  imp_of_healthy_weight_start_date: string;
  imp_of_healthy_weight_end_date: string;
  imp_of_healthy_weight_status: string;
  imp_of_healthy_eating_start_date: string;
  imp_of_healthy_eating_end_date: string;
  imp_of_healthy_eating_status: string;
  diet_assist_start_date: string;
  diet_assist_end_date: string;
  diet_assist_status: string;
  moderate_activity_inaweek_start_date: string;
  moderate_activity_inaweek_end_date: string;
  moderate_activity_inaweek_status: string;
  referred_dietician_start_date: string;
  referred_dietician_end_date: string;
  referred_dietician_status: string;
}

export interface DiabetesMellitusType {
  eyeexam_careplan: string;
  nephro_careplan: string;
  imp_blood_glucose_start_date: string;
  imp_blood_glucose_end_date: string;
  imp_blood_glucose_status: string;
  und_hypoglycemia_hyperglycemia_start_date: string;
  und_hypoglycemia_hyperglycemia_end_date: string;
  und_hypoglycemia_hyperglycemia_status: string;
  recognize_signs_symptoms_start_date: string;
  recognize_signs_symptoms_end_date: string;
  recognize_signs_symptoms_status: string;
  reduce_complications_start_date: string;
  reduce_complications_end_date: string;
  reduce_complications_status: string;
  und_imp_of_quit_smoking_start_date: string;
  und_imp_of_quit_smoking_end_date: string;
  und_imp_of_quit_smoking_status: string;
  maintain_healthy_weight_start_date: string;
  maintain_healthy_weight_end_date: string;
  maintain_healthy_weight_status: string;
  engage_physical_activity_start_date: string;
  engage_physical_activity_end_date: string;
  engage_physical_activity_status: string;
  maintain_a_healthy_diet_start_date: string;
  maintain_a_healthy_diet_end_date: string;
  maintain_a_healthy_diet_status: string;
  und_foot_care_start_date: string;
  und_foot_care_end_date: string;
  und_foot_care_status: string;
}

export interface CopdAssessmentType {
  careplan: string;
  prognosis: string;
  smoking_cessation_start_date: string;
  smoking_cessation_end_date: string;
  smoking_cessation_status: string;
  copd_medication_start_date: string;
  copd_medication_end_date: string;
  copd_medication_status: string;
  supplemental_oxygen_start_date: string;
  supplemental_oxygen_end_date: string;
  supplemental_oxygen_status: string;
  self_mgmt_start_date: string;
  self_mgmt_end_date: string;
  self_mgmt_status: string;
  tirgger_exacerbations_start_date: string;
  tirgger_exacerbations_end_date: string;
  tirgger_exacerbations_status: string;
  exacerbations_symptoms_start_date: string;
  exacerbations_symptoms_end_date: string;
  exacerbations_symptoms_status: string;
  followup_imp_start_date: string;
  followup_imp_end_date: string;
  followup_imp_status: string;
  imp_of_vaccine_start_date: string;
  imp_of_vaccine_end_date: string;
  imp_of_vaccine_status: string;
  safe_physical_activity_start_date: string;
  safe_physical_activity_end_date: string;
  safe_physical_activity_status: string;
  group_support_start_date: string;
  group_support_end_date: string;
  group_support_status: string;
}

export interface ChfAssessmentType {
  no_echodiogram: string;
  careplan: string;
  prognosis: string;
  ge_chf_start_date: string;
  ge_chf_end_date: string;
  ge_chf_status: string;
  ui_smoke_cessation_start_date: string;
  ui_smoke_cessation_end_date: string;
  ui_smoke_cessation_status: string;
  ui_sodium_diet_start_date: string;
  ui_sodium_diet_end_date: string;
  ui_sodium_diet_status: string;
  ui_fluid_restriction_start_date: string;
  ui_fluid_restriction_end_date: string;
  ui_fluid_restriction_status: string;
  uid_weight_monitoring_start_date: string;
  uid_weight_monitoring_end_date: string;
  uid_weight_monitoring_status: string;
  rs_excerbation_start_date: string;
  rs_excerbation_end_date: string;
  rs_excerbation_status: string;
  ri_adherence_start_date: string;
  ri_adherence_end_date: string;
  ri_adherence_status: string;
  seek_help_start_date: string;
  seek_help_end_date: string;
  seek_help_status: string;
}

export interface CkdAssessmentType {
  result: string;
  prognosis: string;
  ak_ckd_start_date: string;
  ak_ckd_end_date: string;
  ak_ckd_status: string;
  ur_kidney_disease_start_date: string;
  ur_kidney_disease_end_date: string;
  ur_kidney_disease_status: string;
  uih_bp_start_date: string;
  uih_bp_end_date: string;
  uih_bp_status: string;
  ria_mitigate_risk_start_date: string;
  ria_mitigate_risk_end_date: string;
  ria_mitigate_status: string;
  ui_smoking_cessation_start_date: string;
  ui_smoking_cessation_end_date: string;
  ui_smoking_status: string;
  uidbp_normalbp_start_date: string;
  uidbp_normalbp_end_date: string;
  uidbp_normalbp_status: string;
  rid_medication_start_date: string;
  rid_medication_end_date: string;
  rid_medication_status: string;
  adm_dietary_start_date: string;
  adm_dietary_end_date: string;
  adm_dietary_status: string;
  mbshr_diabetes_start_date: string;
  mbshr_diabetes_end_date: string;
  mbshr_diabetes_status: string;
  tmh_weight_start_date: string;
  tmh_weight_end_date: string;
  tmh_weight_status: string;
  thp_strategy_start_date: string;
  thp_strategy_end_date: string;
  thp_strategy_status: string;
  thp_adjust_ckd_start_date: string;
  thp_adjust_ckd_end_date: string;
  thp_adjust_status: string;
}

export interface chronicDiseasesType {
  CKD: boolean;
  ChronicObstructivePulmonaryDisease: boolean;
  CongestiveHeartFailure: boolean;
  Depression: boolean;
  DiabetesMellitus: boolean;
  Hypercholesterolemia: boolean;
  Hypertensions: boolean;
  Obesity: boolean;
  anemia: boolean;
  asthma: boolean;
  hyperthyrodism: boolean;
}
