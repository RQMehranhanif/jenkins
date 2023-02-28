import React from "react";
import { Button, Checkbox, DatePicker, Input, Radio, Space } from "antd";
import {
  DiabetesType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import moment from "moment";
import { OpenNotification } from "./../../../Utilties/Utilties";

function Diabetes({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { diabetes: storeDiabetes },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [diabetes, setDiabetes] = React.useState<DiabetesType>(storeDiabetes);

  /* const [state, setState] = React.useState({
    showpatientDiabetes: false,
    eyeExaminationyes: false,
    eyeexaminationno: false,
    eyeExaminationreport: false,
    nephropathyyes: false,
    nephropathyno: false,
    patientNone: false,
    showFbs: false,
    showFasting: false,
  }); */

  const dateFormat = "MM/YYYY";

  const [showDiabetesBody, setShowDiabetesBody] = React.useState<boolean>(
    Boolean(
      diabetes?.diabetec_patient === "Yes" ||
        (diabetes?.diabetec_patient === "No" &&
          diabetes?.fbs_in_year === "Yes" &&
          diabetes?.fbs_value > 100)
    )
  );

  const [showFbsBody, setShowFbsBody] = React.useState<boolean>(
    Boolean(diabetes?.diabetec_patient === "No") ?? false
  );

  const [showFastingBloodSugarFieldsBody, setShowFastingBloodSugarFieldsBody] =
    React.useState<boolean>(
      Boolean(
        diabetes?.diabetec_patient === "No" && diabetes?.fbs_in_year === "Yes"
      ) ?? false
    );

  const [showEyeandNephroBody, setShowEyeandNephroBody] =
    React.useState<boolean>(
      Boolean(
        (diabetes?.diabetec_patient === "No" &&
          diabetes?.hba1c_value >= "6.5") ||
          diabetes?.diabetec_patient === "Yes"
      )
    );

  const [showEyeReportBody, setShowEyeReportBody] = React.useState<boolean>(
    Boolean(diabetes?.diabetec_eye_exam === "Yes")
  );

  const [showEyeExamFieldsBody, setShowEyeExamFieldsBody] =
    React.useState<boolean>(
      Boolean(diabetes?.diabetec_eye_exam_report === "report_available")
    );

  const [showEyeScriptBody, setShowEyeScriptBody] = React.useState<boolean>(
    Boolean(diabetes?.diabetec_eye_exam === "No")
  );

  const [shownephroFieldsBody, setShownephroFieldsBody] =
    React.useState<boolean>(Boolean(diabetes?.urine_microalbumin === "Yes"));

  const [shownephroScriptBody, setShownephroScriptBody] =
    React.useState<boolean>(Boolean(diabetes?.urine_microalbumin === "No"));

  const [showCkdStage4BodyBody, setShowCkdStage4BodyBody] =
    React.useState<boolean>(
      Boolean(diabetes?.urine_microalbumin_inhibitor === "none")
    );

  /* Active Diagnosis of Diabetes */
  React.useEffect(() => {
    const isDiabeticPatient = diabetes?.diabetec_patient;

    if (isDiabeticPatient === "Yes") {
      setDiabetes({
        ...diabetes,
        fbs_in_year: "",
        fbs_value: "",
        fbs_date: "",
      });
    }

    if (isDiabeticPatient === "No") {
      setDiabetes({
        ...diabetes,
        hba1c_value: "",
        hba1c_date: "",
        diabetec_eye_exam: "",
        diabetec_eye_exam_report: "",
        eye_exam_doctor: "",
        eye_exam_facility: "",
        eye_exam_date: "",
        eye_exam_report_reviewed: "",
        ratinavue_ordered: "",
        urine_microalbumin: "",
        urine_microalbumin_date: "",
        urine_microalbumin_report: "",
        urine_microalbumin_ordered: "",
        urine_microalbumin_inhibitor: "",
        ckd_stage_4: "",
      });
    }

    setShowDiabetesBody(
      Boolean(isDiabeticPatient === "Yes" || diabetes?.fbs_value > 100)
    );
    setShowFbsBody(Boolean(isDiabeticPatient === "No"));
  }, [diabetes?.diabetec_patient, diabetes?.fbs_value]);

  /* FBS FIELDS BODY */
  React.useEffect(() => {
    const fbsPerformedinLastYear = diabetes?.fbs_in_year;
    if (fbsPerformedinLastYear === "No") {
      setDiabetes({
        ...diabetes,
        fbs_value: "",
        fbs_date: "",
        hba1c_value: "",
        hba1c_date: "",
        diabetec_eye_exam: "",
        diabetec_eye_exam_report: "",
        eye_exam_doctor: "",
        eye_exam_facility: "",
        eye_exam_date: "",
        eye_exam_report_reviewed: "",
        ratinavue_ordered: "",
        urine_microalbumin: "",
        urine_microalbumin_date: "",
        urine_microalbumin_report: "",
        urine_microalbumin_ordered: "",
        urine_microalbumin_inhibitor: "",
        ckd_stage_4: "",
      });
    }

    setShowFastingBloodSugarFieldsBody(
      Boolean(fbsPerformedinLastYear === "Yes")
    );
  }, [diabetes?.fbs_in_year, diabetes?.fbs_value]);

  React.useEffect(() => {
    const isDiabeticPatient = diabetes?.diabetec_patient;
    const hba1cValue = diabetes?.hba1c_value;

    if (isDiabeticPatient === "No" && hba1cValue < "6.5") {
      setDiabetes({
        ...diabetes,
        diabetec_eye_exam: "",
        diabetec_eye_exam_report: "",
        eye_exam_doctor: "",
        eye_exam_facility: "",
        eye_exam_date: "",
        eye_exam_report_reviewed: "",
        diabetec_ratinopathy: "",
        ratinavue_ordered: "",
        urine_microalbumin: "",
        urine_microalbumin_value: "",
        urine_microalbumin_date: "",
        urine_microalbumin_report: "",
        urine_microalbumin_ordered: "",
        urine_microalbumin_inhibitor: "",
        ckd_stage_4: "",
      });
    }

    const showState = Boolean(
      isDiabeticPatient === "Yes" ||
        (isDiabeticPatient === "No" && hba1cValue >= "6.5")
    );
    setShowEyeandNephroBody(showState);
  }, [diabetes?.diabetec_patient, diabetes?.hba1c_value]);

  React.useEffect(() => {
    const eyeExamPerformed = diabetes?.diabetec_eye_exam;

    if (eyeExamPerformed === "No") {
      setDiabetes({
        ...diabetes,
        diabetec_eye_exam_report: "",
        eye_exam_doctor: "",
        eye_exam_facility: "",
        eye_exam_date: "",
        eye_exam_report_reviewed: "",
        diabetec_ratinopathy: "",
      });
    }

    if (eyeExamPerformed === "Yes") {
      setDiabetes({
        ...diabetes,
        diabetec_eye_exam_report: "",
        ratinavue_ordered: "",
      });
    }

    setShowEyeReportBody(Boolean(eyeExamPerformed === "Yes"));
    setShowEyeScriptBody(Boolean(eyeExamPerformed === "No"));
  }, [diabetes?.diabetec_eye_exam]);

  React.useEffect(() => {
    const microalbuminPerformed = diabetes?.urine_microalbumin;

    if (microalbuminPerformed === "No") {
      setDiabetes({
        ...diabetes,
        urine_microalbumin_value: "",
        urine_microalbumin_date: "",
        urine_microalbumin_report: "",
      });
    }

    if (microalbuminPerformed === "Yes") {
      setDiabetes({
        ...diabetes,
        urine_microalbumin_ordered: "",
        urine_microalbumin_inhibitor: "",
        ckd_stage_4: "",
      });
    }

    setShownephroFieldsBody(microalbuminPerformed === "Yes");
    setShownephroScriptBody(microalbuminPerformed === "No");
  }, [diabetes?.urine_microalbumin]);

  React.useEffect(() => {
    const eyeExamReport = diabetes?.diabetec_eye_exam_report;
    if (eyeExamReport !== "report_available") {
      setDiabetes({
        ...diabetes,
        eye_exam_doctor: "",
        eye_exam_facility: "",
        eye_exam_date: "",
        eye_exam_report_reviewed: "",
        diabetec_ratinopathy: "",
      });
    }

    setShowEyeExamFieldsBody(Boolean(eyeExamReport === "report_available"));
  }, [diabetes?.diabetec_eye_exam_report]);

  React.useEffect(() => {
    const patientInhibitors = diabetes?.urine_microalbumin_inhibitor;
    if (patientInhibitors !== "none") {
      setDiabetes({
        ...diabetes,
        ckd_stage_4: "",
      });
    }
    setShowCkdStage4BodyBody(patientInhibitors === "none");
  }, [diabetes?.urine_microalbumin_inhibitor]);

  function valueChange(e: any) {
    const value = e.target.value;
    setDiabetes({
      ...diabetes,
      [e.target.name]: value,
    });
  }

  function valueChanges(e: any) {
    const value = e.target.checked === true ? e.target.value : "";

    setDiabetes({
      ...diabetes,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const diabetesScreening = { ...diabetes };
    Object.assign(diabetesScreening, completed);

    const response = await saveQuestionairsData("diabetes", diabetesScreening);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Screening Completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const diabetesScreening = { ...diabetes };
    Object.assign(diabetesScreening, completed);

    const response = await saveQuestionairsData("diabetes", diabetesScreening);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  const patientDiabetes = (value: any) => {
    setDiabetes({
      ...diabetes,
      [value.target.name]: value.target.value,
    });
  };
  /* const eyeexaminationChange = (value: any) => {
    if (value.target.value >= "Yes") {
      setState({ ...state, eyeExaminationyes: true, eyeexaminationno: false });
    } else {
      setState({ ...state, eyeExaminationyes: false, eyeexaminationno: true });
    }
  };
  const eyeexaminationreport = (value: any) => {
    if (value.target.value === "Report available") {
      setState({ ...state, eyeExaminationreport: true });
    } else {
      setState({ ...state, eyeExaminationreport: false });
    }
  };
  const nephropathyChange = (value: any) => {
    if (value.target.value === "Yes") {
      setState({ ...state, nephropathyyes: true, nephropathyno: false });
    } else {
      setState({ ...state, nephropathyyes: false, nephropathyno: true });
    }
  };
  const patientNoneChange = (value: any) => {
    if (value.target.value === "None") {
      setState({ ...state, patientNone: true });
    } else {
      setState({ ...state, patientNone: false });
    }
  }; */
  const fbsChange = (value: any) => {
    /* if (value.target.value === "Yes") {
      setState({ ...state, showFasting: true });
    } else {
      setState({ ...state, showFasting: false });
    } */

    setDiabetes({
      ...diabetes,
      [value.target.name]: value.target.value,
    });
  };

  const dates = {
    fbs_date: diabetes?.fbs_date
      ? moment(diabetes?.fbs_date, dateFormat)
      : undefined,
    hba1c_date: diabetes?.hba1c_date
      ? moment(diabetes?.hba1c_date, dateFormat)
      : undefined,
    urine_microalbumin_date: diabetes?.urine_microalbumin_date
      ? moment(diabetes?.urine_microalbumin_date, dateFormat)
      : undefined,
    eye_exam_date: diabetes?.eye_exam_date
      ? moment(diabetes?.eye_exam_date, dateFormat)
      : undefined,
  };

  const onChange = (name: any, value: any) => {
    setDiabetes({
      ...diabetes,
      [name]: value,
    });
  };

  const defaultOptions = ["Yes", "No"];
  const eyeExamReportOptions = {
    "Report requested": "report_requested",
    "Patient will call with the name of the doctor to request report":
      "patient_call_doctor",
    "Report available": "report_available",
  };

  const eyeExamScriptOptions = {
    "Retinavue Ordered": "Yes",
    "Script given for Eye Examination": "No",
  };

  const nephroOptions = {
    "ACE Inhibitor": "ace_inhibitor",
    ARB: "arb",
    None: "none",
  };

  const ckdOptions = {
    "CKD Stage 4": "ckd_stage_4",
    "Patient see Nephrologist": "patient_see_nephrologist",
  };

  const nephroReportOptions = ["Positive", "Negative"];

  return (
    <div className="question-card">
      <h2 className="stepsheading">Diabetes</h2>
      <div className="row mb-2">
        <div className="col-lg-12">
          <div className="mb-3">
            <label className="question-text">
              Does the patient have an active diagnosis of diabetes?
            </label>
            <div>
              <Radio.Group
                name="diabetec_patient"
                onChange={(e) => patientDiabetes(e)}
                value={diabetes?.diabetec_patient}
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

          {showFbsBody && (
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div className="mb-3">
                <label className="question-text">
                  FBS done in the last 12 months ?
                </label>
                <div>
                  <Radio.Group
                    name="fbs_in_year"
                    onChange={(e) => fbsChange(e)}
                    value={diabetes?.fbs_in_year}
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

          {showFastingBloodSugarFieldsBody && (
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div className="row mb-3">
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">
                    Fasting Blood Sugar (FBS)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    className="form-control"
                    name="fbs_value"
                    placeholder="Fasting Blood Sugar"
                    value={diabetes?.fbs_value}
                    onChange={(e) => valueChange(e)}
                  />
                </div>

                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">
                    Fasting Blood Sugar (FBS) Date
                  </label>
                  <DatePicker
                    className="form-control"
                    name="fbs_date"
                    placeholder="Select FBS date"
                    value={dates.fbs_date}
                    onChange={(e, datestring) =>
                      onChange("fbs_date", datestring)
                    }
                    format={dateFormat}
                    picker="month"
                  />
                </div>
              </div>
            </div>
          )}

          {showDiabetesBody && (
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div className="row mb-3">
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">HBA1C Result</label>
                  <Input
                    onChange={valueChange}
                    type="text"
                    className="form-control"
                    name="hba1c_value"
                    placeholder="HBA1C Result"
                    value={diabetes?.hba1c_value}
                  />
                </div>
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">HBA1C Date</label>

                  <DatePicker
                    onChange={(e, dateString) =>
                      onChange("hba1c_date", dateString)
                    }
                    className="form-control"
                    value={dates?.hba1c_date}
                    format={"MM/YYYY"}
                    name="hba1c_date"
                    picker="month"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEyeandNephroBody && (
        <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
          <div className="row">
            <div className="col-lg-6 md-6 sm-12">
              <h6>Eye Examination</h6>

              <div className="mb-3">
                <label className="question-text">
                  Diabetic Eye Examination in the last 12 months ?
                </label>
                <div>
                  <Radio.Group
                    name="diabetec_eye_exam"
                    onChange={(e) => valueChange(e)}
                    value={diabetes?.diabetec_eye_exam}
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

              {showEyeReportBody && (
                <div
                  id=""
                  className={"d-block"}
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                >
                  <div className="mb-3">
                    <Radio.Group
                      name="diabetec_eye_exam_report"
                      onChange={(e) => valueChange(e)}
                      value={diabetes?.diabetec_eye_exam_report}
                    >
                      <Space direction="horizontal">
                        {Object.entries(eyeExamReportOptions).map(
                          ([key, value]) => (
                            <Radio value={value} key={key}>
                              {key}
                            </Radio>
                          )
                        )}
                      </Space>
                    </Radio.Group>
                  </div>

                  {showEyeExamFieldsBody && (
                    <div
                      id=""
                      className={"d-block"}
                      style={{ marginBottom: "10px", marginTop: "10px" }}
                    >
                      <div className="mb-3">
                        <Input
                          onChange={valueChange}
                          type="text"
                          className="form-control mt-2"
                          name="eye_exam_doctor"
                          placeholder="Name of Doctor"
                          value={diabetes?.eye_exam_doctor}
                        />
                        <Input
                          onChange={valueChange}
                          type="text"
                          className="form-control mt-2"
                          name="eye_exam_facility"
                          placeholder="Facility"
                          value={diabetes?.eye_exam_facility}
                        />
                        <DatePicker
                          onChange={(e, dateString) =>
                            onChange("eye_exam_date", dateString)
                          }
                          className="form-control mt-2"
                          value={dates?.eye_exam_date}
                          format={"MM/YYYY"}
                          name="eye_exam_date"
                          picker="month"
                          placeholder="Eye Exam date"
                        />
                        <Checkbox
                          className="mr-2"
                          name="eye_exam_report_reviewed"
                          value="1"
                          checked={diabetes?.eye_exam_report_reviewed === "1"}
                          onChange={valueChanges}
                        />
                        <label
                          className="question-text"
                          style={{ marginLeft: "20px" }}
                        >
                          Report reviewed
                        </label>
                      </div>

                      <div>
                        <label className="question-text">
                          Report Shows Diabetic Retinopathy
                        </label>
                        <div>
                          <Radio.Group
                            name="diabetec_ratinopathy"
                            onChange={(e) => valueChange(e)}
                            value={diabetes?.diabetec_ratinopathy}
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
              )}

              {showEyeScriptBody && (
                <div
                  id=""
                  className={"d-block"}
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                >
                  <Radio.Group
                    name="ratinavue_ordered"
                    onChange={(e) => valueChange(e)}
                    value={diabetes?.ratinavue_ordered}
                  >
                    <Space direction="horizontal">
                      {Object.entries(eyeExamScriptOptions).map(
                        ([key, value]) => (
                          <Radio value={value} key={key}>
                            {key}
                          </Radio>
                        )
                      )}
                    </Space>
                  </Radio.Group>
                </div>
              )}
            </div>

            <div className="col-lg-6 md-6 sm-12">
              <h6>Nephropathy</h6>
              <div className="mb-3">
                <label className="question-text">
                  Urine for microalbumin in last 6 months
                </label>
                <div>
                  <Radio.Group
                    name="urine_microalbumin"
                    onChange={(e) => valueChange(e)}
                    value={diabetes?.urine_microalbumin}
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

              {shownephroFieldsBody && (
                <div
                  id=""
                  className={"d-block"}
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                >
                  <div className="mb-3">
                    <label className="question-text">Microalbumin Value</label>
                    <Input
                      onChange={valueChange}
                      type="number"
                      className="form-control mt-2"
                      name="urine_microalbumin_value"
                      placeholder="Urine for Microalbumin Value"
                      value={diabetes?.urine_microalbumin_value}
                    />
                  </div>

                  <div>
                    <label className="question-text">Microalbumin Date</label>
                    <DatePicker
                      onChange={(e, dateString) =>
                        onChange("urine_microalbumin_date", dateString)
                      }
                      className="form-control"
                      value={dates?.urine_microalbumin_date}
                      format={"MM/YYYY"}
                      name="urine_microalbumin_date"
                      picker="month"
                    />
                  </div>

                  <div>
                    <Radio.Group
                      name="urine_microalbumin_report"
                      onChange={(e) => valueChange(e)}
                      value={diabetes?.urine_microalbumin_report}
                    >
                      <Space direction="horizontal">
                        {nephroReportOptions.map((item, key) => (
                          <Radio value={item} key={key}>
                            {item}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              )}

              {shownephroScriptBody && (
                <div
                  id=""
                  className={"d-block"}
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                >
                  <label className="question-text">
                    Urine for Micro-albumin ordered
                  </label>
                  <div className="mb-3">
                    <Radio.Group
                      name="urine_microalbumin_ordered"
                      onChange={(e) => valueChange(e)}
                      value={diabetes?.urine_microalbumin_ordered}
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

                  <label className="question-text">Does patient use</label>
                  <div>
                    <Radio.Group
                      name="urine_microalbumin_inhibitor"
                      onChange={(e) => valueChange(e)}
                      value={diabetes?.urine_microalbumin_inhibitor}
                    >
                      <Space direction="horizontal">
                        {Object.entries(nephroOptions).map(([key, value]) => (
                          <Radio value={value} key={key}>
                            {key}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>

                  {showCkdStage4BodyBody && (
                    <div
                      id=""
                      className={"d-block"}
                      style={{ marginBottom: "10px", marginTop: "10px" }}
                    >
                      <label className="question-text">Does patient has</label>
                      <div>
                        <Radio.Group
                          name="ckd_stage_4"
                          onChange={(e) => valueChange(e)}
                          value={diabetes?.ckd_stage_4}
                        >
                          <Space direction="horizontal">
                            {Object.entries(ckdOptions).map(([key, value]) => (
                              <Radio value={value} key={key}>
                                {key}
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
export default Diabetes;
