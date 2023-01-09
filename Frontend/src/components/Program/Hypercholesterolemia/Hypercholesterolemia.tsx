import React from "react";
import { Button, DatePicker, Radio, Space } from "antd";
import { OpenNotification } from "./../../../Utilties/Utilties";
import {
  HyperCholestrolemiaType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import moment from "moment";

const Hypercholesterolemia = ({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) => {
  const {
    question: { hypercholestrolemia },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [hyper, setHyper] =
    React.useState<HyperCholestrolemiaType>(hypercholestrolemia);

  const options = ["Yes", "No"];
  const dateFormat = "MM/DD/YYYY";

  /* FLU VACCINE STATE CONST */
  const [showStatinAndLdlQuestion, setShowStatinAndLdlQuestion] =
    React.useState<boolean>(Boolean(hyper?.assesment_done === "No") ?? false);

  React.useEffect(() => {
    const assessmentDone = hyper?.assesment_done;

    if (assessmentDone === "Yes") {
      setHyper({
        ...hyper,
        statin_intensity: "",
        ldl_goal: "",
      });
    }
    setShowStatinAndLdlQuestion(Boolean(assessmentDone === "No"));
  }, [hyper?.assesment_done]);

  function valueChange(e: any) {
    const value = e.target.value;
    setHyper({
      ...hyper,
      [e.target.name]: value,
    });
  }

  function dateChange(name: string, value: string) {
    setHyper({
      ...hyper,
      [name]: value,
    });
  }

  const dates = {
    ur_hyperlipidemia_start_date: hyper?.ur_hyperlipidemia_start_date
      ? moment(hyper?.ur_hyperlipidemia_start_date)
      : undefined,
    ur_hyperlipidemia_end_date: hyper?.ur_hyperlipidemia_end_date
      ? moment(hyper?.ur_hyperlipidemia_start_date)
      : undefined,
    el_cardio_start_date: hyper?.el_cardio_start_date
      ? moment(hyper?.el_cardio_start_date)
      : undefined,
    el_cardio_end_date: hyper?.el_cardio_end_date
      ? moment(hyper?.el_cardio_end_date)
      : undefined,
    ui_controlling_start_date: hyper?.ui_controlling_start_date
      ? moment(hyper?.ui_controlling_start_date)
      : undefined,
    ui_controlling_end_date: hyper?.ui_controlling_end_date
      ? moment(hyper?.ui_controlling_end_date)
      : undefined,
    ue_exercise_start_date: hyper?.ue_exercise_start_date
      ? moment(hyper?.ue_exercise_start_date)
      : undefined,
    ue_exercise_end_date: hyper?.ue_exercise_end_date
      ? moment(hyper?.ue_exercise_end_date)
      : undefined,
  };

  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const hyperCholesterolemia = { ...hyper };
    Object.assign(hyperCholesterolemia, completed);

    const response = await saveQuestionairsData(
      "hypercholestrolemia",
      hyperCholesterolemia
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment complted */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const hyperCholesterolemia = { ...hyper };
    Object.assign(hyperCholesterolemia, completed);

    const response = await saveQuestionairsData(
      "hypercholestrolemia",
      hyperCholesterolemia
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };
  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Hypercholesterolemia</h2>

        <div className="mb-5">
          {/* Assessment done in last 1 year */}
          <div className="mb-3">
            <div>
              <label className="question-text">
                Has Hypercholesterolemia assessment done in this calendar year
                or in last 1 year?
              </label>
            </div>
            <Radio.Group
              name="assesment_done"
              value={hyper?.assesment_done}
              onChange={(e) => {
                valueChange(e);
              }}
            >
              <Space direction="horizontal">
                {options.map((item, key) => (
                  <Radio value={item} key={key}>
                    {item}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>

          {showStatinAndLdlQuestion && (
            <>
              {/* Statin Question */}
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    Is this Patient on Moderate to High Intensity statin?
                  </label>
                </div>
                <Radio.Group
                  name="statin_intensity"
                  value={hyper?.statin_intensity}
                  onChange={(e) => valueChange(e)}
                >
                  <Space direction="horizontal">
                    {options.map((item, key) => (
                      <Radio value={item} key={key}>
                        {item}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>

              {/* Patients LDL at GOAL */}
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    Is this patient’s LDL at Goal?
                  </label>
                </div>
                <Radio.Group
                  name="ldl_goal"
                  value={hyper?.ldl_goal}
                  onChange={(e) => valueChange(e)}
                >
                  <Space direction="horizontal">
                    {options.map((item, key) => (
                      <Radio value={item} key={key}>
                        {item}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </>
          )}
        </div>

        <div className="row mb-2">
          <div className="col-6">
            <label>
              <b>Treatment Goals</b>
            </label>
          </div>
          <div className="col-3">
            <label>
              <b>Start Date</b>
            </label>
          </div>
          <div className="col-3">
            <label>
              <b>End Date</b>
            </label>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p>
              To develope an understanding regarding risk factors and monitoring
              for Hyperlipidemia.
            </p>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="ur_hyperlipidemia_start_date"
              value={dates?.ur_hyperlipidemia_start_date}
              onChange={(e, datestring) =>
                dateChange("ur_hyperlipidemia_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="ur_hyperlipidemia_end_date"
              value={dates?.ur_hyperlipidemia_end_date}
              onChange={(e, datestring) =>
                dateChange("ur_hyperlipidemia_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p>To understand the effect of Lipids on Cardiovascular System</p>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="el_cardio_start_date"
              value={dates?.el_cardio_start_date}
              onChange={(e, datestring) =>
                dateChange("el_cardio_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="el_cardio_end_date"
              value={dates?.el_cardio_end_date}
              onChange={(e, datestring) =>
                dateChange("el_cardio_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p>
              To understand the importance of healthy diet in controlling Lipids
            </p>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="ui_controlling_start_date"
              value={dates?.ui_controlling_start_date}
              onChange={(e, datestring) =>
                dateChange("ui_controlling_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="ui_controlling_end_date"
              value={dates?.ui_controlling_end_date}
              onChange={(e, datestring) =>
                dateChange("ui_controlling_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p>To understand the effect of Exercise on Lipids</p>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="ue_exercise_start_date"
              value={dates?.ue_exercise_start_date}
              onChange={(e, datestring) =>
                dateChange("ue_exercise_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="ue_exercise_end_date"
              value={dates?.ue_exercise_end_date}
              onChange={(e, datestring) =>
                dateChange("ue_exercise_end_date", datestring)
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
    </>
  );
};
export default Hypercholesterolemia;
