import React from "react";
import { Button, Space } from "antd";
import {
  NutritionType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

function Nutrition({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { nutrition: storeNutrition },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [nutrition, setNutrition] =
    React.useState<NutritionType>(storeNutrition);

  function valueChange(e: any) {
    const { value } = e.target;

    setNutrition({
      ...nutrition,
      [e.target.name]: value,
    });
  }
  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const nutritionScreening = { ...nutrition };
    Object.assign(nutritionScreening, completed);

    const response = await saveQuestionairsData(
      "nutrition",
      nutritionScreening
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
    const nutritionScreening = { ...nutrition };
    Object.assign(nutritionScreening, completed);

    const response = await saveQuestionairsData(
      "nutrition",
      nutritionScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Nutrition</h2>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <div className="mb-3">
            <label className="question-text">
              In the past 7 days, how many servings of fruits and vegetables
              have you eaten each day?
            </label>
            <div>
              <span className="text-secondary">
                (1 serving = 1 cup of fresh vegetables, ½ cup of cooked
                vegetables, or 1 medium piece of fruit. 1 cup = size of a
                baseball.)
              </span>
            </div>
            <input
              type="number"
              min="0"
              onChange={valueChange}
              name="fruits_vegs"
              className="form-control  mt-2"
              placeholder="servings per day"
              value={nutrition?.fruits_vegs}
            />
          </div>

          <div className="mb-3">
            <label className="question-text">
              In the past 7 days, how many servings of high fiber or whole (not
              refined) grain foods have you typically eaten each day?
            </label>
            <div>
              <span className="text-secondary">
                (1 serving = 1 slice of 100% whole wheat bread, 1 cup of
                whole-grain or high-fiber ready-to-eat cereal, ½ cup of cooked
                cereal such as oatmeal, or ½ cup of cooked brown rice or whole
                wheat pasta.)
              </span>
            </div>
            <input
              type="number"
              min="0"
              onChange={valueChange}
              name="whole_grain_food"
              className="form-control  mt-2"
              placeholder="servings per day"
              value={nutrition?.whole_grain_food}
            />
          </div>

          <div className="mb-3">
            <label className="question-text">
              In the past 7 days, how many servings of fried or high-fat foods
              have you typically eaten each day?
            </label>
            <div>
              <span className="text-secondary">
                (Examples include fried chicken, fried fish, bacon, French
                fries, potato chips, corn chips, doughnuts, creamy salad
                dressings, and foods made with whole milk, cream, cheese, or
                mayonnaise.)
              </span>
            </div>
            <input
              type="number"
              min="0"
              onChange={valueChange}
              name="high_fat_food"
              className="form-control  mt-2"
              placeholder="servings per day"
              value={nutrition?.high_fat_food}
            />
          </div>

          <div className="mb-3">
            <label className="question-text">
              In the past 7 days, how many sugar-sweetened (not diet) beverages
              did you typically consume each day?
            </label>
            <input
              type="number"
              min="0"
              onChange={valueChange}
              name="sugar_beverages"
              className="form-control  mt-2"
              placeholder="servings per day"
              value={nutrition?.sugar_beverages}
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
  );
}
export default Nutrition;
