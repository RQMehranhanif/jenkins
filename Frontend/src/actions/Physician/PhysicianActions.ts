import { http } from "../../http";
const PHYSICIAN_URL = "/physician";

const getPhysicianList = async () => {
  return await http.get("/physicians");
};
const searchphysicians = async (name: string) => {
  return await http.get(`/physicians?search=${name}`);
};

const addNewPhysician = async (data: any) => {
  return await http.post(PHYSICIAN_URL + "/create", data);
};

const updatePhysicianlist = async (id: string, data: any) => {
  return await http.post(PHYSICIAN_URL + `/update/${id}`, data);
};

const deletePhysician = async (id: string) => {
  return await http.delete(PHYSICIAN_URL + `/delete/${id}`);
};

export {
  getPhysicianList,
  addNewPhysician,
  updatePhysicianlist,
  deletePhysician,
  searchphysicians,
};
