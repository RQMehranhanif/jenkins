import { http } from "../../http";
const Clinic_URL = "/clinicAdmins";

const getClinicList = async (page: number) => {
  return await http.get(`${Clinic_URL}?page=${page}`);
};
const searchclinicAdmins = async (name: string) => {
  return await http.get(`${Clinic_URL}?search=${name}`);
};

const addNewClinic = async (data: any) => {
  return await http.post("clinicAdmin/create", data);
};

const updateClinic = async (id: any, data: any) => {
  return await http.post(`clinicAdmin/update/${id}`, data);
};

const deleteClinic = async (id: any) => {
  return await http.post(`clinicAdmin/delete/${id}`);
};

export {
  getClinicList,
  addNewClinic,
  updateClinic,
  deleteClinic,
  searchclinicAdmins,
};
