import { http } from "../../http";

const getAwvCarePlan = async (id: any) =>
  await http.get(`careplan/awv-careplan/${id}`);

const getCCMGeneralCarePlan = async (id: any) =>
  await http.get(`careplan/ccm-careplan/${id}`);

const getQuestionnairList = async (id: string) =>
  await http.get(`careplan/filledquestionnaire/${id}`);

const getSigned = async (id: string, doctor_id: any) =>
  await http.post(`careplan/savesignature/${id}`, doctor_id);

export {
  getAwvCarePlan,
  getCCMGeneralCarePlan,
  getQuestionnairList,
  getSigned,
};
