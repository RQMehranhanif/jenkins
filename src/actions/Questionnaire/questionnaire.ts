import { http } from "../../http";
const ques_URL = "/questionaire";

const getquesList = async (name: string, page: number) => {
  return await http.get(`${ques_URL}?search=${name}&page=${page}`);
};
const searchquestions = async (name: string) => {
  return await http.get(`${ques_URL}?search=${name}`);
};

const saveques = async (data: any) => {
  return await http.post("/save-questionaires", data);
};

const deleteQues = (id: string) => {
  return http.post(`questionaire/delete/${id}`);
};
const quesedit = (id: string) => {
  return http.post(`questionaire/edit/${id}`);
};
const downloadcareplan = (id: string) => {
  return http.get(`careplan/careplanpdf/${id}`, { responseType: "blob" });
};

const downloadsuperBill = (id: string) => {
  return http.get(`superbill/super-bill/${id}`, { responseType: "blob" });
};

export {
  getquesList,
  saveques,
  quesedit,
  deleteQues,
  searchquestions,
  downloadcareplan,
  downloadsuperBill,
};
