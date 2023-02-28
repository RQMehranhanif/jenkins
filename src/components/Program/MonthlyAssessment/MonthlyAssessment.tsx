import React from "react";
import { Button, Checkbox, DatePicker, Radio, Space } from "antd";
import {
  MonthlyAssessmentType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import moment from "moment";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

const MonthlyAssessment = ({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) => {
  const {
    loading,
    question: { monthly_assessment },
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const dateFormat = "MM/DD/YYYY";
  const defaultOptions = ["Yes", "No"];

  const [monthlyAssessment, setMonthlyAssessment] =
    React.useState<MonthlyAssessmentType>(monthly_assessment);

  console.log(monthlyAssessment, "from db");

  const dates = {
    appointment_schedule_with_pcp:
      monthlyAssessment?.appointment_schedule_with_pcp
        ? moment(monthlyAssessment?.appointment_schedule_with_pcp)
        : undefined,
    last_pcp_visit: monthlyAssessment?.last_pcp_visit
      ? moment(monthlyAssessment?.last_pcp_visit)
      : undefined,
  };

  const [pcpAppointmentBody, setShowPcpAppoinmentBody] = React.useState<any>({
    showElement: Boolean(
      monthlyAssessment?.respiratory_symptoms === "Yes" ||
        monthlyAssessment?.urinary_system === "Yes" ||
        monthlyAssessment?.gastrointestinal_system === "Yes" ||
        monthlyAssessment?.cardiovascular_symptoms === "Yes" ||
        monthlyAssessment?.in_er_since_last_pcp_visit === "Yes" ||
        monthlyAssessment?.hospitalized_since_last_pcp_visit === "Yes"
    ),
  });

  React.useEffect(() => {
    const respiratory_symptoms =
      monthlyAssessment?.respiratory_symptoms ?? "No";
    const urinary_system = monthlyAssessment?.urinary_system ?? "No";
    const gastrointestinal_system =
      monthlyAssessment?.gastrointestinal_system ?? "No";
    const cardiovascular_symptoms =
      monthlyAssessment?.cardiovascular_symptoms ?? "No";
    const in_er_since_last_pcp_visit =
      monthlyAssessment?.in_er_since_last_pcp_visit ?? "No";
    const hospitalized_since_last_pcp_visit =
      monthlyAssessment?.hospitalized_since_last_pcp_visit ?? "No";

    if (
      respiratory_symptoms === "No" &&
      urinary_system === "No" &&
      gastrointestinal_system === "No" &&
      cardiovascular_symptoms === "No" &&
      in_er_since_last_pcp_visit === "No" &&
      hospitalized_since_last_pcp_visit === "No"
    ) {
      setMonthlyAssessment({
        ...monthlyAssessment,
        appointment_schedule_with_pcp: "",
        refused_appoinment_with_pcp: "",
      });
    }

    setShowPcpAppoinmentBody(
      Boolean(
        respiratory_symptoms === "Yes" ||
          urinary_system === "Yes" ||
          gastrointestinal_system === "Yes" ||
          cardiovascular_symptoms === "Yes" ||
          in_er_since_last_pcp_visit === "Yes" ||
          hospitalized_since_last_pcp_visit === "Yes"
      )
    );
  }, [
    monthlyAssessment?.respiratory_symptoms,
    monthlyAssessment?.urinary_system,
    monthlyAssessment?.gastrointestinal_system,
    monthlyAssessment?.cardiovascular_symptoms,
    monthlyAssessment?.in_er_since_last_pcp_visit,
    monthlyAssessment?.hospitalized_since_last_pcp_visit,
  ]);

  function valueChange(e: any) {
    const value = e.target.value;
    setMonthlyAssessment({
      ...monthlyAssessment,
      [e.target.name]: value,
    });
  }

  function dateChange(name: string, value: string) {
    setMonthlyAssessment({
      ...monthlyAssessment,
      [name]: value,
    });
  }

  function lastPCPDate(name: string, value: string) {
    const endDate = moment(new Date(), dateFormat);
    const startDate = moment(value, dateFormat);

    const monthDifference = endDate.diff(startDate, "months");
    if (monthDifference > 6) {
      setShowPcpAppoinmentBody(true);
      setMonthlyAssessment({
        ...monthlyAssessment,
        [name]: value,
      });
    } else {
      setShowPcpAppoinmentBody(false);
      setMonthlyAssessment({
        ...monthlyAssessment,
        [name]: value,
        appointment_schedule_with_pcp: "",
        refused_appoinment_with_pcp: "",
      });
    }
  }

  function refusedPcpAppoinment(e: any) {
    const value = e.target.checked === true ? e.target.value : "";
    setMonthlyAssessment({
      ...monthlyAssessment,
      [e.target.name]: value,
    });
  }

  /* Screening not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const mon_assessment = { ...monthlyAssessment };
    Object.assign(mon_assessment, completed);

    const response = await saveQuestionairsData(
      "monthly_assessment",
      mon_assessment
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const mon_assessment = { ...monthlyAssessment };
    Object.assign(mon_assessment, completed);

    const response = await saveQuestionairsData(
      "monthly_assessment",
      mon_assessment
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <>
      <div className="question-card">
        <div className="mb-3">
          <h2 className="stepsheading">Monthly Assessment</h2>
        </div>

        <h5>Respiratory Symptoms</h5>
        <div className="row mb-4">
          <div className="col-lg-6 md-6 sm-12">
            <div>
              <label className="question-text">
                Have you noticed Shortness of Breath – at exertion, rest or
                lying down – Wheezing, Productive sputum more than usual or
                change in sputum color since you met your PCP?
              </label>
            </div>

            <div>
              <Radio.Group
                name="respiratory_symptoms"
                value={monthlyAssessment?.respiratory_symptoms}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>

        <h5>Urinary System</h5>
        <div className="row mb-4">
          <div className="col-lg-6 md-6 sm-12">
            <div>
              <label className="question-text">
                Have you noticed Blood in the Urine, Urinary Urgency or
                frequency, Urinary Incontinence since you last met the PCP?
              </label>
            </div>

            <div>
              <Radio.Group
                name="urinary_system"
                value={monthlyAssessment?.urinary_system}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>

        <h5>Gastrointestinal System</h5>
        <div className="row mb-4">
          <div className="col-lg-6 md-6 sm-12">
            <div>
              <label className="question-text">
                Have you noticed Blood in the Stool, Diarrhea, Unexplained Weigh
                loss, Difficulty to swallow, Abdominal Discomfort since you last
                met your PCP?
              </label>
            </div>

            <div>
              <Radio.Group
                name="gastrointestinal_system"
                value={monthlyAssessment?.gastrointestinal_system}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>

        <h5>Cardiovascular Symptoms</h5>
        <div className="row mb-4">
          <div className="col-lg-6 md-6 sm-12">
            <div>
              <label className="question-text">
                Have you noticed Shortness of Breath – at exertion, rest or
                lying down – Dizziness, Chest Pain, Profuse Sweating since you
                met your PCP?
              </label>
            </div>

            <div>
              <Radio.Group
                name="cardiovascular_symptoms"
                value={monthlyAssessment?.cardiovascular_symptoms}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <div>
              <label className="question-text">
                When did you last see your PCP?
              </label>
            </div>

            <div>
              <DatePicker
                name="last_pcp_visit"
                value={dates.last_pcp_visit}
                onChange={(e, datestring) =>
                  lastPCPDate("last_pcp_visit", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <div>
              <label className="question-text">
                Have you been in the ER since last seen by the PCP?
              </label>
            </div>

            <div>
              <Radio.Group
                name="in_er_since_last_pcp_visit"
                value={monthlyAssessment?.in_er_since_last_pcp_visit}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <div>
              <label className="question-text">
                Have you been admitted to the Hospital since last seen by the
                PCP?
              </label>
            </div>

            <div>
              <Radio.Group
                name="hospitalized_since_last_pcp_visit"
                value={monthlyAssessment?.hospitalized_since_last_pcp_visit}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <div>
              <label className="question-text">
                Do you have any questions on your Medications?
              </label>
            </div>

            <div>
              <Radio.Group
                name="any_question_about_medications"
                value={monthlyAssessment?.any_question_about_medications}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <div>
              <label className="question-text">
                Do you need any refills on your Medications?
              </label>
            </div>

            <div>
              <Radio.Group
                name="need_medication_refills"
                value={monthlyAssessment?.need_medication_refills}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>

        {pcpAppointmentBody && (
          <div className="col-lg-6 md-6 sm-12">
            <div className="row mb-3">
              <div className="col-lg-6 md-6 sm-12">
                <div>
                  <label className="question-text">
                    Appointment scheduled with PCP on
                  </label>
                </div>

                <div>
                  <DatePicker
                    name="appointment_schedule_with_pcp"
                    value={dates.appointment_schedule_with_pcp}
                    onChange={(_e, datestring) =>
                      dateChange("appointment_schedule_with_pcp", datestring)
                    }
                    format={dateFormat}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-lg-6 md-6 sm-12">
                <div>
                  <Checkbox
                    className="mr-2"
                    name="refused_appoinment_with_pcp"
                    value="1"
                    checked={
                      monthlyAssessment?.refused_appoinment_with_pcp === "1"
                    }
                    onChange={refusedPcpAppoinment}
                  />
                  <label className="question-text">
                    {" "}
                    Refused appointment with the PCP{" "}
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <Space>
          <Button type="primary" onClick={() => handlePreviousStep?.()}>
            Back
          </Button>
          <Button loading={loading} onClick={async () => await SaveAndNext()}>
            Save and Next
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={async () => await handleSave()}
          >
            Finish and Next
          </Button>
        </Space>
      </div>
    </>
  );
};
export default MonthlyAssessment;
