import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import Steper, { StepperType } from "./steper/Steper";
import FallScreening from "./FallScreening/FallScreening";
import Depression from "./Depression/Depression";
import CognitiveAssesment from "./CognitiveAssesment/CognitiveAssesment";
import PhysicalActivity from "./PhysicalActivity/PhysicalActivity";
import AlcoholUse from "./AlcoholUse/AlcoholUse";
import GeneralHealth from "./GeneralHealth/GeneralHealth";
import TobaccoUse from "./TobaccoUse/TobaccoUse";
import LDCT from "./LDCT/LDCT";
import Nutrition from "./Nutrition/Nutrition";
import SeatBeltUse from "./SeatBeltUse/SeatBeltUse";
import Immunization from "./Immunization/Immunization";
import Screening from "./Screening/Screening";
import Diabetes from "./Diabetes/Diabetes";
import Cholesterol from "./Cholesterol/Cholesterol";
import BPAssessment from "./BPAssessment/BPAssessment";
import WeightAssessment from "./WeightAssessment/WeightAssessment";
import Miscellaneous from "./Miscellaneous/Miscellaneous";
import PhysicalExam from "./PhysicalExam/PhysicalExam";
import { Tooltip } from "antd";

interface Props {
  saveQuestionairsData: (key: string, data: any) => void;
  id: any;
  name: any;
  dob: any;
  gender: any;
  step: any;
  signed: any;
  insurance_name: string;
}
const Awv: React.FC<Props> = ({
  saveQuestionairsData,
  id,
  name,
  dob,
  gender,
  step,
  signed,
  insurance_name,
}) => {
  const {
    question: questionData,
    question: {
      fall_screening,
      depression_phq9,
      general_health,
      cognitive_assessment,
      physical_activities,
      alcohol_use,
      tobacco_use,
      ldct_counseling,
      nutrition,
      seatbelt_use,
      immunization,
      screening,
      diabetes,
      cholesterol_assessment,
      bp_assessment,
      weight_assessment,
      physical_exam,
      misc,
    },
    questionId,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [steps, setSteps] = useState<StepperType[]>([]);
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(step ?? 1);

  React.useEffect(() => {
    setSteps([
      {
        id: 1,
        label: "Fall Screening",
        show: true,
        color: fall_screening?.completed === "1" ? "complete" : "",
      },
      {
        id: 2,
        label: "Depression PHQ-9",
        show: true,
        color: depression_phq9?.completed === "1" ? "complete" : "",
      },
      {
        id: 3,
        label: "General Health",
        show: true,
        color: general_health?.completed === "1" ? "complete" : "",
      },
      {
        id: 4,
        label: "Cognitive Assesment",
        show: true,
        color: cognitive_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 5,
        label: "Physical Activity",
        show: true,
        color: physical_activities?.completed === "1" ? "complete" : "",
      },
      {
        id: 6,
        label: "Alcohol Use",
        show: true,
        color: alcohol_use?.completed === "1" ? "complete" : "",
      },
      {
        id: 7,
        label: "Tobacco Use",
        show: true,
        color: tobacco_use?.completed === "1" ? "complete" : "",
      },
      {
        id: 8,
        label: "LDCT",
        show: Boolean(
          ldct_counseling?.length || tobacco_use?.perform_ldct === "Yes"
        ),
        color: ldct_counseling?.completed === "1" ? "complete" : "",
      },
      {
        id: 9,
        label: "Nutrition",
        show: true,
        color: nutrition?.completed === "1" ? "complete" : "",
      },
      {
        id: 10,
        label: "Seat Belt Use",
        show: true,
        color: seatbelt_use?.completed === "1" ? "complete" : "",
      },
      {
        id: 11,
        label: "Immunization",
        show: true,
        color: immunization?.completed === "1" ? "complete" : "",
      },
      {
        id: 12,
        label: "Screening",
        show: true,
        color: screening?.completed === "1" ? "complete" : "",
      },
      {
        id: 13,
        label: "Diabetes",
        show: true,
        color: diabetes?.completed === "1" ? "complete" : "",
      },
      {
        id: 14,
        label: "Cholesterol",
        show: true,
        color: cholesterol_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 15,
        label: "BP Assessment",
        show: true,
        color: bp_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 16,
        label: "Weight Assessment",
        show: true,
        color: weight_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 17,
        label: "Physical Exam",
        show: true,
        color: physical_exam?.completed === "1" ? "complete" : "",
      },
      {
        id: 18,
        label: "Miscellaneous",
        show: true,
        color: misc?.completed === "1" ? "complete" : "",
      },
    ]);
  }, [questionData]);

  const handleNextStep = () => {
    document.getElementById("hello")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    const filterSteps = steps.filter(
      (step) => step.id > activeStep && step.show
    );

    const newActiveStep: StepperType =
      filterSteps.length > 0 ? filterSteps[0] : steps[0];
    setActiveStep(newActiveStep.id);
  };

  const handleLastStep = () => {
    if (activeStep === steps.length) {
      console.log("finish");
    }
  };

  const handlePreviousStep = () => {
    document.getElementById("hello")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    const filterSteps = steps.filter(
      (step) => step.id < activeStep && step.show
    );

    const newActiveStep: StepperType =
      filterSteps.length > 0 ? filterSteps[filterSteps.length - 1] : steps[0];
    setActiveStep(newActiveStep.id);
  };

  const handlecareplancion = () => {
    navigate(`/awvcareplan/${questionId}`, {
      state: { questionid: questionId },
    });
  };

  const handleShowSection = (isShow: boolean) => {
    const stepsArray = [...steps];
    let ldctStep = steps.filter((step) => step.id === 8)[0];
    const index = steps.findIndex((step) => step.id === ldctStep.id);
    ldctStep = { ...ldctStep, show: isShow };
    stepsArray[index] = ldctStep;
    setSteps(stepsArray);
  };
  return (
    <Container fluid id="hello">
      <Steper
        steps={steps}
        activeStep={activeStep}
        setActiveStep={(e) => setActiveStep(e)}
      />

      <div className="container-fluid pl-5  mb-2 mr-0">
        <div className="row">
          <div className="col-md-6 col-lg-10 col-xl-10">
            <p className="d-inline  text-uppercase text-dark">
              patient name: {name}
            </p>
            <p className="d-inline  text-uppercase text-dark ml-4">
              Date of birth: {dob}
            </p>
            <p className="d-inline  text-uppercase text-dark ml-4">Age: {id}</p>
            <p className="d-inline  text-uppercase text-dark ml-4">
              Gender: {gender}
            </p>

            <p className="d-inline  text-uppercase text-dark ml-4">
              Insurance: {insurance_name}
            </p>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-2 ">
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
      <div
        style={{
          opacity: signed ? 0.4 : 1,
          pointerEvents: signed ? "none" : "initial",
        }}
      >
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
          <GeneralHealth
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 4 && (
          <CognitiveAssesment
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 5 && (
          <PhysicalActivity
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 6 && (
          <AlcoholUse
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 7 && (
          <TobaccoUse
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            handleShowSection={handleShowSection}
            saveQuestionairsData={saveQuestionairsData}
            age={id}
          />
        )}
        {activeStep === 8 && (
          <LDCT
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}

        {activeStep === 9 && (
          <Nutrition
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 10 && (
          <SeatBeltUse
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 11 && (
          <Immunization
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 12 && (
          <Screening
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 13 && (
          <Diabetes
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 14 && (
          <Cholesterol
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 15 && (
          <BPAssessment
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 16 && (
          <WeightAssessment
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 17 && (
          <PhysicalExam
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
        {activeStep === 18 && (
          <Miscellaneous
            handleNextStep={handleLastStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
          />
        )}
      </div>
    </Container>
  );
};
export default Awv;
