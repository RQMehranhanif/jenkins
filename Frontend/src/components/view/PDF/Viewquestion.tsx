/* eslint-disable @typescript-eslint/no-unused-vars */
import { RootState } from "@/store/store";
import React, { useState, useEffect } from "react";
import jsPdf from "jspdf";
import html2canvas from "html2canvas";

import { Button, Spin } from "antd";
import {
  PatientType,
  ProgramType,
  PatientRowDetailsType,
  PatientHeightWeightNextDueType,
} from "@/Types/CarePlan";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./../../../hooks/hooks";
import { setLoader } from "../../../store/reducer/QuestionairesReducer";
import { getQuestionnairList } from "../../../actions/AwvCarePlan/AwvCarePlanActions";
const Viewquestions: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [loader, setLoaders] = useState(false);

  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  const [servicedate, setServiceDate] = useState<any>();
  const [program, setProgram] = useState<ProgramType>({} as ProgramType);
  const [patientHeightWeightNextDue, setPatientHeightWeightNextDue] =
    useState<PatientHeightWeightNextDueType>(
      {} as PatientHeightWeightNextDueType
    );
  const [patientRowDetails, setPatientRowDetails] =
    useState<PatientRowDetailsType>({} as PatientRowDetailsType);
  const [fallscreening, setFallScreening] = useState<any>({} as any);
  const [depressionoutcomes, setDepressionOutComes] = useState<any>({} as any);
  const [highStress, setHighStress] = useState<any>({} as any);
  const [generalHealth, setGeneralHealth] = useState<any>({} as any);
  const [socialEmotionalSupport, setSocialEmotionalSupport] = useState<any>(
    {} as any
  );
  const [pain, setPain] = useState<any>({} as any);
  const [cognitiveAssessment, setCognitiveAssessment] = useState<any>(
    {} as any
  );
  const [physicalActivity, setPhysicalActivity] = useState<any>({} as any);
  const [alcohalUse, setAlcohalUse] = useState<any>({} as any);
  const [tobaccoUse, setTobaccoUse] = useState<any>({} as any);
  const [seatBeltUse, setSeatBeltUse] = useState<any>({} as any);
  const [immunization, setImmunization] = useState<any>({} as any);
  const [screening, setScreening] = useState<any>({} as any);
  const [diabetes, setDiabetes] = useState<any>({} as any);
  const [cholestrol, setCholestrol] = useState<any>({} as any);
  const [bpAssessment, setBpAssessment] = useState<any>({} as any);
  const [weightAssessment, setWeightAssessment] = useState<any>({} as any);
  const [nutrition, setNutrition] = useState<any>({} as any);
  const [miscellaneous, setMiscellaneous] = useState<any>({} as any);
  const { questionId, loading, programmId } = useAppSelector(
    (state: RootState) => state.questionairesReduer
  );
  useEffect(() => {
    fetchawvcareplan();
  }, []);
  const location = useLocation();
  const dispatch = useAppDispatch();

  function fetchawvcareplan() {
    dispatch(setLoader(true));
    getQuestionnairList(questionId).then(({ data: response }) => {
      dispatch(setLoader(false));
      setPatient(response.data.patient);
      setServiceDate(response.data.date_of_service);
      setProgram(response.data.program);
      setPatientHeightWeightNextDue(response.data);
      setTitle("Care Plan");
      setPatientRowDetails(response.data.row);
      setFallScreening(response.data.questionaire.fall_screening);
      setDepressionOutComes(response.data.questionaire.depression_phq9);
      setHighStress(response.data.questionaire.high_stress);
      setGeneralHealth(response.data.questionaire.general_health);
      setSocialEmotionalSupport(
        response.data.questionaire.social_emotional_support
      );
      setPain(response.data.questionaire.pain);
      setCognitiveAssessment(response.data.questionaire.cognitive_assessment);
      setPhysicalActivity(response.data.questionaire.physical_activities);
      setAlcohalUse(response.data.questionaire.alcohol_use);
      setTobaccoUse(response.data.questionaire.tobacco_use);
      setSeatBeltUse(response.data.questionaire.seatbelt_use);
      setImmunization(response.data.questionaire.immunization);
      setScreening(response.data.questionaire.screening);
      setDiabetes(response.data.questionaire.diabetes);
      setNutrition(response.data.questionaire.nutrition);
      setCholestrol(response.data.questionaire.cholesterol_assessment);
      setBpAssessment(response.data.questionaire.bp_assessment);
      setWeightAssessment(response.data.questionaire.weight_assessment);
      setWeightAssessment(response.data.questionaire.weight_assessment);
      setMiscellaneous(response.data.questionaire.miscellaneous);
    });
  }

  const handlesave = () => {
    const domElement = document.getElementById("getall");
    const allsize = document.getElementById("getall")?.getBoundingClientRect();
    const width = allsize?.width as number;
    const height = allsize?.height as number;
    console.log(allsize, width, height);

    setLoaders(true);
    const pdf = new jsPdf("p", "px", "a4");
    pdf.html(domElement as HTMLElement, {
      html2canvas: { scale: 0.3 },
      x: 3,
      y: 0,
      callback: function (pdf) {
        pdf.save("Questions");
        setLoaders(false);
      },
    });

    /*  setTimeout(() => {
             html2canvas(domElement as HTMLElement,).then((canvas) => {
                 const imgData = canvas.toDataURL("image/png")
                 pdf.addImage(imgData, "PNG", 0, 2, 210, 250);
 
                 pdf.save(`AWVCarePlan.pdf`);
 
                 setLoaders(false);
             });
         }, 2000); */
  };

  return (
    <Spin spinning={loading}>
      <Button
        type="primary"
        className="mb-2"
        loading={loader}
        onClick={() => handlesave()}
      >
        Download
      </Button>
      <div id="getall" style={{ height: "100%" }}>
        <div
          className="card main-card"
          style={{ minHeight: "auto", borderRadius: "0px" }}
        >
          <div className="card-body" style={{ borderRadius: "0px" }}>
            <h5 className="main-heading ">
              {program.short_name} {title}
            </h5>
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
                <h6 className="d-inline ms-4">
                  Next Due: {patientHeightWeightNextDue?.next_year_due}
                </h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">
                  Program: {program?.name} ({program?.short_name})
                </h6>
              </div>
              <div className="col-lg-3 md-3 sm-3">
                <h6 className="d-inline ms-4">Age: {patient?.age}</h6>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3 md-3 sm-3">
                {" "}
                <h6 className="d-inline ms-4">
                  Wellness Visit Date: {servicedate}
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body ">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Physical Health - Fall Screening
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>Have you fallen in the past 1 year? </td>
                        <td className="font-weight-bold text-center text-dark">
                          {fallscreening?.fall_in_one_year}
                        </td>
                      </tr>
                      <tr>
                        <td> Number of times you fell in last 1 year?</td>
                        <td className="font-weight-bold text-center text-dark">
                          {fallscreening?.number_of_falls}
                        </td>
                      </tr>
                      <tr>
                        <td> Was their any injury?</td>
                        <td className="font-weight-bold text-center text-dark">
                          {fallscreening?.injury}
                        </td>
                      </tr>
                      <tr>
                        <td> Physical Therapy?</td>
                        <td className="font-weight-bold text-center text-dark">
                          {fallscreening?.physical_therapy}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Do you feel unsteady or do thing move when standing or
                          Walking ?{" "}
                        </td>
                        <td className="font-weight-bold text-center text-dark">
                          {fallscreening?.unsteady_todo_things}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Do you feel like “blacking out” when getting up from
                          bed or chair?{" "}
                        </td>
                        <td className="font-weight-bold text-center text-dark">
                          {fallscreening?.blackingout_from_bed}
                        </td>
                      </tr>
                      <tr>
                        <td>Do you use any assistance device?</td>
                        <td className="font-weight-bold text-center text-dark">
                          {fallscreening?.assistance_device}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Depression PHQ-9
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>
                          How often have you felt down, depressed, or hopeless?
                        </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.feltdown_depressed_hopeless}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          How often have you felt little interest or pleasure in
                          doing things?{" "}
                        </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.little_interest_pleasure}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Trouble falling or staying asleep, or sleeping too
                          much?
                        </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.trouble_sleep}
                        </td>
                      </tr>
                      <tr>
                        <td>Feeling tired or having little energy? </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.tired_little_energy}
                        </td>
                      </tr>
                      <tr>
                        <td>Poor appetite or overeating ? </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.poor_over_appetite}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Feeling bad about yourself or that you are a failure
                          or have let yourself or your family down?{" "}
                        </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.feeling_bad_failure}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Trouble concentrating on things, such as reading the
                          newspaper or watching television?{" "}
                        </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.trouble_concentrating}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Moving or speaking so slowly that other people could
                          have noticed?
                          <br /> Or the opposite - being so fidgety or restless
                          that you have been moving around a lot more than
                          usual?{" "}
                        </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.slow_fidgety}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Thoughts that you would be better off dead, or of
                          hurting yourself in some way?{" "}
                        </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.suicidal_thoughts}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          If you checked off any problems, how difficult have
                          these problems made it for you to do your work, <br />{" "}
                          take care of things at home, or get along with other
                          people?{" "}
                        </td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.problem_difficulty}
                        </td>
                      </tr>
                      <tr>
                        <td>Comments</td>
                        <td className="text-nowrap pr-0 font-weight-bold text-center text-dark">
                          {depressionoutcomes?.comments}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/*  <div className="card mb-0" style={{ minHeight: "178px" }}>
              <div className="card-body">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      Social/Emotional Support
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>
                        How often is stress a problem for you in handling such
                        things as: <br />
                        Your health, Your finances, Your family or social
                        relationships, Your Work?{" "}
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {socialEmotionalSupport?.get_social_emotional_support}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
            </div>
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        High Stress
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>
                          How often is stress a problem for you in handling such
                          things as : <br />
                          Your health, Your finances, Your family or social
                          relationships, Your Work?{" "}
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {highStress?.stress_problem}
                        </td>
                      </tr>
                      <tr className="text-center">
                        <th colSpan={2} className="border-top-0 pt-0">
                          General Health
                        </th>
                      </tr>
                      <tr>
                        <td>
                          How often is stress a problem for you in handling such
                          things as: <br /> Your health, Your finances, Your
                          family or social relationships, Your Work?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {generalHealth?.health_level}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          How would you describe the condition of your mouth and{" "}
                          <br />
                          teeth—including false teeth or dentures?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {generalHealth?.mouth_and_teeth}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          How often is stress a problem for you in handling such
                          things as:
                          <br /> Your health, Your finances, Your family or
                          social relationships, Your Work?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {generalHealth?.feeling_caused_distress}
                        </td>
                      </tr>
                      <tr className="text-center">
                        <th colSpan={2} className="border-top-0 pt-0">
                          Pain
                        </th>
                      </tr>
                      <tr>
                        <td>
                          In the past 7 days, how much pain have you felt?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {pain?.pain_felt}
                        </td>
                      </tr>
                      <tr className="text-center">
                        <th colSpan={2} className="border-top-0 pt-0">
                          Social/Emotional Support
                        </th>
                      </tr>
                      <tr>
                        <td>
                          How often is stress a problem for you in handling such
                          things as: <br />
                          Your health, Your finances, Your family or social
                          relationships, Your Work?{" "}
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {socialEmotionalSupport?.get_social_emotional_support}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Physical Activity
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>
                          In the past 7 days, how many days did you exercise?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {physicalActivity?.days_of_exercise}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          On days when you exercised, for how long did you
                          exercise (in minutes)?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {physicalActivity?.mins_of_exercise}
                        </td>
                      </tr>
                      <tr>
                        <td>How intense was your typical exercise?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {physicalActivity?.exercise_intensity}
                        </td>
                      </tr>
                      <tr>
                        <td>Does not apply</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {physicalActivity?.does_not_apply}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <div className="card mb-3" style={{ minHeight: "346px" }}>
              <div className="card-body">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      Nutrition
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>
                        In the past 7 days, how many servings of fruits and
                        vegetables did you typically eat each day?
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {nutrition?.fruits_vegs}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        In the past 7 days, how many servings of high fiber or
                        whole (not refined) grain foods did you typically eat
                        each day?
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {nutrition?.whole_grain_food}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        In the past 7 days, how many servings of fried or
                        high-fat foods did you typically eat each day?
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {nutrition?.high_fat_food}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        In the past 7 days, how many sugar-sweetened (not diet)
                        beverages did you typically consume each day?
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {nutrition?.sugar_beverages}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
              {/* <div className="card mb-3" style={{ minHeight: "auto" }}>
              <div className="card-body">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      Seat Belt Use
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>
                        Do you always fasten your seat belt when you are in a
                        car?
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {seatBeltUse?.wear_seat_belt}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
            </div>
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Alcohol Use
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>
                          In the past 7 days,on how many days did you drink
                          alcohol?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {alcohalUse?.days_of_alcoholuse}
                        </td>
                      </tr>
                      <tr>
                        <td>How many drinks per day? </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {alcohalUse?.drinks_per_day}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          On days when you drank alcohol, how often did you have
                          alcoholic drinks on one occasion?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {alcohalUse?.drinks_per_occasion}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          On days when you drank alcohol, how often did you have
                          alcoholic drinks on one occasion?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {alcohalUse?.average_usage}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Do you ever drive after drinking, or ride with a
                          driver who has been drinking?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {alcohalUse?.drink_drive_yes}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <div className="card mb-3" style={{ minHeight: "auto" }}>
                <div className="card-body">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Tobacco Use
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>In the last 30 days, have you used tobacco?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {tobaccoUse?.smoked_in_thirty_days}
                        </td>
                      </tr>
                      <tr>
                        <td>Used a smokeless tobacco product?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {tobaccoUse?.smokeless_product_use}
                        </td>
                      </tr>
                      <tr>
                        <td>In the last 15 years, have you used tobacco?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {tobaccoUse?.smoked_in_fifteen_years}
                        </td>
                      </tr>
                      <tr>
                        <td>Average smoking years? </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {tobaccoUse?.average_smoking_years}
                        </td>
                      </tr>
                      <tr>
                        <td>Average packs per day?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {tobaccoUse?.average_packs_per_day}
                        </td>
                      </tr>
                      <tr>
                        <td>Average packs per year? </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {tobaccoUse?.average_packs_per_year}
                        </td>
                      </tr>
                      <tr>
                        <td>Would you be interested to Perform LDCT?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {tobaccoUse?.perform_ldct}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Would you be interested in quitting tobacco use within
                          the next month?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {tobaccoUse?.quit_tobacco}
                        </td>
                      </tr>
                      <tr>
                        <td>Would you be interested in using any alternate?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {tobaccoUse?.tobacoo_alternate}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Nutrition
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>
                          In the past 7 days, how many servings of fruits and
                          vegetables did you typically eat each day?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {nutrition?.fruits_vegs}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          In the past 7 days, how many servings of high fiber or
                          whole (not refined) grain foods did you typically eat
                          each day?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {nutrition?.whole_grain_food}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          In the past 7 days, how many servings of fried or
                          high-fat foods did you typically eat each day?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {nutrition?.high_fat_food}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          In the past 7 days, how many sugar-sweetened (not
                          diet) beverages did you typically consume each day?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {nutrition?.sugar_beverages}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3" style={{ minHeight: "auto" }}>
                <div className="card-body">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Seat Belt Use
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>
                          Do you always fasten your seat belt when you are in a
                          car?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {seatBeltUse?.wear_seat_belt}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body ">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Immunization
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>Refused Flu Vaccine ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.flu_vaccine_refused}
                        </td>
                      </tr>
                      <tr>
                        <td>Received Flu Vaccine ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.flu_vaccine_recieved}
                        </td>
                      </tr>
                      <tr>
                        <td>Flu vaccine recieved on</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.flu_vaccine_recieved_on}
                        </td>
                      </tr>
                      <tr>
                        <td>Flu vaccine recieved at</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.flu_vaccine_recieved_at}
                        </td>
                      </tr>
                      <tr>
                        <td>Script given for Flu Vaccine</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.flu_vaccine_script_given}
                        </td>
                      </tr>
                      <tr>
                        <td>Refused Pneumococcal Vaccine ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.pneumococcal_vaccine_refused}
                        </td>
                      </tr>
                      <tr>
                        <td>Received Pneumococcal Vaccine ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.pneumococcal_vaccine_recieved}
                        </td>
                      </tr>
                      <tr>
                        <td>Recieved Prevnar 13 on</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.pneumococcal_prevnar_recieved_on}
                        </td>
                      </tr>
                      <tr>
                        <td>Recieved Prevnar 13 at</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.pneumococcal_prevnar_recieved_at}
                        </td>
                      </tr>
                      <tr>
                        <td>Recieved PPSV 23 on</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.pneumococcal_ppsv23_recieved_on}
                        </td>
                      </tr>
                      <tr>
                        <td>Recieved PPSV 23 at</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.pneumococcal_ppsv23_recieved_at}
                        </td>
                      </tr>
                      <tr>
                        <td>Script given for Prevnar 13 / PPSV 23</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.pneumococcal_vaccine_script_given}
                        </td>
                      </tr>
                      <tr>
                        <td>Comments</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {immunization?.comments}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Screening
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>Refused Mammogram ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.mammogram_refused}
                        </td>
                      </tr>
                      <tr>
                        <td>Mammogram done on ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.mammogram_done_on}
                        </td>
                      </tr>
                      <tr>
                        <td>Mammogram done at ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.mammogram_done_at}
                        </td>
                      </tr>
                      <tr>
                        <td>Report reviewed </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.mommogram_report_reviewed}
                        </td>
                      </tr>
                      <tr>
                        <td>Next Mammogram due on</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.next_mommogram}
                        </td>
                      </tr>
                      <tr>
                        <td>Script given for the Screening Mammogram ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.mammogram_script}
                        </td>
                      </tr>
                      <tr>
                        <td>Refused Colonoscopy & FIT Test ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.colonoscopy_refused}
                        </td>
                      </tr>
                      <tr>
                        <td>Colonoscopy / FIT Test / Cologuard done on </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.colonoscopy_done_on}
                        </td>
                      </tr>
                      <tr>
                        <td>Colonoscopy / FIT Test / Cologuard done at </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.colonoscopy_done_at}
                        </td>
                      </tr>
                      <tr>
                        <td>Report reviewed</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.colonoscopy_report_reviewed}
                        </td>
                      </tr>
                      <tr>
                        <td>Next Colonoscopy / FIT Test due on </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.next_colonoscopy}
                        </td>
                      </tr>
                      <tr>
                        <td>Script given for the Screening Colonoscopy</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.colonoscopy_script}
                        </td>
                      </tr>
                      <tr>
                        <td>Comments</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {screening?.comments}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: "370px" }}>
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body ">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Diabetes
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>
                          Does Patient have active diagnosis of diabetes ?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.diabetec_patient}
                        </td>
                      </tr>
                      <tr>
                        <td>FBS done in last 12 months ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.fbs_in_year}
                        </td>
                      </tr>
                      <tr>
                        <td>Fasting Blood Sugar (FBS)</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.fbs_value}
                        </td>
                      </tr>
                      <tr>
                        <td>Fasting Blood Sugar date (FBS)</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.fbs_date}
                        </td>
                      </tr>
                      <tr>
                        <td>HBA1C</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.hba1c_value}
                        </td>
                      </tr>
                      <tr>
                        <td>HBA1C Date</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.hba1c_date}
                        </td>
                      </tr>
                      <tr>
                        <td>Diabetic Eye Examination in last 12 months ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.diabetec_eye_exam}
                        </td>
                      </tr>
                      <tr>
                        <td>Ratinavue Ordered</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.ratinavue_ordered}
                        </td>
                      </tr>
                      <tr>
                        <td>Script given for Eye Examination</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.diabetec_eye_exam_report?.replace(
                            /_/g,
                            " "
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Eye Exmaination Report</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.diabetec_eye_exam_report?.replace(
                            /_/g,
                            " "
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Name of Doctor</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.eye_exam_doctor}
                        </td>
                      </tr>
                      <tr>
                        <td>Facility</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.eye_exam_facility}
                        </td>
                      </tr>
                      <tr>
                        <td>Eye Exam date</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.eye_exam_date}
                        </td>
                      </tr>
                      <tr>
                        <td>Report Reviewed</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.eye_exam_report_reviewed}
                        </td>
                      </tr>
                      <tr>
                        <td>Report Shows Diabetic Retinopathy</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.diabetec_ratinopathy}
                        </td>
                      </tr>
                      <tr>
                        <td>Urine for microalbumin in last 6 months</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.urine_microalbumin}
                        </td>
                      </tr>
                      <tr>
                        <td>Urine for Microalbumin date</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.urine_microalbumin_date}
                        </td>
                      </tr>
                      <tr>
                        <td>Urine for Microalbumin report</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.urine_microalbumin_report}
                        </td>
                      </tr>
                      <tr>
                        <td>Urine for Micro-albumin ordered</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.urine_microalbumin_ordered}
                        </td>
                      </tr>
                      <tr>
                        <td>Does patient use</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.urine_microalbumin_inhibitor}
                        </td>
                      </tr>
                      <tr>
                        <td>Does patient has</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {diabetes?.ckd_stage_4}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className=" col-md-12 col-lg-12">
              <div className="card mb-3">
                <div className="card-body ">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Cholesterol
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>LDL Done in last 12 months ?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.ldl_in_last_12months}
                        </td>
                      </tr>
                      <tr>
                        <td>LDL is</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.ldl_value} {cholestrol?.ldl_date}
                        </td>
                      </tr>
                      <tr>
                        <td>Does Patient have ASCVD?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.patient_has_ascvd}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Fasting or direct LDL-C ≥ 190 mg/dL? Check from result
                          above ?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.ldlvalue_190ormore}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          History or active diagnosis of familial or pure
                          hypercholesterolemia
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.pure_hypercholesterolemia}
                        </td>
                      </tr>
                      <tr>
                        <td>Does Patient have active diagnosis of diabetes?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.active_diabetes}
                        </td>
                      </tr>
                      <tr>
                        <td>Patient age between 40-75 years?</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.diabetes_patient_age}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Fasting or Direct LDL-C 70-189 mg/dL any time in past
                          two years (2020-2022)? Yes
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.ldl_range_in_past_two_years}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Was the patient prescribed any high or moderate
                          intensity statin in the current calendar year?
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.statin_prescribed}
                        </td>
                      </tr>
                      <tr>
                        <td>Statin Type and dosage</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.statintype_dosage}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Documented medical reason for not being on statin
                          therapy is:
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {cholestrol?.medical_reason_for_nostatin}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card mb-3" style={{ minHeight: "auto" }}>
                <div className="card-body ">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        BP Assessment
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>BP</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {bpAssessment?.bp_value}
                        </td>
                      </tr>
                      <tr>
                        <td>BP Date</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {bpAssessment?.bp_date}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card mb-3">
                <div className="card-body ">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Weight Assessment
                      </th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>BP</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {weightAssessment?.bmi_value}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className=" col-md-12 col-lg-12 ">
              <div className="card mb-3" style={{ minHeight: "auto" }}>
                <div className="card-body ">
                  <table className="table">
                    <tr className="text-center">
                      <th colSpan={2} className="border-top-0 pt-0">
                        Miscellaneous
                      </th>
                    </tr>
                    <tbody>
                      <tr className="text-center">
                        <th colSpan={2} className="border-top-0 pt-0">
                          <h6>
                            <b> Vitals</b>
                          </h6>
                        </th>
                      </tr>
                      <tr>
                        <td>Height</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {miscellaneous?.height}in
                        </td>
                      </tr>
                      <tr>
                        <td>Weight</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {miscellaneous?.weight}lbs
                        </td>
                      </tr>
                      <tr className="text-center">
                        <th colSpan={2} className="border-top-0 pt-0 ">
                          <h6>
                            <b>Advance Care Plan</b>{" "}
                          </h6>
                        </th>
                      </tr>
                      <tr>
                        <td>
                          Advanced Care planning was discussed with the patient.
                          A packet is given to the patient. The patient shows
                          understanding. The patient was by himself during the
                          discussion
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Time Spent</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {miscellaneous?.time_spent}minutes
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Intensive behavioral therapy for cardiovascular
                          disease (CVD)
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>
                          Encouraged aspirin use for primary prevention a
                          cardiovascular disease when the benefits outweigh the
                          risks for men age 45-79 and <br /> women 55-79.
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {miscellaneous?.asprin_use}
                        </td>
                      </tr>
                      <tr>
                        <td>Screened for high blood pressure.</td>
                        <td className=" font-weight-bold text-center text-dark">
                          {miscellaneous?.high_blood_pressure}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Intensive behavioral counseling provided to promote a
                          healthy diet for adults who already have
                          hyperlipidemia, hypertension, advancing age, <br />{" "}
                          and other known risk factors for cardiovascular br and
                          diet related chronic diseases.
                        </td>
                        <td className=" font-weight-bold text-center text-dark">
                          {miscellaneous?.behavioral_counselling}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default Viewquestions;
