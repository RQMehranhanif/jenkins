import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { PatientType } from "@/Types/PatientType";
import ProgramType from "@/Types/ProgramType";
import {
  setLoader,
  setProgramId,
  setQuestionId,
} from "../../store/reducer/QuestionairesReducer";
import { getCCMGeneralCarePlan } from "../../actions/AwvCarePlan/AwvCarePlanActions";
import { RootState } from "../../store/store";
import { Button, Spin, Tooltip } from "antd";
import {
  CaregiverAssesmentType,
  CognitiveAssessmentType,
  DepressionOutComesType,
  FallScreeningType,
  GeneralAssessmentType,
  ImmunizationType,
  OtherProviderType,
  PatientRowDetailsType,
  ScreeningType,
} from "@/Types/CarePlan";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const CCMGeneralCarePlan: React.FC = () => {
  const { questionId, loading, programmId } = useAppSelector(
    (state: RootState) => state.questionairesReduer
  );
  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  const [program, setProgram] = useState<ProgramType>({} as ProgramType);
  const [rowdata, setRowData] = useState<PatientRowDetailsType>(
    {} as PatientRowDetailsType
  );

  const [fallscreening, setFallScreening] = useState<FallScreeningType>(
    {} as FallScreeningType
  );
  const [depressionphq9, setDepressionOutComes] =
    useState<DepressionOutComesType>({} as DepressionOutComesType);
  const [cognitiveAssessment, setCognitiveAssessment] =
    useState<CognitiveAssessmentType>({} as CognitiveAssessmentType);
  const [caregiveAssessment, setCaregiveAssessment] =
    useState<CaregiverAssesmentType>({} as CaregiverAssesmentType);
  const [otherProvider, setOtherProvider] = useState<OtherProviderType>(
    {} as OtherProviderType
  );
  const [immunization, setImmunization] = useState<ImmunizationType>(
    {} as ImmunizationType
  );
  const [screening, setScreening] = useState<ScreeningType>(
    {} as ScreeningType
  );
  const [generalAssessment, setGeneralAssessment] =
    useState<GeneralAssessmentType>({} as GeneralAssessmentType);

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
      setFallScreening(response.fall_screening);
      setDepressionOutComes(response.depression_out_comes);
      setCognitiveAssessment(response.cognitive_assessment);
      setCaregiveAssessment(response.caregiver_assesment_outcomes);
      setOtherProvider(response.other_providers_outcome);
      setImmunization(response.immunization);
      setScreening(response.screening);
      setGeneralAssessment(response.general_assessment_outcomes);
    });
  }

  const navigate = useNavigate();
  const handleBack = (questionId: any, programid: any) => {
    dispatch(setProgramId(programid));
    dispatch(setQuestionId(questionId));
    navigate(`/questionaire/edit/${questionId}`, {
      state: { id: rowdata.id, age: patient.age },
    });
  };

  const handleclose = () => {
    navigate("/questionaires");
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  return (
    <>
      <Spin spinning={loading} indicator={antIcon}>
        <div className="card main-card">
          <div className="card-body">
            <h3 className="main-heading">CCM Care Plan</h3>
            <div className="row">
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Patient Name: {patient?.name}</h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Date of Birth: {patient?.dob}</h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Gender: {patient?.gender}</h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Age: {patient?.age}</h6>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Height: 7.3</h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Weight: 45</h6>
              </div> */}
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
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">
                  Date of Service: {rowdata?.date_of_service}
                </h6>
              </div>
              {/* <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Next Due: 2023-03-05</h6></div> */}
            </div>
            <div className="row">
              <div className="col-lg-12 md-3 sm-12  pull-right">
                <button
                  className="btn btn-info round-pill float-right ml-2"
                  style={{ lineHeight: "15px" }}
                >
                  Sign
                </button>
                <Tooltip placement="topLeft" title={"Finish"}>
                  <Button
                    className=" round-pill float-right ml-2"
                    style={{ lineHeight: "15px" }}
                    onClick={handleclose}
                    type="primary"
                  >
                    Close
                  </Button>
                </Tooltip>
                <button
                  className="btn btn-info float-right"
                  style={{ lineHeight: "15px" }}
                  onClick={() => {
                    handleBack(questionId, programmId);
                  }}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <table className="table table-hover table-light">
              <tbody>
                {/* <!--PHYSICAL HEALTH STARTS --> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Physical Activity
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Physical Health - Fall Screening
                  </th>
                  <td colSpan={12} width="80%">
                    {fallscreening?.outcome}
                  </td>
                </tr>
                {/* <!--PHYSICAL HEALTH ENDS --> */}
                {/* <!-- MENTAL HEALTH STARTS --> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Mental health
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Depression PHQ-9
                  </th>
                  <td colSpan={12} width="80%">
                    {depressionphq9?.severity} <br />
                    {depressionphq9?.referrals} <br />
                    {depressionphq9?.referrals1} <br />
                  </td>
                </tr>
                {/* <!-- MENTAL HEALTH ENDS --> */}
                {/* <!--Cognitive Assessment--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Cognitive Assessment
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Cognitive Assessment
                  </th>
                  <td colSpan={12} width="80%">
                    {cognitiveAssessment?.outcome}
                  </td>
                </tr>
                {/* <!--Cognitive Assessment ENDS--> */}
                {/* <!--Caregiver Assessment--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Caregiver Assessment
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Caregiver Assessment
                  </th>
                  <td colSpan={12} width="80%">
                    {caregiveAssessment?.every_day_activities} <br />
                    {caregiveAssessment?.medications}
                  </td>
                </tr>
                {/* <!--Caregiver Assessment ENDS--> */}
                {/* <!--Other Providers--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Other Providers
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Other Providers
                  </th>
                  <td colSpan={12} width="80%">
                    {otherProvider?.other_provider_beside_pcp}
                  </td>
                </tr>
                {/* <!--Other Providers ENDS--> */}
                {/* <!--Immunization--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Immunization
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Immunization
                  </th>
                  <td colSpan={12} width="80%">
                    {immunization?.flu_vaccine}
                    <br />
                    {immunization?.flu_vaccine_script}
                    <br />
                    {immunization?.pneumococcal_vaccine}
                    <br />
                    {immunization?.pneumococcal_vaccine_script}
                  </td>
                </tr>
                {/* <!--Immunization ENDS--> */}
                {/* <!--Screening--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Screening
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Mammogaram
                  </th>
                  <td colSpan={12} width="80%">
                    {screening?.mammogram}
                    <br />
                    {screening?.next_mammogram}
                    <br />
                    {screening?.mammogram_script}
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Colon Cancer
                  </th>
                  <td colSpan={12} width="80%">
                    {screening?.colonoscopy}
                    <br />
                    {screening?.next_colonoscopy}
                    <br />
                    {screening?.colonoscopy_script}
                    <br />
                  </td>
                </tr>
                {/* <!--Screening ENDS--> */}
                {/* <!--General Assessment--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    General Assessment
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Medication Reconciliation
                  </th>
                  <td colSpan={12} width="80%">
                    {generalAssessment?.is_taking_medication}
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Tobacco Usage
                  </th>
                  <td colSpan={12} width="80%">
                    {generalAssessment?.is_consuming_tobacco}
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="w-25">
                    Physical Excercises
                  </th>
                  <td colSpan={12}>
                    {generalAssessment?.physical_exercise_level}
                  </td>
                </tr>
                <tr>
                  <th colSpan={9} className="text-center table-primary">
                    General Assessment Goals
                  </th>
                  <th colSpan={1} className="text-center table-primary">
                    Start Date
                  </th>
                  <th colSpan={1} className="text-center table-primary">
                    End Date
                  </th>
                  <th colSpan={1} className="text-center table-primary">
                    Status
                  </th>
                </tr>
                <tr>
                  <td colSpan={9} width="70%">
                    Instructed on Importance of Hand Washing
                  </td>
                  <td colSpan={1} width="10%">
                    {generalAssessment?.imp_handwash_start_date}
                  </td>
                  <td colSpan={1} width="10%">
                    {generalAssessment?.imp_handwash_end_date}
                  </td>
                  <td colSpan={1} width="10%">
                    {generalAssessment?.imp_handwash_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9}>
                    Patient shows understanding of Importance of Hand Washing
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.und_handwash_start_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.und_handwash_end_date}
                  </td>
                  <td colSpan={1}>{generalAssessment?.und_handwash_status}</td>
                </tr>
                <tr>
                  <td colSpan={9}>
                    Instructed on how washing with Soap remove germs
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.washwithsoap_start_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.washwithsoap_end_date}
                  </td>
                  <td colSpan={1}>{generalAssessment?.washwithsoap_status}</td>
                </tr>
                <tr>
                  <td colSpan={9}>
                    Patient shows understanding on how washing with Soap remove
                    germs
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.und_washhands_start_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.und_washhands_end_date}
                  </td>
                  <td colSpan={1}>{generalAssessment?.und_washhands_status}</td>
                </tr>
                <tr>
                  <td colSpan={9}>
                    Instructed on proper way to turn off the faucet
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.turnoff_faucet_start_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.turnoff_faucet_end_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.turnoff_faucet_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9}>
                    Patient shows understanding on proper way to turn off the
                    faucet
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.understand_faucet_start_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.understand_faucet_end_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.understand_faucet_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9}>
                    Patient shows understanding of using plain Soap
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.plain_soap_usage_start_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.plain_soap_usage_end_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.plain_soap_usage_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9}>Is Bar Soap or Liquid Soap better?</td>
                  <td colSpan={1}>
                    {generalAssessment?.bar_or_liquid_start_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.bar_or_liquid_end_date}
                  </td>
                  <td colSpan={1}>{generalAssessment?.bar_or_liquid_status}</td>
                </tr>
                <tr>
                  <td colSpan={9}>
                    Patient shows understanding about importance of plain soap
                    in any form
                  </td>
                  <td colSpan={1}> {generalAssessment?.uips_start_date} </td>
                  <td colSpan={1}> {generalAssessment?.uips_end_date} </td>
                  <td colSpan={1}> {generalAssessment?.uips_status} </td>
                </tr>
                <tr>
                  <td colSpan={9}>What if there is no Soap?</td>
                  <td colSpan={1}>
                    {generalAssessment?.no_soap_condition_start_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.no_soap_condition_end_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.no_soap_condition_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9}>
                    Patient shows understanding about Hand Sanitizer
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.understand_hand_sanitizer_start_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.understand_hand_sanitizer_end_date}
                  </td>
                  <td colSpan={1}>
                    {generalAssessment?.understand_hand_sanitizer_status}
                  </td>
                </tr>
                {/* <!--General Assessment ENDS--> */}
              </tbody>
            </table>
          </div>
        </div>
      </Spin>
    </>
  );
};
export default CCMGeneralCarePlan;
