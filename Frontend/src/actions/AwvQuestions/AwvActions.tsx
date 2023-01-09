import { http } from "../../http";
// const USERS_URL = "/questionnaire";

const addNewawv = async (data: any) => await http.post("questionaire", data);
const updateQuestionnaire = async (id: any, data: any) =>
  await http.post(`questionaire/update/${id}`, data);
const getprogram = async (data: any) =>
  await http.post("questionaire/get-programm-data", data);

export { addNewawv, updateQuestionnaire, getprogram };
