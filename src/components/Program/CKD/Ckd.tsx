import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { Button, Input, Space, Tooltip } from "antd";
import React, { useState } from "react";
import { QuestionaireStepProps } from "../../../Types/QuestionaireTypes";
import { CKDType } from "./../../../Types/QuestionaireTypes";
import { OpenNotification } from "./../../../Utilties/Utilties";
import DatePickerComponent from "../../../components/DatePickerComponent/DatePickerComponent";

const CKD: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const {
    question: { ckd_assessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [ckd, setCkd] = React.useState<CKDType>(ckd_assessment);
  const [count, setCount] = useState(1);
  const [bpRows, setBpRows] = useState<CKDType[]>([
    {
      key: 0,
      bp_day: "",
      systolic_day: "",
      diastolic_day: "",
    },
  ]);

  const dateFormat = "MM/DD/YYYY";

  const handlebpMonitor = (e: any, index: any) => {
    const bloodPressure = [...bpRows];
    const item = bloodPressure[index];
    Object.assign(item, { [e.target.name]: e.target.value });

    const assessmentCkd = { ...ckd, bp: bpRows };
    setCkd(assessmentCkd);
  };

  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const ckdAssessment = { ...ckd };
    Object.assign(ckdAssessment, completed);

    const response = await saveQuestionairsData(
      "ckd_assessment",
      ckdAssessment
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
    const ckdAssessment = { ...ckd };
    Object.assign(ckdAssessment, completed);

    await saveQuestionairsData("CKD", ckdAssessment);
    handleNextStep && handleNextStep();
  };
  const handleAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newdignoses: CKDType = {
      key: count,
      bp_day: "",
      systolic_day: "",
      diastolic_day: "",
    };
    const data = [...bpRows, newdignoses];
    setBpRows(data);
    setCount(count + 1);
  };
  const handleDelete = (index: any) => {
    const newData = bpRows.filter((item) => item.key !== index);
    setBpRows(newData);
  };

  function handlevalue(e: any) {
    const value = e.target.value;

    setCkd({
      ...ckd,
      [e.target.name]: value,
    });
  }

  function dateChange(name: string, value: string) {
    setCkd({
      ...ckd,
      [name]: value,
    });
  }

  function bpDateChange(name: string, value: string, index: number) {
    const bloodPressure = [...bpRows];
    const item = bloodPressure[index];
    Object.assign(item, { [name]: value });

    const assessmentCkd = { ...ckd, bp: bpRows };
    setCkd(assessmentCkd);
  }

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Chronic Kidney Disease</h2>

        {/* BLOOD PRESSURE MONITORING FIELDS */}
        <div>
          <label>
            If you have been monitoring your Blood pressure, please tell me the
            readings from the last three days.
          </label>
          <table className="table">
            <tbody>
              {bpRows?.map((items: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>
                      <DatePickerComponent
                        fieldName={"bp_day"}
                        value={ckd?.bp_day}
                        placeHolder={"BP Monitor date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          bpDateChange(key, value, index)
                        }
                      />
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <Input
                        type="number"
                        value={ckd?.systolic_day}
                        name="systolic_day"
                        size="middle"
                        placeholder="Systolic value"
                        onChange={(e) => handlebpMonitor(e, index)}
                      />
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <Input
                        type="number"
                        value={ckd?.diastolic_day}
                        name="diastolic_day"
                        placeholder="Diastolic value"
                        onChange={(e) => handlebpMonitor(e, index)}
                      />
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <Tooltip title={"Delete"}>
                        <Button danger size="small">
                          <i
                            className="fas fa-times"
                            onClick={() => handleDelete(index)}
                          ></i>
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Button onClick={handleAdd} className="mb-5" type="primary">
            Add a row
          </Button>
        </div>

        {/* HBA1C field and EFGR Fields */}
        <div>
          <div className="row">
            <div className="col-lg-6 mb-3">
              <Input
                value={ckd?.hba1c}
                name="hba1c"
                placeholder="HBA1C Result"
                onChange={(e) => handlevalue(e)}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="mb-2">
              <label htmlFor="">
                Mention the results of eGFR tests performed on two occasions
                within the last 12 months
              </label>
            </div>

            <div>
              <label>First test</label>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <DatePickerComponent
                  fieldName={"egfr_result_one_start_date"}
                  value={ckd?.egfr_result_one_start_date}
                  placeHolder={"EFGR Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="number"
                  name="egfr_result_one_report"
                  value={ckd?.egfr_result_one_report}
                  placeholder="EFGR Result"
                  onChange={(e) => handlevalue(e)}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div>
              <label>Second test</label>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <DatePickerComponent
                  fieldName={"egfr_result_two_start_date"}
                  value={ckd?.egfr_result_two_start_date}
                  placeHolder={"EFGR Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="number"
                  name="egfr_result_two_report"
                  value={ckd?.egfr_result_two_report}
                  placeholder="EFGR Result"
                  onChange={(e) => handlevalue(e)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Treatment Goals */}
        <div>
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
                    To acquire knowledge about CKD and how it can affect you
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"ak_ckd_start_date"}
                    value={ckd?.ak_ckd_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"ak_ckd_end_date"}
                    value={ckd?.ak_ckd_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To understand the relationship between chronic kidney
                    disease and cardiovascular risks
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"ur_kidney_disease_start_date"}
                    value={ckd?.ur_kidney_disease_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"ur_kidney_disease_end_date"}
                    value={ckd?.ur_kidney_disease_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To understand the impact of high blood pressure on
                    progression of CKD
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"uih_bp_start_date"}
                    value={ckd?.uih_bp_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"uih_bp_end_date"}
                    value={ckd?.uih_bp_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To recognize the importance of adopting lifestyle
                    modifications to mitigate risk of complications
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"ria_mitigate_risk_start_date"}
                    value={ckd?.ria_mitigate_risk_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"ria_mitigate_risk_end_date"}
                    value={ckd?.ria_mitigate_risk_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To understand the importance of smoking cessation
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"ui_smoking_cessation_start_date"}
                    value={ckd?.ui_smoking_cessation_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"ui_smoking_cessation_end_date"}
                    value={ckd?.ui_smoking_cessation_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To understand the importance of daily blood pressure
                    monitoring and maintaining a normal blood pressure.
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"uidbp_normalbp_start_date"}
                    value={ckd?.uidbp_normalbp_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"uidbp_normalbp_end_date"}
                    value={ckd?.uidbp_normalbp_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To recognize the importance of discipline in taking all
                    medications as prescribed
                  </label>
                </div>

                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"rid_medication_start_date"}
                    value={ckd?.rid_medication_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"rid_medication_end_date"}
                    value={ckd?.rid_medication_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To adopt dietary modifications suggested by the
                    PCP/nephrologist
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"adm_dietary_start_date"}
                    value={ckd?.adm_dietary_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"adm_dietary_end_date"}
                    value={ckd?.adm_dietary_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To maintain blood sugars in a healthy range, if you have
                    diabetes
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"mbshr_diabetes_start_date"}
                    value={ckd?.mbshr_diabetes_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"mbshr_diabetes_end_date"}
                    value={ckd?.mbshr_diabetes_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">To maintain a healthy Weight</label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"tmh_weight_start_date"}
                    value={ckd?.tmh_weight_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"tmh_weight_end_date"}
                    value={ckd?.tmh_weight_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To help the patient design a personalized strategy to manage
                    and influence their own condition
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"thp_strategy_start_date"}
                    value={ckd?.thp_strategy_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"thp_strategy_end_date"}
                    value={ckd?.thp_strategy_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <label htmlFor="">
                    To help the patient people cope with and adjust to CKD and
                    find sources of psychological support
                  </label>
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"thp_adjust_ckd_start_date"}
                    value={ckd?.thp_adjust_ckd_start_date}
                    placeHolder={"Start Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
                <div className="col-3">
                  <DatePickerComponent
                    fieldName={"thp_adjust_ckd_end_date"}
                    value={ckd?.thp_adjust_ckd_end_date}
                    placeHolder={"End Date"}
                    dateFormat={dateFormat}
                    handleChange={(key: string, value: string) =>
                      dateChange(key, value)
                    }
                  />
                </div>
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
export default CKD;
