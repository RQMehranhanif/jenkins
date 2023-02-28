/* eslint-disable @typescript-eslint/ban-types */
export interface getAllUsersRespose {
  success: boolean;
  message: string;
  total_records: number;
  roles_data: Object;
  data: UserType[];
}

export interface singleUserResponse {
  errors: any;
  success: boolean;
  message: string;
  data: UserType;
}

export default interface UserType {
  id: string;
  first_name: string;
  mid_name: string;
  last_name: string;
  contact_no: string;
  role: string;
  role_id: string;
  gender: string;
  email: string;
  password: string;
}
