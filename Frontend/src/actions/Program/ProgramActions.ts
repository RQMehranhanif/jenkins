import { http } from "../../http";
const USERS_URL = "/programs";

const getProgramList = async (page: number) => {
  return await http.get(`${USERS_URL}?page=${page}`);
};
const searchprograms = async (name: string) => {
  return await http.get(`${USERS_URL}?search=${name}`);
};
const addProgram = async (data: any) => {
  return await http.post("program/create", data);
};

const updateprogram = async (id: string, data: any) => {
  return await http.post(`program/update/${id}`, data);
};

const deleteprogram = async (id: string) => {
  return await http.delete(`program/delete/${id}`);
};
const Programedit = async (id: string) => {
  return await http.get(`program/edit/${id}`);
};

export {
  getProgramList,
  addProgram,
  updateprogram,
  deleteprogram,
  Programedit,
  searchprograms,
};
