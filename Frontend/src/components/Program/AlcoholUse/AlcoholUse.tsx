import React, { useEffect } from "react";
import { Button, Radio, Space } from "antd";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

import {
  QuestionaireStepProps,
  AlcoholUseType,
} from "@/Types/QuestionaireTypes";

const AlcoholUse: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const {
    question: { alcohol_use },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const defaultOptions = ["Yes", "No"];
  const occasions = [
    "Never",
    "Once during the week",
    "2–3 times during the week",
    "More than 3 times during the week",
  ];

  const [alcohol, setAlcohol] = React.useState<AlcoholUseType>(alcohol_use);

  const [state, setState] = React.useState<any>({
    showElement: Boolean(alcohol?.days_of_alcoholuse >= "1"),
  });

  /* Clear fields or show Fields when value in input is updated */
  useEffect(() => {
    const show = alcohol?.days_of_alcoholuse >= "1";
    setState({ state, showElement: show });

    if (alcohol?.days_of_alcoholuse < "1") {
      setAlcohol({
        ...alcohol,
        drinks_per_day: "",
        drinks_per_occasion: "",
        average_usage: "",
        drink_drive_yes: "",
      });
    }
  }, [alcohol?.days_of_alcoholuse]);

  function valueChange(e: any) {
    const { value } = e.target;
    setAlcohol({
      ...alcohol,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const alcoholScreening = { ...alcohol };
    Object.assign(alcoholScreening, completed);

    const response = await saveQuestionairsData(
      "alcohol_use",
      alcoholScreening
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
    const alcoholScreening = { ...alcohol };
    Object.assign(alcoholScreening, completed);

    const response = await saveQuestionairsData(
      "alcohol_use",
      alcoholScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <>
      {/* <Alcohol Use /> */}
      <div className="question-card">
        <h2 className="stepsheading">Alcohol Use</h2>
        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <div className="mb-3">
              <div>
                <label className="question-text">
                  In the past 7 days,on how many days did you drink alcohol?
                </label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  name="days_of_alcoholuse"
                  className="form-control"
                  onChange={valueChange}
                  placeholder="Days of alcohol usage"
                  value={alcohol?.days_of_alcoholuse}
                />
              </div>
            </div>

            <div
              id="results"
              className={state.showElement ? "d-block" : "d-none"}
            >
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    How many drinks per day?
                  </label>
                  <input
                    type="number"
                    min="0"
                    onChange={valueChange}
                    name="drinks_per_day"
                    value={alcohol?.drinks_per_day}
                    className="form-control"
                    placeholder="Drinks per day"
                  />
                </div>
              </div>

              <div className="mb-3">
                <div>
                  <label className="question-text">
                    On days when you drink alcohol, how often did you take it on
                    one occasion?
                  </label>
                  <input
                    type="number"
                    min="0"
                    onChange={valueChange}
                    name="drinks_per_occasion"
                    className="form-control"
                    value={alcohol?.drinks_per_occasion}
                    placeholder="Drinks per occasion"
                  />
                </div>
              </div>

              <div className="mb-3">
                <div>
                  <Radio.Group
                    name="average_usage"
                    onChange={(e) => valueChange(e)}
                    value={alcohol?.average_usage}
                  >
                    <Space direction="horizontal">
                      {occasions.map((item, key) => (
                        <Radio value={item} key={key}>
                          {item}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </div>
              </div>

              <div className="">
                <div>
                  <label className="question-text">
                    Do you ever drive after drinking, or ride with a driver who
                    has been drinking?
                  </label>
                </div>

                <div>
                  <Radio.Group
                    name="drink_drive_yes"
                    onChange={(e) => valueChange(e)}
                    value={alcohol?.drink_drive_yes}
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
export default AlcoholUse;
