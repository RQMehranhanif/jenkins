import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {PatientType} from "@/Types/PatientType";
import {
  CKDType,
  OtherProviderType,
  CaregiverAssesmentType,
  HyperCholestrolemiaType,
  Hypertension,
} from "./../../Types/QuestionaireTypes";
import {
  FallingScreenType,
  DepressionType,
  GeneralHealthType,
  LdctType,
  CognitiveAssessmentType,
  MiscellaneousType,
  NutritionType,
  ImmunizationType,
  ScreeningType,
  SeatBeltType,
  CholesterolType,
  PhysicalActivityType,
  WeightAssessmentType,
  GeneralAssessmentType,
  MonthlyAssessmentType,
  AlcoholUseType,
  TobaccoUseType,
  PhysicalExamType,
  BpAssessmentType,
  COPDType,
  ObesityType,
  DiabetesMellitusType,
} from "@/Types/QuestionaireTypes";

type Questions = {
  fall_screening?: FallingScreenType;
  depression_phq9?: DepressionType;
  immunization?: ImmunizationType;
  screening?: ScreeningType;
  cholesterol_assessment?: CholesterolType;
  cognitiveAssessment?: CognitiveAssessmentType;
  diabetes?: FallingScreenType;
  generalHealth?: GeneralHealthType;
  pain?: GeneralHealthType;
  socialsupport?: GeneralHealthType;
  highstress?: GeneralHealthType;
  ldctdata?: LdctType;
  weight_assessment?: WeightAssessmentType;
  copd_assessment?: COPDType;
  physical_activities?: PhysicalActivityType;
  ckd_assessment?: CKDType;
  other_Provider?: OtherProviderType;
  caregiver_assessment?: CaregiverAssesmentType;
  hypercholestrolemia?: HyperCholestrolemiaType;
  misc?: MiscellaneousType;
  seatbelt_use?: SeatBeltType;
  nutrition?: NutritionType;
  cognitive_assessment?: CognitiveAssessmentType;
  general_health?: GeneralHealthType;
  social_emotional_support: GeneralHealthType;
  high_stress?: GeneralHealthType;
  obesity_assessment?: ObesityType;
  ldct_counseling?: LdctType;
  alcohol_use?: AlcoholUseType;
  tobacco_use?: TobaccoUseType;
  physical_exam?: PhysicalExamType;
  bp_assessment?: BpAssessmentType;
  general_assessment?: GeneralAssessmentType;
  monthly_assessment?: MonthlyAssessmentType;
  hypertension?: Hypertension;
  diabetes_mellitus?: DiabetesMellitusType;
};

const questionairesIntialState: Questions = {
  fall_screening: {} as FallingScreenType,
  depression_phq9: {} as DepressionType,
  immunization: {} as ImmunizationType,
  physical_activities: {} as PhysicalActivityType,
  misc: {} as MiscellaneousType,
  screening: {} as ScreeningType,
  seatbelt_use: {} as SeatBeltType,
  nutrition: {} as NutritionType,
  cholesterol_assessment: {} as CholesterolType,
  cognitive_assessment: {} as CognitiveAssessmentType,
  diabetes: {} as FallingScreenType,
  general_health: {} as GeneralHealthType,
  pain: {} as GeneralHealthType,
  social_emotional_support: {} as GeneralHealthType,
  high_stress: {} as GeneralHealthType,
  ldctdata: {} as LdctType,
  bp_assessment: {} as BpAssessmentType,
  weight_assessment: {} as WeightAssessmentType,
  general_assessment: {} as GeneralAssessmentType,
  monthly_assessment: {} as MonthlyAssessmentType,
  ldct_counseling: {} as LdctType,
  copd_assessment: {} as COPDType,
  ckd_assessment: {} as CKDType,
  other_Provider: {} as OtherProviderType,
  caregiver_assessment: {} as CaregiverAssesmentType,
  hypercholestrolemia: {} as HyperCholestrolemiaType,
  obesity_assessment: {} as ObesityType,
  alcohol_use: {} as AlcoholUseType,
  tobacco_use: {} as TobaccoUseType,
  physical_exam: {} as PhysicalExamType,
  hypertension: {} as Hypertension,
  diabetes_mellitus: {} as DiabetesMellitusType,
};

interface QuestionAirSlicetype {
  errors: object;
  loading: boolean;
  programmId: string;
  date_of_service: string;
  questionId: string;
  patientId: string;
  patientProfile: PatientType;
  question: Questions;
}

interface PatientProfileRequest {
  programmId: string;
  patient: PatientType;
}

interface QuestionPayload {
  key: string;
  data: any;
}

const initialState: QuestionAirSlicetype = {
  errors: {},
  loading: false,
  date_of_service: "",
  questionId: "",
  programmId: "2",
  patientId: "180",
  patientProfile: {} as PatientType,
  question: questionairesIntialState,
};

export const QuestionairesServiceSlice = createSlice({
  name: "QuestionairesService",
  initialState,
  reducers: {
    setLoader: (state, action: PayloadAction<boolean>) => {
      return { ...state, loading: action.payload };
    },
    setErrors: (state, action: PayloadAction<object>) => {
      return { ...state, errors: action.payload };
    },
    setDateofService: (state, action: PayloadAction<string>) => {
      return { ...state, date_of_service: action.payload };
    },
    setProgramId: (state, action: PayloadAction<string>) => {
      return { ...state, programmId: action.payload };
    },
    setPatientId: (state, action: PayloadAction<string>) => {
      return { ...state, patientId: action.payload };
    },
    setQuestionId: (state, action: PayloadAction<string>) => {
      return { ...state, questionId: action.payload };
    },
    setdiagnosis: (state, action: PayloadAction<object>) => {
      return { ...state, diagnosis: action.payload };
    },
    addPatientProfileData: (
      state,
      action: PayloadAction<PatientProfileRequest>
    ) => {
      const { patient, programmId } = action.payload;
      return {
        ...state,
        programmId,
        patientId: patient.id,
        patientProfile: patient,
      };
    },
    setQuestions: (state, action: PayloadAction<QuestionPayload>) => {
      const { key, data } = action.payload;
      const questions = { ...state.question };
      Object.assign(questions, { [key]: data });
      return { ...state, question: questions };
    },
    setAllQuestion: (state, action: PayloadAction<Questions>) => {
      return { ...state, question: action.payload };
    },
  },
});

export const {
  setLoader,
  setErrors,
  setDateofService,
  setQuestionId,
  addPatientProfileData,
  setQuestions,
  setAllQuestion,
  setProgramId,
  setPatientId,
  setdiagnosis,
} = QuestionairesServiceSlice.actions;

export const saveQuestionairesData = () => {
  const programmId = (state: RootState) => state.questionairesReduer.programmId;
  console.log("program Id data is ", programmId);
};

export default QuestionairesServiceSlice.reducer;
