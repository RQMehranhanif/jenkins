import React from "react";
import { Button, DatePicker, Radio, Space } from "antd";

import {
  ImmunizationType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import moment from "moment";
import { OpenNotification } from "./../../../Utilties/Utilties";

function Immunization({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { immunization: storeImmunization },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [immunization, setImmunization] =
    React.useState<ImmunizationType>(storeImmunization);

  const defaultOptions = ["Yes", "No"];

  function valueChange(e: any) {
    const { value } = e.target;

    setImmunization({
      ...immunization,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const immunizationScreening = { ...immunization };
    Object.assign(immunizationScreening, completed);

    const response = await saveQuestionairsData(
      "immunization",
      immunizationScreening
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
    const immunizationScreening = { ...immunization };
    Object.assign(immunizationScreening, completed);

    const response = await saveQuestionairsData(
      "immunization",
      immunizationScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  /* FLU VACCINE STATE CONST */
  const [showFluVaccineBody, setShowFluVaccineBody] = React.useState<boolean>(
    Boolean(immunization?.flu_vaccine_recieved === "Yes") ?? false
  );
  const [showRefusedFluVaccineBody, setShowRefusedFluVaccineBody] =
    React.useState<boolean>(
      Boolean(immunization?.flu_vaccine_recieved === "No") ?? false
    );
  const [showScriptFluVaccineBody, setShowScriptFluVaccineBody] =
    React.useState<boolean>(
      Boolean(immunization?.flu_vaccine_refused === "No") ?? false
    );

  /* Flu Vaccine UES EFFECT */
  React.useEffect(() => {
    const recievedFluVaccine = immunization?.flu_vaccine_recieved;
    const refusedFluVaccine = immunization?.flu_vaccine_refused;

    if (recievedFluVaccine === "No") {
      setImmunization({
        ...immunization,
        flu_vaccine_recieved_on: "",
        flu_vaccine_recieved_at: "",
      });
    }

    if (recievedFluVaccine === "Yes") {
      setImmunization({
        ...immunization,
        flu_vaccine_refused: "",
        flu_vaccine_script_given: "",
      });
    }

    if (refusedFluVaccine === "Yes") {
      setImmunization({
        ...immunization,
        flu_vaccine_script_given: "",
      });
    }

    setShowFluVaccineBody(Boolean(recievedFluVaccine === "Yes"));
    setShowRefusedFluVaccineBody(Boolean(recievedFluVaccine === "No"));
    setShowScriptFluVaccineBody(Boolean(refusedFluVaccine === "No"));
  }, [immunization?.flu_vaccine_recieved, immunization?.flu_vaccine_refused]);

  React.useEffect(() => {
    const recievedFluVaccine = immunization?.flu_vaccine_recieved;
    const refusedFluVaccine = immunization?.flu_vaccine_refused;

    if (recievedFluVaccine === "Yes") {
      setImmunization({
        ...immunization,
        flu_vaccine_refused: "",
        flu_vaccine_script_given: "",
      });
    }

    setShowFluVaccineBody(Boolean(recievedFluVaccine === "Yes"));
    setShowRefusedFluVaccineBody(Boolean(recievedFluVaccine === "No"));
    setShowScriptFluVaccineBody(Boolean(refusedFluVaccine === "No"));
  }, [immunization?.flu_vaccine_recieved]);

  /* PNEUMOCOCCAL VACCINE CONST */
  const [showPneumococcalVaccineBody, setShowPneumococcalVaccineBody] =
    React.useState<boolean>(
      Boolean(immunization?.pneumococcal_vaccine_recieved === "Yes") ?? false
    );

  const [
    showRefusedPneumococcalVaccineBody,
    setShowRefusedPneumococcalVaccineBody,
  ] = React.useState<boolean>(
    Boolean(immunization?.pneumococcal_vaccine_recieved === "No") ?? false
  );

  const [showPneumococcalScriptBody, setShowPneumococcalScriptBody] =
    React.useState<boolean>(
      Boolean(immunization?.pneumococcal_vaccine_refused === "No") ?? false
    );

  React.useEffect(() => {
    const pneumococcalVaccineRecieved =
      immunization?.pneumococcal_vaccine_recieved;
    const pneumococcalVaccineRefused =
      immunization?.pneumococcal_vaccine_refused;

    if (pneumococcalVaccineRecieved === "No") {
      setImmunization({
        ...immunization,
        pneumococcal_prevnar_recieved_on: "",
        pneumococcal_prevnar_recieved_at: "",
        pneumococcal_ppsv23_recieved_on: "",
        pneumococcal_ppsv23_recieved_at: "",
      });
    }

    if (pneumococcalVaccineRecieved === "Yes") {
      setImmunization({
        ...immunization,
        pneumococcal_vaccine_refused: "",
        pneumococcal_vaccine_script_given: "",
      });
    }

    if (pneumococcalVaccineRefused === "Yes") {
      setImmunization({
        ...immunization,
        pneumococcal_vaccine_script_given: "",
      });
    }

    setShowPneumococcalVaccineBody(
      Boolean(pneumococcalVaccineRecieved === "Yes")
    );
    setShowRefusedPneumococcalVaccineBody(
      Boolean(pneumococcalVaccineRecieved === "No")
    );
    setShowPneumococcalScriptBody(Boolean(pneumococcalVaccineRefused === "No"));
  }, [
    immunization?.pneumococcal_vaccine_recieved,
    immunization?.pneumococcal_vaccine_refused,
  ]);

  React.useEffect(() => {
    const pneumococcalVaccineRecieved =
      immunization?.pneumococcal_vaccine_recieved;

    if (pneumococcalVaccineRecieved === "Yes") {
      setImmunization({
        ...immunization,
        pneumococcal_vaccine_refused: "",
        pneumococcal_vaccine_script_given: "",
      });
    }

    setShowPneumococcalVaccineBody(
      Boolean(pneumococcalVaccineRecieved === "Yes")
    );
    setShowRefusedPneumococcalVaccineBody(
      Boolean(pneumococcalVaccineRecieved === "No")
    );
  }, [immunization?.pneumococcal_vaccine_recieved]);

  const dateFormat = "MM/YYYY";

  const dates = {
    flu_vaccine_recieved_on: immunization?.flu_vaccine_recieved_on
      ? moment(immunization?.flu_vaccine_recieved_on, dateFormat)
      : undefined,

    pneumococcal_prevnar_recieved_on:
      immunization?.pneumococcal_prevnar_recieved_on
        ? moment(immunization?.pneumococcal_prevnar_recieved_on, dateFormat)
        : undefined,

    pneumococcal_ppsv23_recieved_on:
      immunization?.pneumococcal_ppsv23_recieved_on
        ? moment(immunization?.pneumococcal_ppsv23_recieved_on, dateFormat)
        : undefined,
  };

  function vaccineRecievedDate(name: string, value: string) {
    setImmunization({
      ...immunization,
      [name]: value,
    });
  }

  return (
    <div className="question-card">
      <h2 className="stepsheading">Immunization</h2>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <h6>Flu Vaccine</h6>

          <div className="mb-3">
            <label className="question-text">Received Flu Vaccine ?</label>
            <div>
              <Radio.Group
                name="flu_vaccine_recieved"
                onChange={(e) => valueChange(e)}
                value={immunization?.flu_vaccine_recieved}
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

          {/* Flu Vaccine Recieved data Body */}
          {showFluVaccineBody && (
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div className="mb-3">
                <label className="question-text">Flu vaccine Received on</label>
                <DatePicker
                  name="flu_vaccine_recieved_on"
                  className="form-control"
                  value={dates.flu_vaccine_recieved_on}
                  placeholder={"Select Flu vaccine date"}
                  onChange={(e, datestring) =>
                    vaccineRecievedDate("flu_vaccine_recieved_on", datestring)
                  }
                  format={dateFormat}
                  picker="month"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="mb-3">
                <label className="question-text">Flu vaccine Received at</label>
                <input
                  onChange={valueChange}
                  type="text"
                  className="form-control"
                  name="flu_vaccine_recieved_at"
                  placeholder="Flu Vaccine Received at place"
                  value={immunization?.flu_vaccine_recieved_at}
                />
              </div>
            </div>
          )}

          {/* Flu Vaccine Refused Body */}
          {showRefusedFluVaccineBody && (
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div className="mb-3">
                <label className="question-text">Refused Flu Vaccine ?</label>
                <div>
                  <Radio.Group
                    name="flu_vaccine_refused"
                    onChange={(e) => valueChange(e)}
                    value={immunization?.flu_vaccine_refused}
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

          {/* Flu Vaccine script body */}
          {showScriptFluVaccineBody && (
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div className="mb-3">
                <label className="question-text">
                  Script given for Flu Vaccine
                </label>
                <div>
                  <Radio.Group
                    name="flu_vaccine_script_given"
                    onChange={(e) => valueChange(e)}
                    value={immunization?.flu_vaccine_script_given}
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

        <div className="col-lg-6 md-6 sm-12">
          <h6>Pneumococcal Vaccine</h6>
          <div className="mb-3">
            <label className="question-text">
              Received Pneumococcal Vaccine ?
            </label>
            <div>
              <Radio.Group
                name="pneumococcal_vaccine_recieved"
                onChange={(e) => valueChange(e)}
                value={immunization?.pneumococcal_vaccine_recieved}
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

          {showPneumococcalVaccineBody && (
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div className="mb-3">
                <label className="question-text">Received Prevnar 13 on</label>
                <DatePicker
                  className="form-control"
                  name="pneumococcal_prevnar_recieved_on"
                  placeholder={"Select Prevnar 13 vaccine date"}
                  value={dates.pneumococcal_prevnar_recieved_on}
                  onChange={(e, datestring) =>
                    vaccineRecievedDate(
                      "pneumococcal_prevnar_recieved_on",
                      datestring
                    )
                  }
                  format={dateFormat}
                  picker="month"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="mb-3">
                <label className="question-text">Received Prevnar 13 at</label>
                <input
                  onChange={valueChange}
                  type="text"
                  className="form-control"
                  name="pneumococcal_prevnar_recieved_at"
                  placeholder="Prevnar 13 Vaccine Received at place"
                  value={immunization?.pneumococcal_prevnar_recieved_at}
                />
              </div>

              <div className="mb-3">
                <label className="question-text">Received PPSV 23 on</label>
                <DatePicker
                  className="form-control"
                  name="pneumococcal_ppsv23_recieved_on"
                  placeholder={"Select PPSV 23 vaccine date"}
                  value={dates.pneumococcal_ppsv23_recieved_on}
                  onChange={(e, datestring) =>
                    vaccineRecievedDate(
                      "pneumococcal_ppsv23_recieved_on",
                      datestring
                    )
                  }
                  format={dateFormat}
                  picker="month"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="mb-3">
                <label className="question-text">Received PPSV 23 at</label>
                <input
                  onChange={valueChange}
                  type="text"
                  className="form-control"
                  name="pneumococcal_ppsv23_recieved_at"
                  placeholder="PPSV 23 Vaccine Received at place"
                  value={immunization?.pneumococcal_ppsv23_recieved_at}
                />
              </div>
            </div>
          )}

          {/* Pneumococcal vaccine refused Body */}
          {showRefusedPneumococcalVaccineBody && (
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div className="mb-3">
                <label className="question-text">
                  Refused Pneumococcal Vaccine ?
                </label>
                <div>
                  <Radio.Group
                    name="pneumococcal_vaccine_refused"
                    onChange={(e) => valueChange(e)}
                    value={immunization?.pneumococcal_vaccine_refused}
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

          {/* Pneumococcal Vaccine script body */}
          {showPneumococcalScriptBody && (
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div className="mb-3">
                <label className="question-text">
                  Script given for Prevnar 13 / PPSV 23
                </label>
                <div>
                  <Radio.Group
                    name="pneumococcal_vaccine_script_given"
                    onChange={(e) => valueChange(e)}
                    value={immunization?.pneumococcal_vaccine_script_given}
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
            onChange={valueChange}
            value={immunization?.comments}
            rows={3}
            spellCheck="false"
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
export default Immunization;
