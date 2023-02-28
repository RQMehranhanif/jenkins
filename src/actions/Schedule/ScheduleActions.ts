import { http } from "../../http";
import {
  getAllScheduleRespose,
  updateScheduleRespose,
} from "@/Types/ScheduleTypes";
import { deleteRecordResponse } from "@/Types/Common";
const USERS_URL = "/schedules";

const getScheduleList = async (page: number) => {
  return await http.get<getAllScheduleRespose>(`${USERS_URL}?page=${page}`);
};
const searchschedules = async (name: string) => {
  return await http.get<getAllScheduleRespose>(`${USERS_URL}?search=${name}`);
};

const addNewSchedule = async (data: any) => {
  return await http.post<updateScheduleRespose>("/schedule/create", data);
};

const updateSchedule = async (id: string, data: any) => {
  return await http.post<updateScheduleRespose>(`/schedule/update/${id}`, data);
};

const deleteSchedule = async (id: string) => {
  return await http.post<deleteRecordResponse>(`/schedule/delete/${id}`);
};

export {
  getScheduleList,
  addNewSchedule,
  updateSchedule,
  deleteSchedule,
  searchschedules,
};
