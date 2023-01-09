import React from "react";
import { Button, Radio, Space } from "antd";
import { useAppSelector } from "../../../hooks/hooks";

import {
  CognitiveAssessmentType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";

import { RootState } from "@/store/store";
import { OpenNotification } from "./../../../Utilties/Utilties";

function CognitiveAssesment({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { cognitive_assessment: storeCognitiveAssessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [cognitiveAssessment, setCognitiveAssessment] =
    React.useState<CognitiveAssessmentType>(storeCognitiveAssessment);

  function valueChange(e: any) {
    const { value } = e.target;
    setCognitiveAssessment({
      ...cognitiveAssessment,
      [e.target.name]: value,
    });
  }
  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const cogAssessment = { ...cognitiveAssessment };
    Object.assign(cogAssessment, completed);

    const response = await saveQuestionairsData(
      "cognitive_assessment",
      cogAssessment
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
    const cogAssessment = { ...cognitiveAssessment };
    Object.assign(cogAssessment, completed);

    const response = await saveQuestionairsData(
      "cognitive_assessment",
      cogAssessment
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Cognitive Assessment</h2>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <div className="mb-3">
            <div>
              <label className="question-text">What year is it?</label>
            </div>
            <div>
              <Radio.Group
                name="year_recalled"
                onChange={(e) => valueChange(e)}
                value={cognitiveAssessment?.year_recalled}
              >
                <Space direction="vertical">
                  <Radio value="correct">Correct</Radio>
                  <Radio value="incorrect">Incorrect</Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">What month is it?</label>
            </div>
            <div>
              <Radio.Group
                name="month_recalled"
                onChange={(e) => valueChange(e)}
                value={cognitiveAssessment?.month_recalled}
              >
                <Space direction="vertical">
                  <Radio value="correct">Correct</Radio>
                  <Radio value="incorrect">Incorrect</Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <h5 style={{ marginTop: "10px" }}>
                Give the patient an address phrase to remember with 5
                components,
                <b>eg John, Smith, 42, High St, Bedford</b>
              </h5>
              <label className="question-text">
                About what time is it (within 1 hour) ?
              </label>
            </div>
            <div>
              <Radio.Group
                name="hour_recalled"
                onChange={(e) => valueChange(e)}
                value={cognitiveAssessment?.hour_recalled}
              >
                <Space direction="vertical">
                  <Radio value="correct">Correct</Radio>
                  <Radio value="incorrect">Incorrect</Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                Count backwards from 20-1.
              </label>
            </div>
            <div>
              <Radio.Group
                name="reverse_count"
                onChange={(e) => valueChange(e)}
                value={cognitiveAssessment?.reverse_count}
              >
                <Space direction="vertical">
                  <Radio value="correct">Correct</Radio>
                  <Radio value="1 error">1 Error</Radio>
                  <Radio value="more than 1 error">More Than 1 Error</Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                Say the months of the year in reverse.
              </label>
            </div>

            <div>
              <Radio.Group
                name="reverse_month"
                onChange={(e) => valueChange(e)}
                value={cognitiveAssessment?.reverse_month}
              >
                <Space direction="vertical">
                  <Radio value="Correct">Correct</Radio>
                  <Radio value="1 Error">1 Error</Radio>
                  <Radio value="more than 1 error">More Than 1 Error</Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                Repeat address phrase <b>John, Smith, 42, High St, Bedford</b>
              </label>
            </div>

            <div>
              <Radio.Group
                name="address_recalled"
                onChange={(e) => valueChange(e)}
                value={cognitiveAssessment?.address_recalled}
              >
                <Space direction="vertical">
                  <Radio value="correct">Correct</Radio>
                  <Radio value="1 error">1 Error</Radio>
                  <Radio value="2 error">2 Error</Radio>
                  <Radio value="3 error">3 Error</Radio>
                  <Radio value="4 error">4 Error</Radio>
                  <Radio value="All wrong">All Wrong</Radio>
                </Space>
              </Radio.Group>
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
  );
}
export default CognitiveAssesment;
