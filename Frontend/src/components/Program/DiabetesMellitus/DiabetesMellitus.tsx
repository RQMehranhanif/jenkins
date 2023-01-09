import React from "react";
import { Button, Checkbox, DatePicker, Radio, Space } from "antd";
import {
  DiabetesMellitusType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import moment from "moment";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

function DiabetesMellitus({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { diabetes_mellitus },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [diabetes, setDiabetes] =
    React.useState<DiabetesMellitusType>(diabetes_mellitus);

  const options = ["Yes", "No"];

  const testResult = ["Positve", "Negative"];

  const noNephropathy = [
    "Script generated for Urine for Micro-albumin",
    "Patient refused urine for Microalbuminemia testing",
  ];

  const inhibitors = ["ACE Inhibitor", "ARB", "None"];

  const dateFormat = "MM/DD/YYYY";
  const mothFormat = "YYYY/MM";

  /* CONST TO SHOW THE CHECKBOX BODY FOR HBA1C SCRIP */
  let monthDifference = 0;
  const [showHba1cScriptBody, setShowHba1cScriptBody] =
    React.useState<boolean>(Boolean(monthDifference > 6) ?? false)

  /* USE EFFECT TO SHOW THE HBA1C SCRIPT GENERATED BODY */
  React.useEffect(() => {
    if (diabetes?.result_month) {
      const startDate = moment(new Date(), mothFormat);
      const endDate = moment(diabetes?.result_month, mothFormat);
      monthDifference = startDate.diff(endDate, "months");
    }

    if (monthDifference < 6) {
      setDiabetes({
        ...diabetes,
        hba1c_script: "",
      })
    }

    setShowHba1cScriptBody(Boolean(monthDifference > 6))
  }, [diabetes?.result_month])

  /* CONST TO SHOW EYE EXAM AND NEPHROBODY */
  const [showEyeandNephroBody, setShowEyeandNephroBody] =
    React.useState<boolean>(Boolean(diabetes?.hb_result >= "8.5") ?? false);

  /* CONST TO SHOW THE FIELDS BODY FOR EYE EXAM DETAILS */
  const [showEyeexamdetailBody, setShowEyeexamdetailBody] =
    React.useState<boolean>(
      Boolean(diabetes?.eye_examination === "Yes") ?? false
    );

  /* CONST TO SHOW THE REPORT REQUESTED BODY */
  const [showReportrequestedBody, setShowReportrequestedBody] =
    React.useState<boolean>(
      Boolean(diabetes?.report_available === "No") ?? false
    );

  /* CONST TO SHOW THE RATINAVUE BODY */
  const [showRatinavueBody, setShowRatinavueBody] = React.useState<boolean>(
    Boolean(diabetes?.eye_examination === "No") ?? false
  );

  /* CONST TO SHOW THE FIELDS FOR NEPHROPATHY DETAILS */
  const [showNephropathyBody, setShowNephropathyBody] = React.useState<boolean>(
    Boolean(diabetes?.diabetic_nephropathy === "Yes") ?? false
  );

  /* CONST TO SHOW THE INHIBITORS BODY */
  const [showInhibitorBody, setShowInhibitorBody] = React.useState<boolean>(
    Boolean(diabetes?.diabetic_nephropathy === "No") ?? false
  );

  /* CONST TO SHOW THE CKD STAGE4 QUESTION BODY */
  const [showCKDbody, sethowCKDbody] = React.useState<boolean>(
    Boolean(diabetes?.diabetic_inhibitors === "None") ?? false
  );

  /* To show Eye and Nepropathy Body */
  React.useEffect(() => {
    const hba1cValue = diabetes?.hb_result;
    if (hba1cValue < "8.5") {
      setDiabetes({
        ...diabetes,
        eye_examination: "",
        name_of_doctor: "",
        name_of_facility: "",
        checkup_date: "",
        report_available: "",
        report_requested: "",
        retinavue_ordered: "",
        eye_examination_script: "",
        diabetic_nephropathy: "",
        diabetic_nephropathy_result: "",
        diabetic_nephropathy_date: "",
        diabetic_nephropathy_not_conducted: "",
      });
    }

    /* Eye and Nephro Body Bodies */
    setShowEyeandNephroBody(Boolean(hba1cValue >= "8.5"));
  }, [diabetes?.hb_result]);

  /* Eye Exam Body */
  React.useEffect(() => {
    const eyeExamPerformed = diabetes?.eye_examination;
    if (eyeExamPerformed === "No") {
      setDiabetes({
        ...diabetes,
        name_of_doctor: "",
        name_of_facility: "",
        checkup_date: "",
        report_available: "",
        report_requested: "",
      });
    } else {
      setDiabetes({
        ...diabetes,
        retinavue_ordered: "",
        eye_examination_script: "",
      });
    }

    /* Eye and Nephro Body Bodies */
    setShowEyeexamdetailBody(Boolean(eyeExamPerformed === "Yes"));

    /* Ratinavuw Order and Eye Examination script Body */
    setShowRatinavueBody(Boolean(eyeExamPerformed === "No"));
  }, [diabetes?.eye_examination]);

  /* Eye Exam Report Requested */
  React.useEffect(() => {
    const reportAvailable = diabetes?.report_available;
    if (reportAvailable === "Yes") {
      setDiabetes({
        ...diabetes,
        report_requested: "",
      });
    }

    /* Eye and Nephro Body Bodies */
    setShowReportrequestedBody(Boolean(reportAvailable === "No"));
  }, [diabetes?.report_available]);

  /* TO show the nephropathy Body */
  React.useEffect(() => {
    const nephropathyPerformed = diabetes?.diabetic_nephropathy;
    if (nephropathyPerformed === "No") {
      setDiabetes({
        ...diabetes,
        diabetic_nephropathy_date: "",
        diabetic_nephropathy_result: "",
      });
    }
    setShowNephropathyBody(Boolean(nephropathyPerformed === "Yes"));
  }, [diabetes?.diabetic_nephropathy]);

  /* To Show The inhibitors Body */
  React.useEffect(() => {
    const nephropathyPerformed = diabetes?.diabetic_nephropathy;
    if (nephropathyPerformed === "Yes") {
      setDiabetes({
        ...diabetes,
        diabetic_nephropathy_date: "",
        diabetic_nephropathy_result: "",
        diabetic_nephropathy_not_conducted: "",
        diabetic_inhibitors: "",
        nephropathy_patient_has: "",
      });
    }
    setShowInhibitorBody(Boolean(nephropathyPerformed === "No"));
  }, [diabetes?.diabetic_nephropathy]);

  /* To Show the CKD STAGE 4 Body */
  React.useEffect(() => {
    const onInhibitor = diabetes?.diabetic_inhibitors;
    if (onInhibitor !== "None") {
      setDiabetes({
        ...diabetes,
        nephropathy_patient_has: "",
      });
    }
    sethowCKDbody(Boolean(onInhibitor === "None"));
  }, [diabetes?.diabetic_inhibitors]);

  const dates = {
    imp_blood_glucose_start_date: diabetes?.imp_blood_glucose_start_date
      ? moment(diabetes?.imp_blood_glucose_start_date)
      : undefined,
    imp_blood_glucose_end_date: diabetes?.imp_blood_glucose_end_date
      ? moment(diabetes?.imp_blood_glucose_end_date)
      : undefined,
    und_hypoglycemia_hyperglycemia_start_date:
      diabetes?.und_hypoglycemia_hyperglycemia_start_date
        ? moment(diabetes?.und_hypoglycemia_hyperglycemia_start_date)
        : undefined,
    und_hypoglycemia_hyperglycemia_end_date:
      diabetes?.und_hypoglycemia_hyperglycemia_end_date
        ? moment(diabetes?.und_hypoglycemia_hyperglycemia_end_date)
        : undefined,
    recognize_signs_symptoms_start_date:
      diabetes?.recognize_signs_symptoms_start_date
        ? moment(diabetes?.recognize_signs_symptoms_start_date)
        : undefined,
    recognize_signs_symptoms_end_date:
      diabetes?.recognize_signs_symptoms_end_date
        ? moment(diabetes?.recognize_signs_symptoms_end_date)
        : undefined,
    reduce_complications_start_date: diabetes?.reduce_complications_start_date
      ? moment(diabetes?.reduce_complications_start_date)
      : undefined,
    reduce_complications_end_date: diabetes?.reduce_complications_end_date
      ? moment(diabetes?.reduce_complications_end_date)
      : undefined,
    und_imp_of_quit_smoking_start_date:
      diabetes?.und_imp_of_quit_smoking_start_date
        ? moment(diabetes?.und_imp_of_quit_smoking_start_date)
        : undefined,
    und_imp_of_quit_smoking_end_date: diabetes?.und_imp_of_quit_smoking_end_date
      ? moment(diabetes?.und_imp_of_quit_smoking_end_date)
      : undefined,
    maintain_healthy_weight_start_date:
      diabetes?.maintain_healthy_weight_start_date
        ? moment(diabetes?.maintain_healthy_weight_start_date)
        : undefined,
    maintain_healthy_weight_end_date: diabetes?.maintain_healthy_weight_end_date
      ? moment(diabetes?.maintain_healthy_weight_end_date)
      : undefined,
    engage_physical_activity_start_date:
      diabetes?.engage_physical_activity_start_date
        ? moment(diabetes?.engage_physical_activity_start_date)
        : undefined,
    engage_physical_activity_end_date:
      diabetes?.engage_physical_activity_end_date
        ? moment(diabetes?.engage_physical_activity_end_date)
        : undefined,
    maintain_a_healthy_diet_start_date:
      diabetes?.maintain_a_healthy_diet_start_date
        ? moment(diabetes?.maintain_a_healthy_diet_start_date)
        : undefined,
    maintain_a_healthy_diet_end_date: diabetes?.maintain_a_healthy_diet_end_date
      ? moment(diabetes?.maintain_a_healthy_diet_end_date)
      : undefined,
    und_foot_care_start_date: diabetes?.und_foot_care_start_date
      ? moment(diabetes?.und_foot_care_start_date)
      : undefined,
    und_foot_care_end_date: diabetes?.und_foot_care_end_date
      ? moment(diabetes?.und_foot_care_end_date)
      : undefined,
    result_month: diabetes?.result_month
      ? moment(diabetes?.result_month)
      : undefined,
    checkup_date: diabetes?.checkup_date
      ? moment(diabetes?.checkup_date)
      : undefined,
    diabetic_nephropathy_date: diabetes?.diabetic_nephropathy_date
      ? moment(diabetes?.diabetic_nephropathy_date)
      : undefined,
  };

  function dateChange(name: string, value: string) {
    setDiabetes({
      ...diabetes,
      [name]: value,
    });
  }

  function valueChange(e: any) {
    const value = e.target.value;

    setDiabetes({
      ...diabetes,
      [e.target.name]: value,
    });
  }

  function hba1cScript(e: any) {
    const value = e.target.checked === true ? e.target.value : "";

    setDiabetes({
      ...diabetes,
      [e.target.name]: value,
    });
  }

  /* Assessment not compelted */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const diabetesMellitus = { ...diabetes };
    Object.assign(diabetesMellitus, completed);

    const response = await saveQuestionairsData(
      "diabetes_mellitus",
      diabetesMellitus
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const diabetesMellitus = { ...diabetes };
    Object.assign(diabetesMellitus, completed);

    const response = await saveQuestionairsData(
      "diabetes_mellitus",
      diabetesMellitus
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
        <h2 className="stepsheading">Diabetes</h2>
        <div>
          <label className="question-text">
            When was your last HbA1c test performed and what was the result?
          </label>
        </div>

        {/* HBA1C Question */}
        <div className="row mb-3">
          <div className="col-lg-6">
            <input
              style={{ height: "35px" }}
              type="number"
              className="form-control"
              name="hb_result"
              placeholder="HbA1c result"
              onChange={(e) => {
                valueChange(e);
              }}
            />
          </div>
          <div className="col-lg-6">
            <DatePicker
              name="result_month"
              value={dates.result_month}
              onChange={(e, datestring) =>
                dateChange("result_month", datestring)
              }
              format={mothFormat}
              picker="month"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {showHba1cScriptBody && (
          <div className="mb-3">
            <Checkbox
              className="mr-2"
              name="hba1c_script"
              value="Yes"
              checked={diabetes?.hba1c_script === "Yes"}
              onChange={hba1cScript}
            />
            <label className="question-text"> HBA1C script generated to be picked up by patient </label>
          </div>
        )}

        {/* EYE AND NEPHROPATHY */}
        <div className="mb-5">
          {showEyeandNephroBody && (
            <div className="row mb-2">
              <div className="col-lg-6">
                <div className="mb-3">
                  <div>
                    <label className="question-text">
                      Have you had a Diabetic Eye Examination in last 12 months?
                    </label>
                  </div>
                  <Radio.Group
                    name="eye_examination"
                    value={diabetes?.eye_examination}
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

                {/* Eye Exam Details body */}
                {showEyeexamdetailBody && (
                  <div className={"d-block mb-3"}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control mt-2 mb-2"
                        style={{ height: "35px" }}
                        placeholder="Name of Doctor?"
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        style={{ height: "35px" }}
                        placeholder="Facility"
                      />
                      <DatePicker
                        name="checkup_date"
                        value={dates.checkup_date}
                        onChange={(e, datestring) =>
                          dateChange("checkup_date", datestring)
                        }
                        format={mothFormat}
                        picker="month"
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-6 md-6 sm-12">
                        <label className="question-text">
                          Report Available
                        </label>

                        <Radio.Group
                          name="report_available"
                          value={diabetes?.report_available}
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
                      <div className="col-lg-6">
                        {showReportrequestedBody && (
                          <div className={"d-block"}>
                            <label className="question-text">
                              Report Requested
                            </label>

                            <Radio.Group
                              name="report_requested"
                              value={diabetes?.report_requested}
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
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {showRatinavueBody && (
                  <div className={"d-block"}>
                    <div className="row">
                      <div className="col-lg-6 md-6 sm-12">
                        <div>
                          <label className="question-text">
                            Retinavue ordered
                          </label>
                        </div>
                        <Radio.Group
                          name="retinavue_ordered"
                          value={diabetes?.retinavue_ordered}
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

                      <div className={"col-lg-6"}>
                        <div>
                          <label className="question-text">
                            Script given for eye examination
                          </label>
                        </div>
                        <Radio.Group
                          name="eye_examination_script"
                          value={diabetes?.eye_examination_script}
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
                    </div>
                  </div>
                )}
              </div>

              <div className="col-lg-6">
                <div className="mb-3">
                  <div>
                    <label className="question-text">
                      Have you had a Diabetic Nephropathy screening in the last
                      6 months?
                    </label>
                  </div>
                  <Radio.Group
                    name="diabetic_nephropathy"
                    value={diabetes?.diabetic_nephropathy}
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

                {/* Nephropathy Date and test Result Body */}
                {showNephropathyBody && (
                  <div className={"mb-3 d-block"}>
                    <div className="mb-3">
                      <div>
                        <label className="question-text">
                          Nephropathy Screening
                        </label>
                      </div>
                      <DatePicker
                        name="diabetic_nephropathy_date"
                        placeholder="Nephropathy Test Date"
                        value={dates.diabetic_nephropathy_date}
                        onChange={(e, datestring) =>
                          dateChange("diabetic_nephropathy_date", datestring)
                        }
                        format={mothFormat}
                        picker="month"
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div className="mb-3">
                      <div>
                        <label className="question-text mt-3">
                          Test Result
                        </label>
                      </div>
                      <Radio.Group
                        name="diabetic_nephropathy_result"
                        value={diabetes?.diabetic_nephropathy_result}
                        onChange={(e) => valueChange(e)}
                      >
                        <Space direction="horizontal">
                          {testResult.map((item, key) => (
                            <Radio value={item} key={key}>
                              {item}
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </div>
                  </div>
                )}

                {/* Inhibitors Body */}
                {showInhibitorBody && (
                  <div className={"d-block"}>
                    <div className="mb-3">
                      <Radio.Group
                        name="diabetic_nephropathy_not_conducted"
                        value={diabetes?.diabetic_nephropathy_not_conducted}
                        onChange={(e) => {
                          valueChange(e);
                        }}
                      >
                        <Space direction="horizontal">
                          {noNephropathy.map((item, key) => (
                            <Radio value={item} key={key}>
                              {item}
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </div>

                    <div className="mb-3">
                      <div>
                        <label className="question-text">Patient is on</label>
                      </div>
                      <Radio.Group
                        name="diabetic_inhibitors"
                        value={diabetes?.diabetic_inhibitors}
                        onChange={(e) => {
                          valueChange(e);
                        }}
                      >
                        <Space direction="horizontal">
                          {inhibitors.map((item, key) => (
                            <Radio value={item} key={key}>
                              {item}
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </div>

                    {showCKDbody && (
                      <div className="">
                        <div>
                          <label className="question-text">Patient is on</label>
                        </div>

                        <Radio.Group
                          name="nephropathy_patient_has"
                          value={diabetes?.nephropathy_patient_has}
                          onChange={(e) => {
                            valueChange(e);
                          }}
                        >
                          <Space direction="horizontal">
                            <Radio value={"ckd_stage_4"}>{"CKD Stage 4"}</Radio>
                            <Radio value={"patient_see_nephrologist"}>
                              {"Patient see Nephrologist"}
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Treatment Goals */}
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
              <label className="question-text mt-2">
                To understand the importance of Blood Glucose Monitoring and
                control
              </label>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="imp_blood_glucose_start_date"
                value={dates.imp_blood_glucose_start_date}
                onChange={(e, datestring) =>
                  dateChange("imp_blood_glucose_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="imp_blood_glucose_end_date"
                value={dates.imp_blood_glucose_end_date}
                onChange={(e, datestring) =>
                  dateChange("imp_blood_glucose_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2">
                To Understand Hypoglycemia, hyperglycemia and how to prevent
                them
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="und_hypoglycemia_hyperglycemia_start_date"
                value={dates.und_hypoglycemia_hyperglycemia_start_date}
                onChange={(e, datestring) =>
                  dateChange(
                    "und_hypoglycemia_hyperglycemia_start_date",
                    datestring
                  )
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="und_hypoglycemia_hyperglycemia_end_date"
                value={dates.und_hypoglycemia_hyperglycemia_end_date}
                onChange={(e, datestring) =>
                  dateChange(
                    "und_hypoglycemia_hyperglycemia_end_date",
                    datestring
                  )
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2">
                To recognize the signs and symptoms of exacerbation that must be
                reported to the doctor/nurse
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="recognize_signs_symptoms_start_date"
                value={dates.recognize_signs_symptoms_start_date}
                onChange={(e, datestring) =>
                  dateChange("recognize_signs_symptoms_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="recognize_signs_symptoms_end_date"
                value={dates.recognize_signs_symptoms_end_date}
                onChange={(e, datestring) =>
                  dateChange("recognize_signs_symptoms_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2">
                To reduce the risk of complications and prevent future health
                problems
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="reduce_complications_start_date"
                value={dates.reduce_complications_start_date}
                onChange={(e, datestring) =>
                  dateChange("reduce_complications_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="reduce_complications_end_date"
                value={dates.reduce_complications_end_date}
                onChange={(e, datestring) =>
                  dateChange("reduce_complications_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2">
                To understand the importance of quitting Smoking to reduce the
                risk of complications
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="und_imp_of_quit_smoking_start_date"
                value={dates.und_imp_of_quit_smoking_start_date}
                onChange={(e, datestring) =>
                  dateChange("und_imp_of_quit_smoking_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="und_imp_of_quit_smoking_end_date"
                value={dates.und_imp_of_quit_smoking_end_date}
                onChange={(e, datestring) =>
                  dateChange("und_imp_of_quit_smoking_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2">To maintain a healthy Weight</p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="maintain_healthy_weight_start_date"
                value={dates.maintain_healthy_weight_start_date}
                onChange={(e, datestring) =>
                  dateChange("maintain_healthy_weight_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="maintain_healthy_weight_end_date"
                value={dates.maintain_healthy_weight_end_date}
                onChange={(e, datestring) =>
                  dateChange("maintain_healthy_weight_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2">
                To engage in 150 minutes of moderate intensity physical activity
                per week
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="engage_physical_activity_start_date"
                value={dates.engage_physical_activity_start_date}
                onChange={(e, datestring) =>
                  dateChange("engage_physical_activity_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="engage_physical_activity_end_date"
                value={dates.engage_physical_activity_end_date}
                onChange={(e, datestring) =>
                  dateChange("engage_physical_activity_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2">
                To maintain a healthy diet for managing diabetes
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="maintain_a_healthy_diet_start_date"
                value={dates.maintain_a_healthy_diet_start_date}
                onChange={(e, datestring) =>
                  dateChange("maintain_a_healthy_diet_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="maintain_a_healthy_diet_end_date"
                value={dates.maintain_a_healthy_diet_end_date}
                onChange={(e, datestring) =>
                  dateChange("maintain_a_healthy_diet_end_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2">
                To develop an understanding of Diabetic Foot care
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="und_foot_care_start_date"
                value={dates.und_foot_care_start_date}
                onChange={(e, datestring) =>
                  dateChange("und_foot_care_start_date", datestring)
                }
                format={dateFormat}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePicker
                name="und_foot_care_end_date"
                value={dates.und_foot_care_end_date}
                onChange={(e, datestring) =>
                  dateChange("und_foot_care_end_date", datestring)
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
}
export default DiabetesMellitus;
