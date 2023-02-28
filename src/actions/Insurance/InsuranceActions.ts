import { http } from "../../http";
const USERS_URL = "/insurance";

const getInsuranceList = async (page: number) => {
  return await http.get(`${USERS_URL}?page=${page}`);
};
const searchinsurance = async (name: string) => {
  return await http.get(`${USERS_URL}?search=${name}`);
};

const addNewInsurance = async (data: any) => {
  return await http.post("insurance/create", data);
};

const updateInsurance = async (id: string, data: any) => {
  return await http.post(`/insurance/update/${id}`, data);
};

const deleteInsurance = async (id: string) => {
  return await http.delete(`/insurance/delete/${id}`);
};

export {
  getInsuranceList,
  addNewInsurance,
  updateInsurance,
  deleteInsurance,
  searchinsurance,
};
