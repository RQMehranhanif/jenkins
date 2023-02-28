import React from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { Form, Button, DatePicker, TimePicker } from "antd";
import ScheduleTypes from "../../../../Types/ScheduleTypes";

interface Props {
  isOpen: boolean;
  title: string;
  disablePatientSelection: boolean;
  scheduled: ScheduleTypes;
  handleChange: (e: any) => void;
  handledateChange: (name: any, datestring: any) => void;
  handleCloseModel: () => void;
  handleSubmit: () => void;
  patientData: any;
  loading: any;
}

const ScheduledForm: React.FC<Props> = ({
  isOpen,
  title,
  disablePatientSelection,
  scheduled,
  loading,
  handleChange,
  handleCloseModel,
  handleSubmit,
  patientData,
  handledateChange,
}) => {
  const dates = {
    date: scheduled.scheduled_date
      ? moment(scheduled.scheduled_date, "YYYY-MM-DD")
      : undefined,
    time: scheduled.scheduled_time
      ? moment(scheduled.scheduled_time, "HH:mm:ss")
      : undefined,
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => handleCloseModel()}
      style={{ zIndex: "1050" }}
    >
      <Modal.Header className="pt-0 bg-info" style={{ color: "white" }}>
        <Modal.Title style={{ fontSize: "18px" }} className="mt-2 mb-2">
          {title}
        </Modal.Title>
        <i
          className="fa fa-times float-right mt-3 cursor-pointer"
          aria-hidden="true"
          onClick={() => handleCloseModel()}
        ></i>
      </Modal.Header>
      <Modal.Body style={{ lineHeight: "1.9rem" }}>
        <Form onFinish={() => handleSubmit()}>
          <label className="required-field">Patient</label>
          <select
            required
            placeholder="Select Patient"
            className="form-control "
            name="patient_id"
            onChange={(e) => handleChange(e)}
            value={scheduled?.patient_id}
            disabled={disablePatientSelection}
          >
            <option value="" selected disabled>
              Select
            </option>
            {patientData.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <br />
          <label className="required-field">Status</label>
          <select
            placeholder="Select Status"
            name="status"
            required
            onChange={(e) => handleChange(e)}
            value={scheduled.status}
            className="form-control"
          >
            <>
              <option value="" selected disabled>
                Select
              </option>
              <option value="confirmed">Confirmed</option>
              <option value="not_confirmed">Not Confirmed</option>
            </>
          </select>
          <br />

          <label>Date</label>
          <DatePicker
            name="scheduled_date"
            onChange={(e, datestring) =>
              handledateChange("scheduled_date", datestring)
            }
            value={dates?.date}
            style={{ width: "100%" }}
          />
          <br />
          <br />

          <label >Time</label>
          <TimePicker
            name="scheduled_time"
            onChange={(e, timestring) =>
              handledateChange("scheduled_time", timestring)
            }
            value={dates?.time}
            style={{ width: "100%" }}
          />
          {/* </form> */}
          <br />
          <br />
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="rounded-pill float-right "
            style={{ fontSize: "12px", marginTop: "6px" }}
          >
            Save
          </Button>
          <Button
            onClick={() => handleCloseModel()}
            className="rounded-pill "
            style={{ fontSize: "12px", marginTop: "6px" }}
          >
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default ScheduledForm;
