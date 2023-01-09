import React, { useState } from "react";
import { RootState } from "@/store/store";
import { useAppSelector, useAppDispatch } from "../../../../hooks/hooks";
import { QuestionaireResponse } from "../../../../Types/QuestionaireTypes";
import {
  setLoader,
  setQuestionId,
  setQuestions,
  setAllQuestion,
  setProgramId,
  setDateofService,
  setPatientId,
  addPatientProfileData,
} from "../../../../store/reducer/QuestionairesReducer";
import Awv from "../../../Program/Questionaires";
import {
  addNewawv,
  updateQuestionnaire,
} from "../../../../actions/AwvQuestions/AwvActions";
import CCM from "../../../../components/Program/CCMQuestionaires";
import { quesedit } from "../../../../actions/Questionnaire/questionnaire";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";
import { OpenNotification } from "./../../../../Utilties/Utilties";
import { LoadingOutlined } from "@ant-design/icons";

function QuestionairesForm() {
  const location = useLocation();
  const id = location.state?.id;
  const age = location.state?.age;
  const patientdata = location?.state?.data;
  const name = location?.state?.name;
  const dob = location?.state?.dob;
  const gender = location?.state?.gender;
  const insurance_name = location?.state?.insurance_name;
  const step = location?.state?.step;
  const [signed, setSigned] = useState("");

  React.useEffect(() => {
    dispatch(setQuestionId(""));
  }, []);
  const dispatch = useAppDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const {
    programmId,
    questionId,
    patientId,
    date_of_service,
    loading,
    diagnosis,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  React.useEffect(() => {
    if (id) {
      dispatch(setLoader(true));

      quesedit(id).then(({ data: response }) => {
        dispatch(setLoader(false));
        const row = response.data.row;
        if (response.success) {
          setSigned(row.signed_date);
          dispatch(setAllQuestion(response.data.list));
          dispatch(setQuestionId(row.id));
          dispatch(setDateofService(row.date_of_service));
          dispatch(setProgramId(row.program_id.toString()));
          dispatch(setPatientId(row.patient_id));
          dispatch(setDateofService(row.date_of_service));
          dispatch(
            addPatientProfileData({
              patient: row?.patient,
              programmId: row.program_id.toString(),
            })
          );
        } else {
          OpenNotification("error", response.error);
        }
      });
    }
  }, []);

  const saveQuestionairsData = async (
    key: string,
    data: any,
    moreThanOneRecord?: object
  ): Promise<QuestionaireResponse> => {
    const request = {};
    const dispatchdata = { key, data };
    Object.assign(request, { patient_id: patientId });
    Object.assign(request, { program_id: programmId });
    dispatch(setLoader(true));
    if (questionId === "") {
      Object.assign(request, { [key]: data });
      Object.assign(request, { date_of_service });
      try {
        const response = await addNewawv(request);

        const result = await response.data;
        dispatch(setLoader(false));
        if (result.success) {
          dispatch(setQuestionId(result.questionnaire_id.toString()));
        }
        dispatch(setQuestions(dispatchdata));
        return result;
      } catch (error) {
        dispatch(setLoader(false));

        return {
          success: false,
          message: "Something went wrong",
        };
      }
    } else {
      try {
        if (moreThanOneRecord != null) {
          Object.entries(moreThanOneRecord).map(([itemKey, itemValue]) => {
            Object.assign(request, { [itemKey]: itemValue });
            Object.assign(request, { ["date_of_service"]: date_of_service });
          });
        } else {
          Object.assign(request, { [key]: data });
          Object.assign(request, { ["date_of_service"]: date_of_service });
        }
        const response = await updateQuestionnaire(questionId, request);
        const result = await response.data;
        dispatch(setLoader(false));
        if (moreThanOneRecord != null) {
          Object.entries(moreThanOneRecord).map(([itemKey, itemValue]) => {
            const newdata = { key: itemKey, data: itemValue };
            dispatch(setQuestions(newdata));
          });
        } else {
          dispatch(setQuestions(dispatchdata));
        }
        return result;
      } catch (error) {
        dispatch(setLoader(false));

        return {
          success: false,
          message: "Something went wrong",
        };
      }
    }
  };

  return (
    <div>
      <Spin spinning={loading} indicator={antIcon}>
        {programmId === "1" && (
          <Awv
            saveQuestionairsData={saveQuestionairsData}
            id={age}
            name={name}
            dob={dob}
            gender={gender}
            step={step}
            signed={signed}
            insurance_name={insurance_name}
          />
        )}
        {programmId === "2" && (
          <CCM
            saveQuestionairsData={saveQuestionairsData}
            patient={patientdata}
            diagnosis={diagnosis}
            id={age}
            name={name}
            dob={dob}
            gender={gender}
            insurance_name={insurance_name}
          />
        )}
      </Spin>
    </div>
  );
}
export default QuestionairesForm;
