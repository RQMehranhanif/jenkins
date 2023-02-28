import React from "react";
import { Button, Checkbox, DatePicker, Input, Radio, Space } from "antd";
import {
  CholesterolType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import moment from "moment";
import { OpenNotification } from "./../../../Utilties/Utilties";

function Cholesterol({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { cholesterol_assessment: storeCholesterol },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const monthFormat = "MM/YYYY";

  const statinName = [
    "Atorvastatin",
    "Fluvastatin",
    "Lovastatin",
    "Pitavastatin",
    "Pravastatin",
    "Rosuvastatin",
    "Simvastatin",
  ];

  const statinModerateDosage = {
    Atorvastatin: "10 to 20 mg",
    Fluvastatin: "40 mg 2×/day; XL 80 mg",
    Lovastatin: "40 mg",
    Pitavastatin: "2 to 4 mg",
    Pravastatin: "40 to 80 mg",
    Rosuvastatin: "5 to 10 mg",
    Simvastatin: "20 to 40 mg",
  };

  const statinHighDosage = {
    Atorvastatin: "40 to 80 mg",
    Fluvastatin: "",
    Lovastatin: "",
    Pitavastatin: "",
    Pravastatin: "",
    Rosuvastatin: "20 to 40 mg",
    Simvastatin: "",
  };

  const [cholesterol, setCholesterol] =
    React.useState<CholesterolType>(storeCholesterol);

  const [showLDLFieldsBody, setShowLdlFieldsBody] = React.useState<boolean>(
    Boolean(cholesterol?.ldl_in_last_12months === "Yes")
  );
  const [showFastingDirectLdlBody, setShowFastingDirectLdlBody] =
    React.useState<boolean>(Boolean(cholesterol?.patient_has_ascvd === "No"));
  const [showDiabetesQuestionBody, setShowDiabetesQuestionBody] =
    React.useState<boolean>(
      Boolean(
        cholesterol?.ldlvalue_190ormore === "No" &&
          cholesterol?.pure_hypercholesterolemia === "No"
      )
    );
  const [showPatientAgeBody, setShowPatientAgeBody] = React.useState<boolean>(
    Boolean(cholesterol?.active_diabetes === "Yes")
  );
  const [showPastTwoyearLdlBody, setShowPastTwoyearLdlBody] =
    React.useState<boolean>(
      Boolean(cholesterol?.diabetes_patient_age === "Yes")
    );
  const [showStatinQuestionBody, setShowStatinQuestionBody] =
    React.useState<boolean>(
      Boolean(
        cholesterol?.patient_has_ascvd === "Yes" ||
          cholesterol?.ldlvalue_190ormore === "Yes" ||
          cholesterol?.pure_hypercholesterolemia === "Yes" ||
          cholesterol?.ldl_range_in_past_two_years === "Yes"
      )
    );

  const [showStatinTypeDosageBody, setShowStatinTypeDosageBody] =
    React.useState<boolean>(
      Boolean(
        (cholesterol?.patient_has_ascvd === "Yes" &&
          cholesterol?.statin_prescribed === "Yes") ||
          (cholesterol?.patient_has_ascvd === "No" &&
            cholesterol?.ldlvalue_190ormore === "Yes" &&
            cholesterol?.statin_prescribed === "Yes") ||
          (cholesterol?.patient_has_ascvd === "No" &&
            cholesterol?.pure_hypercholesterolemia === "Yes" &&
            cholesterol?.statin_prescribed === "Yes") ||
          (cholesterol?.patient_has_ascvd === "No" &&
            cholesterol?.active_diabetes === "Yes" &&
            cholesterol?.diabetes_patient_age === "Yes" &&
            cholesterol?.ldl_range_in_past_two_years === "Yes" &&
            cholesterol?.statin_prescribed === "Yes")
      )
    );
  const [showStatinReasonBody, setShowStatinReasonBody] =
    React.useState<boolean>(
      Boolean(
        (cholesterol?.patient_has_ascvd === "Yes" &&
          cholesterol?.statin_prescribed === "No") ||
          (cholesterol?.patient_has_ascvd === "No" &&
            cholesterol?.ldlvalue_190ormore === "Yes" &&
            cholesterol?.statin_prescribed === "No") ||
          (cholesterol?.patient_has_ascvd === "No" &&
            cholesterol?.pure_hypercholesterolemia === "Yes" &&
            cholesterol?.statin_prescribed === "No") ||
          (cholesterol?.patient_has_ascvd === "No" &&
            cholesterol?.active_diabetes === "Yes" &&
            cholesterol?.diabetes_patient_age === "Yes" &&
            cholesterol?.ldl_range_in_past_two_years === "Yes" &&
            cholesterol?.statin_prescribed === "No")
      )
    );

  /* LDL BODY USE EFFECT */
  React.useEffect(() => {
    const ldlDone = cholesterol?.ldl_in_last_12months;
    if (ldlDone === "No") {
      setCholesterol({
        ...cholesterol,
        ldl_value: "",
        ldl_date: "",
      });
    }
    setShowLdlFieldsBody(Boolean(ldlDone === "Yes"));
  }, [cholesterol?.ldl_in_last_12months]);

  /* SHOW STATIN QUESTION OR FASTING LDL QUESTION BODY */
  React.useEffect(() => {
    const patientHasAscvd = cholesterol?.patient_has_ascvd;
    const fastingLdlValue = cholesterol?.ldlvalue_190ormore;
    const pureHypercholesterolemia = cholesterol?.pure_hypercholesterolemia;
    const ldlRangeInTwoYears = cholesterol?.ldl_range_in_past_two_years;

    if (patientHasAscvd === "Yes") {
      setCholesterol({
        ...cholesterol,
        ldlvalue_190ormore: "",
        pure_hypercholesterolemia: "",
        active_diabetes: "",
        diabetes_patient_age: "",
        ldl_range_in_past_two_years: "",
      });
    }

    if (patientHasAscvd === "No") {
      setCholesterol({
        ...cholesterol,
        statin_prescribed: "",
        statintype_dosage: "",
        medical_reason_for_nostatin0: "",
        medical_reason_for_nostatin1: "",
        medical_reason_for_nostatin2: "",
        medical_reason_for_nostatin3: "",
        medical_reason_for_nostatin4: "",
        medical_reason_for_nostatin5: "",
      });
    }

    setShowStatinQuestionBody(
      Boolean(
        patientHasAscvd === "Yes" ||
          fastingLdlValue === "Yes" ||
          pureHypercholesterolemia === "Yes" ||
          ldlRangeInTwoYears === "Yes"
      )
    );
    setShowFastingDirectLdlBody(Boolean(patientHasAscvd === "No"));
  }, [
    cholesterol?.patient_has_ascvd,
    cholesterol?.ldlvalue_190ormore,
    cholesterol?.pure_hypercholesterolemia,
    cholesterol?.ldl_range_in_past_two_years,
  ]);

  /* Show Statin Type and Dosage Body */
  React.useEffect(() => {
    const statinPrescribed = cholesterol?.statin_prescribed;
    const hasAscvd = cholesterol?.patient_has_ascvd;
    const fastingLdl = cholesterol?.ldlvalue_190ormore;
    const pureHypercholesterol = cholesterol?.pure_hypercholesterolemia;
    const activeDiabetes = cholesterol?.active_diabetes;
    const patientAgeQuestion = cholesterol?.diabetes_patient_age;
    const ldlRange = cholesterol?.ldl_range_in_past_two_years;

    if (statinPrescribed === "Yes") {
      setCholesterol({
        ...cholesterol,
        medical_reason_for_nostatin0: "",
        medical_reason_for_nostatin1: "",
        medical_reason_for_nostatin2: "",
        medical_reason_for_nostatin3: "",
        medical_reason_for_nostatin4: "",
        medical_reason_for_nostatin5: "",
      });
    }

    if (statinPrescribed === "No") {
      console.log("no wali condition");
      setCholesterol({
        ...cholesterol,
        statintype_dosage: "",
      });
    }

    if (fastingLdl === "No" && pureHypercholesterol === "No") {
      setCholesterol({
        ...cholesterol,
        // statin_prescribed: "",
        statintype_dosage: "",
        medical_reason_for_nostatin0: "",
        medical_reason_for_nostatin1: "",
        medical_reason_for_nostatin2: "",
        medical_reason_for_nostatin3: "",
        medical_reason_for_nostatin4: "",
        medical_reason_for_nostatin5: "",
      });
    }

    setShowStatinTypeDosageBody(
      Boolean(
        (hasAscvd === "Yes" && statinPrescribed === "Yes") ||
          (hasAscvd === "No" &&
            fastingLdl === "Yes" &&
            statinPrescribed === "Yes") ||
          (hasAscvd === "No" &&
            pureHypercholesterol === "Yes" &&
            statinPrescribed === "Yes") ||
          (hasAscvd === "No" &&
            activeDiabetes === "Yes" &&
            patientAgeQuestion === "Yes" &&
            ldlRange === "Yes" &&
            statinPrescribed === "Yes")
      )
    );
    setShowStatinReasonBody(
      Boolean(
        (hasAscvd === "Yes" && statinPrescribed === "No") ||
          (hasAscvd === "No" &&
            fastingLdl === "Yes" &&
            statinPrescribed === "No") ||
          (hasAscvd === "No" &&
            pureHypercholesterol === "Yes" &&
            statinPrescribed === "No") ||
          (hasAscvd === "No" &&
            activeDiabetes === "Yes" &&
            patientAgeQuestion === "Yes" &&
            ldlRange === "Yes" &&
            statinPrescribed === "No")
      )
    );
  }, [cholesterol?.statin_prescribed]);

  React.useEffect(() => {
    const fastingLdlValue = cholesterol?.ldlvalue_190ormore;
    const pureHypercholesterolemia = cholesterol?.pure_hypercholesterolemia;

    if (fastingLdlValue === "Yes" || pureHypercholesterolemia === "Yes") {
      setCholesterol({
        ...cholesterol,
        active_diabetes: "",
        diabetes_patient_age: "",
        ldl_range_in_past_two_years: "",
      });
    }

    if (fastingLdlValue === "No" && pureHypercholesterolemia === "No") {
      setCholesterol({
        ...cholesterol,
        statin_prescribed: "",
        statintype_dosage: "",
        medical_reason_for_nostatin0: "",
        medical_reason_for_nostatin1: "",
        medical_reason_for_nostatin2: "",
        medical_reason_for_nostatin3: "",
        medical_reason_for_nostatin4: "",
        medical_reason_for_nostatin5: "",
      });
    }
    setShowDiabetesQuestionBody(
      Boolean(fastingLdlValue === "No" && pureHypercholesterolemia === "No")
    );
  }, [cholesterol?.ldlvalue_190ormore, cholesterol?.pure_hypercholesterolemia]);

  React.useEffect(() => {
    const activeDiabetes = cholesterol?.active_diabetes;

    if (activeDiabetes === "No") {
      setCholesterol({
        ...cholesterol,
        diabetes_patient_age: "",
        ldl_range_in_past_two_years: "",
      });
    }
    setShowPatientAgeBody(Boolean(activeDiabetes === "Yes"));
  }, [cholesterol?.active_diabetes]);

  React.useEffect(() => {
    const patientAgeEffect = cholesterol?.diabetes_patient_age;
    if (patientAgeEffect === "No") {
      setCholesterol({
        ...cholesterol,
        ldl_range_in_past_two_years: "",
      });
    }
    setShowPastTwoyearLdlBody(Boolean(patientAgeEffect === "Yes"));
  }, [cholesterol?.diabetes_patient_age]);

  function valueChange(e: any) {
    const { value } = e.target;
    setCholesterol({
      ...cholesterol,
      [e.target.name]: value,
    });
  }

  function reasonforNoStatin(e: any) {
    const value = e.target.checked === true ? e.target.value : "";
    console.log(value);
    setCholesterol({
      ...cholesterol,
      [e.target.name]: value,
    });
  }

  function dateChange(name: string, value: string) {
    console.log(name, value);
    setCholesterol({
      ...cholesterol,
      [name]: value,
    });
  }

  const defaultOptions = ["Yes", "No"];

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const cholesterolScreening = { ...cholesterol };
    Object.assign(cholesterolScreening, completed);

    const response = await saveQuestionairsData(
      "cholesterol_assessment",
      cholesterolScreening
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
    const cholesterolScreening = { ...cholesterol };
    Object.assign(cholesterolScreening, completed);

    const response = await saveQuestionairsData(
      "cholesterol_assessment",
      cholesterolScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };
  const dates = {
    ldl_date: cholesterol?.ldl_date
      ? moment(cholesterol?.ldl_date, monthFormat)
      : undefined,
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Cholesterol Assessment</h2>
      <div className="row mb-3">
        <div className="col-lg-12 md-12 sm-12">
          <div className="mb-3">
            <label className="question-text" style={{ marginRight: "10px" }}>
              LDL Done in last 12 months?
            </label>
            <div>
              <Radio.Group
                name="ldl_in_last_12months"
                onChange={(e) => {
                  valueChange(e);
                }}
                value={cholesterol?.ldl_in_last_12months}
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

          {showLDLFieldsBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="row">
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">LDL is ?</label>
                  <Input
                    onChange={valueChange}
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    name="ldl_value"
                    placeholder="LDL Result"
                    value={cholesterol?.ldl_value}
                  />
                </div>
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">Date</label>
                  <br />
                  <DatePicker
                    onChange={(e, datestring) =>
                      dateChange("ldl_date", datestring)
                    }
                    format={monthFormat}
                    picker="month"
                    className="form-control"
                    name="ldl_date"
                    placeholder="LDL Date"
                    value={dates?.ldl_date}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="question-text" style={{ marginRight: "10px" }}>
              Does the patient have ASCVD?
            </label>
            <div>
              <Radio.Group
                name="patient_has_ascvd"
                onChange={(e) => {
                  valueChange(e);
                }}
                value={cholesterol?.patient_has_ascvd}
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

          {showFastingDirectLdlBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="mb-3">
                <label className="question-text">
                  Fasting or direct LDL-C ≥ 190 mg/dL? Check from result above
                </label>
                <div>
                  <Radio.Group
                    name="ldlvalue_190ormore"
                    onChange={(e) => {
                      valueChange(e);
                    }}
                    value={cholesterol?.ldlvalue_190ormore}
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

              <div className="mb-3">
                <label className="question-text">
                  History or active diagnosis of familial or pure
                  hypercholesterolemia
                </label>

                <div>
                  <Radio.Group
                    name="pure_hypercholesterolemia"
                    onChange={(e) => {
                      valueChange(e);
                    }}
                    value={cholesterol?.pure_hypercholesterolemia}
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

          {showDiabetesQuestionBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <label className="question-text">
                Does Patient have active diagnosis of diabetes?
              </label>
              <div>
                <Radio.Group
                  name="active_diabetes"
                  onChange={(e) => {
                    valueChange(e);
                  }}
                  value={cholesterol?.active_diabetes}
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
          )}

          {showPatientAgeBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="row">
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">
                    Patient age between 40-75 years?
                  </label>

                  <div>
                    <Radio.Group
                      name="diabetes_patient_age"
                      onChange={(e) => {
                        valueChange(e);
                      }}
                      value={cholesterol?.diabetes_patient_age}
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
            </div>
          )}

          {showPastTwoyearLdlBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <label className="question-text">
                Fasting or Direct LDL-C 70-189 mg/dL any time in the past two
                years (2020-2022)?
              </label>
              <div>
                <Radio.Group
                  name="ldl_range_in_past_two_years"
                  onChange={(e) => {
                    valueChange(e);
                  }}
                  value={cholesterol?.ldl_range_in_past_two_years}
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
          )}

          {showStatinQuestionBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="row">
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">
                    Was the patient prescribed any high or moderate intensity
                    statin in the current calendar year?
                  </label>
                  <div>
                    <Radio.Group
                      name="statin_prescribed"
                      onChange={(e) => {
                        valueChange(e);
                      }}
                      value={cholesterol?.statin_prescribed}
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
            </div>
          )}

          {showStatinTypeDosageBody && (
            <div
              id=""
              className={"d-block"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <h6>Statin Type and dosage</h6>
              <div className="row">
                <div className="col-lg-4 md-4 sm-4">
                  <label className="question-text">
                    <b>Statin</b>
                  </label>
                  {statinName.map((item, key) => (
                    <div key={key}>
                      <label className="question-text" key={key}>
                        {" "}
                        {item}{" "}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="col-lg-4 md-4 sm-4">
                  <label className="question-text">
                    <b>
                      {"Moderate - intensity(LDL - C reduction 30 % to < 50)"}
                    </b>
                  </label>
                  <div>
                    <Radio.Group
                      name="statintype_dosage"
                      onChange={(e) => valueChange(e)}
                      value={cholesterol?.statintype_dosage}
                    >
                      <Space direction="vertical">
                        {Object.entries(statinModerateDosage).map(
                          ([key, value]) => (
                            <Radio value={key + value} key={key}>
                              {value}
                            </Radio>
                          )
                        )}
                      </Space>
                    </Radio.Group>
                  </div>
                </div>

                <div className="col-lg-4 md-4 sm-4">
                  <label className="question-text">
                    <b>{"High-intensity (LDL-C reduction >50%)"}</b>
                  </label>
                  <div>
                    <Radio.Group
                      name="statintype_dosage"
                      onChange={(e) => valueChange(e)}
                      value={cholesterol?.statintype_dosage}
                    >
                      <Space direction="vertical">
                        {Object.entries(statinHighDosage).map(([key, value]) =>
                          value != "" ? (
                            <Radio value={key + value} key={key}>
                              {value}
                            </Radio>
                          ) : (
                            <label className="question-text2" key={key}>
                              N/A
                            </label>
                          )
                        )}
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showStatinReasonBody && (
            <div
              id=""
              className={"d-block"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="row">
                <div className="col-lg-12 md-12 sm-12">
                  <label className="question-text">
                    Documented medical reason for not being on statin therapy
                    is:
                  </label>

                  <div>
                    <Space direction="horizontal">
                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin0"
                        value="Adverse side effect"
                        checked={
                          cholesterol?.medical_reason_for_nostatin0 ===
                          "Adverse side effect"
                        }
                        onChange={reasonforNoStatin}
                      >
                        Adverse side effect
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin1"
                        value="Allergy, Acute liver disease/ Hepatic insufficiency"
                        checked={
                          cholesterol?.medical_reason_for_nostatin1 ===
                          "Allergy, Acute liver disease/ Hepatic insufficiency"
                        }
                        onChange={reasonforNoStatin}
                      >
                        Allergy, Acute liver disease/ Hepatic insufficiency{" "}
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin2"
                        value="ESRD"
                        checked={
                          cholesterol?.medical_reason_for_nostatin2 === "ESRD"
                        }
                        onChange={reasonforNoStatin}
                      >
                        ESRD{" "}
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin3"
                        value="Rhabdomyolysis"
                        checked={
                          cholesterol?.medical_reason_for_nostatin3 ===
                          "Rhabdomyolysis"
                        }
                        onChange={reasonforNoStatin}
                      >
                        Rhabdomyolysis{" "}
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin4"
                        value="Pregnancy/Breastfeeding"
                        checked={
                          cholesterol?.medical_reason_for_nostatin4 ===
                          "Pregnancy/Breastfeeding"
                        }
                        onChange={reasonforNoStatin}
                      >
                        Pregnancy/Breastfeeding{" "}
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin5"
                        value="In Hospice"
                        checked={
                          cholesterol?.medical_reason_for_nostatin5 ===
                          "In Hospice"
                        }
                        onChange={reasonforNoStatin}
                      >
                        In Hospice{" "}
                      </Checkbox>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-lg-6 md-6 sm-12"></div>
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
export default Cholesterol;
