import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { Button, DatePicker, Input, Radio, Space } from "antd";
import React, { useState } from "react";
import { QuestionaireStepProps } from "../../../Types/QuestionaireTypes";
import { COPDType } from "./../../../Types/QuestionaireTypes";
import { OpenNotification } from "./../../../Utilties/Utilties";
import moment from "moment";

const ChronicObstructivePulmonaryDisease: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const {
    question: { copd_assessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [copd, setCopd] = React.useState<COPDType>(copd_assessment);
  const [first, setfirst] = useState(0);
  const [second, setsecond] = useState(0);
  const [third, setthird] = useState(0);
  const [forth, setforth] = useState(0);
  const [fifth, setfifth] = useState(0);
  const [six, setsix] = useState(0);
  const [seven, setseven] = useState(0);
  const [eight, seteight] = useState(0);
  const [final, setfinal] = useState(0);
  const dateFormat = "MM/DD/YYYY";

  function handlevalue1(e: any) {
    const value = e.target.value;
    console.log(value);
    setfirst(value);
    const data = value;

    setfinal(data);

    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }
  function handlevalue2(e: any) {
    const value = e.target.value;
    console.log(value);
    setsecond(value);

    const data = first + value;
    setfinal(data);

    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }
  function handlevalue3(e: any) {
    const value = e.target.value;
    console.log(value);
    const data = first + second + value;
    setfinal(data);
    setthird(value);
    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }
  function handlevalue4(e: any) {
    const value = e.target.value;
    console.log(value);
    const data = first + second + third + value;
    setfinal(data);
    setforth(value);
    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }
  function handlevalue5(e: any) {
    const value = e.target.value;
    console.log(value);
    const data = first + second + third + forth + value;
    setfinal(data);
    setfifth(value);
    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }
  function handlevalue6(e: any) {
    const value = e.target.value;
    console.log(value);
    const data = first + second + third + forth + fifth + value;
    setfinal(data);
    setsix(value);
    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }
  function handlevalue7(e: any) {
    const value = e.target.value;
    console.log(value);
    const data = first + second + third + forth + fifth + six + value;
    setfinal(data);
    setseven(value);
    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }
  function handlevalue8(e: any) {
    const value = e.target.value;
    console.log(value);
    const data = first + second + third + forth + fifth + six + seven + value;
    setfinal(data);
    seteight(value);
    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }
  function handlevalue(e: any) {
    const value = e.target.value;
    console.log(value);

    setCopd({
      ...copd,
      [e.target.name]: value,
      total_assessment_score: final,
    });
  }

  function dateChange(name: string, value: string) {
    console.log(name, value);
    setCopd({
      ...copd,
      [name]: value,
    });
  }

  const dates = {
    smoking_cessation_start_date: copd?.smoking_cessation_start_date
      ? moment(copd?.smoking_cessation_start_date)
      : undefined,
    smoking_cessation_end_date: copd?.smoking_cessation_end_date
      ? moment(copd?.smoking_cessation_end_date)
      : undefined,
    copd_medication_start_date: copd?.copd_medication_start_date
      ? moment(copd?.copd_medication_start_date)
      : undefined,
    copd_medication_end_date: copd?.copd_medication_end_date
      ? moment(copd?.copd_medication_end_date)
      : undefined,
    supplemental_oxygen_start_date: copd?.supplemental_oxygen_start_date
      ? moment(copd?.supplemental_oxygen_start_date)
      : undefined,
    supplemental_oxygen_end_date: copd?.supplemental_oxygen_end_date
      ? moment(copd?.supplemental_oxygen_end_date)
      : undefined,
    self_mgmt_start_date: copd?.self_mgmt_start_date
      ? moment(copd?.self_mgmt_start_date)
      : undefined,
    self_mgmt_end_date: copd?.self_mgmt_end_date
      ? moment(copd?.self_mgmt_end_date)
      : undefined,
    tirgger_exacerbations_start_date: copd?.tirgger_exacerbations_start_date
      ? moment(copd?.tirgger_exacerbations_start_date)
      : undefined,
    tirgger_exacerbations_end_date: copd?.tirgger_exacerbations_end_date
      ? moment(copd?.tirgger_exacerbations_end_date)
      : undefined,
    exacerbations_symptoms_start_date: copd?.exacerbations_symptoms_start_date
      ? moment(copd?.exacerbations_symptoms_start_date)
      : undefined,
    exacerbations_symptoms_end_date: copd?.exacerbations_symptoms_end_date
      ? moment(copd?.exacerbations_symptoms_end_date)
      : undefined,
    followup_imp_start_date: copd?.followup_imp_start_date
      ? moment(copd?.followup_imp_start_date)
      : undefined,
    followup_imp_end_date: copd?.followup_imp_end_date
      ? moment(copd?.followup_imp_end_date)
      : undefined,
    imp_of_vaccine_start_date: copd?.imp_of_vaccine_start_date
      ? moment(copd?.imp_of_vaccine_start_date)
      : undefined,
    imp_of_vaccine_end_date: copd?.imp_of_vaccine_end_date
      ? moment(copd?.imp_of_vaccine_end_date)
      : undefined,
    safe_physical_activity_start_date: copd?.safe_physical_activity_start_date
      ? moment(copd?.safe_physical_activity_start_date)
      : undefined,
    safe_physical_activity_end_date: copd?.safe_physical_activity_end_date
      ? moment(copd?.safe_physical_activity_end_date)
      : undefined,
    group_support_start_date: copd?.group_support_start_date
      ? moment(copd?.group_support_start_date)
      : undefined,
    group_support_end_date: copd?.group_support_end_date
      ? moment(copd?.group_support_end_date)
      : undefined,
  };

  /* Assessment Not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const copdAssessment = { ...copd };
    Object.assign(copdAssessment, completed);

    const response = await saveQuestionairsData(
      "copd_assessment",
      copdAssessment
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
    const copdAssessment = { ...copd };
    Object.assign(copdAssessment, completed);

    await saveQuestionairsData("copd_assessment", copdAssessment);
    handleNextStep && handleNextStep();
  };
  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Chronic Obstructive Pulmonary Disease</h2>
        <table className="table">
          <tbody>
            <tr>
              <td>
                <label htmlFor="">Score I never Cough</label>
              </td>
              <td>
                {" "}
                <Radio.Group
                  onChange={(e) => handlevalue1(e)}
                  name={"Cough"}
                  value={copd?.Cough}
                >
                  <Radio value={0}>0</Radio>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </Radio.Group>
              </td>
              <td>
                <label htmlFor="">I cough all the time</label>
              </td>
              <td>
                <Input
                  type="text"
                  value={first}
                  className="dateHeight"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="">
                  I have no phlegum (mucus) in my chest at all
                </label>
              </td>
              <td>
                <Radio.Group
                  onChange={(e) => handlevalue2(e)}
                  name={"phlegum_in_chest"}
                  value={copd?.phlegum_in_chest}
                >
                  <Radio value={0}>0</Radio>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </Radio.Group>
              </td>
              <td>
                <label htmlFor="">
                  My chest is completely full of phlegum (mucus)
                </label>
              </td>
              <td>
                <Input
                  value={second}
                  type="text"
                  className="dateHeight"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="">My chest does not feel tight at all </label>
              </td>
              <td>
                <Radio.Group
                  onChange={(e) => handlevalue3(e)}
                  name={"tight_chest"}
                  value={copd?.tight_chest}
                >
                  <Radio value={0}>0</Radio>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </Radio.Group>
              </td>
              <td>
                <label htmlFor="">My chest feels very tight</label>
              </td>
              <td>
                <Input
                  value={third}
                  type="text"
                  className="dateHeight"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="">
                  When i walk upto a hill or one flight of stairs i am not
                  breathless
                </label>{" "}
              </td>
              <td>
                <Radio.Group
                  onChange={(e) => handlevalue4(e)}
                  name={"breathless"}
                  value={copd?.breathless}
                >
                  <Radio value={0}>0</Radio>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </Radio.Group>
              </td>
              <td>
                <label htmlFor="">
                  When i walk upto a hill or one flight of stairs i am very
                  breathless
                </label>{" "}
              </td>
              <td>
                <Input
                  value={forth}
                  type="text"
                  className="dateHeight"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="">
                  I am not limited doing any activities at home
                </label>{" "}
              </td>
              <td>
                <Radio.Group
                  onChange={(e) => handlevalue5(e)}
                  name={"limited_activities"}
                  value={copd?.limited_activities}
                >
                  <Radio value={0}>0</Radio>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </Radio.Group>
              </td>
              <td>
                <label htmlFor="">
                  I am very limited doing activities at home
                </label>{" "}
              </td>
              <td>
                <Input
                  value={fifth}
                  type="text"
                  className="dateHeight"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="">
                  I am confident leaving my home despite my lung condition
                </label>{" "}
              </td>
              <td>
                <Radio.Group
                  onChange={(e) => handlevalue6(e)}
                  name={"lung_condition"}
                  value={copd?.lung_condition}
                >
                  <Radio value={0}>0</Radio>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </Radio.Group>
              </td>
              <td>
                <label htmlFor="">
                  I am not at all confident leaving my home because of my lung
                  condition
                </label>{" "}
              </td>
              <td>
                <Input
                  value={six}
                  type="text"
                  className="dateHeight"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="">I sleep soundly</label>
              </td>
              <td>
                <Radio.Group
                  onChange={(e) => handlevalue7(e)}
                  name={"sound_sleep"}
                  value={copd?.sound_sleep}
                >
                  <Radio value={0}>0</Radio>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </Radio.Group>
              </td>
              <td>
                <label htmlFor="">
                  I don't sleep soundly because of my lung condition
                </label>{" "}
              </td>
              <td>
                <Input
                  value={seven}
                  type="text"
                  className="dateHeight"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="">I have lots of energy</label>
              </td>
              <td>
                <Radio.Group
                  onChange={(e) => handlevalue8(e)}
                  name={"energy_level"}
                  value={copd?.energy_level}
                >
                  <Radio value={0}>0</Radio>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </Radio.Group>
              </td>
              <td>
                <label htmlFor="">I have no energy at all</label>
              </td>
              <td>
                <Input
                  value={eight}
                  type="text"
                  className="dateHeight"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>
                <label htmlFor="">Final Score</label>
              </td>
              <td>
                <Input
                  value={final}
                  type="text"
                  name="total_assessment_score"
                  className="dateHeight"
                  onChange={(e) => {
                    handlevalue(e);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="row mb-2">
          <div className="col-12">
            <div className="row mb-2">
              <div className="col-6">
                <label>
                  <b>Treatment Goals</b>
                </label>
              </div>
              <div className="col-3">
                <label>
                  <b>Start Date</b>
                </label>
              </div>
              <div className="col-3">
                <label>
                  <b>End Date</b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the importance of smoking cessation
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  name="smoking_cessation_start_date"
                  value={dates.smoking_cessation_start_date}
                  onChange={(e, datestring) =>
                    dateChange("smoking_cessation_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="smoking_cessation_end_date"
                  value={dates.smoking_cessation_end_date}
                  onChange={(e, datestring) =>
                    dateChange("smoking_cessation_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To recognize the importance of discipline in taking COPD
                  medication as prescribed
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  name="copd_medication_start_date"
                  value={dates.copd_medication_start_date}
                  onChange={(e, datestring) =>
                    dateChange("copd_medication_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="copd_medication_end_date"
                  value={dates.copd_medication_end_date}
                  onChange={(e, datestring) =>
                    dateChange("copd_medication_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To have an understanding regarding safe utilization and
                  management of supplemental oxygen therapy
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  name="supplemental_oxygen_start_date"
                  value={dates.supplemental_oxygen_start_date}
                  onChange={(e, datestring) =>
                    dateChange("supplemental_oxygen_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="supplemental_oxygen_end_date"
                  value={dates.supplemental_oxygen_end_date}
                  onChange={(e, datestring) =>
                    dateChange("supplemental_oxygen_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To have an understanding regarding self-management of COPD
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  name="self_mgmt_start_date"
                  value={dates.self_mgmt_start_date}
                  onChange={(e, datestring) =>
                    dateChange("self_mgmt_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="self_mgmt_end_date"
                  value={dates.self_mgmt_end_date}
                  onChange={(e, datestring) =>
                    dateChange("self_mgmt_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To identify and avoid triggers for exacerbations
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  name="tirgger_exacerbations_start_date"
                  value={dates.tirgger_exacerbations_start_date}
                  onChange={(e, datestring) =>
                    dateChange("tirgger_exacerbations_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="tirgger_exacerbations_end_date"
                  value={dates.tirgger_exacerbations_end_date}
                  onChange={(e, datestring) =>
                    dateChange("tirgger_exacerbations_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To recognize signs and symptoms of exacerbations which must be
                  reported to the doctor/nurse
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  name="exacerbations_symptoms_start_date"
                  value={dates.exacerbations_symptoms_start_date}
                  onChange={(e, datestring) =>
                    dateChange("exacerbations_symptoms_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="exacerbations_symptoms_end_date"
                  value={dates.exacerbations_symptoms_end_date}
                  onChange={(e, datestring) =>
                    dateChange("exacerbations_symptoms_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the importance of regular follow-up with PCP and
                  Pulmonologist
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  name="followup_imp_start_date"
                  value={dates.followup_imp_start_date}
                  onChange={(e, datestring) =>
                    dateChange("followup_imp_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="followup_imp_end_date"
                  value={dates.followup_imp_end_date}
                  onChange={(e, datestring) =>
                    dateChange("followup_imp_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the importance of pneumonia and flu vaccination
                </label>
              </div>

              <div className="col-3">
                <DatePicker
                  name="imp_of_vaccine_start_date"
                  value={dates.imp_of_vaccine_start_date}
                  onChange={(e, datestring) =>
                    dateChange("followup_imp_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="imp_of_vaccine_end_date"
                  value={dates.imp_of_vaccine_end_date}
                  onChange={(e, datestring) =>
                    dateChange("imp_of_vaccine_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To develop knowledge regarding and engage in symptom-limited,
                  safe physical activity
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  name="safe_physical_activity_start_date"
                  value={dates.safe_physical_activity_start_date}
                  onChange={(e, datestring) =>
                    dateChange("safe_physical_activity_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="safe_physical_activity_end_date"
                  value={dates.safe_physical_activity_end_date}
                  onChange={(e, datestring) =>
                    dateChange("safe_physical_activity_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">To utilize counseling/group support.</label>
              </div>
              <div className="col-3">
                <DatePicker
                  name="group_support_start_date"
                  value={dates.group_support_start_date}
                  onChange={(e, datestring) =>
                    dateChange("group_support_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  name="group_support_end_date"
                  value={dates.group_support_end_date}
                  onChange={(e, datestring) =>
                    dateChange("group_support_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
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
export default ChronicObstructivePulmonaryDisease;
