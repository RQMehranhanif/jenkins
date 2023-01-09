import { http } from "../../http";
const SPECIALIST_URL = "/specialist";

const getSpecialistList = async () => {
  return await http.get(SPECIALIST_URL);
};

const addNewSpecialist = async (data: any) => {
  return await http.post(SPECIALIST_URL, data);
};

const updateSpecialist = async (id: string, data: any) => {
  return await http.post(SPECIALIST_URL + `/update/${id}`, data);
};

const deleteSpecialist = async (id: string) => {
  return await http.delete(SPECIALIST_URL + `/delete/${id}`);
};

export {
  getSpecialistList,
  addNewSpecialist,
  updateSpecialist,
  deleteSpecialist,
};
