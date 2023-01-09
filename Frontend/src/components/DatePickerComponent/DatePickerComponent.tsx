import { DatePicker } from "antd";
import moment from "moment";
import React from "react";

interface Props {
  fieldName: string;
  value: string | undefined;
  placeHolder: string;
  dateFormat: string;
  handleChange: (key: string, value: string) => void;
}

const DatePickerComponent: React.FC<Props> = ({
  fieldName,
  value,
  placeHolder,
  dateFormat,
  handleChange,
}) => {
  const formatedDate = value ? moment(value) : undefined;
  return (
    <DatePicker
      className="form-control"
      name={fieldName}
      placeholder={placeHolder}
      value={formatedDate}
      onChange={(e, datestring) => handleChange(fieldName, datestring)}
      format={dateFormat}
      style={{ width: "100%" }}
    />
  );
};
export default DatePickerComponent;
