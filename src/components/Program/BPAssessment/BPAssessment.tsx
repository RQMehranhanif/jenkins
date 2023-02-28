import React from "react";
import { Button, DatePicker, Space } from "antd";
import {
  BpAssessmentType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import moment from "moment";
import { OpenNotification } from "./../../../Utilties/Utilties";

function BPAssessment({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { bp_assessment: storeBpAssessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [bpAssessment, setBpAssessment] =
    React.useState<BpAssessmentType>(storeBpAssessment);

  const dateFormat = "MM/DD/YYYY";
  const dates = {
    bp_date: bpAssessment?.bp_date
      ? moment(bpAssessment?.bp_date, dateFormat)
      : undefined,
  };

  function valueChange(e: any) {
    const { value } = e.target;
    const re = /^[0-9 ]/;
    if (value === "" || re.test(value)) {
      setBpAssessment({
        ...bpAssessment,
        [e.target.name]: value,
      });
    }
  }

  function bpAssessmentDate(name: string, value: string) {
    setBpAssessment({
      ...bpAssessment,
      [name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const bpAssessmentScreening = { ...bpAssessment };
    Object.assign(bpAssessmentScreening, completed);

    const response = await saveQuestionairsData(
      "bp_assessment",
      bpAssessmentScreening
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
    const bpAssessmentScreening = { ...bpAssessment };
    Object.assign(bpAssessmentScreening, completed);

    const response = await saveQuestionairsData(
      "bp_assessment",
      bpAssessmentScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">BP Assessment</h2>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">BP ?</label>
          <input
            type="text"
            className="form-control"
            name="bp_value"
            onChange={valueChange}
            placeholder="BP e.g (120/90)"
            value={bpAssessment?.bp_value}
          />
        </div>
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">BP Date</label>
          <br />

          <DatePicker
            name="bp_date"
            className="form-control"
            value={dates.bp_date}
            placeholder={"Select date"}
            onChange={(e, datestring) =>
              bpAssessmentDate("bp_date", datestring)
            }
            format={dateFormat}
            style={{ width: "100%" }}
          />
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
export default BPAssessment;
