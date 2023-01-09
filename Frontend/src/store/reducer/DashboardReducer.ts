import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface dashboardFilters {
  doctor_id: string;
  program_id: string;
  clinic_id: string;
  insurance_id: string;
}

interface RequestFilter {
  key: string;
  value: string;
}

const initialState: dashboardFilters = {
  doctor_id: "",
  program_id: "",
  clinic_id: "",
  insurance_id: "",
};

export const DashboardService = createSlice({
  name: "DashboardService",
  initialState,
  reducers: {
    setFilterData: (state, action: PayloadAction<RequestFilter>) => {
      const { key, value } = action.payload;
      /* let filters = {...state }
     Object.assign(filters,{[key]:value}) */
      return { ...state, [key]: value };
    },
  },
});

export const { setFilterData } = DashboardService.actions;
export default DashboardService.reducer;
