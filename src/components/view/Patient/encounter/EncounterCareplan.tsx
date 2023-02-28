/* eslint-disable @typescript-eslint/no-unused-vars */
import { RootState } from "@/store/store";
import React, { useState, useEffect } from "react";

import { useAppSelector } from "../../../../hooks/hooks";

import { Spin } from "antd";
import { useAppDispatch } from "./../../../../hooks/hooks";
import {
  PatientType,
  ProgramType,
  PatientRowDetailsType,
  FallScreeningType,
  DepressionOutComesType,
  HighStressType,
  GeneralHealthType,
  SocialEmotionalSupportType,
  PainType,
  CognitiveAssessmentType,
  PhysicalActivityType,
  AlcohalUseType,
  TobaccoUseType,
  SeatBeltUseType,
  ImmunizationType,
  ScreeningType,
  DiabetesType,
  CholestrolType,
  BpAssessmentType,
  WeightAssessmentType,
  PatientHeightWeightNextDueType,
} from "@/Types/CarePlan";
import { setLoader } from "../../../../store/reducer/QuestionairesReducer";

import { useNavigate } from "react-router-dom";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { getAwvCarePlan } from "../../../../actions/AwvCarePlan/AwvCarePlanActions";

const EncounterCareplan = ({ questionId }: { questionId: any }) => {
  const [title, setTitle] = useState<string>("");
  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  const [program, setProgram] = useState<ProgramType>({} as ProgramType);
  const [questio, setQuestio] = useState<any>();
  const [signer, setsigner] = useState<any>();
  const [docid, setDocid] = useState<any>();
  const [signed_date, setSigned_date] = useState<any>();
  const [showbutton, setShowbutton] = useState<any>(false);
  const [showtext, setshowtext] = useState<any>(false);
  const [patientHeightWeightNextDue, setPatientHeightWeightNextDue] =
    useState<PatientHeightWeightNextDueType>(
      {} as PatientHeightWeightNextDueType
    );
  const [patientRowDetails, setPatientRowDetails] =
    useState<PatientRowDetailsType>({} as PatientRowDetailsType);
  const [fallscreening, setFallScreening] = useState<FallScreeningType>(
    {} as FallScreeningType
  );
  const [depressionoutcomes, setDepressionOutComes] =
    useState<DepressionOutComesType>({} as DepressionOutComesType);
  const [highStress, setHighStress] = useState<HighStressType>(
    {} as HighStressType
  );
  const [generalHealth, setGeneralHealth] = useState<GeneralHealthType>(
    {} as GeneralHealthType
  );
  const [socialEmotionalSupport, setSocialEmotionalSupport] =
    useState<SocialEmotionalSupportType>({} as SocialEmotionalSupportType);
  const [pain, setPain] = useState<PainType>({} as PainType);
  const [cognitiveAssessment, setCognitiveAssessment] =
    useState<CognitiveAssessmentType>({} as CognitiveAssessmentType);
  const [physicalActivity, setPhysicalActivity] =
    useState<PhysicalActivityType>({} as PhysicalActivityType);
  const [alcohalUse, setAlcohalUse] = useState<AlcohalUseType>(
    {} as AlcohalUseType
  );
  const [tobaccoUse, setTobaccoUse] = useState<TobaccoUseType>(
    {} as TobaccoUseType
  );
  const [seatBeltUse, setSeatBeltUse] = useState<SeatBeltUseType>(
    {} as SeatBeltUseType
  );
  const [immunization, setImmunization] = useState<ImmunizationType>(
    {} as ImmunizationType
  );
  const [screening, setScreening] = useState<ScreeningType>(
    {} as ScreeningType
  );
  const [diabetes, setDiabetes] = useState<DiabetesType>({} as DiabetesType);
  const [cholestrol, setCholestrol] = useState<CholestrolType>(
    {} as CholestrolType
  );
  const [bpAssessment, setBpAssessment] = useState<BpAssessmentType>(
    {} as BpAssessmentType
  );
  const [weightAssessment, setWeightAssessment] =
    useState<WeightAssessmentType>({} as WeightAssessmentType);
  const { loading } = useAppSelector(
    (state: RootState) => state.questionairesReduer
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  useEffect(() => {
    if (signed_date && docid) {
      setshowtext(true);
      setShowbutton(false);
    } else {
      if (signer && signed_date === null) {
        setShowbutton(true);
        setshowtext(false);
      }
    }
    fetchEncounterCareplan();
  }, [showbutton, showtext, signer, signed_date]);
  const dispatch = useAppDispatch();

  function fetchEncounterCareplan() {
    dispatch(setLoader(true));
    getAwvCarePlan(questionId).then(({ data: response }) => {
      dispatch(setLoader(false));
      setPatient(response.data.row.patient);
      setProgram(response.data.row.program);
      setQuestio(response.data.row);
      setsigner(response.data.row.signer_doctor);
      setSigned_date(response.data.row.signed_date);
      setDocid(response.data.row.doctor_id);
      setPatientHeightWeightNextDue(response.data);
      setTitle("Care Plan");
      setPatientRowDetails(response.data.row);
      setFallScreening(response.data.fall_screening);
      setDepressionOutComes(response.data.depression_out_comes);
      setHighStress(response.data.high_stress);
      setGeneralHealth(response.data.general_health);
      setSocialEmotionalSupport(response.data.social_emotional_support);
      setPain(response.data.pain);
      setCognitiveAssessment(response.data.cognitive_assessment);
      setPhysicalActivity(response.data.physical_out_comes);
      setAlcohalUse(response.data.alcohol_out_comes);
      setTobaccoUse(response.data.tobacco_out_comes);
      setSeatBeltUse(response.data.seatbelt_use);
      setImmunization(response.data.immunization);
      setScreening(response.data.screening);
      setDiabetes(response.data.diabetes);
      setCholestrol(response.data.cholesterol_assessment);
      setBpAssessment(response.data.bp_assessment);
      setWeightAssessment(response.data.weight_assessment);
    });
  }
  const navigate = useNavigate();
  /*   const handleBack = (questionId: any, programid: any) => {
    dispatch(setProgramId(programid));
    dispatch(setQuestionId(questionId));
    navigate(`/questionaire/edit/${questionId}`, {
      state: {
        id: questio.id,
        age: patient.age,
        name: patient.name,
        dob: patient.dob,
        gender: patient.gender,
      },
    });
  }; */

  const nextYearDue = moment(patientHeightWeightNextDue?.next_year_due).format(
    "MM/YYYY"
  );

  /*  const handleSignBack = (id: string) => {
    setLoading(true);
    const doctor_id = { doctor_id: signer };
    getSigned(id, doctor_id).then((response: any) => {
      if (response.data.success === true) {
        setLoading(false);
        fetchEncounterCareplan();
        OpenNotification("success", response.data.message);
      } else {
        OpenNotification("error", response.data.message);
      }
    });
  }; */

  return (
    <Spin spinning={loading} indicator={antIcon}>
      <>
        <div className="card main-card">
          <div className="card-body">
            <h3 className="main-heading ">
              {program.short_name} {title}
            </h3>
            <div className="row">
              <div className="col-lg-3 md-3 sm-3">
                {" "}
                <h6 className="d-inline ms-4">Patient Name: {patient?.name}</h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Date of Birth: {patient?.dob}</h6>
              </div>

              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Gender: {patient?.gender}</h6>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 md-3 sm-3">
                {" "}
                <h6 className="d-inline ms-4">
                  Height: {patientHeightWeightNextDue?.height} ft
                </h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">
                  Weight: {patientHeightWeightNextDue?.weight} lbs
                </h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">
                  Program: {program?.name} ({program?.short_name})
                </h6>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">
                  Primary care Physician:{" "}
                  {patientRowDetails?.primary_care_physician}
                </h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">
                  Next Due:{" "}
                  {moment(patientHeightWeightNextDue?.next_year_due).format(
                    "MM/DD/YYYY"
                  )}
                </h6>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Age: {patient?.age}</h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                {" "}
                <h6 className="d-inline ms-4">
                  Date of Service:{" "}
                  {moment(patientRowDetails?.date_of_service).format(
                    "MM/DD/YYYY"
                  )}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid table-data">
          <div className="card-body">
            <table className="table table-hover table-light">
              <tbody>
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    <div className="row">
                      <div className="col-10">
                        <span
                          style={{ marginLeft: "21%" }}
                          className="table-primary"
                        >
                          Physical Activity
                        </span>
                      </div>
                      <div className="col-2">Next due</div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 1)}
                     */
                  >
                    Physical Health - Fall Screening
                  </th>
                  <td colSpan={2}>{fallscreening?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    {" "}
                    Mental health{" "}
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 2)}
                     */
                  >
                    Depression PHQ-9
                  </th>
                  <td colSpan={2}>
                    {depressionoutcomes?.severity} <br />
                    {depressionoutcomes?.referrals} <br />
                    {depressionoutcomes?.referrals1} <br />
                  </td>
                  <td colSpan={2}>
                    {depressionoutcomes?.flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary ">
                    {" "}
                    General Health{" "}
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 3)}
                     */
                  >
                    High Stress
                  </th>
                  <td colSpan={2}>{highStress?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 3)}
                     */
                  >
                    General Health
                  </th>
                  <td colSpan={2}>
                    Health level: {generalHealth?.health_level} <br />
                    Mouth and teeth: {generalHealth?.mouth_and_teeth} <br />
                    Feeling caused distress:{" "}
                    {generalHealth?.feelings_cause_distress} <br />
                  </td>
                  <td colSpan={2}>
                    {generalHealth?.flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 3)}
                     */
                  >
                    Social/Emotional Support
                  </th>
                  <td colSpan={2}>{socialEmotionalSupport?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 3)}
                     */
                  >
                    Pain
                  </th>
                  <td colSpan={2}>{pain?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary ">
                    {" "}
                    Cognitive Assessment{" "}
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 4)}
                     */
                  >
                    Cognitive Assessment
                  </th>
                  <td colSpan={2}>{cognitiveAssessment?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary ">
                    {" "}
                    Habits{" "}
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 5)}
                     */
                  >
                    Physical Activity
                  </th>
                  <td>{physicalActivity?.outcome}</td>
                  <td colSpan={2}>
                    {physicalActivity?.flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 6)}
                     */
                  >
                    Alcohol Use
                  </th>
                  <td>{alcohalUse?.outcome}</td>

                  <td colSpan={2}>
                    {alcohalUse?.flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 7)}
                     */
                  >
                    Tobacco Use
                  </th>
                  <td>
                    {tobaccoUse?.quit_tobacoo} <br />
                  </td>
                  <td
                    colSpan={2}
                    /* onClick={() => handlestep(questionId, programmId, 8)}
                     */
                  >
                    {tobaccoUse?.flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 9)}
                     */
                  >
                    Nutrition
                  </th>
                  <td colSpan={2}>
                    CDC guidelines given and patient advised: <br />• Vegetables
                    2 cups every week. <br />• Fruit 1 ½ cup Equivalent per day.{" "}
                    <br />• Grain – 6 ounces eq each day. <br />
                  </td>
                  <td colSpan={2}> </td>
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 10)} */
                  >
                    Seat Belt Use
                  </th>
                  <td colSpan={2}>{seatBeltUse?.outcome}</td>
                  <td colSpan={2}>
                    {seatBeltUse?.flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary ">
                    {" "}
                    Immunization{" "}
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 11)} */
                  >
                    Immunization
                  </th>
                  <td colSpan={2}>
                    {immunization?.flu_vaccine}
                    <br />
                    {immunization?.flu_vaccine_script}
                    <br />
                    {immunization?.pneumococcal_vaccine}
                    <br />
                    {immunization?.pneumococcal_vaccine_script}
                  </td>
                  <td colSpan={2}>
                    {immunization?.flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td className="col-sm-2">Next season</td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary ">
                    {" "}
                    Screening{" "}
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 12)} */
                  >
                    Mammogaram
                  </th>
                  <td colSpan={2}>
                    {screening?.mammogram}
                    <br />
                    {screening?.next_mammogram}
                    <br />

                    {screening?.mammogram_script}
                  </td>
                  <td colSpan={2}>
                    {screening?.mammogaram_flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td colSpan={2}> {screening?.next_mammogram_date}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 12)} */
                  >
                    Colon Cancer
                  </th>
                  <td colSpan={2}>
                    {screening?.colonoscopy}
                    <br />
                    {screening?.next_colonoscopy}
                    <br />
                    {screening?.colonoscopy_script}
                    <br />
                  </td>
                  <td colSpan={2}>
                    {screening?.colo_flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td colSpan={2}>
                    <strong>{screening?.test_type}:</strong>{" "}
                    {screening?.next_col_fit_guard}
                  </td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary ">
                    {" "}
                    Metabolic Screening{" "}
                  </th>
                </tr>
                {diabetes?.is_diabetic === "Yes" ? (
                  <>
                    <tr>
                      <th
                        scope="row"
                        /* onClick={() => handlestep(questionId, programmId, 13)} */
                      >
                        Diabetes
                      </th>
                      <td colSpan={2}>
                        {diabetes?.diabetes} <br />
                      </td>
                      <td colSpan={2}>
                        {diabetes?.flag && (
                          <i
                            className="fa fa-flag text-danger"
                            aria-hidden="true"
                          />
                        )}
                      </td>
                      <td colSpan={2}>
                        <strong>HBA1C:</strong> {diabetes?.next_hba1c_date}{" "}
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        /* onClick={() => handlestep(questionId, programmId, 13)} */
                      >
                        DM - Eye Examination
                      </th>
                      <td colSpan={2}>
                        {diabetes?.diabetec_eye_exam} <br />
                      </td>
                      <td colSpan={2}>
                        {diabetes?.eye_exam_flag && (
                          <i
                            className="fa fa-flag text-danger"
                            aria-hidden="true"
                          />
                        )}
                      </td>
                      <td colSpan={2}>
                        {nextYearDue} <br />
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        /* onClick={() => handlestep(questionId, programmId, 13)} */
                      >
                        DM - Nepropathy
                      </th>
                      <td colSpan={2}>
                        {diabetes?.nepropathy} <br />
                      </td>
                      <td colSpan={2}>
                        {diabetes?.nephropathy_flag && (
                          <i
                            className="fa fa-flag text-danger"
                            aria-hidden="true"
                          />
                        )}
                      </td>
                      <td colSpan={2}>
                        {nextYearDue} <br />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <th
                        scope="row"
                        /* onClick={() => handlestep(questionId, programmId, 13)} */
                      >
                        Fasting Blood Sugar
                      </th>
                      <td colSpan={2}>
                        {diabetes?.nepropathy} {diabetes?.diabetes} <br />
                      </td>
                      <td colSpan={2} />
                      <td colSpan={2}>
                        <strong>FBS:</strong> {diabetes?.next_fbs_date} <br />
                      </td>
                    </tr>
                    {diabetes?.diabetec_eye_exam !== "" && (
                      <tr>
                        <th
                          scope="row"
                          /* onClick={() => handlestep(questionId, programmId, 13)} */
                        >
                          Eye Examination
                        </th>
                        <td colSpan={2}>
                          {diabetes?.diabetec_eye_exam} <br />
                        </td>
                        <td colSpan={2}>
                          {diabetes?.eye_exam_flag && (
                            <i
                              className="fa fa-flag text-danger"
                              aria-hidden="true"
                            />
                          )}
                        </td>
                        <td colSpan={2}>
                          {nextYearDue} <br />
                        </td>
                      </tr>
                    )}
                    {diabetes?.diabetec_eye_exam !== "" && (
                      <tr>
                        <th
                          scope="row"
                          /* onClick={() => handlestep(questionId, programmId, 13)} */
                        >
                          Nepropathy
                        </th>
                        <td colSpan={2}>
                          {diabetes?.nepropathy} <br />
                        </td>
                        <td colSpan={2}>
                          {diabetes?.nephropathy_flag && (
                            <i
                              className="fa fa-flag text-danger"
                              aria-hidden="true"
                            />
                          )}
                        </td>
                        <td colSpan={2}>
                          {nextYearDue} <br />
                        </td>
                      </tr>
                    )}
                  </>
                )}

                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 14)} */
                  >
                    Cholesterol
                  </th>
                  <td colSpan={2}>
                    {" "}
                    {cholestrol?.ldl_result} {cholestrol?.outcome}
                  </td>
                  <td colSpan={2} />
                  <td colSpan={2}> {cholestrol?.ldl_next_due}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 15)} */
                  >
                    BP Assessment
                  </th>
                  <td colSpan={2}>
                    {bpAssessment?.bp_result} {bpAssessment?.outcome}{" "}
                  </td>
                  <td colSpan={2}>
                    {bpAssessment?.flag && (
                      <i
                        className="fa fa-flag text-danger"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    /* onClick={() => handlestep(questionId, programmId, 16)} */
                  >
                    Weight Assessment
                  </th>
                  <td colSpan={2}>
                    {weightAssessment?.bmi_result} {weightAssessment?.outcome}
                  </td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    </Spin>
  );
};
export default EncounterCareplan;
