import React from "react";
import { Button, Radio, Space } from "antd";
import {
  SeatBeltType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

const seatBeltOptions = ["Yes", "No"];

function SeatBeltUse({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { seatbelt_use: storeSeatBelt },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [seatBelt, setSeatBelt] = React.useState<SeatBeltType>(storeSeatBelt);
  function valueChange(e: any) {
    const { value } = e.target;

    setSeatBelt({
      ...seatBelt,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const seatBeltUse = { ...seatBelt };
    Object.assign(seatBeltUse, completed);

    const response = await saveQuestionairsData("seatbelt_use", seatBeltUse);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Screening Completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const seatBeltUse = { ...seatBelt };
    Object.assign(seatBeltUse, completed);

    const response = await saveQuestionairsData("seatbelt_use", seatBeltUse);
    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Seat Belt Use</h2>
      <div className="row mb-3">
        <div className="col-lg-6 md-6 sm-12">
          <div>
            <label className="question-text">
              Do you always fasten your seat belt when you are in a car?
            </label>
          </div>

          <div>
            <Radio.Group
              name="wear_seat_belt"
              value={seatBelt?.wear_seat_belt}
              onChange={valueChange}
            >
              <Space direction="horizontal">
                {seatBeltOptions.map((item, key) => (
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
  );
}

export default SeatBeltUse;
