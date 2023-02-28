import React, { useEffect, useState } from "react";
import { Button, Radio, Space } from "antd";
import {
  TobaccoUseType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "@/store/store";
import { OpenNotification } from "./../../../Utilties/Utilties";

const TobaccoUse: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
  handleShowSection,
  age,
}) => {
  const {
    question: { tobacco_use },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const defaultOptions = ["Yes", "No"];
  const [tobacco, setTobacco] = React.useState<TobaccoUseType>(tobacco_use);
  const [state, setState] = useState(false);

  /* useEffect(() => {
    const show = Boolean(
      tobacco?.smokeless_product_use === "Yes" ||
        tobacco?.smoked_in_thirty_days === "Yes" ||
        tobacco?.smoked_in_fifteen_years === "Yes" ||
        tobacco_use?.smokeless_product_use === "Yes" ||
        tobacco_use?.smoked_in_thirty_days === "Yes" ||
        tobacco_use?.smoked_in_fifteen_years === "Yes"
    );

    if (show === false) {
      setTobacco({
        ...tobacco,
        average_smoking_years: "",
        average_packs_per_day: "",
        average_packs_per_year: "",
        quit_tobacco: "",
        perform_ldct: ""
      })

      const isShow = Boolean(tobacco?.perform_ldct === "Yes");
      handleShowSection != null && handleShowSection(isShow);
    }

    console.log(show);
    setState(show);

  }, [
    tobacco?.smokeless_product_use,
    tobacco?.smoked_in_thirty_days,
    tobacco?.smoked_in_fifteen_years,
    tobacco_use?.smokeless_product_use,
    tobacco_use?.smoked_in_thirty_days,
    tobacco_use?.smoked_in_fifteen_years,
  ]); */

  React.useEffect(() => {
    const smokingInlast30Days = tobacco?.smoked_in_thirty_days;
    const useSmokelessProduct = tobacco?.smokeless_product_use;
    const smokedInfifteenyears = tobacco?.smoked_in_fifteen_years;

    if (smokingInlast30Days === "Yes") {
      setTobacco({
        ...tobacco,
        smoked_in_fifteen_years: "Yes",
      });
    } else {
      setTobacco({
        ...tobacco,
        smoked_in_fifteen_years: tobacco?.smoked_in_fifteen_years,
      });
    }

    const show = Boolean(
      smokingInlast30Days === "Yes" ||
        useSmokelessProduct === "Yes" ||
        smokedInfifteenyears === "Yes"
    );
    setState(show);
  }, [tobacco?.smoked_in_thirty_days]);

  React.useEffect(() => {
    const smokingInlast30Days = tobacco?.smoked_in_thirty_days;
    const useSmokelessProduct = tobacco?.smokeless_product_use;
    const smokedInfifteenyears = tobacco?.smoked_in_fifteen_years;

    if (
      smokingInlast30Days === "No" &&
      useSmokelessProduct === "No" &&
      smokedInfifteenyears === "No"
    ) {
      const isShow = Boolean(false);
      handleShowSection != null && handleShowSection(isShow);
      console.log(isShow);

      setTobacco({
        ...tobacco,
        average_smoking_years: "",
        average_packs_per_day: "",
        average_packs_per_year: "",
        quit_tobacco: "",
        perform_ldct: "",
      });
    }

    const show = Boolean(
      smokingInlast30Days === "Yes" ||
        useSmokelessProduct === "Yes" ||
        smokedInfifteenyears === "Yes"
    );
    setState(show);
  }, [
    tobacco?.smoked_in_thirty_days,
    tobacco?.smokeless_product_use,
    tobacco?.smoked_in_fifteen_years,
  ]);

  /*  React.useEffect(() => {
     const smokeInthirtyDays = tobacco?.smoked_in_thirty_days;
     const useSmokelessProduct = tobacco?.smokeless_product_use;
     const smokedInfifteenyears = tobacco?.smoked_in_fifteen_years;
 
     if (smokeInthirtyDays === "No" && useSmokelessProduct === "No" && smokedInfifteenyears === "No") {
       setTobacco({
         ...tobacco,
         average_smoking_years: "",
         average_packs_per_day: "",
         average_packs_per_year: "",
         quit_tobacco: "",
         perform_ldct: ""
       })
 
       const isShow = Boolean(tobacco?.perform_ldct === "Yes");
       handleShowSection != null && handleShowSection(isShow);
     }
 
     const show = Boolean(
       smokeInthirtyDays === "Yes" ||
       useSmokelessProduct === "Yes" ||
       smokedInfifteenyears === "Yes"
     );
     setState(show);
   }, [tobacco?.smokeless_product_use])
 
 
   React.useEffect(() => {
     const smokeInthirtyDays = tobacco?.smoked_in_thirty_days;
     const useSmokelessProduct = tobacco?.smokeless_product_use;
     const smokedInfifteenyears = tobacco?.smoked_in_fifteen_years;
 
     if (smokeInthirtyDays === "No" && useSmokelessProduct === "No" && smokedInfifteenyears === "No") {
       setTobacco({
         ...tobacco,
         average_smoking_years: "",
         average_packs_per_day: "",
         average_packs_per_year: "",
         quit_tobacco: "",
         perform_ldct: ""
       })
 
       const isShow = Boolean(tobacco?.perform_ldct === "Yes");
       handleShowSection != null && handleShowSection(isShow);
     }
 
     const show = Boolean(
       smokeInthirtyDays === "Yes" ||
       useSmokelessProduct === "Yes" ||
       smokedInfifteenyears === "Yes"
     );
     setState(show);
   }, [tobacco?.smoked_in_fifteen_years]) */

  const [showLdctQuestion, setShowLdctQuestion] =
    React.useState<boolean>(false);
  useEffect(() => {
    const open = Boolean(
      (age > 50 && age < 85 && tobacco?.average_packs_per_year > 30) ||
        (age > 50 && age < 85 && tobacco_use?.average_packs_per_year > 30)
    );
    setShowLdctQuestion(open);
  }, [
    age,
    tobacco?.average_packs_per_year,
    age,
    tobacco_use?.average_packs_per_year,
  ]);

  function valueChange(e: any) {
    const { value } = e.target;

    setTobacco({
      ...tobacco,
      [e.target.name]: value,
    });

    if (e.target.name === "perform_ldct") {
      const isShow = Boolean(value === "Yes");
      handleShowSection != null && handleShowSection(isShow);
    }
  }

  useEffect(() => {
    if (
      tobacco?.average_packs_per_day > 0 &&
      tobacco?.average_smoking_years > 0
    ) {
      let avg = tobacco?.average_packs_per_day * tobacco?.average_smoking_years;
      avg = !isNaN(avg) ? avg : 0;
      const avgSmokingperyear = avg === 0 ? "" : avg;
      const ldct = isNaN(avg) || avg === 0 ? "" : tobacco?.perform_ldct;

      const isShow = Boolean(ldct === "Yes");
      handleShowSection != null && handleShowSection(isShow);

      setTobacco({
        ...tobacco,
        average_packs_per_year: avgSmokingperyear,
        perform_ldct: ldct,
      });
    } else {
      let avg = tobacco?.average_packs_per_day * tobacco?.average_smoking_years;
      avg = !isNaN(avg) ? avg : 0;
      const avgSmokingperyear = avg === 0 ? "" : avg;
      const ldct = isNaN(avg) || avg === 0 ? "" : tobacco?.perform_ldct;
      console.log(avg, ldct, "checkavg");

      const isShow = Boolean(ldct === "Yes");
      handleShowSection != null && handleShowSection(isShow);

      setTobacco({
        ...tobacco,
        average_packs_per_year: avgSmokingperyear,
        perform_ldct: ldct,
      });
    }
  }, [tobacco?.average_smoking_years, tobacco?.average_packs_per_day]);

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const tobaccoScreening = { ...tobacco };
    Object.assign(tobaccoScreening, completed);

    const response = await saveQuestionairsData(
      "tobacco_use",
      tobaccoScreening
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
    const tobaccoScreening = { ...tobacco };
    Object.assign(tobaccoScreening, completed);

    const response = await saveQuestionairsData(
      "tobacco_use",
      tobaccoScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Tobacco Use</h2>
      <div className="row mb-2">
        <div className="col-lg-12 md-12 sm-12">
          <label className="question-text">Patient Age?</label>
          <input
            type="number"
            className="form-control"
            value={age}
            disabled
            name="patient_age"
          />
        </div>
        <div className="col-lg-6 md-6 sm-12 mt-4">
          <label className="question-text">
            In the last 30 days, have you used tobacco?
          </label>

          <Radio.Group
            name="smoked_in_thirty_days"
            onChange={(e) => {
              valueChange(e);
            }}
            value={tobacco?.smoked_in_thirty_days}
          >
            {defaultOptions.map((item, key) => (
              <Radio value={item} key={key}>
                {item}
              </Radio>
            ))}
          </Radio.Group>
          <br />

          <label className="question-text">
            Have you ever used a smokeless tobacco product?
          </label>
          <Radio.Group
            name="smokeless_product_use"
            onChange={(e) => {
              valueChange(e);
            }}
            value={tobacco?.smokeless_product_use}
          >
            {defaultOptions.map((item, key) => (
              <Radio value={item} key={key}>
                {item}
              </Radio>
            ))}
          </Radio.Group>
          <br />
          <label className="question-text">
            In the last 15 years, have you used tobacco?
          </label>
          <Radio.Group
            name="smoked_in_fifteen_years"
            onChange={(e) => {
              valueChange(e);
            }}
            value={tobacco?.smoked_in_fifteen_years}
          >
            {defaultOptions.map((item, key) => (
              <Radio value={item} key={key}>
                {item}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>
      {state && (
        <div id="results" style={{ marginBottom: "10px" }}>
          <div className="row">
            <div className="col-lg-12 md-12 sm-12">
              <label className="question-text">Average smoking years?</label>
              <input
                type="number"
                min="0"
                name="average_smoking_years"
                className="form-control"
                value={tobacco?.average_smoking_years}
                onChange={(e) => {
                  valueChange(e);
                }}
                placeholder="Average smoking years"
              />
            </div>
            <div className="col-lg-12 md-12 sm-12 mt-2">
              <label className="question-text">Average packs per day?</label>
              <input
                type="number"
                min="0"
                name="average_packs_per_day"
                value={tobacco?.average_packs_per_day}
                className="form-control"
                onChange={(e) => {
                  valueChange(e);
                }}
                placeholder="Average packs per day"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 md-12 sm-12 mt-2 mb-2">
              <label className="question-text">Average packs per year?</label>
              <input
                type="number"
                min="0"
                name="average_packs_per_year"
                value={tobacco?.average_packs_per_year}
                onSelect={(e) => {
                  valueChange(e);
                }}
                className="form-control"
                disabled
                placeholder="Average packs per year"
              />
            </div>
            <div className="col-lg-12 md-12 sm-12">
              <label className="question-text">
                Would you be interested in quitting tobacco use within the next
                month?
              </label>{" "}
              <Radio.Group
                name="quit_tobacco"
                onChange={(e) => {
                  valueChange(e);
                }}
                value={tobacco?.quit_tobacco}
              >
                {defaultOptions.map((item, key) => (
                  <Radio value={item} key={key}>
                    {item}
                  </Radio>
                ))}
              </Radio.Group>
            </div>

            <div
              id="results"
              className={showLdctQuestion ? "d-block" : "d-none"}
              style={{ marginBottom: "10px" }}
            >
              <div className="col-lg-12 md-6 sm-12">
                <label className="question-text">
                  Would you be interested to Perform LDCT?
                </label>

                <Radio.Group
                  name="perform_ldct"
                  onChange={(e) => {
                    valueChange(e);
                  }}
                  value={tobacco?.perform_ldct}
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
export default TobaccoUse;
