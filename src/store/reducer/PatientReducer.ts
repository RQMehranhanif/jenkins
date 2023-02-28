import { createSlice } from "@reduxjs/toolkit";
import {PatientType} from "@/Types/PatientType";

const initialState = {
  patientList: [] as PatientType[],
  patientProfile: {} as PatientType,
};

export const PatientServiceSlice = createSlice({
  name: "PatientService",
  initialState,
  reducers: {
    addPatientList: (state, action) => {
      return {
        ...state,
        patientList: action.payload,
      };
    },
    addPatientProfileList: (state, action) => {
      return {
        ...state,
        patientProfile: action.payload,
      };
    },
  },
});

export const { addPatientList, addPatientProfileList } =
  PatientServiceSlice.actions;
export default PatientServiceSlice.reducer;
