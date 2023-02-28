import { http } from "../../http";
const Patient_URL = "/patients";

const getPatientList = async (name: string, page: number) => {
  return await http.get(`${Patient_URL}?seacrh=${name}&page=${page}`);
};
const searchPatient = async (name: number) => {
  return await http.get(`${Patient_URL}?search=${name}`);
};

const addNewPatient = async (data: any) => {
  return await http.post("patient/create", data);
};

const editPatient = async (id: any, data: any) => {
  return await http.get(`patient/edit/${id}`, data);
};

const updatePatient = async (id: any, data: any) => {
  return await http.post(`patient/update/${id}`, data);
};

const deletePatient = async (id: any) => {
  return await http.post(`patient/delete/${id}`);
};
const getprogram = async (data: any) => {
  return await http.post(`questionaire/get-programm-data`, data);
};
const addDiagnosis = async (data: any) => {
  return await http.post(`patient/add-disease`, data);
};
const addMedication = async (data: any) => {
  return await http.post(`patient/add-medication`, data);
};
const addSurgical_history = async (data: any) => {
  return await http.post(`patient/add-surgery`, data);
};
const encounters = async (patient_id: any) => {
  return await http.get(`patient/encounters/${patient_id}`);
};
const roleFilter = async (clinic_id: any) => {
  return await http.get(`patient/insurance-pcp/${clinic_id}`);
};

export {
  roleFilter,
  getPatientList,
  addNewPatient,
  editPatient,
  updatePatient,
  deletePatient,
  getprogram,
  searchPatient,
  addDiagnosis,
  addMedication,
  addSurgical_history,
  encounters,
};
