import React from "react";
import { Button, Radio, Space } from "antd";
import { LdctType, QuestionaireStepProps } from "@/Types/QuestionaireTypes";

import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "@/store/store";
import { OpenNotification } from "./../../../Utilties/Utilties";

const LDCT: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const {
    question: { ldct_counseling, tobacco_use },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const Symptoms = ["Yes", "No"];

  function valueChange(e: any) {
    const { value } = e.target;

    setLdct({
      ...ldctdata,
      [e.target.name]: value,
    });
  }

  const [ldctdata, setLdct] = React.useState<LdctType>(ldct_counseling);

  const SaveAndNext = async () => {
    Object.assign(ldctdata, { ["completed"]: "0" });
    const response = await saveQuestionairsData("ldct_counseling", ldctdata);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  const handleSave = async () => {
    Object.assign(ldctdata, { ["completed"]: "1" });

    const response = await saveQuestionairsData("ldct_counseling", ldctdata);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  React.useEffect(() => {
    const currentSmoker = tobacco_use?.smoked_in_thirty_days;
    if (currentSmoker === "Yes") {
      setLdct({
        ...ldctdata,
        current_quit_smoker: "Current smoker",
      });
    } else {
      const smokingStatus = ldctdata?.current_quit_smoker
        ? ldctdata?.current_quit_smoker
        : "Years since quit";
      setLdct({
        ...ldctdata,
        current_quit_smoker: smokingStatus,
      });
    }
  }, tobacco_use?.smoked_in_thirty_days);

  return (
    <div className="question-card">
      <h2 className="stepsheading">LDCT Counseling</h2>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">
            Sign and Symptoms of Lung Cancer?
          </label>{" "}
          <br />
          <Radio.Group
            name="cancer_symptoms"
            onChange={(e) => {
              valueChange(e);
            }}
            value={ldctdata?.cancer_symptoms}
          >
            <Space direction="horizontal">
              {Symptoms.map((item, key) => (
                <Radio value={item} key={key}>
                  {item}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">No of Pack-Year?</label> <br />
          <input
            type="text"
            className="form-control"
            disabled
            value={tobacco_use?.average_packs_per_year}
            onChange={valueChange}
            name="no_of_packs_year"
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">
            Current Smoker or Years since quit?
          </label>{" "}
          <br />
          <input
            type="text"
            className="form-control"
            placeholder="Current Smoker or Years since quit"
            onChange={valueChange}
            value={ldctdata?.current_quit_smoker}
            name="current_quit_smoker"
          />
        </div>
        <div className="col-lg-6 md-6 sm-12">
          <p>
            Patient Counseled that LDCT will help find the effect of Smoking on
            the Lungs and help identify Nodules or masses that might need a
            follow up. Advised the it has low dose radiation exposure. <br />
            Patient understand that we would need annual LDCT. Patient if needed
            will undergo treatment. <br />
            Patient counseled to quit smoking. Patient understand the importance
            of smoking abstinence.
          </p>
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
};
export default LDCT;
