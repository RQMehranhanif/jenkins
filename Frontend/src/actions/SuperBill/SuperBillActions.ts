import { http } from "../../http";
const SuperBill_URL = "superbill";

const fetchData = async (id: string) => {
  return await http.get(`${SuperBill_URL}/${id}`);
};

const addCodes = async (data: any) => {
  return await http.post(`${SuperBill_URL}/add-code`, data);
};
const updateStatus = async (data: any) => {
  return await http.post(`${SuperBill_URL}/update-code`, data);
};

const deleteCode = async (data: any) => {
  return await http.post(`${SuperBill_URL}/delete-code`, data);
};
const deleteDxCode = async (data: any) => {
  return await http.post(`${SuperBill_URL}/delete-dx-code`, data);
};

export { fetchData, addCodes, updateStatus, deleteCode, deleteDxCode };
