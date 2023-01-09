import React from "react";
import "./steps.css";
export interface StepperType {
  id: number;
  label: string;
  show: boolean;
  color?: string;
}
interface Props {
  steps: StepperType[];
  activeStep: number;
  setActiveStep: (e: number) => void;
}
const Steper: React.FC<Props> = ({ steps, activeStep, setActiveStep }) => {
  const activeSteps = steps.filter((step) => step.show);
  return (
    <div
      className="arrow-steps clearfix"
      style={{ marginTop: "10px", marginBottom: "20px" }}
    >
      {activeSteps &&
        activeSteps.map((item, index) => (
          <div
            key={index}
            className={`step ${
              item.id === activeStep
                ? "current"
                : item.id < activeStep
                ? item.color //complete
                : item.color
            }`}
            onClick={() => setActiveStep(item.id)}
            /* onClick={() =>
          activeStep > 1
            ? setActiveStep(item.id)
            : OpenNotification("error", "Please fill step 1 first.")
        } */
          >
            <span>
              Step {++index}: {item.label}
            </span>
          </div>
        ))}
    </div>
  );
};
export default Steper;
