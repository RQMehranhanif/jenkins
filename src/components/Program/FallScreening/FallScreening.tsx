import React, { useEffect } from "react";
import { Button, DatePicker, Radio, Space } from "antd";
import "assets/css/questions_answers.css";
import {
  FallingScreenType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { setDateofService } from "../../../store/reducer/QuestionairesReducer";
import { OpenNotification } from "../../../Utilties/Utilties";
import moment from "moment";

const FallScreening: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  saveQuestionairsData,
}) => {
  const dispatch = useAppDispatch();
  const {
    question: { fall_screening },
    date_of_service,
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const defaultOptions = ["Yes", "No"];
  const assistanceDevices = [
    "Cane",
    "Walker",
    "Wheel Chair",
    "Crutches",
    "None",
  ];

  const [fallscreening, setFallscreening] = React.useState<FallingScreenType>(
    {} as any
  );

  useEffect(() => {
    setFallscreening(fall_screening);
  }, [fall_screening]);

  const [showFallScreeningBody, setShowFallScreeningBody] =
    React.useState<boolean>(
      Boolean(
        fallscreening?.fall_in_one_year === "Yes" ||
          fall_screening?.fall_in_one_year === "Yes"
      )
    );
  React.useEffect(() => {
    const fallScreening =
      fallscreening?.fall_in_one_year || fall_screening?.fall_in_one_year;

    if (fallscreening?.fall_in_one_year === "No") {
      setFallscreening({
        ...fallscreening,
        number_of_falls: "",
        injury: "",
        physical_therapy: "",
      });
    }

    setShowFallScreeningBody(Boolean(fallScreening === "Yes"));
  }, [fallscreening?.fall_in_one_year, fall_screening?.fall_in_one_year]);

  function valueChange(e: any) {
    const { value } = e.target;
    setFallscreening({
      ...fallscreening,
      [e.target.name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const fallScreening = { ...fallscreening };
    Object.assign(fallScreening, completed);

    const response = await saveQuestionairsData(
      "fall_screening",
      fallScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", response.errors);
    }
  };
  /* Screening Completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const fallScreening = { ...fallscreening };
    Object.assign(fallScreening, completed);

    const response = await saveQuestionairsData(
      "fall_screening",
      fallScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", response.errors);
    }
  };
  const format = "MM/DD/YYYY";
  const handledate = (date: any, dateString: any) => {
    dispatch(setDateofService(dateString));
  };

  const dateofService = moment(date_of_service).format(format);

  return (
    <>
      <div className="question-card">
        <div className="mb-3">
          <DatePicker
            format={format}
            placeholder="date of service"
            onChange={(date, dateString) =>
              handledate("date_of_service", dateString)
            }
            value={date_of_service ? moment(dateofService, format) : undefined}
          />
        </div>
        <h2 className="stepsheading">Physical Health - Fall Screening</h2>
        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <div className="mb-3">
              <label className="question-text">
                Have you fallen in the past 1 year?
              </label>
              <div>
                <Radio.Group
                  name="fall_in_one_year"
                  onChange={(e) => valueChange(e)}
                  value={fallscreening?.fall_in_one_year}
                >
                  <Space direction="vertical">
                    {defaultOptions.map((item, key) => (
                      <Radio value={item} key={key}>
                        {item}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>

            {showFallScreeningBody && (
              <div id="results" className={"d-block mb-3"}>
                <div className="mb-3">
                  <div>
                    <label className="question-text">
                      Number of times you fell in last 1 year
                    </label>
                  </div>

                  <div>
                    <Radio.Group
                      name="number_of_falls"
                      onChange={(e) => valueChange(e)}
                      value={fallscreening?.number_of_falls}
                    >
                      <Space direction="vertical">
                        <Radio value="One">One</Radio>
                        <Radio value="More then one">More then one</Radio>
                        <Radio value="Do not remember">Do not remember</Radio>
                      </Space>
                    </Radio.Group>
                  </div>
                </div>

                <div className="mb-3">
                  <div>
                    <label className="question-text">
                      Was there any injury?
                    </label>
                  </div>

                  <div>
                    <Radio.Group
                      name="injury"
                      onChange={(e) => valueChange(e)}
                      value={fallscreening?.injury}
                    >
                      <Space direction="vertical">
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
                  <div>
                    <label className="question-text">Physical Therapy</label>
                  </div>

                  <div>
                    <Radio.Group
                      name="physical_therapy"
                      onChange={(e) => valueChange(e)}
                      value={fallscreening?.physical_therapy}
                    >
                      <Space direction="vertical">
                        <Radio value="Referred">Referred</Radio>
                        <Radio value="Refused">Refused</Radio>
                        <Radio value="Already receiving">
                          Already receiving
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div>
                <label className="question-text">
                  Do you feel like “blacking out” when getting up from bed or
                  chair?
                </label>
              </div>

              <div>
                <Radio.Group
                  name="blackingout_from_bed"
                  onChange={(e) => valueChange(e)}
                  value={fallscreening?.blackingout_from_bed}
                >
                  <Space direction="vertical">
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
          <div className="col-lg-6 md-6 sm-12">
            <div className="mb-3">
              <label className="control-label question-text">
                Do you feel unsteady or do thing move when standing or walking?
              </label>
              <div>
                <Radio.Group
                  name="unsteady_todo_things"
                  onChange={(e) => valueChange(e)}
                  value={fallscreening?.unsteady_todo_things}
                >
                  <Space direction="vertical">
                    {defaultOptions.map((item, key) => (
                      <Radio value={item} key={key}>
                        {item}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>
            <div className="">
              <label className="question-text">
                Do you use any assistance device?
              </label>
              <br />
              <Radio.Group
                name="assistance_device"
                onChange={(e) => valueChange(e)}
                value={fallscreening?.assistance_device}
              >
                <Space direction="vertical">
                  {assistanceDevices.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>

              <br />
            </div>
          </div>
        </div>
        <Space>
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
export default FallScreening;
