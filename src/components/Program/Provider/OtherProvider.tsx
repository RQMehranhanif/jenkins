import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "@/store/store";
import { Button, Radio, Space } from "antd";
import {
  OtherProviderType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import React from "react";
import { OpenNotification } from "./../../../Utilties/Utilties";

const OtherProvider = ({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) => {
  const {
    question: { other_Provider },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [provider, setProvider] =
    React.useState<OtherProviderType>(other_Provider);

  const [state, setState] = React.useState({
    showElement: false,
  });

  const options = ["Yes", "No"];

  function valueChange(e: any) {
    const value = e.target.value;

    setProvider({
      ...provider,
      [e.target.name]: value,
    });
  }

  /* Screening not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const otherProvider = { ...provider };
    Object.assign(otherProvider, completed);

    const response = await saveQuestionairsData(
      "other_Provider",
      otherProvider
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  const handleSave = async () => {
    const completed = { completed: "1" };
    const otherProvider = { ...provider };
    Object.assign(otherProvider, completed);

    const response = await saveQuestionairsData(
      "other_Provider",
      otherProvider
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  const handleChange1 = (e: any) => {
    const value = e.target.value;

    if (value == "Yes") {
      setState({ ...state, showElement: true });
    } else {
      setState({ ...state, showElement: false });
    }
  };

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Other Providers</h2>
        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <label className="question-text">
              Do you see any other Provider beside PCP?
            </label>{" "}
            <br />
            <Radio.Group
              name="other_provider_beside_pcp"
              value={provider?.other_provider_beside_pcp}
              onChange={(e) => {
                valueChange(e);
                handleChange1(e);
              }}
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
            <div
              id="results"
              className={state.showElement ? "d-block" : "d-none"}
            >
              <label className="question-text">Name</label> <br />
              <input
                type="text"
                className="form-control"
                value={provider?.full_name}
                onChange={(e) => valueChange(e)}
                name="full_name"
              />
              <br />
              <label className="question-text">Speciality</label> <br />
              <input
                type="text"
                className="form-control"
                value={provider?.speciality}
                onChange={(e) => valueChange(e)}
                name="speciality"
              />
              <br />
            </div>
          </div>
        </div>
        <div className="row"></div>
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
export default OtherProvider;
