import React from "react";
import { Button, DatePicker, Radio, Space } from "antd";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";
import moment from "moment";
import {
  CongestiveHeartFailureType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";

const CongestiveHeartFailure = ({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) => {
  const {
    question: { cong_heart_failure },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [congestiveheartfaliure, setCongestiveHeartFaliure] =
    React.useState<CongestiveHeartFailureType>(cong_heart_failure);

  const defaultOptions = ["Yes", "No"];

  const dateFormat = "MM/DD/YYYY";

  const dates = {
    ge_chf_start_date: congestiveheartfaliure?.ge_chf_start_date
      ? moment(congestiveheartfaliure?.ge_chf_start_date)
      : undefined,
    ge_chf_end_date: congestiveheartfaliure?.ge_chf_end_date
      ? moment(congestiveheartfaliure?.ge_chf_end_date)
      : undefined,
    ui_smoke_cessation_start_date:
      congestiveheartfaliure?.ui_smoke_cessation_start_date
        ? moment(congestiveheartfaliure?.ui_smoke_cessation_start_date)
        : undefined,
    ui_smoke_cessation_end_date:
      congestiveheartfaliure?.ui_smoke_cessation_end_date
        ? moment(congestiveheartfaliure?.ui_smoke_cessation_end_date)
        : undefined,
    ui_sodium_diet_start_date: congestiveheartfaliure?.ui_sodium_diet_start_date
      ? moment(congestiveheartfaliure?.ui_sodium_diet_start_date)
      : undefined,
    ui_sodium_diet_end_date: congestiveheartfaliure?.ui_sodium_diet_end_date
      ? moment(congestiveheartfaliure?.ui_sodium_diet_end_date)
      : undefined,
    ui_fluid_restriction_start_date:
      congestiveheartfaliure?.ui_fluid_restriction_start_date
        ? moment(congestiveheartfaliure?.ui_fluid_restriction_start_date)
        : undefined,
    ui_fluid_restriction_end_date:
      congestiveheartfaliure?.ui_fluid_restriction_end_date
        ? moment(congestiveheartfaliure?.ui_fluid_restriction_end_date)
        : undefined,
    uid_weight_monitoring_start_date:
      congestiveheartfaliure?.uid_weight_monitoring_start_date
        ? moment(congestiveheartfaliure?.uid_weight_monitoring_start_date)
        : undefined,
    uid_weight_monitoring_end_date:
      congestiveheartfaliure?.uid_weight_monitoring_end_date
        ? moment(congestiveheartfaliure?.uid_weight_monitoring_end_date)
        : undefined,
    rs_excerbation_start_date: congestiveheartfaliure?.rs_excerbation_start_date
      ? moment(congestiveheartfaliure?.rs_excerbation_start_date)
      : undefined,
    rs_excerbation_end_date: congestiveheartfaliure?.rs_excerbation_end_date
      ? moment(congestiveheartfaliure?.rs_excerbation_end_date)
      : undefined,
    ri_adherence_start_date: congestiveheartfaliure?.ri_adherence_start_date
      ? moment(congestiveheartfaliure?.ri_adherence_start_date)
      : undefined,
    ri_adherence_end_date: congestiveheartfaliure?.ri_adherence_end_date
      ? moment(congestiveheartfaliure?.ri_adherence_end_date)
      : undefined,
    seek_help_start_date: congestiveheartfaliure?.seek_help_start_date
      ? moment(congestiveheartfaliure?.seek_help_start_date)
      : undefined,
    seek_help_end_date: congestiveheartfaliure?.seek_help_end_date
      ? moment(congestiveheartfaliure?.seek_help_end_date)
      : undefined,
  };

  const [showFollowUpFrequency, setShowFollowUpFrequency] =
    React.useState<boolean>(
      Boolean(congestiveheartfaliure?.follow_up_cardio === "Yes") ?? false
    );
  const [showNotSeeingCardiologist, setShowNotSeeingCardiologist] =
    React.useState<boolean>(
      Boolean(congestiveheartfaliure?.follow_up_cardio === "No") ?? false
    );
  const [showEchoDiagramAdviseBody, setShowEchoDiagramAdviseBody] =
    React.useState<boolean>(
      Boolean(congestiveheartfaliure?.echocardiogram === "No") ?? false
    );

  /* SHOW CARDIOLOGIST QUESTIONS BODY */
  React.useEffect(() => {
    const followUpCardiologist = congestiveheartfaliure?.follow_up_cardio;
    if (followUpCardiologist === "Yes") {
      setCongestiveHeartFaliure({
        ...congestiveheartfaliure,
        not_following_cardio: "",
      });
    } else {
      setCongestiveHeartFaliure({
        ...congestiveheartfaliure,
        freq_recom_cardio: "",
      });
    }

    setShowFollowUpFrequency(Boolean(followUpCardiologist === "Yes"));
    setShowNotSeeingCardiologist(Boolean(followUpCardiologist === "No"));
  }, [congestiveheartfaliure?.follow_up_cardio]);

  /* SHOW ECHODIAGRAM ADSVISE BODY */
  React.useEffect(() => {
    const haveEchoDiagram = congestiveheartfaliure?.echocardiogram;
    if (haveEchoDiagram === "No") {
      setCongestiveHeartFaliure({
        ...congestiveheartfaliure,
        no_echocardiogram: "",
      });
    }
    setShowEchoDiagramAdviseBody(Boolean(haveEchoDiagram === "No"));
  }, [congestiveheartfaliure?.echocardiogram]);

  /* Handle values for the questions */
  function valueChange(e: any) {
    const value = e.target.value;
    console.log(value);

    setCongestiveHeartFaliure({
      ...congestiveheartfaliure,
      [e.target.name]: value,
    });
  }

  /* Handle Dates Fields for Treatment Goals */
  function handleDateSelection(key: string, value: any) {
    setCongestiveHeartFaliure({
      ...congestiveheartfaliure,
      [key]: value,
    });
  }

  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const chfAssessment = { ...congestiveheartfaliure };
    Object.assign(chfAssessment, completed);

    const response = await saveQuestionairsData(
      "cong_heart_failure",
      chfAssessment
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment cmompleted */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const chfAssessment = { ...congestiveheartfaliure };
    Object.assign(chfAssessment, completed);

    const response = await saveQuestionairsData(
      "cong_heart_failure",
      chfAssessment
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
        <h2 className="stepsheading">Congestive Heart Failure</h2>

        {/* QUESTIONS */}
        <div className="mb-5">
          <div className="mb-3">
            <label className="question-text">
              Do you follow up with a Cardiologist for your CHF?
            </label>
            <br />
            <Radio.Group
              name="follow_up_cardio"
              value={congestiveheartfaliure?.follow_up_cardio}
              onChange={(e) => valueChange(e)}
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

          <div className="mb-3">
            {/* FREQUENCY TO FOLLOWUP CARDIOLOGIST */}
            {showFollowUpFrequency && (
              <div>
                <div>
                  <label className="question-text">
                    How frequently were you recommended to follow up with
                    cardiology?
                  </label>
                </div>
                <Radio.Group
                  name="freq_recom_cardio"
                  value={congestiveheartfaliure?.freq_recom_cardio}
                  onChange={(e) => valueChange(e)}
                >
                  <Space direction="horizontal">
                    <Radio value="following_up">
                      Patient is following up as recommended by cardiologist
                    </Radio>
                    <Radio value="not_following_up">
                      Patient is not following up per recommendation, advised to
                      set up and appointment with cardiologist
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            )}

            {/* REASON FOR NOT SEEING CARDIOLOGIST */}
            {showNotSeeingCardiologist && (
              <div>
                <label className="question-text">
                  Why are you not seeing a Cardiologist?
                </label>{" "}
                <br />
                <Radio.Group
                  name="not_following_cardio"
                  value={congestiveheartfaliure?.not_following_cardio}
                  onChange={(e) => valueChange(e)}
                >
                  <Space direction="horizontal">
                    <Radio value="chf_is_controlled">
                      CHF is controlled and cardiology wants patient to follow
                      up as needed
                    </Radio>
                    <Radio value="patient_does_not_have_cardiologist">
                      Patient does not have a cardiologist as of now, will set
                      up with cardiology
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            )}
          </div>

          <div className="mb-3">
            <div>
              <label className="question-text">
                Did you have an echocardiogram within the last 1-2 years?
              </label>
            </div>
            <Radio.Group
              name="echocardiogram"
              value={congestiveheartfaliure?.echocardiogram}
              onChange={(e) => valueChange(e)}
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

          {/* ADVISE ON IMPORTANCE OF ECHODIAGRAM BODY */}
          {showEchoDiagramAdviseBody && (
            <div className="mb-3">
              <Radio.Group
                name="no_echocardiogram"
                value={congestiveheartfaliure?.no_echocardiogram}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  <Radio value="patient_adviced">
                    Patient advised on importance of echocardiograms done every
                    1-2 years to evaluate heart function in patients with CHF.
                    Patient agrees to get echocardiogram done.
                  </Radio>
                  <Radio value="patient_refused">
                    Patient refused to get echocardiogram at this time. Patient
                    advised in detail on the possible complications of not
                    following up regularly to evaluate heart function.
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          )}
        </div>

        {/* TREATMENT GOALS */}
        <div>
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
              <label className="question-text">
                To gain education about CHF and self-management of the condition
              </label>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                value={dates.ge_chf_start_date}
                name="ge_chf_start_date"
                onChange={(e, datestring) =>
                  handleDateSelection("ge_chf_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                value={dates.ge_chf_end_date}
                name="ge_chf_end_date"
                onChange={(e, datestring) =>
                  handleDateSelection("ge_chf_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label className="question-text">
                To understand the importance of smoking cessation and
                restricting alcohol intake
              </label>
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.ui_smoke_cessation_start_date}
                name="ui_smoke_cessation_start_date"
                onChange={(e, datestring) =>
                  handleDateSelection(
                    "ui_smoke_cessation_start_date",
                    datestring
                  )
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.ui_smoke_cessation_end_date}
                name="ui_smoke_cessation_end_date"
                onChange={(e, datestring) =>
                  handleDateSelection("ui_smoke_cessation_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label className="question-text">
                To understand the importance of a low sodium diet
              </label>{" "}
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.ui_sodium_diet_start_date}
                name="ui_sodium_diet_start_date"
                onChange={(e, datestring) =>
                  handleDateSelection("ui_sodium_diet_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.ui_sodium_diet_end_date}
                name="ui_sodium_diet_end_date"
                onChange={(e, datestring) =>
                  handleDateSelection("ui_sodium_diet_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label className="question-text">
                To understand the importance of fluid restriction for
                self-management of CHF
              </label>{" "}
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.ui_fluid_restriction_start_date}
                name="ui_fluid_restriction_start_date"
                onChange={(e, datestring) =>
                  handleDateSelection(
                    "ui_fluid_restriction_start_date",
                    datestring
                  )
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.ui_fluid_restriction_end_date}
                name="ui_fluid_restriction_end_date"
                onChange={(e, datestring) =>
                  handleDateSelection(
                    "ui_fluid_restriction_end_date",
                    datestring
                  )
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label className="question-text">
                To understand importance of daily weight monitoring and
                recording in a daily log
              </label>{" "}
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.uid_weight_monitoring_start_date}
                name="uid_weight_monitoring_start_date"
                onChange={(e, datestring) =>
                  handleDateSelection(
                    "uid_weight_monitoring_start_date",
                    datestring
                  )
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.uid_weight_monitoring_end_date}
                name="uid_weight_monitoring_end_date"
                onChange={(e, datestring) =>
                  handleDateSelection(
                    "uid_weight_monitoring_end_date",
                    datestring
                  )
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label className="question-text">
                To recognize the signs of exacerbation which must be reported to
                the doctor/nurse
              </label>{" "}
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.rs_excerbation_start_date}
                name="rs_excerbation_start_date"
                onChange={(e, datestring) =>
                  handleDateSelection("rs_excerbation_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.rs_excerbation_end_date}
                name="rs_excerbation_end_date"
                onChange={(e, datestring) =>
                  handleDateSelection("rs_excerbation_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label className="question-text">
                To recognize the importance of adherence to treatment
              </label>{" "}
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.ri_adherence_start_date}
                name="ri_adherence_start_date"
                onChange={(e, datestring) =>
                  handleDateSelection("ri_adherence_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.ri_adherence_end_date}
                name="ri_adherence_end_date"
                onChange={(e, datestring) =>
                  handleDateSelection("ri_adherence_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label className="question-text">
                To seek help with activities of daily living
              </label>{" "}
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.seek_help_start_date}
                name="seek_help_start_date"
                onChange={(e, datestring) =>
                  handleDateSelection("seek_help_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-3">
              <DatePicker
                value={dates.seek_help_end_date}
                name="seek_help_end_date"
                onChange={(e, datestring) =>
                  handleDateSelection("seek_help_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
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
export default CongestiveHeartFailure;
