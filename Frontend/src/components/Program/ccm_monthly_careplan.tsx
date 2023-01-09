import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { PatientType } from "@/Types/PatientType";
import ProgramType from "@/Types/ProgramType";
import {
  setLoader,
  /* setProgramId,
  setQuestionId, */
} from "../../store/reducer/QuestionairesReducer";
import { getCCMGeneralCarePlan } from "../../actions/AwvCarePlan/AwvCarePlanActions";
import { RootState } from "../../store/store";
import { Spin } from "antd";
import {
  ChfAssessmentType,
  chronicDiseasesType,
  CkdAssessmentType,
  CopdAssessmentType,
  DiabetesMellitusType,
  HypercholesterolemiaType,
  HypertensionType,
  ObesityType,
  PatientRowDetailsType,
} from "@/Types/CarePlan";
import { useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

// import { MonthlyAssessmentType } from "@/Types/QuestionaireTypes";
// import { useNavigate } from "react-router-dom";

const CCMMonthlyCarePlan: React.FC = () => {
  const { loading } = useAppSelector(
    (state: RootState) => state.questionairesReduer
  );
  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  const [program, setProgram] = useState<ProgramType>({} as ProgramType);
  const [rowdata, setRowData] = useState<PatientRowDetailsType>(
    {} as PatientRowDetailsType
  );

  /* const [monthly_assessment, setMonthlyAssessment] = useState<MonthlyAssessmentType>(
    {} as MonthlyAssessmentType
  ); */
  const [hypercholesterolemia, setHypercholesterolemia] =
    useState<HypercholesterolemiaType>({} as HypercholesterolemiaType);

  const [hypertension, setHypertension] = useState<HypertensionType>(
    {} as HypertensionType
  );

  const [obesity, setObesity] = useState<ObesityType>({} as ObesityType);

  const [diabetesmellitus, setDiabetesMellitus] =
    useState<DiabetesMellitusType>({} as DiabetesMellitusType);

  const [copdassessment, setCopdAssessment] = useState<CopdAssessmentType>(
    {} as CopdAssessmentType
  );

  const [chfassessment, setChfAssessment] = useState<ChfAssessmentType>(
    {} as ChfAssessmentType
  );

  const [ckdassessment, setCkdAssessment] = useState<CkdAssessmentType>(
    {} as CkdAssessmentType
  );

  const [chronicDiseases, setChronicDiseases] = useState<chronicDiseasesType>(
    {} as chronicDiseasesType
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchccmgeneralCareplan();
  }, []);
  const location = useLocation();
  const id = location.state.questionid;

  function fetchccmgeneralCareplan() {
    dispatch(setLoader(true));
    getCCMGeneralCarePlan(id).then(({ data: response }) => {
      dispatch(setLoader(false));
      /* General Data */
      setPatient(response.row.patient);
      setProgram(response.row.program);
      setRowData(response.row);

      /* Careplan Data */
      // setMonthlyAssessment(response.monthly_assessment_outcomes);
      setHypercholesterolemia(response.hypercholestrolemia_outcomes);
      setHypertension(response.hypertension_outcomes);
      setObesity(response.obesity_outcomes);
      setDiabetesMellitus(response.diabetes_outcome);
      setCopdAssessment(response.copd_outcomes);
      setChfAssessment(response.chf_outcomes);
      setCkdAssessment(response.ckd_outcomes);
      setChronicDiseases(response.chronic_disease);
    });
  }
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  /* const navigate = useNavigate();
  const handleBack = (questionId: any, programid: any) => {
    dispatch(setProgramId(programid));
    dispatch(setQuestionId(questionId));
    navigate(`/questionaire/edit/${questionId}`, {
      state: { id: rowdata.id, age: patient.age },
    });
  };

  const handleclose = () => {
    navigate("/questionaires");
  }; */

  console.log(chronicDiseases, "chronicDiseases");

  return (
    <>
      <Spin spinning={loading} indicator={antIcon}>
        <div className="card-header">
          <div className="card main-card">
            <div className="card-body">
              <h3 className="main-heading">CCM Care plan Particular Diease</h3>
              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Patient Name: {patient?.name}
                  </h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Date of Birth: {patient.dob}
                  </h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">Age: {patient?.age}</h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">Gender: {patient?.gender}</h6>
                </div>
              </div>
              <div className="row">
                {/* <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">Height: </h6></div>
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">Weight: </h6></div> */}
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Primary care Physician: {rowdata?.primary_care_physician}
                  </h6>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Program: {program?.name} ({program?.short_name})
                  </h6>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Date of Service: {rowdata?.date_of_service}
                  </h6>
                </div>
                <div className="col-lg-6 md-3 sm-6">
                  <button
                    className="btn btn-info round-pill float-right ml-2"
                    style={{ lineHeight: "15px" }}
                  >
                    Sign
                  </button>
                  <button
                    className="btn btn-info float-right"
                    style={{ lineHeight: "15px" }}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              <table className="table table-hover table-light">
                <tbody>
                  {/* {{--Hypercholestrolemia Starts--}} */}
                  {chronicDiseases?.Hypercholesterolemia && (
                    <>
                      <th colSpan={12} className="text-center table-primary">
                        Hypercholesterolemia
                      </th>

                      <tr>
                        <th colSpan={2}>Prognosis</th>
                        <td colSpan={10}>{hypercholesterolemia?.prognosis}</td>
                      </tr>

                      <tr>
                        <th colSpan={7} className="text-center table-primary">
                          Goals
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          Start Date
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          End Date
                        </th>
                        <th colSpan={1} className="text-center table-primary">
                          Status
                        </th>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To develope an understanding regarding risk factors
                          and monitoring for Hyperlipidemia.
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            hypercholesterolemia?.ur_hyperlipidemia_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            hypercholesterolemia?.ur_hyperlipidemia_end_date
                          }{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypercholesterolemia?.ur_hyperlipidemia_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the effect of Lipids on Cardiovascular
                          System
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypercholesterolemia?.el_cardio_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypercholesterolemia?.el_cardio_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypercholesterolemia?.el_cardio_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of healthy diet in
                          controlling Lipids
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypercholesterolemia?.ui_controlling_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypercholesterolemia?.ui_controlling_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypercholesterolemia?.ui_controlling_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the effect of Exercise on Lipids
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypercholesterolemia?.ue_exercise_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypercholesterolemia?.ue_exercise_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypercholesterolemia?.ue_exercise_status}{" "}
                        </td>
                      </tr>
                    </>
                  )}
                  {/* {{--Hypercholestrolemia Ends--}} */}

                  {/*{{--Diabetes Starts--}} */}
                  {chronicDiseases?.DiabetesMellitus && (
                    <>
                      <th colSpan={12} className="text-center table-primary">
                        Diabetes
                      </th>

                      <tr>
                        <th colSpan={2}> Prognosis </th>
                        <td colSpan={10}>
                          {" "}
                          {diabetesmellitus?.eyeexam_careplan}{" "}
                        </td>{" "}
                        <br />
                        <td colSpan={10}>
                          {" "}
                          {diabetesmellitus?.nephro_careplan}{" "}
                        </td>
                      </tr>

                      <tr>
                        <th colSpan={7} className="text-center table-primary">
                          Goals
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          Start Date
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          End Date
                        </th>
                        <th colSpan={1} className="text-center table-primary">
                          Status
                        </th>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of Blood Glucose
                          Monitoring and control
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {diabetesmellitus?.imp_blood_glucose_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {diabetesmellitus?.imp_blood_glucose_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {diabetesmellitus?.imp_blood_glucose_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To Understand Hypoglycemia, hyperglycemia and how to
                          prevent them
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.und_hypoglycemia_hyperglycemia_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.und_hypoglycemia_hyperglycemia_end_date
                          }{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {
                            diabetesmellitus?.und_hypoglycemia_hyperglycemia_status
                          }{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To recognize the signs and symptoms of exacerbation
                          that must be reported to the doctor/nurse
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.recognize_signs_symptoms_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.recognize_signs_symptoms_end_date
                          }{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {
                            diabetesmellitus?.recognize_signs_symptoms_status
                          }{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To reduce the risk of complications and prevent future
                          health problems
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.reduce_complications_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {diabetesmellitus?.reduce_complications_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {diabetesmellitus?.reduce_complications_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of quitting Smoking to
                          reduce the risk of complications
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.und_imp_of_quit_smoking_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.und_imp_of_quit_smoking_end_date
                          }{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {
                            diabetesmellitus?.und_imp_of_quit_smoking_status
                          }{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>To maintain a healthy Weight</td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.maintain_healthy_weight_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.maintain_healthy_weight_end_date
                          }{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {
                            diabetesmellitus?.maintain_healthy_weight_status
                          }{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To engage in 150 minutes of moderate intensity
                          physical activity per week
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.engage_physical_activity_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.engage_physical_activity_end_date
                          }{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {
                            diabetesmellitus?.engage_physical_activity_status
                          }{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To maintain a healthy diet for managing diabetes
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.maintain_a_healthy_diet_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            diabetesmellitus?.maintain_a_healthy_diet_end_date
                          }{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {
                            diabetesmellitus?.maintain_a_healthy_diet_status
                          }{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To develop an understanding of Diabetic Foot care
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {diabetesmellitus?.und_foot_care_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {diabetesmellitus?.und_foot_care_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {diabetesmellitus?.und_foot_care_status}{" "}
                        </td>
                      </tr>
                    </>
                  )}
                  {/* {{--Diabetes Ends--}} */}

                  {/* {{-- COPD STARTS --}} */}
                  {chronicDiseases?.ChronicObstructivePulmonaryDisease && (
                    <>
                      <th colSpan={12} className="text-center table-primary">
                        COPD
                      </th>

                      <tr>
                        <th colSpan={2}>Prognosis</th>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.careplan} {copdassessment?.prognosis}{" "}
                        </td>
                      </tr>

                      <tr>
                        <th colSpan={7} className="text-center table-primary">
                          Goals
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          Start Date
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          End Date
                        </th>
                        <th colSpan={1} className="text-center table-primary">
                          Status
                        </th>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of smoking cessation
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.smoking_cessation_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.smoking_cessation_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.smoking_cessation_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To recognize the importance of discipline in taking
                          COPD medication as prescribed
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.copd_medication_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.copd_medication_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.copd_medication_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To have an understanding regarding safe utilization
                          and management of supplemental oxygen therapy
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.supplemental_oxygen_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.supplemental_oxygen_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.supplemental_oxygen_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To have an understanding regarding self-management of
                          COPD
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.self_mgmt_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.self_mgmt_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.self_mgmt_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To identify and avoid triggers for exacerbations
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            copdassessment?.tirgger_exacerbations_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.tirgger_exacerbations_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.tirgger_exacerbations_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To recognize signs and symptoms of exacerbations which
                          must be reported to the doctor/nurse
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            copdassessment?.exacerbations_symptoms_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.exacerbations_symptoms_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.exacerbations_symptoms_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of regular follow-up with
                          PCP and Pulmonologist
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.followup_imp_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.followup_imp_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.followup_imp_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of pneumonia and flu
                          vaccination
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.imp_of_vaccine_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.imp_of_vaccine_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.imp_of_vaccine_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To develop knowledge regarding and engage in
                          symptom-limited, safe physical activity
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {
                            copdassessment?.safe_physical_activity_start_date
                          }{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.safe_physical_activity_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.safe_physical_activity_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To utilize counseling/group support.
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.group_support_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {copdassessment?.group_support_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {copdassessment?.group_support_status}{" "}
                        </td>
                      </tr>
                    </>
                  )}
                  {/* {{-- COPD ENDS --}}*/}

                  {/*{{-- CKD START --}} */}
                  {chronicDiseases?.CKD && (
                    <>
                      <th colSpan={12} className="text-center table-primary">
                        CKD
                      </th>

                      <tr>
                        <th scope="row">BP Assesment</th>

                        <td colSpan={2}>
                          <br />
                        </td>
                      </tr>

                      <tr>
                        <th colSpan={2}>Prognosis</th>
                        <td colSpan={10}> {ckdassessment?.prognosis} </td>
                      </tr>

                      <tr>
                        <th colSpan={7} className="text-center table-primary">
                          Goals
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          Start Date
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          End Date
                        </th>
                        <th colSpan={1} className="text-center table-primary">
                          Status
                        </th>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To acquire knowledge about CKD and how it can affect
                          you
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.ak_ckd_start_date}{" "}
                        </td>
                        <td colSpan={2}> {ckdassessment?.ak_ckd_end_date} </td>
                        <td colSpan={1}> {ckdassessment?.ak_ckd_status} </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the relationship between chronic kidney
                          disease and cardiovascular risks
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.ur_kidney_disease_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.ur_kidney_disease_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.ur_kidney_disease_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the impact of high blood pressure on
                          progression of CKD
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.uih_bp_start_date}{" "}
                        </td>
                        <td colSpan={2}> {ckdassessment?.uih_bp_end_date} </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.ur_kidney_disease_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To recognize the importance of adopting lifestyle
                          modifications to mitigate risk of complications
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.ria_mitigate_risk_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.ria_mitigate_risk_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.ria_mitigate_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of smoking cessation
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.ui_smoking_cessation_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.ui_smoking_cessation_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.ui_smoking_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of daily blood pressure
                          monitoring and maintaining a normal blood pressure.
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.uidbp_normalbp_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.uidbp_normalbp_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.uidbp_normalbp_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To recognize the importance of discipline in taking
                          all medications as prescribed
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.rid_medication_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.rid_medication_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.rid_medication_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To adopt dietary modifications suggested by the
                          PCP/nephrologist
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.adm_dietary_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.adm_dietary_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.adm_dietary_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To maintain blood sugars in a healthy range, if you
                          have diabetes
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.mbshr_diabetes_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.mbshr_diabetes_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.mbshr_diabetes_end_date}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>To maintain a healthy Weight</td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.tmh_weight_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.tmh_weight_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.tmh_weight_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To help the patient design a personalized strategy to
                          manage and influence their own condition
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.thp_strategy_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.thp_strategy_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.thp_strategy_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To help the patient people cope with and adjust to CKD
                          and find sources of psychological support
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.thp_adjust_ckd_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {ckdassessment?.thp_adjust_ckd_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {ckdassessment?.thp_adjust_status}{" "}
                        </td>
                      </tr>
                    </>
                  )}
                  {/* {{-- CKD ENDS --}} */}

                  {/* {{--Hypertension Starts--}} */}

                  {chronicDiseases?.Hypertensions && (
                    <>
                      <th colSpan={12} className="text-center table-primary">
                        Hypertension
                      </th>

                      <tr>
                        <th scope="row">BP Assesment</th>

                        <td colSpan={2}>
                          <br />
                        </td>
                      </tr>

                      <tr>
                        <th colSpan={2}>Prognosis</th>
                        <td colSpan={10}></td>
                      </tr>

                      <tr>
                        <th colSpan={7} className="text-center table-primary">
                          Goals
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          Start Date
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          End Date
                        </th>
                        <th colSpan={1} className="text-center table-primary">
                          Status
                        </th>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To acquire knowledge about hypertension and how it can
                          affect you
                        </td>
                        <td colSpan={2}> {hypertension?.effect_start_date} </td>
                        <td colSpan={2}> {hypertension?.effect_end_date} </td>
                        <td colSpan={1}> {hypertension?.effect_status} </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of daily blood pressure
                          monitoring, logging and maintaining a normal blood
                          pressure.
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.imp_bp_monitoring_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.imp_bp_monitoring_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypertension?.imp_bp_monitoring_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the relationship between high blood
                          pressure and cardiovascular and kidney disease risks
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.relation_start_date}{" "}
                        </td>
                        <td colSpan={2}> {hypertension?.relation_end_date} </td>
                        <td colSpan={1}> {hypertension?.relation_status} </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To recognize the importance of discipline in taking
                          all medications as prescribed
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.imp_of_medication_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.imp_of_medication_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypertension?.imp_of_medication_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To recognize the importance of adopting lifestyle
                          modifications to mitigate risk of complications
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.adopt_lifestyle_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.adopt_lifestyle_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypertension?.adopt_lifestyle_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of quitting Smoking
                          and/or reducing alcohol consumption to reduce the risk
                          of complications
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.quit_smoking_alcohol_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.quit_smoking_alcohol_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypertension?.quit_smoking_alcohol_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To adopt dietary modifications suggested by the
                          PCP/cardiologist and maintain a healthy diet for
                          managing high blood pressure
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.adopt_dietary_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.adopt_dietary_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypertension?.adopt_dietary_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>To maintain a healthy Weight</td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.maintain_weight_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.maintain_weight_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypertension?.maintain_weight_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To engage in 150 minutes of moderate intensity
                          physical activity per week
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.moderate_exercise_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.moderate_exercise_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypertension?.moderate_exercise_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of regular follow-up with
                          PCP and cardiologist
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.regular_pcp_folloup_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {hypertension?.regular_pcp_folloup_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {hypertension?.regular_pcp_folloup_status}{" "}
                        </td>
                      </tr>
                    </>
                  )}
                  {/* {{--Hypertension Ends--}} */}

                  {/* {{--OBESITY START--}} */}

                  {chronicDiseases?.Obesity && (
                    <>
                      <th colSpan={12} className="text-center table-primary">
                        OBESITY
                      </th>

                      <tr>
                        <th colSpan={2}>Prognosis</th>
                        <td colSpan={1}> {obesity?.prognosis} </td>
                      </tr>

                      <tr>
                        <th colSpan={7} className="text-center table-primary">
                          Goals
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          Start Date
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          End Date
                        </th>
                        <th colSpan={1} className="text-center table-primary">
                          Status
                        </th>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To gain education and awareness about BMI and current
                          BMI range.
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.awareness_about_bmi_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.awareness_about_bmi_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {obesity?.awareness_about_bmi_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the need for weight loss.
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.need_of_weight_loss_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.need_of_weight_loss_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {obesity?.need_of_weight_loss_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of maintaining a healthy
                          weight.
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.imp_of_healthy_weight_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.imp_of_healthy_weight_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {obesity?.imp_of_healthy_weight_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of healthy eating habits.
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.imp_of_healthy_eating_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.imp_of_healthy_eating_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {obesity?.imp_of_healthy_eating_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To receive education regarding required changes in
                          diet that would assist with weight loss.
                        </td>
                        <td colSpan={2}> {obesity?.diet_assist_start_date} </td>
                        <td colSpan={2}> {obesity?.diet_assist_end_date} </td>
                        <td colSpan={1}> {obesity?.diet_assist_status} </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To engage in 150 minutes of moderate intensity
                          physical activity per week.
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.moderate_activity_inaweek_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.moderate_activity_inaweek_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {obesity?.moderate_activity_inaweek_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>To be referred to a dietician.</td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.referred_dietician_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {obesity?.referred_dietician_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {obesity?.referred_dietician_status}{" "}
                        </td>
                      </tr>
                    </>
                  )}
                  {/* {{--OBESITY END--}}

                  {{--CHF START --}} */}
                  {chronicDiseases?.CongestiveHeartFailure && (
                    <>
                      <th colSpan={12} className="text-center table-primary">
                        CHF
                      </th>

                      <tr>
                        <td colSpan={12}>{chfassessment?.careplan}</td>
                      </tr>

                      <tr>
                        <th colSpan={2}>Prognosis</th>
                        <td colSpan={1}> {chfassessment?.prognosis} </td>
                      </tr>

                      <tr>
                        <th colSpan={7} className="text-center table-primary">
                          Goals
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          Start Date
                        </th>
                        <th colSpan={2} className="text-center table-primary">
                          End Date
                        </th>
                        <th colSpan={1} className="text-center table-primary">
                          Status
                        </th>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To gain education about CHF and self-management of the
                          condition
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.ge_chf_start_date}{" "}
                        </td>
                        <td colSpan={2}> {chfassessment?.ge_chf_end_date} </td>
                        <td colSpan={1}> {chfassessment?.ge_chf_status} </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of smoking cessation and
                          restricting alcohol intake
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.ui_smoke_cessation_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.ui_smoke_cessation_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {chfassessment?.ui_smoke_cessation_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of a low sodium diet
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.ui_sodium_diet_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.ui_sodium_diet_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {chfassessment?.ui_sodium_diet_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand the importance of fluid restriction for
                          self-management of CHF
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.ui_fluid_restriction_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.ui_fluid_restriction_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {chfassessment?.ui_fluid_restriction_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To understand importance of daily weight monitoring
                          and recording in a daily log
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.uid_weight_monitoring_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.uid_weight_monitoring_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {chfassessment?.uid_weight_monitoring_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To recognize the signs of exacerbation which must be
                          reported to the doctor/nurse
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.rs_excerbation_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.rs_excerbation_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {chfassessment?.rs_excerbation_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To recognize the importance of adherence to treatment
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.ri_adherence_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.ri_adherence_end_date}{" "}
                        </td>
                        <td colSpan={1}>
                          {" "}
                          {chfassessment?.ri_adherence_status}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={7}>
                          To seek help with activities of daily living
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.seek_help_start_date}{" "}
                        </td>
                        <td colSpan={2}>
                          {" "}
                          {chfassessment?.seek_help_end_date}{" "}
                        </td>
                        <td colSpan={1}> {chfassessment?.seek_help_status} </td>
                      </tr>
                    </>
                  )}
                  {/* {{--CHF END --}} */}
                </tbody>
              </table>

              <div className="card-body">
                <strong>
                  <p className="d-inline"> Electronically signed by </p>
                </strong>
              </div>
              <div className="card-body">
                <form className="make_ajax">
                  <div
                    className="flex-row-reverse"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button className="btn btn-success btn-md" type="submit">
                      Sign
                    </button>
                  </div>
                  <input type="hidden" name="questionaire_id" />
                  <input type="hidden" name="questionaire_serialno" />
                  <input type="hidden" name="doctor_id" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};
export default CCMMonthlyCarePlan;
