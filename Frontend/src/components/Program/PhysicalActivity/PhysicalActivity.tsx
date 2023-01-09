import React, { useEffect } from "react";
import { Button, Checkbox, Radio, Space } from "antd";
import {
  PhysicalActivityType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

function PhysicalActivity({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { physical_activities: storePhysicalActivity },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [physicalActivity, setPhysicalActivity] =
    React.useState<PhysicalActivityType>(storePhysicalActivity);

  const [state, setState] = React.useState<any>({
    showElement: Boolean(physicalActivity?.days_of_exercise >= "1"),
  });

  /* Clear fields or show Fields when value in input is updated */
  useEffect(() => {
    const show = physicalActivity?.days_of_exercise >= "1";
    setState({ state, showElement: show });

    if (physicalActivity?.days_of_exercise < "1") {
      setPhysicalActivity({
        ...physicalActivity,
        mins_of_exercise: "",
        exercise_intensity: "",
      });
    } else {
      setPhysicalActivity({
        ...physicalActivity,
        does_not_apply: "",
      });
    }
  }, [physicalActivity?.days_of_exercise]);

  /* Use Effect to clear fields data when does not apply is checked */
  useEffect(() => {
    const doesnotApply = physicalActivity?.does_not_apply;

    if (doesnotApply === "0") {
      setState({ state, showElement: false });
      setPhysicalActivity({
        ...physicalActivity,
        days_of_exercise: "",
        mins_of_exercise: "",
        exercise_intensity: "",
      });
    }
  }, [physicalActivity?.does_not_apply]);

  function handleChange(e: any) {
    const { value } = e.target;

    setPhysicalActivity({
      ...physicalActivity,
      [e.target.name]: value,
    });
    if (e.target.name === "days_of_exercise") {
      const isShow = Number(value) >= 1;
      setState({ ...state, showElement: isShow });
    }
  }
  function handleMinChange(e: any) {
    const value = e.target.value.replace(/[^0-9\s]/g, "");

    setPhysicalActivity({
      ...physicalActivity,
      [e.target.name]: value,
    });
  }

  function doesNotApply(e: any) {
    const value = e.target.checked === true ? e.target.value : "";

    setPhysicalActivity({
      ...physicalActivity,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const physicalScreening = { ...physicalActivity };
    Object.assign(physicalScreening, completed);

    const response = await saveQuestionairsData(
      "physical_activities",
      physicalScreening
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
    const physicalScreening = { ...physicalActivity };
    Object.assign(physicalScreening, completed);

    const response = await saveQuestionairsData(
      "physical_activities",
      physicalScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Physical Activity</h2>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <div className="mb-3">
            <div>
              <label className="question-text">
                In the past 7 days, how many days did you exercise?
              </label>
              <input
                type="number"
                min="0"
                max="7"
                name="days_of_exercise"
                className="form-control"
                onChange={handleChange}
                placeholder="Days"
                value={physicalActivity?.days_of_exercise}
              />
            </div>
          </div>

          <div
            id="results"
            className={state.showElement ? "d-block mb-3" : "d-none"}
          >
            <div className="mb-3">
              <label className="question-text">
                On days when you exercised, for how long did you exercise (in
                minutes)?
              </label>
              <input
                onChange={handleMinChange}
                type="text"
                min="0"
                name="mins_of_exercise"
                className="form-control"
                placeholder="Minutes per day"
                value={physicalActivity?.mins_of_exercise}
              />
            </div>

            <div className="mb-3">
              <div>
                <label className="question-text">
                  How intense was your typical exercise?
                </label>

                <div>
                  <Radio.Group
                    name="exercise_intensity"
                    onChange={(e) => handleChange(e)}
                    value={physicalActivity?.exercise_intensity}
                  >
                    <Space direction="vertical">
                      <Radio value="light">
                        Light (like stretching or slow walking)
                      </Radio>
                      <Radio value="moderate">
                        Moderate (like stretching or slow walking)
                      </Radio>
                      <Radio value="heavy">
                        Heavy (like stretching or slow walking)
                      </Radio>
                      <Radio value="veryheavy">
                        Very Heavy (like stretching or slow walking)
                      </Radio>
                      <Radio value="noexercise">
                        I am currently not exercising
                      </Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <Checkbox
                className="mr-2"
                name="does_not_apply"
                value="0"
                checked={physicalActivity?.does_not_apply === "0"}
                onChange={doesNotApply}
              />
              <label className="question-text"> Does not apply </label>
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
export default PhysicalActivity;
