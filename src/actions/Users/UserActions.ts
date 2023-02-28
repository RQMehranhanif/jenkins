import { http } from "../../http";
import { getAllUsersRespose, singleUserResponse } from "@/Types/User";
import { deleteRecordResponse } from "@/Types/Common";
const USERS_URL = "/users";

const getUsersList = async (name: string, page: number) => {
  return await http.get<getAllUsersRespose>(
    `${USERS_URL}?search=${name}&page=${page}`
  );
};
const searchUser = async (name: string) => {
  return await http.get<getAllUsersRespose>(`${USERS_URL}?search=${name}`);
};

const addNewUser = async (data: any) => {
  return await http.post<singleUserResponse>("user/create", data);
};

const updateUser = async (id: string, data: any) => {
  return await http.post<singleUserResponse>(`/user/update/${id}`, data);
};

const deleteUser = async (id: string) => {
  return await http.post<deleteRecordResponse>(`/user/delete/${id}`);
};

export { getUsersList, addNewUser, updateUser, deleteUser, searchUser };
