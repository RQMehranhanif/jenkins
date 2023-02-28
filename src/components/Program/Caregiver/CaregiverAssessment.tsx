import React, { useEffect, useState } from "react";
import { Button, Radio, Space } from "antd";
import {
  CaregiverAssesmentType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

const CaregiverAssessment = ({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) => {
  const {
    question: { caregiver_assessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [caregiver, setCaregiver] =
    React.useState<CaregiverAssesmentType>(caregiver_assessment);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (
      caregiver?.every_day_activities === "Yes" ||
      caregiver?.medications === "Yes"
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [caregiver?.every_day_activities, caregiver?.medications]);

  const options = ["Yes", "No"];
  const caregiverSupport = ["One", "More then one"];

  function valueChange(e: any) {
    const value = e.target.value;

    setCaregiver({
      ...caregiver,
      [e.target.name]: value,
    });
  }

  /* Screening Not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const careGiver = { ...caregiver };
    Object.assign(careGiver, completed);

    const response = await saveQuestionairsData(
      "caregiver_assessment",
      careGiver
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
    const careGiver = { ...caregiver };
    Object.assign(careGiver, completed);

    const response = await saveQuestionairsData(
      "caregiver_assessment",
      careGiver
    );

    console.log("response data is : ", response);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Caregiver Assessment</h2>
        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <label className="question-text">
              In the past 7 days, did you need help from others to perform every
              day activities such as eating, getting dressed, grooming, bathing,
              walking or using the toilet?
            </label>{" "}
            <br />
            <Radio.Group
              name="every_day_activities"
              value={caregiver?.every_day_activities}
              onChange={(e) => valueChange(e)}
            >
              <Space direction="vertical">
                {options.map((item, key) => (
                  <Radio value={item} key={key}>
                    {item}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
          <div className="col-lg-6 md-6 sm-12">
            <label className="question-text">
              In the past 7 days, did you need help from others to take care of
              things such as laundry, house-keeping, banking, shopping, using
              the telephone, food preparation, transportation or taking your own
              medications?
            </label>{" "}
            <br />
            <Radio.Group
              name="medications"
              value={caregiver?.medications}
              data-tag2={caregiver?.medications}
              onChange={(e) => valueChange(e)}
            >
              <Space direction="vertical">
                {options.map((item, key) => (
                  <Radio value={item} key={key}>
                    {item}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <div id="results" className={show ? "d-block" : "d-none"}>
              <label className="question-text">
                Do You have a Care giver to help take care of ADLs?
              </label>{" "}
              <br />
              <Radio.Group
                name="adls"
                value={caregiver?.adls}
                onChange={valueChange}
              >
                <Space direction="vertical">
                  {caregiverSupport.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
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
export default CaregiverAssessment;
