import { http } from "../../http";

const DashboardData = async () => {
  return await http.get("/dashboard");
};
const FilterData = async (
  doctor_id: any,
  program_id: any,
  clinic_id: any,
  insurance_id: any
) => {
  return await http.get(
    `/dashboard?doctor_id=${doctor_id}&program_id=${program_id}&clinic_id=${clinic_id}&insurance_id=${insurance_id}`
  );
};

export { DashboardData, FilterData };
