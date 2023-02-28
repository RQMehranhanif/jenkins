export interface PatientType {
  id: number;
  name: string;
  first_name: string;
  mid_name: string;
  last_name: string;
}

export interface getAllScheduleRespose {
  success: boolean;
  message: string;
  total_records: number;
  patients_data: PatientType[];
  data: ScheduleTypes[];
}

export interface updateScheduleRespose {
  success: boolean;
  message: string;
  data: ScheduleTypes;
}

export default interface ScheduleTypes {
  patient_name?: string | number | readonly string[] | undefined;
  id: string;
  patient_id: any | null;
  status: string;
  scheduled_date: Date | string;
  scheduled_time: any;
}
