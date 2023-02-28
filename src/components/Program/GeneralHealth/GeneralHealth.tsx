import React from "react";
import { Button, Divider, Radio, Space } from "antd";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import {
  GeneralHealthType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";

function GeneralHealth({
  handleNextStep,
  saveQuestionairsData,
  handlePreviousStep,
}: QuestionaireStepProps) {
  const {
    question: {
      general_health: storeGeneralHealth,
      social_emotional_support: storeSocialSupport,
      high_stress: storeHighStress,
      pain: storePain,
    },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [generalHealth, setGeneralHealth] =
    React.useState<GeneralHealthType>(storeGeneralHealth);
  const [pain, setPain] = React.useState<GeneralHealthType>(storePain);
  const [socialsupport, setSocialSupport] =
    React.useState<GeneralHealthType>(storeSocialSupport);
  const [highstress, setHighStress] =
    React.useState<GeneralHealthType>(storeHighStress);

  function painvalueChange(e: any) {
    const { value } = e.target;
    setPain({
      ...pain,
      [e.target.name]: value,
    });
  }
  function socialsupportvalueChange(e: any) {
    const { value } = e.target;
    setSocialSupport({
      ...socialsupport,
      [e.target.name]: value,
    });
  }
  function highstresspainvalueChange(e: any) {
    const { value } = e.target;
    setHighStress({
      ...highstress,
      [e.target.name]: value,
    });
  }
  function generalhealthvalueChange(e: any) {
    const { value } = e.target;
    setGeneralHealth({
      ...generalHealth,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const healthScreening = { ...generalHealth };
    Object.assign(healthScreening, completed);

    const data = {
      general_health: healthScreening,
      social_emotional_support: socialsupport,
      high_stress: highstress,
      pain,
    };

    const response = await saveQuestionairsData("", "", data);
    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  /* Screening Completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const healthScreening = { ...generalHealth };
    Object.assign(healthScreening, completed);

    const data = {
      general_health: healthScreening,
      social_emotional_support: socialsupport,
      high_stress: highstress,
      pain,
    };

    const response = await saveQuestionairsData("", "", data);
    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">General Health</h2>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <Space
            direction="vertical"
            size="middle"
            style={{
              display: "flex",
            }}
          >
            <div className="mb-5">
              <h6>Pain</h6>
              <div>
                <label className="question-text">
                  In the past 7 days, how much pain have you felt?
                </label>
              </div>
              <div>
                <Radio.Group
                  name="pain_felt"
                  onChange={(e) => painvalueChange(e)}
                  value={pain?.pain_felt}
                >
                  <Space direction="vertical">
                    <Radio value="None">None</Radio>
                    <Radio value="Some">Some</Radio>
                    <Radio value="Alot">Alot</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="">
              <h6>General Health</h6>
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    In general, would you say your health is?
                  </label>
                </div>

                <div>
                  <Radio.Group
                    name="health_level"
                    onChange={(e) => generalhealthvalueChange(e)}
                    value={generalHealth?.health_level}
                  >
                    <Space direction="vertical">
                      <Radio value="Excellent">Excellent</Radio>
                      <Radio value="Very Good">Very Good</Radio>
                      <Radio value="Good">Good</Radio>
                      <Radio value="Fair">Fair</Radio>
                      <Radio value="Poor">Poor</Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </div>

              <div className="mb-3">
                <div>
                  <label className="question-text">
                    How would you describe the condition of your mouth and
                    teeth—including false teeth or dentures?
                  </label>
                </div>

                <div>
                  <Radio.Group
                    name="mouth_and_teeth"
                    onChange={(e) => generalhealthvalueChange(e)}
                    value={generalHealth?.mouth_and_teeth}
                  >
                    <Space direction="vertical">
                      <Radio value="Excellent">Excellent</Radio>
                      <Radio value="Very Good">Very Good</Radio>
                      <Radio value="Good">Good</Radio>
                      <Radio value="Fair">Fair</Radio>
                      <Radio value="Poor">Poor</Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </div>

              <div className="mb-3">
                <div>
                  <label className="question-text">
                    {" "}
                    Have your feelings caused you distress or interfered with
                    your ability to get along socially with family or friends?{" "}
                  </label>
                </div>

                <div>
                  <Radio.Group
                    name="feeling_caused_distress"
                    onChange={(e) => generalhealthvalueChange(e)}
                    value={generalHealth?.feeling_caused_distress}
                  >
                    <Space direction="vertical">
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </Space>
        </div>

        <div>
          <Divider
            type="vertical"
            style={{ height: "100%", background: "black" }}
          />
        </div>

        <div
          className="col-lg-4 md-4 sm-6" /* style={{ borderLeft: "1px solid #23468c" }} */
        >
          <Space
            direction="vertical"
            size="middle"
            style={{
              display: "flex",
            }}
          >
            <div className="mb-5">
              <h6>Social/Emotional Support</h6>
              <div>
                <label className="question-text">
                  How often do you get the social and emotional support you
                  need?
                </label>
              </div>

              <div>
                <Radio.Group
                  name="get_social_emotional_support"
                  onChange={(e) => socialsupportvalueChange(e)}
                  value={socialsupport?.get_social_emotional_support}
                >
                  <Space direction="vertical">
                    <Radio value="Always">Always</Radio>
                    <Radio value="Usually">Usually</Radio>
                    <Radio value="Sometimes">Sometimes</Radio>
                    <Radio value="Rarely">Rarely</Radio>
                    <Radio value="Never">Never</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="">
              <h6>High Stress</h6>
              <div>
                <label className="question-text">
                  How often is stress a problem for you in handling such things
                  as:
                </label>
                <ul className="list-unstyled">
                  <li>
                    <ul>
                      <li className="">Your health?</li>
                      <li className="">Your finances?</li>
                      <li className="">Your family or social relationships?</li>
                      <li className="">Your work?</li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div>
                <Radio.Group
                  name="stress_problem"
                  onChange={(e) => highstresspainvalueChange(e)}
                  value={highstress?.stress_problem}
                >
                  <Space direction="vertical">
                    <Radio value="Never or Rarely">Never or Rarely</Radio>
                    <Radio value="Sometimes">Sometimes</Radio>
                    <Radio value="Often">Often</Radio>
                    <Radio value="Always">Always</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </Space>
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
export default GeneralHealth;
