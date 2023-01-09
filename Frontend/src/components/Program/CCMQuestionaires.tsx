/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Steper, { StepperType } from "./steper/Steper";

import { Container } from "react-bootstrap";
import FallScreening from "./FallScreening/FallScreening";
import Depression from "./Depression/Depression";
import CognitiveAssesment from "./CognitiveAssesment/CognitiveAssesment";
import ChronicObstructivePulmonaryDisease from "./COPD/ChronicObstructivePulmonaryDisease";
import Obesity from "./Obesity/Obesity";
import CKD from "./CKD/Ckd";
import CongestiveHeartFailure from "./CongestiveHeartFailure/CongestiveHeartFailure";
import CaregiverAssessment from "./Caregiver/CaregiverAssessment";
import Hypercholesterolemia from "./Hypercholesterolemia/Hypercholesterolemia";
import Immunization from "./Immunization/Immunization";
import Screening from "./Screening/Screening";
import GeneralAssesment from "./GeneralAssesment/GeneralAssesment";
import OtherProvider from "./Provider/OtherProvider";
import Hypertensions from "./Hypertension/Hypertention";
import DiabetesMellitus from "./DiabetesMellitus/DiabetesMellitus";
import MonthlyAssessment from "./MonthlyAssessment/MonthlyAssessment";
import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";

interface Props {
  saveQuestionairsData: (key: string, data: any) => void;
  patient: any;
  diagnosis: any;
  id: any;
  name: any;
  dob: any;
  gender: any;
  insurance_name: string;
}
const CCM: React.FC<Props> = ({
  saveQuestionairsData,
  patient,
  diagnosis,
  id,
  name,
  dob,
  gender,
  insurance_name,
}) => {
  const {
    question: { ldct_counseling, tobacco_use },
    questionId,
    patientProfile,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [steps, setSteps] = useState<StepperType[]>([
    { id: 1, label: "Fall Screening", show: true },
    { id: 2, label: "Depression PHQ-9", show: true },
    { id: 3, label: "Cognitive Assesment", show: true },
    { id: 4, label: "Caregiver Assesment", show: true },
    { id: 5, label: "Other Provider", show: true },
    { id: 6, label: "Immunization", show: true },
    { id: 7, label: "Screening", show: true },
    { id: 8, label: "General Assessment", show: true },
    { id: 9, label: "Monthly Assessment", show: true },
    {
      id: 10,
      label: "Obesity",
      show: Boolean(diagnosis?.Obesity === "true"),
    },
    {
      id: 11,
      label: "Chronic Obstructive Pulmonary Disease",
      show: Boolean(diagnosis?.ChronicObstructivePulmonaryDisease === "true"),
    },
    {
      id: 12,
      label: "Chronic Kidney Disease",
      show: Boolean(diagnosis?.CKD === "true"),
    },
    {
      id: 13,
      label: "Congestive Heart Faliure",
      show: Boolean(diagnosis?.CongestiveHeartFailure === "true"),
    },
    {
      id: 14,
      label: "Hypercholestrolemia",
      show: Boolean(diagnosis?.Hypercholesterolemia === "true"),
    },
    {
      id: 15,
      label: "Hypertension",
      show: Boolean(diagnosis?.Hypertensions === "true"),
    },
    {
      id: 16,
      label: "Diabetes",
      show: Boolean(diagnosis?.DiabetesMellitus === "true"),
    },
  ]);

  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();
  const handleNextStep = () => {
    if (activeStep === steps.length) {
      navigate(`/ccm-general-careplan/${questionId}`, {
        state: { questionid: questionId },
      });
      return;
    }
    const filterSteps = steps.filter(
      (step) => step.id > activeStep && step.show
    );

    const newActiveStep: StepperType =
      filterSteps.length > 0 ? filterSteps[0] : steps[0];
    setActiveStep(newActiveStep.id);
  };
  const handlePreviousStep = () => {
    const filterSteps = steps.filter(
      (step) => step.id < activeStep && step.show
    );

    const newActiveStep: StepperType =
      filterSteps.length > 0 ? filterSteps[filterSteps.length - 1] : steps[0];
    setActiveStep(newActiveStep.id);
  };

  const handlecareplancion = () => {
    navigate(`/ccm-general-careplan/${questionId}`, {
      state: { questionid: questionId },
    });
  };
  return (
    <>
      <Container fluid>
        <Steper
          steps={steps}
          activeStep={activeStep}
          setActiveStep={(e) => setActiveStep(e)}
        />
        <div className="container-fluid  pl-5 mb-2 ">
          <div className="row">
            <div className="col-md-6 col-lg-10 col-xl-10">
              <p className="d-inline text-nowrap text-uppercase text-dark">
                patient name: {name}
              </p>
              <p className="d-inline text-nowrap text-uppercase text-dark ml-4">
                Date of birth: {dob}
              </p>
              <p className="d-inline text-nowrap text-uppercase text-dark ml-4">
                Age: {id}
              </p>
              <p className="d-inline text-nowrap text-uppercase text-dark ml-4">
                Gender: {gender}
              </p>
              <p className="d-inline  text-uppercase text-dark ml-4">
                Insurance: {insurance_name}
              </p>
            </div>

            <div className="col-md-6 col-lg-4 col-xl-2">
              <h6 className="d-inline ">
                <Tooltip title="Careplan">
                  <a onClick={() => handlecareplancion()}>
                    <i className="fas fa-laptop-medical"></i>
                  </a>
                </Tooltip>
              </h6>
            </div>
          </div>
        </div>
        {activeStep === 1 && (
          <FallScreening
            handleNextStep={handleNextStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 2 && (
          <Depression
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 3 && (
          <CognitiveAssesment
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 4 && (
          <CaregiverAssessment
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 5 && (
          <OtherProvider
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 6 && (
          <Immunization
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 7 && (
          <Screening
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 8 && (
          <GeneralAssesment
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
            patientdata={patient}
          />
        )}

        {activeStep === 9 && (
          <MonthlyAssessment
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
            patientdata={patient}
          />
        )}

        {activeStep === 10 && (
          <Obesity
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 11 && (
          <ChronicObstructivePulmonaryDisease
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 12 && (
          <CKD
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 13 && (
          <CongestiveHeartFailure
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}

        {activeStep === 14 && (
          <Hypercholesterolemia
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 15 && (
          <Hypertensions
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 16 && (
          <DiabetesMellitus
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
      </Container>
    </>
  );
};
export default CCM;
