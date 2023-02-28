import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { Button, Input, Space, Tooltip } from "antd";
import React, { useState } from "react";
import {
  Hypertension,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import TextArea from "antd/lib/input/TextArea";
import { OpenNotification } from "./../../../Utilties/Utilties";
import DatePickerComponent from "../../../components/DatePickerComponent/DatePickerComponent";

const Hypertensions: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const {
    question: { hypertension },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [hp, setHp] = React.useState<Hypertension>(hypertension);
  const [count, setCount] = useState(1);
  const [hypertensionBp, setHypertensionBp] = useState<Hypertension[]>([
    {
      key: 0,
      bp_day: "",
      systolic_day: "",
      diastolic_day: "",
    },
  ]);

  const dateFormat = "MM/DD/YYYY";

  const handleHypertensionBpMonitor = (e: any, index: any) => {
    const bloodPressure = [...hypertensionBp];
    const item = bloodPressure[index];
    Object.assign(item, { [e.target.name]: e.target.value });

    const assessmentHypertension = { ...hp, bp: hypertensionBp };
    setHp(assessmentHypertension);
  };

  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const hyperTenion = { ...hp };
    Object.assign(hyperTenion, completed);

    const response = await saveQuestionairsData("hypertension", hyperTenion);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const hyperTenion = { ...hp };
    Object.assign(hyperTenion, completed);

    await saveQuestionairsData("hypertension", hyperTenion);
    handleNextStep && handleNextStep();
  };

  const handleAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newdignoses: Hypertension = {
      key: count,
      bp_day: "",
      systolic_day: "",
      diastolic_day: "",
    };
    const data = [...hypertensionBp, newdignoses];
    setHypertensionBp(data);
    setCount(count + 1);
  };
  const handleDelete = (index: any) => {
    const newData = hypertensionBp.filter((item) => item.key !== index);
    setHypertensionBp(newData);
  };

  function handlevalue(e: any) {
    const value = e.target.value;

    setHp({
      ...hp,
      [e.target.name]: value,
    });
  }

  function dateChange(name: string, value: string, index: number) {
    const newHp = [...hypertensionBp];
    const item = newHp[index];
    Object.assign(item, { [name]: value });

    const assessmentHypertension = { ...hp, bp: hypertensionBp };
    setHp(assessmentHypertension);
    /* setHp({
      ...hp,
      [name]: value,
    }); */
  }

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Hypertension</h2>
        <div>
          <label>
            If you have been monitoring your Blood pressure, please tell me the
            readings from the last three days.
          </label>
          <table className="table">
            <tbody>
              {hypertensionBp?.map((items: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>
                      <DatePickerComponent
                        fieldName={"bp_day"}
                        value={hp?.bp_day}
                        placeHolder={"BP Monitor date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value, index)
                        }
                      />
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <Input
                        type="number"
                        value={hp?.systolic_day}
                        name="systolic_day"
                        size="middle"
                        placeholder="Systolic value"
                        onChange={(e) => handleHypertensionBpMonitor(e, index)}
                      />
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <Input
                        type="number"
                        value={hp?.diastolic_day}
                        name="diastolic_day"
                        placeholder="Diastolic value"
                        onChange={(e) => handleHypertensionBpMonitor(e, index)}
                      />
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <Tooltip title={"Delete"}>
                        <Button danger size="small">
                          <i
                            className="fas fa-times"
                            onClick={() => handleDelete(index)}
                          ></i>
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Button onClick={handleAdd} className="mb-5" type="primary">
            Add a row
          </Button>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <label>
                If patient has not been monitoring their blood pressure, please
                state the reason
              </label>
              <TextArea
                value={hypertension?.reason_for_no_bp}
                name="reason_for_no_bp"
                onChange={(e) => handlevalue(e)}
              />
              <br />
              <br />
            </div>
          </div>
          <br />
        </div>
        <br />

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
                  To acquire knowledge about hypertension and how it can affect
                  you
                </label>
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="effect_start_date"
                  className="dateHeight"
                  value={hypertension?.effect_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="effect_end_date"
                  className="dateHeight"
                  value={hypertension?.effect_end_date}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the importance of daily blood pressure
                  monitoring, logging and maintaining a normal blood pressure.
                </label>
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="imp_bp_monitoring_start_date"
                  className="dateHeight"
                  value={hypertension?.imp_bp_monitoring_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="imp_bp_monitoring_end_date"
                  className="dateHeight"
                  value={hypertension?.imp_bp_monitoring_end_date}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the relationship between high blood pressure and
                  cardiovascular and kidney disease risks
                </label>
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="relation_start_date"
                  className="dateHeight"
                  value={hypertension?.relation_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="relation_end_date"
                  className="dateHeight"
                  value={hypertension?.relation_end_date}
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To recognize the importance of discipline in taking all
                  medications as prescribed
                </label>
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="imp_of_medication_start_date"
                  className="dateHeight"
                  value={hypertension?.imp_of_medication_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="imp_of_medication_end_date"
                  className="dateHeight"
                  value={hypertension?.imp_of_medication_end_date}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To recognize the importance of adopting lifestyle
                  modifications to mitigate risk of complications
                </label>
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="adopt_lifestyle_start_date"
                  className="dateHeight"
                  value={hypertension?.adopt_lifestyle_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="adopt_lifestyle_end_date"
                  className="dateHeight"
                  value={hypertension?.adopt_lifestyle_end_date}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the importance of quitting Smoking and/or
                  reducing alcohol consumption to reduce the risk of
                  complications
                </label>
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="quit_smoking_alcohol_start_date"
                  className="dateHeight"
                  value={hypertension?.quit_smoking_alcohol_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="quit_smoking_alcohol_end_date"
                  className="dateHeight"
                  value={hypertension?.quit_smoking_alcohol_end_date}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To adopt dietary modifications suggested by the
                  PCP/cardiologist and maintain a healthy diet for managing high
                  blood pressure
                </label>
              </div>

              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="adopt_dietary_start_date"
                  className="dateHeight"
                  value={hypertension?.adopt_dietary_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="adopt_dietary_end_date"
                  className="dateHeight"
                  value={hypertension?.adopt_dietary_end_date}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">To maintain a healthy Weight</label>
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="maintain_weight_start_date"
                  className="dateHeight"
                  value={hypertension?.maintain_weight_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="maintain_weight_end_date"
                  className="dateHeight"
                  value={hypertension?.maintain_weight_end_date}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To engage in 150 minutes of moderate intensity physical
                  activity per week
                </label>
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="moderate_exercise_start_date"
                  className="dateHeight"
                  value={hypertension?.moderate_exercise_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="moderate_exercise_end_date"
                  className="dateHeight"
                  value={hypertension?.moderate_exercise_end_date}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the importance of regular follow-up with PCP and
                  cardiologist
                </label>
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="Start Date"
                  type="date"
                  name="regular_pcp_folloup_start_date"
                  className="dateHeight"
                  value={hypertension?.regular_pcp_folloup_start_date}
                />
              </div>
              <div className="col-3">
                <Input
                  onChange={(e) => handlevalue(e)}
                  placeholder="End Date"
                  type="date"
                  name="regular_pcp_folloup_end_date"
                  className="dateHeight"
                  value={hypertension?.regular_pcp_folloup_end_date}
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
export default Hypertensions;
