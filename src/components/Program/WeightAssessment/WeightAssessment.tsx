import React from "react";
import { Button, Space } from "antd";
import {
  WeightAssessmentType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

function WeightAssessment({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { weight_assessment: storeWeightAssessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [weightAssessment, setWeightAssessment] =
    React.useState<WeightAssessmentType>(storeWeightAssessment);

  function valueChange(e: any) {
    const { value } = e.target;
    setWeightAssessment({
      ...weightAssessment,
      [e.target.name]: value,
    });
  }
  const [state, setState] = React.useState<any>({
    showElement: false,
  });
  const handleChange = (value: any) => {
    if (value.target.value >= 30) {
      setState({ state, showElement: true });
    } else {
      setState({ state, showElement: false });
    }
  };

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const weightScreening = { ...weightAssessment };
    Object.assign(weightScreening, completed);

    const response = await saveQuestionairsData(
      "weight_assessment",
      weightScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Screening Completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const weightScreening = { ...weightAssessment };
    Object.assign(weightScreening, completed);

    const response = await saveQuestionairsData(
      "weight_assessment",
      weightScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Weight Assessment</h2>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">BMI ?</label>
          <input
            onChange={valueChange}
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            onClick={handleChange}
            name="bmi_value"
            placeholder="BMI"
            value={weightAssessment?.bmi_value}
          />
        </div>
        <div className="col-lg-6 md-6 sm-12">
          <div
            id=""
            className={state.showElement ? "d-block" : "d-none"}
            style={{ marginBottom: "10px" }}
          >
            <label className="question-text">
              Would you like to follow up with the Nutritionist ?
            </label>
            <br />
            <input
              onClick={valueChange}
              type="radio"
              className="my_radio"
              value="Yes"
              name="followup_withnutritionist"
              checked={weightAssessment?.followup_withnutritionist === "Yes"}
            />
            <span className="radio_text"> Yes</span> <br />
            <input
              onClick={valueChange}
              type="radio"
              className="my_radio"
              value="No"
              name="followup_withnutritionist"
              checked={weightAssessment?.followup_withnutritionist === "No"}
            />
            <span className="radio_text"> No</span>
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
  );
}
export default WeightAssessment;
