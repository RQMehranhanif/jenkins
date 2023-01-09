import { http } from "../../http";

const SubmitLogin = async (data: any) => {
  return await http.post("login", data);
};

const SubmitLogout = async () => {
  return await http.post("logout");
};

export { SubmitLogin, SubmitLogout };
