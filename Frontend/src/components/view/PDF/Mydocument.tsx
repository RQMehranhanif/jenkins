import { RootState } from "@/store/store";
import React, { useState, useEffect } from "react";
import { getAwvCarePlan } from "../../../actions/AwvCarePlan/AwvCarePlanActions";
import { useAppSelector } from "../../../hooks/hooks";

import page from "../../../assets/img/One.png";
import page2 from "../../../assets/img/Two.png";
import page3 from "../../../assets/img/Three.png";
import page4 from "../../../assets/img/Forth.png";
import page5 from "../../../assets/img/Fifth.png";
import page6 from "../../../assets/img/Sixth.png";
import page7 from "../../../assets/img/Seventh.png";
import html2canvas from "html2canvas";

import { Button, Spin } from "antd";
import jsPdf from "jspdf";
import { useAppDispatch } from "./../../../hooks/hooks";
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
import { setLoader } from "../../../store/reducer/QuestionairesReducer";
import moment from "moment";
const Mydocument = () => {
  const [title, setTitle] = useState<string>("");
  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  const [data, setData] = useState<any>({} as any);
  const [program, setProgram] = useState<ProgramType>({} as ProgramType);
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

  const [loader, setLoaders] = useState(false);

  const { questionId, loading, programmId } = useAppSelector(
    (state: RootState) => state.questionairesReduer
  );
  useEffect(() => {
    fetchawvcareplan();
  }, [questionId, programmId]);
  const dispatch = useAppDispatch();

  function fetchawvcareplan() {
    dispatch(setLoader(true));
    getAwvCarePlan(questionId).then(({ data: response }) => {
      dispatch(setLoader(false));
      setData(response.data.row.clinic);
      setPatient(response.data.row.patient);
      setProgram(response.data.row.program);
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

  const handlesave = () => {
    const domElement = document.getElementById("getall");
    setLoaders(true);
    const pdf = new jsPdf();

    /*  pdf.html(domElement as HTMLElement, {
			 html2canvas: { scale: 0.144 },
			 callback: function (pdf) {
			 pdf.insertPage(1);
		 
			 pdf.setFontSize(15);
			 pdf.setFont("arial", undefined);
			 pdf.text(
				 `${patient?.name} AWV 2022 ${data?.name ? data?.name : ""}`,
				 50,
				 60,
				 { align: "left" }
			 );
			 pdf.setFontSize(14);
			 pdf.text(
				 `This is your Preventive Care Plan
		Attached Please see the following documents:
		1. CDC recommendations for physical activity
		2. CDC guidelines for alcohol use
		3. CDC Information on Tobacco
		4. USDA dietary guidelines
		 
		Wellness Visit Date: ${patientRowDetails?.date_of_service}`,
				 50,
				 67,
				 { align: "left" }
			 );
			  
		 
			 pdf.addPage();
			 pdf.addImage(page, "PNG", 0, 0, 210, 297);
			 pdf.addPage();
			 pdf.addImage(page2, "PNG", 0, 0, 210, 297);
			 pdf.addPage();
			 pdf.addImage(page3, "PNG", 0, 0, 210, 297);
			 pdf.addPage();
			 pdf.addImage(page4, "PNG", 0, 0, 210, 297);
			 pdf.addPage();
			 pdf.addImage(page5, "PNG", 0, 0, 210, 297);
			 pdf.addPage();
			 pdf.addImage(page6, "PNG", 0, 0, 210, 297);
			 pdf.addPage();
			 pdf.addImage(page7, "PNG", 0, 0, 210, 297);
			 pdf.save();
			 setLoaders(false);
			 },
		 }); */

    setTimeout(() => {
      html2canvas(domElement as HTMLElement, {
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 3.0);

        pdf.setFontSize(15);
        pdf.setFont("arial", undefined);
        pdf.text(
          `${patient?.name} AWV 2022 ${data?.name ? data?.name : ""}`,
          50,
          60,
          { align: "left" }
        );
        pdf.setFontSize(14);
        pdf.text(
          `This is your Preventive Care Plan
  Attached Please see the following documents:
  1. CDC recommendations for physical activity
  2. CDC guidelines for alcohol use
  3. CDC Information on Tobacco
  4. USDA dietary guidelines
  
  Wellness Visit Date:${patientRowDetails?.date_of_service}`,
          50,
          67,
          { align: "left" }
        );
        pdf.addPage([210, 250], "p");

        pdf.addImage(imgData, "PNG", 0, 2, 210, 250);
        pdf.addPage([210, 297], "p");
        pdf.addImage(page, "PNG", 0, 0, 210, 297);
        pdf.addPage([210, 297], "p");
        pdf.addImage(page2, "PNG", 0, 0, 210, 297);
        pdf.addPage([210, 297], "p");
        pdf.addImage(page3, "PNG", 0, 0, 210, 297);
        pdf.addPage([210, 297], "p");
        pdf.addImage(page4, "PNG", 0, 0, 210, 297);
        pdf.addPage([210, 297], "p");
        pdf.addImage(page5, "PNG", 0, 0, 210, 297);
        pdf.addPage([210, 297], "p");
        pdf.addImage(page6, "PNG", 0, 0, 210, 297);
        pdf.addPage([210, 297], "p");
        pdf.addImage(page7, "PNG", 0, 0, 210, 297);
        pdf.save(`AWVCarePlan.pdf`);

        setLoaders(false);
      });
    }, 2000);
  };

  const nextYearDue = moment(patientHeightWeightNextDue?.next_year_due).format(
    "MM/YYYY"
  );
  return (
    <>
      <Button
        type="primary"
        className="mb-2"
        loading={loader}
        onClick={() => handlesave()}
      >
        Download
      </Button>
      <div id="getall">
        <div className="container-fluid" style={{ width: "97%" }}>
          <div className="card">
            <div className="card-body">
              <h3 className="main-heading ">
                {program.short_name} {title}
              </h3>
              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Patient Name: {patient?.name}
                  </h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Date of Birth: {patient?.dob}
                  </h6>
                </div>

                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Gender: {patient?.gender}
                  </h6>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Height: {patientHeightWeightNextDue?.height} in
                  </h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Weight: {patientHeightWeightNextDue?.weight} lbs
                  </h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Program: {program?.name} ({program?.short_name})
                  </h6>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Primary care Physician:
                    {patientRowDetails?.primary_care_physician}
                  </h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Next Due:{" "}
                    {moment(patientHeightWeightNextDue?.next_year_due).format(
                      "MM/DD/YYYY"
                    )}
                  </h6>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Age: {patient?.age}
                  </h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4 font-weight-bold">
                    Date of Service:{" "}
                    {moment(patientRowDetails?.date_of_service).format(
                      "MM/DD/YYYY"
                    )}
                  </h6>
                </div>
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
                  <th scope="row">Physical Health - Fall Screening</th>
                  <td colSpan={2}>{fallscreening?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Mental health
                  </th>
                </tr>
                <tr>
                  <th scope="row">Depression PHQ-9</th>
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
                    General Health
                  </th>
                </tr>
                <tr>
                  <th scope="row">High Stress</th>
                  <td colSpan={2}>{highStress?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th scope="row">General Health</th>
                  <td colSpan={2}>
                    Health level: {generalHealth?.health_level} <br />
                    Mouth and teeth: {generalHealth?.mouth_and_teeth} <br />
                    Feeling caused distress:
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
                  <th scope="row">Social/Emotional Support</th>
                  <td colSpan={2}>{socialEmotionalSupport?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th scope="row">Pain</th>
                  <td colSpan={2}>{pain?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary ">
                    Cognitive Assessment
                  </th>
                </tr>
                <tr>
                  <th scope="row">Cognitive Assessment</th>
                  <td colSpan={2}>{cognitiveAssessment?.outcome}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary ">
                    Habits
                  </th>
                </tr>
                <tr>
                  <th scope="row">Physical Activity</th>
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
                  <th scope="row">Alcohol Use</th>
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
                  <th scope="row">Tobacco Use</th>
                  <td>
                    {tobaccoUse?.quit_tobacoo} <br />
                  </td>
                  <td colSpan={2}>
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
                  <th scope="row">Nutrition</th>
                  <td colSpan={2}>
                    CDC guidelines given and patient advised: <br />• Vegetables
                    2 cups every week. <br />• Fruit 1 ½ cup Equivalent per day.
                    <br />• Grain – 6 ounces eq each day. <br />
                  </td>
                  <td colSpan={2}> </td>
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th scope="row">Seat Belt Use</th>
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
                    Immunization
                  </th>
                </tr>
                <tr>
                  <th scope="row">Immunization</th>
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
                    Screening
                  </th>
                </tr>
                <tr>
                  <th scope="row">Mammogaram</th>
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
                  <th scope="row">Colon Cancer</th>
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
                    <strong>{screening?.test_type}:</strong>
                    {screening?.next_col_fit_guard}
                  </td>
                </tr>
                <tr>
                  <th colSpan={12} className="text-center table-primary ">
                    Metabolic Screening
                  </th>
                </tr>
                {diabetes?.is_diabetic === "Yes" ? (
                  <>
                    <tr>
                      <th scope="row">Diabetes</th>
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
                      <th scope="row">DM - Eye Examination</th>
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
                      <th scope="row">DM - Nepropathy</th>
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
                      <th scope="row">Fasting Blood Sugar</th>
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
                        <th scope="row">Eye Examination</th>
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
                        <th scope="row">Nepropathy</th>
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
                  <th scope="row">Cholesterol</th>
                  <td colSpan={2}>
                    {" "}
                    {cholestrol?.ldl_result} {cholestrol?.outcome}
                  </td>
                  <td colSpan={2} />
                  <td colSpan={2}> {cholestrol?.ldl_next_due}</td>
                </tr>
                <tr>
                  <th scope="row">BP Assessment</th>
                  <td colSpan={2}>
                    {bpAssessment?.bp_result} {bpAssessment?.outcome}
                  </td>
                  <td colSpan={2} />
                  <td colSpan={2}>{nextYearDue}</td>
                </tr>
                <tr>
                  <th scope="row">Weight Assessment</th>
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
      </div>
    </>
  );
};
export default Mydocument;
