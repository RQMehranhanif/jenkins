import React from "react";
import { Button, Space } from "antd";
import {
  PhysicalExamType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

const PhysicalExam: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const {
    question: { physical_exam },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [physical, setPhysical] =
    React.useState<PhysicalExamType>(physical_exam);

  function valueChange(e: any) {
    const { value } = e.target;

    setPhysical({
      ...physical,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const physicalExam = { ...physical };
    Object.assign(physicalExam, completed);

    const response = await saveQuestionairsData("physical_exam", physicalExam);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Screening Completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const physicalExam = { ...physical };
    Object.assign(physicalExam, completed);

    const response = await saveQuestionairsData("physical_exam", physicalExam);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Physical Exam</h2>
        <div className="row mb-2">
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">General</label>
            <select
              name="general"
              id=""
              onChange={valueChange}
              value={physical?.general}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Eyes</label>
            <select
              name="eyes"
              id=""
              onChange={valueChange}
              value={physical?.eyes}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Neck</label>
            <select
              name="neck"
              id=""
              onChange={valueChange}
              value={physical?.neck}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Lungs</label>
            <select
              name="lungs"
              id=""
              onChange={valueChange}
              value={physical?.lungs}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Heart</label>
            <select
              name="heart"
              id=""
              onChange={valueChange}
              value={physical?.heart}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Neuro</label>
            <select
              name="neuro"
              id=""
              onChange={valueChange}
              value={physical?.neuro}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Extremeties</label>
            <select
              name="extremeties"
              id=""
              onChange={valueChange}
              value={physical?.extremeties}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">GI</label>
            <select
              name="gi"
              id=""
              onChange={valueChange}
              value={physical?.gi}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Ears</label>
            <select
              name="ears"
              id=""
              onChange={valueChange}
              value={physical?.ears}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Nose</label>
            <select
              name="nose"
              id=""
              onChange={valueChange}
              value={physical?.nose}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Throat</label>
            <select
              name="throat"
              id=""
              onChange={valueChange}
              value={physical?.throat}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Skin</label>
            <select
              name="skin"
              id=""
              onChange={valueChange}
              value={physical?.skin}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">Oral cavity</label>
            <select
              name="oral_cavity"
              id=""
              onChange={valueChange}
              value={physical?.oral_cavity}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="">MS</label>
            <select
              name="ms"
              id=""
              onChange={valueChange}
              value={physical?.ms}
              className="form-control"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
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
export default PhysicalExam;
