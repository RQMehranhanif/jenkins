import { http } from "../../http";
const USERS_URL = "/clinics";

const getClinicList = async (page: number) => {
  return await http.get(`${USERS_URL}?page=${page}`);
};
const searchclinics = async (name: string) => {
  return await http.get(`${USERS_URL}?search=${name}`);
};

const addNewClinic = async (data: any) => {
  return await http.post("clinic/create", data);
};

const updateClinic = async (id: string, data: any) => {
  return await http.post(`/clinic/update/${id}`, data);
};

const editClinic = async (id: string) => {
  return await http.get(`/clinic/edit/${id}`);
};

const deleteClinic = async (id: string) => {
  return await http.post(`/clinic/delete/${id}`);
};

export {
  getClinicList,
  addNewClinic,
  updateClinic,
  editClinic,
  deleteClinic,
  searchclinics,
};
