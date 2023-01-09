/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-sequences */
import React from "react";
import { Button, Checkbox, DatePicker, Radio, Space } from "antd";
import {
  ScreeningType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import moment from "moment";
import { useState } from "react";
import { OpenNotification } from "./../../../Utilties/Utilties";

function Screening({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { screening: storeScreening },
    patientProfile: { gender },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [screening, setScreening] =
    React.useState<ScreeningType>(storeScreening);

  const [showMammogramBody, setShowMammogramBody] = React.useState<boolean>(
    Boolean(screening?.mammogram_done === "Yes") ?? false
  );
  const [showRefusedMammogramBody, setShowRefusedMammogramBody] =
    React.useState<boolean>(
      Boolean(screening?.mammogram_done === "No") ?? false
    );
  const [showMammogramScriptBody, setShowMammogramScriptBody] =
    React.useState<boolean>(
      Boolean(screening?.mammogram_refused === "No") ?? false
    );
  const [showRefuseColonoscopyBody, setShowRefuseColonoscopyBody] =
    React.useState<boolean>(
      Boolean(screening?.colonoscopy_done === "No") ?? false
    );
  const [showColonScriptBody, setShowColonScriptBody] = React.useState<boolean>(
    Boolean(screening?.colonoscopy_refused === "No") ?? false
  );
  const [showColonTestBody, setShowColonTestBody] = React.useState<boolean>(
    Boolean(screening?.colonoscopy_done === "Yes") ?? false
  );
  const [showColonoscopyFieldsBody, setShowColonoscopyFieldsBody] =
    React.useState<boolean>(
      Boolean(screening?.colon_test_type === "Colonoscopy") ?? false
    );
  const [showFitFieldsBody, setShowFitFieldsBody] = React.useState<boolean>(
    Boolean(screening?.colon_test_type === "FIT Test") ?? false
  );
  const [showCologuardFieldsBody, setShowCologuardFieldsBody] =
    React.useState<boolean>(
      Boolean(screening?.colon_test_type === "Cologuard") ?? false
    );

  const dateFormat = "MM/YYYY";

  const dates = {
    mammogram_done_on: screening?.mammogram_done_on
      ? moment(screening?.mammogram_done_on, dateFormat)
      : undefined,
    colonoscopy_done_on: screening?.colonoscopy_done_on
      ? moment(screening?.colonoscopy_done_on, dateFormat)
      : undefined,
  };

  function mammogramDate(name: string, value: string) {
    const next_mammogramDate = moment(value, dateFormat)
      .add(27, "months")
      .format(dateFormat);

    setScreening({
      ...screening,
      [name]: value,
      next_mommogram: next_mammogramDate,
    });
  }

  function colonoscopyDate(name: string, value: string) {
    const next_colonoscopyDate = moment(value, dateFormat)
      .add(120, "months")
      .format(dateFormat);

    setScreening({
      ...screening,
      [name]: value,
      next_colonoscopy: next_colonoscopyDate,
    });
  }

  function fitDate(name: string, value: string) {
    const fit_date = moment(value, dateFormat)
      .add(12, "months")
      .format(dateFormat);

    setScreening({
      ...screening,
      [name]: value,
      next_colonoscopy: fit_date,
    });
  }
  function cologuardDate(name: string, value: string) {
    const colo_date = moment(value, dateFormat)
      .add(24, "months")
      .format(dateFormat);

    setScreening({
      ...screening,
      [name]: value,
      next_colonoscopy: colo_date,
    });
  }

  /* MAMMOGRAM USE EFFECT */
  React.useEffect(() => {
    const mammogramDone = screening?.mammogram_done;
    if (mammogramDone === "No") {
      setScreening({
        ...screening,
        mammogram_done_on: "",
        mammogram_done_at: "",
        next_mommogram: "",
        mommogram_report_reviewed: "",
      });
    }

    if (mammogramDone === "Yes") {
      setScreening({
        ...screening,
        mammogram_refused: "",
        mammogram_script: "",
      });
    }

    const mammogramRefused = screening?.mammogram_refused;
    if (mammogramRefused === "Yes") {
      setScreening({
        ...screening,
        mammogram_script: "",
      });
    }

    /* Mammogram Bodies */
    setShowMammogramBody(Boolean(mammogramDone === "Yes"));
    setShowRefusedMammogramBody(Boolean(mammogramDone === "No"));
    setShowMammogramScriptBody(
      Boolean(mammogramRefused === "No") && Boolean(mammogramDone === "No")
    );
  }, [screening?.mammogram_done, screening?.mammogram_refused]);

  /* MAMMOGRAM USE EFFECT */
  React.useEffect(() => {
    const mammogramDone = screening?.mammogram_done;

    if (mammogramDone === "Yes") {
      setScreening({
        ...screening,
        mammogram_refused: "",
        mammogram_script: "",
      });
    }

    /* Mammogram Bodies */
    setShowMammogramBody(Boolean(mammogramDone === "Yes"));
    setShowRefusedMammogramBody(Boolean(mammogramDone === "No"));
  }, [screening?.mammogram_done]);

  /* COLONOSCOPY UES EFFECT */
  React.useEffect(() => {
    const colonoscopyDone = screening?.colonoscopy_done;
    if (colonoscopyDone === "No") {
      setScreening({
        ...screening,
        colon_test_type: "",
        colonoscopy_done_on: "",
        colonoscopy_done_at: "",
        next_colonoscopy: "",
        colonoscopy_report_reviewed: "",
      });
    }

    const colonoscopyRefused = screening?.colonoscopy_refused;
    if (colonoscopyRefused === "Yes") {
      setScreening({
        ...screening,
        colonoscopy_script: "",
      });
    }

    setShowColonTestBody(Boolean(colonoscopyDone === "Yes"));
    setShowRefuseColonoscopyBody(Boolean(colonoscopyDone === "No"));
    setShowColonScriptBody(
      Boolean(colonoscopyRefused === "No" && colonoscopyDone === "No")
    );
  }, [screening?.colonoscopy_done, screening?.colonoscopy_refused]);

  /* Effect  */
  React.useEffect(() => {
    const colonoscopyDone = screening?.colonoscopy_done;
    const colonoscopyTest = screening?.colon_test_type;

    /* COlonoscopy Fields */
    setShowColonoscopyFieldsBody(
      Boolean(colonoscopyDone === "Yes") &&
        Boolean(colonoscopyTest === "Colonoscopy")
    );
    setShowFitFieldsBody(
      Boolean(colonoscopyDone === "Yes") &&
        Boolean(colonoscopyTest === "FIT Test")
    );
    setShowCologuardFieldsBody(
      Boolean(colonoscopyDone === "Yes") &&
        Boolean(colonoscopyTest === "Cologuard")
    );

    if (colonoscopyDone === "Yes") {
      setScreening({
        ...screening,
        colonoscopy_refused: "",
        colonoscopy_script: "",
      });
    }
  }, [screening?.colonoscopy_done, screening?.colon_test_type]);

  function valueChange(e: any) {
    const value = e.target.value;

    setScreening({
      ...screening,
      [e.target.name]: value,
    });
  }

  const defaultOptions = ["Yes", "No"];
  const colonTestType = ["Colonoscopy", "FIT Test", "Cologuard"];

  /* Trigger on Change of COLON test TYPE  */
  function changeTestType(e: any) {
    const value = e.target.value;

    setScreening({
      ...screening,
      [e.target.name]: value,
      colonoscopy_done_on: "",
      colonoscopy_done_at: "",
      next_colonoscopy: "",
      colonoscopy_report_reviewed: "",
    });
  }

  function reportReviewed(e: any) {
    const value = e.target.checked === true ? e.target.value : "";

    setScreening({
      ...screening,
      [e.target.name]: value,
    });
  }

  function valueChanges(e: any) {
    const value = e.target.checked === true ? e.target.value : "";

    setScreening({
      ...screening,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const cancerScreening = { ...screening };
    Object.assign(cancerScreening, completed);

    const response = await saveQuestionairsData("screening", cancerScreening);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Screening Completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const cancerScreening = { ...screening };
    Object.assign(cancerScreening, completed);

    const response = await saveQuestionairsData("screening", cancerScreening);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  const mammogramEligible = gender.toUpperCase() === "MALE" ? true : false;
  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Screening</h2>
        <div className="row mb-2">
          {/* MAMMOGRAM SCREENING */}
          <div className="col-lg-6 md-6 sm-12">
            <h5> Mammogram </h5>
            <div className="mb-3">
              <label className="question-text">Mammogram done ?</label>
              <div>
                <Radio.Group
                  name="mammogram_done"
                  onChange={(e) => valueChange(e)}
                  value={screening?.mammogram_done ?? "{screening?.comments}"}
                  disabled={mammogramEligible}
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

            {/* Show Mammogram Body */}
            {showMammogramBody && (
              <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
                <div className="mb-3">
                  {gender.toUpperCase() === "MALE" ? (
                    <>
                      <label className="question-text">
                        Mammogram done on ?
                      </label>
                      <DatePicker
                        className="form-control"
                        name="mammogram_done_on"
                        placeholder="Select Mammogram date"
                        disabled
                        value={dates.mammogram_done_on}
                        onChange={(e, datestring) =>
                          mammogramDate("mammogram_done_on", datestring)
                        }
                        format={dateFormat}
                        picker="month"
                        style={{ width: "100%" }}
                      />
                    </>
                  ) : (
                    <>
                      <label className="question-text">
                        Mammogram done on ?
                      </label>
                      <DatePicker
                        className="form-control"
                        name="mammogram_done_on"
                        placeholder="Select Mammogram date"
                        value={dates.mammogram_done_on}
                        onChange={(e, datestring) =>
                          mammogramDate("mammogram_done_on", datestring)
                        }
                        format={dateFormat}
                        picker="month"
                        style={{ width: "100%" }}
                      />
                    </>
                  )}
                </div>

                <div className="mb-3">
                  {gender.toUpperCase() === "MALE" ? (
                    <>
                      <label className="question-text">
                        Mammogram done at ?
                      </label>
                      <input
                        onChange={valueChange}
                        type="text"
                        className="form-control"
                        name="mammogram_done_at"
                        placeholder="Mammogram done at"
                        disabled
                        value={screening?.mammogram_done_at ?? ""}
                      />
                    </>
                  ) : (
                    <>
                      <label className="question-text">
                        Mammogram done at ?
                      </label>
                      <input
                        onChange={valueChange}
                        type="text"
                        className="form-control"
                        name="mammogram_done_at"
                        placeholder="Mammogram done at"
                        value={screening?.mammogram_done_at ?? ""}
                      />
                    </>
                  )}
                </div>

                <div className="mb-3">
                  <label className="question-text">
                    Next Mammogram due on ?
                  </label>
                  <input
                    name="next_mommogram"
                    className="form-control"
                    placeholder="Next Mammogram due on"
                    value={screening?.next_mommogram ?? ""}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <Checkbox
                    className="mr-2"
                    name="mommogram_report_reviewed"
                    value="0"
                    checked={screening?.mommogram_report_reviewed === "0"}
                    onChange={reportReviewed}
                  />
                  <label className="question-text"> Report reviewed </label>
                </div>
              </div>
            )}

            {/* Mammogram refused Body */}
            {showRefusedMammogramBody && (
              <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
                <div className="mb-3">
                  <label className="question-text">Refused Mammogram ?</label>
                  <div>
                    <Radio.Group
                      name="mammogram_refused"
                      onChange={(e) => valueChange(e)}
                      value={screening?.mammogram_refused}
                      disabled={mammogramEligible}
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
            )}

            {/* MammogramScript Body*/}
            {showMammogramScriptBody && (
              <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
                <div className="mb-3">
                  <label className="question-text">
                    Script given for the Screening Mammogram ?
                  </label>
                  <div>
                    <Radio.Group
                      name="mammogram_script"
                      onChange={(e) => valueChange(e)}
                      value={screening?.mammogram_script}
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
            )}
          </div>

          {/* COLON CANCER SCREENING */}
          <div className="col-lg-6 md-6 sm-12">
            <h5> Colon Cancer </h5>
            <div className="mb-3">
              <label className="question-text">
                Colonoscopy / FIT Test / Cologuard done ?
              </label>

              <div className="mb-2">
                <Radio.Group
                  name="colonoscopy_done"
                  onChange={(e) => valueChange(e)}
                  value={screening?.colonoscopy_done}
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

              {/* Colon screening Test Type body */}
              {showColonTestBody && (
                <div className={"d-block"} style={{ marginBottom: "10px" }}>
                  <div className="mb-3">
                    <div>
                      <Radio.Group
                        name="colon_test_type"
                        onChange={(e) => changeTestType(e)}
                        value={screening?.colon_test_type}
                      >
                        <Space direction="horizontal">
                          {colonTestType.map((item, key) => (
                            <Radio value={item} key={key}>
                              {item}
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Colonoscopy Fields Body */}
            {showColonoscopyFieldsBody && (
              <div className={"d-block"} style={{ marginBottom: "10px" }}>
                <div className="mb-3">
                  <label className="question-text">Colonoscopy done on</label>
                  <DatePicker
                    className="form-control"
                    name="colonoscopy_done_on"
                    placeholder="Select Colonoscopy date"
                    value={dates.colonoscopy_done_on}
                    onChange={(e, datestring) =>
                      colonoscopyDate("colonoscopy_done_on", datestring)
                    }
                    format={dateFormat}
                    picker="month"
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="mb-3">
                  <label className="question-text">Colonoscopy done at</label>
                  <input
                    onChange={valueChange}
                    type="text"
                    className="form-control"
                    name="colonoscopy_done_at"
                    placeholder="Colonoscopy done at"
                    value={screening?.colonoscopy_done_at}
                  />
                </div>

                <div className="mb-3">
                  <label className="question-text">
                    Next Colonoscopy due on
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="next_colonoscopy"
                    value={screening?.next_colonoscopy}
                    placeholder="Next Colonoscopy due on"
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <Checkbox
                    className="mr-2"
                    name="colonoscopy_report_reviewed"
                    value="0"
                    checked={screening?.colonoscopy_report_reviewed === "0"}
                    onChange={reportReviewed}
                  />
                  <label className="question-text"> Report reviewed </label>
                </div>
              </div>
            )}

            {/* FIT TEST Fields Body */}
            {showFitFieldsBody && (
              <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
                <div className="mb-3">
                  <label className="question-text">FIT Test done on</label>
                  <DatePicker
                    className="form-control"
                    name="colonoscopy_done_on"
                    placeholder="Select FIT Test date"
                    value={dates.colonoscopy_done_on}
                    onChange={(e, datestring) =>
                      fitDate("colonoscopy_done_on", datestring)
                    }
                    format={dateFormat}
                    picker="month"
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="mb-3">
                  <label className="question-text">FIT Test done at</label>
                  <input
                    onChange={valueChange}
                    type="text"
                    className="form-control"
                    name="colonoscopy_done_at"
                    value={screening?.colonoscopy_done_at}
                    placeholder="FIT done at"
                  />
                </div>

                <div className="mb-3">
                  <label className="question-text">Next FIT Test due on</label>
                  <input
                    type="text"
                    onSelect={valueChange}
                    className="form-control"
                    name="next_colonoscopy"
                    value={screening?.next_colonoscopy}
                    placeholder="Next FIT on MM/YYYY"
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <Checkbox
                    className="mr-2"
                    name="colonoscopy_report_reviewed"
                    value="0"
                    checked={screening?.colonoscopy_report_reviewed === "0"}
                    onChange={reportReviewed}
                  />
                  <label className="question-text"> Report reviewed </label>
                </div>
              </div>
            )}

            {/* Cologuard Fields Body */}
            {showCologuardFieldsBody && (
              <div className={"d-block"} style={{ marginBottom: "10px" }}>
                <div className="mb-3">
                  <label className="question-text">Cologuard done on</label>
                  <DatePicker
                    className="form-control"
                    name="colonoscopy_done_on"
                    placeholder="Select Cologuard date"
                    value={dates.colonoscopy_done_on}
                    onChange={(e, datestring) =>
                      cologuardDate("colonoscopy_done_on", datestring)
                    }
                    format={dateFormat}
                    picker="month"
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="mb-3">
                  <label className="question-text">Cologuard done at</label>
                  <input
                    onChange={valueChange}
                    type="text"
                    className="form-control"
                    name="colonoscopy_done_at"
                    value={screening?.colonoscopy_done_at}
                    placeholder="Cologuard done at"
                  />
                </div>

                <div className="mb-3">
                  <label className="question-text">Next Cologuard due on</label>
                  <input
                    type="text"
                    onSelect={valueChange}
                    className="form-control"
                    name="next_colonoscopy"
                    value={screening?.next_colonoscopy}
                    placeholder="Next Cologuard on MM/YYYY"
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <Checkbox
                    className="mr-2"
                    name="colonoscopy_report_reviewed"
                    value="0"
                    checked={screening?.colonoscopy_report_reviewed === "0"}
                    onChange={reportReviewed}
                  />
                  <label className="question-text"> Report reviewed </label>
                </div>
              </div>
            )}

            {/* Refused colonoscopy Body */}
            {showRefuseColonoscopyBody && (
              <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
                <div className="mb-3">
                  <label className="question-text">
                    Refused Colonoscopy & FIT Test ?
                  </label>
                  <div>
                    <Radio.Group
                      name="colonoscopy_refused"
                      onChange={(e) => valueChange(e)}
                      value={screening?.colonoscopy_refused}
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
            )}

            {/* Colonoscopy Script Body */}
            {showColonScriptBody && (
              <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
                <div className="mb-3">
                  <label className="question-text">
                    Script given for the Screening Colonoscopy
                  </label>
                  <div>
                    <Radio.Group
                      name="colonoscopy_script"
                      onChange={(e) => valueChange(e)}
                      value={screening?.colonoscopy_script}
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
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <label className="question-text">Comments</label>
            <textarea
              className="form-control"
              name="comments"
              value={screening?.comments ?? ""}
              defaultValue={screening?.comments ?? ""}
              spellCheck="false"
              onChange={valueChange}
            >
              {" "}
            </textarea>
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
}
export default Screening;
