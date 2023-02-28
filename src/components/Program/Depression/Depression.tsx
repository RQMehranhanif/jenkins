import React from "react";
import { Button, Radio, Space, Input } from "antd";
import {
  DepressionType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

const { TextArea } = Input;

function Depression({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { depression_phq9 },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [depressionPhq, setDepressionPhq] =
    React.useState<DepressionType>(depression_phq9);

  const AlmostOption = {
    "Almost all of the time": 3,
    "Most of the time": 2,
    "Some of the time": 1,
    "Almost never": 0,
  };

  function valueChange(e: any) {
    const { value } = e.target;
    setDepressionPhq({
      ...depressionPhq,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const depressionPHQ9 = { ...depressionPhq };
    Object.assign(depressionPHQ9, completed);

    const response = await saveQuestionairsData(
      "depression_phq9",
      depressionPHQ9
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
    const depressionPHQ9 = { ...depressionPhq };
    Object.assign(depressionPHQ9, completed);

    const response = await saveQuestionairsData(
      "depression_phq9",
      depressionPHQ9
    );
    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  let sum = 0;
  if (depressionPhq && Object.keys(depressionPhq).length > 0) {
    sum = Object.values(depressionPhq)?.reduce((a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a + b;
      } else {
        return a;
      }
    });
  }

  return (
    <div className="question-card">
      <div className="mb-2">
        <h2 className="stepsheading d-inline">Depression PHQ-9</h2>
        <h5 className="d-inline pl-2" style={{ fontSize: 18 }}>
          {" "}
          <b>Score: {sum}/27</b>
        </h5>
      </div>

      {/* Label */}
      <div className="mb-3">
        <b>
          <label className="question-text"> In the past two weeks </label>
        </b>
      </div>

      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <div className="mb-3">
            <div>
              <label className="question-text">
                How often have you felt down, depressed, or hopeless?
              </label>
            </div>
            <div>
              <Radio.Group
                name="feltdown_depressed_hopeless"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.feltdown_depressed_hopeless}
              >
                <Space direction="vertical">
                  {Object.entries(AlmostOption).map(([key, value]) => (
                    <Radio value={value} key={key}>
                      {key}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                How often have you felt little interest or pleasure in doing
                things?
              </label>
            </div>
            <div>
              <Radio.Group
                name="little_interest_pleasure"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.little_interest_pleasure}
              >
                <Space direction="vertical">
                  {Object.entries(AlmostOption).map(([key, value]) => (
                    <Radio value={value} key={key}>
                      {key}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                How often have you trouble falling or staying asleep, or
                sleeping too much?
              </label>
            </div>

            <div>
              <Radio.Group
                name="trouble_sleep"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.trouble_sleep}
              >
                <Space direction="vertical">
                  {Object.entries(AlmostOption).map(([key, value]) => (
                    <Radio value={value} key={key}>
                      {key}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                {" "}
                Feeling tired or having little energy?{" "}
              </label>
            </div>
            <div>
              <Radio.Group
                name="tired_little_energy"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.tired_little_energy}
              >
                <Space direction="vertical">
                  {Object.entries(AlmostOption).map(([key, value]) => (
                    <Radio value={value} key={key}>
                      {key}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                Poor appetite or overeating?
              </label>
            </div>

            <div>
              <Radio.Group
                name="poor_over_appetite"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.poor_over_appetite}
              >
                <Space direction="vertical">
                  {Object.entries(AlmostOption).map(([key, value]) => (
                    <Radio value={value} key={key}>
                      {key}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>

        <div className="col-lg-6 md-6 sm-12">
          <div className="mb-3">
            <div>
              <label className="question-text">
                {" "}
                How often have you felt bad about yourself that you are a
                failure or have let yourself or your family down?{" "}
              </label>
            </div>
            <div>
              <Radio.Group
                name="feeling_bad_failure"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.feeling_bad_failure}
              >
                <Space direction="vertical">
                  {Object.entries(AlmostOption).map(([key, value]) => (
                    <Radio value={value} key={key}>
                      {key}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                {" "}
                Trouble concentrating on things, such as reading the newspaper
                or watching television?{" "}
              </label>
            </div>
            <div>
              <Radio.Group
                name="trouble_concentrating"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.trouble_concentrating}
              >
                <Space direction="vertical">
                  {Object.entries(AlmostOption).map(([key, value]) => (
                    <Radio value={value} key={key}>
                      {key}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                {" "}
                How often have you moved or spoken so slowly that other people
                could have noticed, or How often have you been so fidgety or
                restless that you have been moving around a lot more than usual?{" "}
              </label>
            </div>

            <div>
              <Radio.Group
                name="slow_fidgety"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.slow_fidgety}
              >
                <Space direction="vertical">
                  {Object.entries(AlmostOption).map(([key, value]) => (
                    <Radio value={value} key={key}>
                      {key}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                How often have you thought you would be better off dead, or
                hurting yourself somehow?
              </label>
            </div>
            <div>
              <Radio.Group
                name="suicidal_thoughts"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.suicidal_thoughts}
              >
                <Space direction="vertical">
                  {Object.entries(AlmostOption).map(([key, value]) => (
                    <Radio value={value} key={key}>
                      {key}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                How often have you checked off problems that made it difficult
                for you to do your work, take care of things at home, or get
                along with other people?
              </label>
            </div>
            <div>
              <Radio.Group
                name="problem_difficulty"
                onChange={(e) => valueChange(e)}
                value={depressionPhq?.problem_difficulty}
              >
                <Space direction="vertical">
                  <Radio value="Extremely difficult">Extremely difficult</Radio>
                  <Radio value="Very difficult">Very difficult</Radio>
                  <Radio value="Somewhat difficult">Somewhat difficult</Radio>
                  <Radio value="Not difficult at all">
                    Not difficult at all
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">Comments</label>
          <TextArea
            name="comments"
            value={depressionPhq?.comments}
            onChange={(e) => valueChange(e)}
            placeholder="Controlled autosize"
            autoSize={{ minRows: 3, maxRows: 5 }}
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
export default Depression;
