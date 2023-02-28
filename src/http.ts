import axios from "axios";
import { OpenNotification } from "./Utilties/Utilties";

const token =
  localStorage.getItem("token") ||
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NzcxMTIxZi1kYmI3LTQ4NDMtYWI4ZC1lYzk2MDgyMmVmMjUiLCJqdGkiOiJkODM1OTRjMTdmZjRjNDBiYzdlOTFlNzU3ODJkNjc5NmZmZTIyNmJjNjNjZTY2OWI3ODA3NWIxYzY4ZDQ5NDljNDcyZTNiNzFlYjFmN2FlMCIsImlhdCI6MTY2NTE0OTc2MC4xMTc0NywibmJmIjoxNjY1MTQ5NzYwLjExNzU0OCwiZXhwIjoxNjk2Njg1NzYwLjEwOTQyMiwic3ViIjoiMyIsInNjb3BlcyI6W119.DEQOLv206NhP4l6RD3Az6W8dzILyjKsV-QBAGefWYPmOiZ2eBpMGWW3DfkBEH1M5L4WcV0HNts_s3Wj6udJinPp4Clp7rX0jahnQtthHa-mAyzD0EjehVPmKJWhd9uGj9dStTo0q40indznGudf1jpYUeT_Og-dr44CrfGuizCAWmZx_8tDHsiDef3N9mUGZsGHhArrw-uEKczmTX1YYTZQuuzklbgHSU26mUbCS5U03cpU1sBcZwdYVykkwDTx2qmaVorcJu2AJ_PXHUgYZWwQ_ahxTngsliAuUZwo8ZC7cdqxVuaV3LIiqz1TJx3g8llKm1zBlUVXaXxBbTu9vSx7wrNke4QWSAyHBQtDJK3U12QGTP0EgXkMAIi64Q4R3MKznKtmtfIM6Bl9OQ2bQwZEEx5ttgHVoB15V-tcvKe7EzTH6fRtD-j1VRvpjQ3VztGq5iwxYZMrJEcrbM_oBNPdu2e6INwMLfnchQhTrakW8AjbmKQihEO4tN5i9Rl-NQP18CJ7QOexJBW0gveTA6uN78yyNcORWGzEF3LNQ5yy254c4L5wY2cHtI4uxAtse4uFrOQQAlxXAbCj79d8AYE9MUZQnnEN_pBo2sqRXpCRBbsGgmo9lCOicN3HYlQoPfYj1RLw27CAkMQYQPmwwjVL4U29n0mwsc9ae2oV-31k";
export const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "access-control-allow-methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
  },
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      OpenNotification("error", "Please login with correct credentials");
    }
  }
);
