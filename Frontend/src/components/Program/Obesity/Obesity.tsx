import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { Button, DatePicker, Input, Radio, Space } from "antd";
import { OpenNotification } from "./../../../Utilties/Utilties";
import React from "react";
import {
  ObesityType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import moment from "moment";

const Obesity: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const defaultOptions = ["Yes", "No"];
  const dateFormat = "MM/DD/YYYY";

  const {
    question: { obesity_assessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [obesity, setObesity] = React.useState<ObesityType>(obesity_assessment);
  const [state, setState] = React.useState<any>({
    element: false,
    element2: false,
  });

  const dates = {
    awareness_about_bmi_start_date: obesity?.awareness_about_bmi_start_date
      ? moment(obesity?.awareness_about_bmi_start_date)
      : undefined,
    awareness_about_bmi_end_date: obesity?.awareness_about_bmi_end_date
      ? moment(obesity?.awareness_about_bmi_end_date)
      : undefined,

    need_of_weight_loss_start_date: obesity?.need_of_weight_loss_start_date
      ? moment(obesity?.need_of_weight_loss_start_date)
      : undefined,
    need_of_weight_loss_end_date: obesity?.need_of_weight_loss_end_date
      ? moment(obesity?.need_of_weight_loss_end_date)
      : undefined,

    imp_of_healthy_weight_start_date: obesity?.imp_of_healthy_weight_start_date
      ? moment(obesity?.imp_of_healthy_weight_start_date)
      : undefined,
    imp_of_healthy_weight_end_date: obesity?.imp_of_healthy_weight_end_date
      ? moment(obesity?.imp_of_healthy_weight_end_date)
      : undefined,

    imp_of_healthy_eating_start_date: obesity?.imp_of_healthy_eating_start_date
      ? moment(obesity?.imp_of_healthy_eating_start_date)
      : undefined,
    imp_of_healthy_eating_end_date: obesity?.imp_of_healthy_eating_end_date
      ? moment(obesity?.imp_of_healthy_eating_end_date)
      : undefined,

    diet_assist_start_date: obesity?.diet_assist_start_date
      ? moment(obesity?.diet_assist_start_date)
      : undefined,
    diet_assist_end_date: obesity?.diet_assist_end_date
      ? moment(obesity?.diet_assist_end_date)
      : undefined,

    moderate_activity_inaweek_start_date:
      obesity?.moderate_activity_inaweek_start_date
        ? moment(obesity?.moderate_activity_inaweek_start_date)
        : undefined,
    moderate_activity_inaweek_end_date:
      obesity?.moderate_activity_inaweek_end_date
        ? moment(obesity?.moderate_activity_inaweek_end_date)
        : undefined,

    referred_dietician_start_date: obesity?.referred_dietician_start_date
      ? moment(obesity?.referred_dietician_start_date)
      : undefined,
    referred_dietician_end_date: obesity?.referred_dietician_end_date
      ? moment(obesity?.referred_dietician_end_date)
      : undefined,
  };

  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const obesityAssessment = { ...obesity };
    Object.assign(obesityAssessment, completed);

    const response = await saveQuestionairsData("obesity", obesityAssessment);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const obesityAssessment = { ...obesity };
    Object.assign(obesityAssessment, completed);

    await saveQuestionairsData("obesity", obesityAssessment);
    handleNextStep && handleNextStep();
  };

  const handleshow = (e: any) => {
    if (e.target.value === "Yes") {
      setState({ ...state, element: true, element2: false });
    } else {
      setState({ ...state, element: false, element2: true });
    }
  };

  const handleshow2 = (e: any) => {
    if (e.target.value === "Yes") {
      setState({ ...state, element: true });
    } else {
      setState({ ...state, element: false });
    }
  };
  const valuechange = (e: any) => {
    const value = e.target.value;

    setObesity({
      ...obesity,
      [e.target.name]: value,
    });
  };

  function dateChange(name: string, value: string) {
    setObesity({
      ...obesity,
      [name]: value,
    });
  }
  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Obesity</h2>

        <div className="row mb-2">
          <div className=" col-lg-12">
            <div className="col-lg-6 md-6 sm-12">
              <label className="question-text">
                Have you gained weight since last visit?
              </label>
              <Radio.Group
                name="gained_weight"
                onChange={(e) => {
                  handleshow(e), valuechange(e);
                }}
                className="ml-3"
                value={obesity?.gained_weight}
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

        <div
          id="results"
          className={state.element2 ? "d-block" : "d-none"}
          style={{ marginBottom: "10px" }}
        >
          <div className="row">
            <div className="col-lg-6 md-6 sm-12">
              <label className="question-text">
                Have you lost weight since last visit ?
              </label>
              <Radio.Group
                name="lost_weight"
                onChange={(e) => {
                  handleshow2(e), valuechange(e);
                }}
                className="ml-3"
                value={obesity?.lost_weight}
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
        <div
          id="results"
          className={state.element ? "d-block" : "d-none"}
          style={{ marginBottom: "10px" }}
        >
          <div className="row">
            <div className="col-lg-6 md-6 sm-12">
              <label className="question-text">How much</label>
              <Input
                onChange={(e) => valuechange(e)}
                type="number"
                min="0"
                name="bmi"
                className="form-control"
                placeholder="BMI"
                value={obesity?.bmi}
              />
            </div>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-12">
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
              <div className="col-6">
                <label htmlFor="">
                  To gain education and awareness about BMI and current BMI
                  range.
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="awareness_about_bmi_start_date"
                  placeholder={"Start Date"}
                  value={dates.awareness_about_bmi_start_date}
                  onChange={(e, datestring) =>
                    dateChange("awareness_about_bmi_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="awareness_about_bmi_end_date"
                  placeholder={"End Date"}
                  value={dates.awareness_about_bmi_end_date}
                  onChange={(e, datestring) =>
                    dateChange("awareness_about_bmi_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the need for weight loss.
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="need_of_weight_loss_start_date"
                  placeholder={"Start Date"}
                  value={dates.need_of_weight_loss_start_date}
                  onChange={(e, datestring) =>
                    dateChange("need_of_weight_loss_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="need_of_weight_loss_end_date"
                  placeholder={"End Date"}
                  value={dates.need_of_weight_loss_end_date}
                  onChange={(e, datestring) =>
                    dateChange("need_of_weight_loss_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the importance of maintaining a healthy weight.
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="imp_of_healthy_weight_start_date"
                  placeholder={"Start Date"}
                  value={dates.imp_of_healthy_weight_start_date}
                  onChange={(e, datestring) =>
                    dateChange("imp_of_healthy_weight_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="imp_of_healthy_weight_end_date"
                  placeholder={"End Date"}
                  value={dates.imp_of_healthy_weight_end_date}
                  onChange={(e, datestring) =>
                    dateChange("imp_of_healthy_weight_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To understand the importance of healthy eating habits.
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="imp_of_healthy_eating_start_date"
                  placeholder={"Start Date"}
                  value={dates.imp_of_healthy_eating_start_date}
                  onChange={(e, datestring) =>
                    dateChange("imp_of_healthy_eating_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="imp_of_healthy_eating_end_date"
                  placeholder={"End Date"}
                  value={dates.imp_of_healthy_eating_end_date}
                  onChange={(e, datestring) =>
                    dateChange("imp_of_healthy_eating_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To receive education regarding required changes in diet that
                  would assist with weight loss.
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="diet_assist_start_date"
                  placeholder={"Start Date"}
                  value={dates.diet_assist_start_date}
                  onChange={(e, datestring) =>
                    dateChange("diet_assist_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="diet_assist_end_date"
                  placeholder={"End Date"}
                  value={dates.diet_assist_end_date}
                  onChange={(e, datestring) =>
                    dateChange("diet_assist_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  To engage in 150 minutes of moderate intensity physical
                  activity per week.
                </label>
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="moderate_activity_inaweek_start_date"
                  placeholder={"Start Date"}
                  value={dates.moderate_activity_inaweek_start_date}
                  onChange={(e, datestring) =>
                    dateChange(
                      "moderate_activity_inaweek_start_date",
                      datestring
                    )
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="moderate_activity_inaweek_end_date"
                  placeholder={"End Date"}
                  value={dates.moderate_activity_inaweek_end_date}
                  onChange={(e, datestring) =>
                    dateChange("moderate_activity_inaweek_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">To be referred to a dietician.</label>
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="referred_dietician_start_date"
                  placeholder={"Start Date"}
                  value={dates.referred_dietician_start_date}
                  onChange={(e, datestring) =>
                    dateChange("referred_dietician_start_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-3">
                <DatePicker
                  className="form-control"
                  name="referred_dietician_end_date"
                  placeholder={"End Date"}
                  value={dates.referred_dietician_end_date}
                  onChange={(e, datestring) =>
                    dateChange("referred_dietician_end_date", datestring)
                  }
                  format={dateFormat}
                  style={{ width: "100%" }}
                />
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
export default Obesity;
