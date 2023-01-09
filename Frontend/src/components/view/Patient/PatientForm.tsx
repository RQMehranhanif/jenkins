/* eslint-disable react/jsx-key */
/* eslint-disable no-sequences */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable react/jsx-no-undef */
import { Input, Form, DatePicker, Cascader, Tooltip, Spin } from "antd";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { PatientType, Doctors } from "../../../Types/PatientType";
import { Button } from "antd";
import "../../../assets/css/profile.css";
import moment from "moment";
import {
  Depression,
  CHF,
  COPD,
  CKD,
  DiabetesMellitus,
  hypertension,
  obesity,
  Hypercholesterolemia,
  Anemia,
  HYPOTHYROIDISM,
  Asthma,
  others,
} from "../../../Constant/constant";
import { Modal } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
  isOpen: boolean;
  title: string;
  patient: PatientType;
  loading: any;
  handleChange: (e: any) => void;
  handleChanges: (e: any) => void;
  handleClinicChange: (e: any) => void;
  handledignosischange: (e: any, index: any) => void;
  handlemedchange: (e: any, index: any) => void;
  handlesurchange: (e: any, index: any) => void;
  handlefamchange: (e: any) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
  insurances: any;
  loadingClc: any;
  medical: any;
  surgical: any;
  doctorsClinic: any;
  dignoses: any;
  doctors: Doctors[];
  age: any;
  IDCT: any;
  insurancesCLinic: any;
  description: any;
  family_history: any;
  clinicList: any;
  handleAdd: (e: any) => void;
  handleAdd2: (e: any) => void;
  handleAdd3: (e: any) => void;
  handleaddress: (e: any) => void;
  handlezipChange: (e: any) => void;
  handlepatientInfo: (e: any) => void;
  handlecellChange: (e: any) => void;
  handleCustomCode: (e: number) => void;
  handleIDCT: (e: any, option: any, index: any) => void;
  handledateChanges: (e: any, dateString: any) => void;
}

const PatientForm: React.FC<Props> = ({
  isOpen,
  title,
  patient,
  handleChange,
  handleCloseModel,
  handleSubmit,
  handleClinicChange,
  insurances,
  medical,
  surgical,
  dignoses,
  insurancesCLinic,
  loadingClc,
  doctors,
  loading,
  IDCT,
  description,
  family_history,
  clinicList,
  doctorsClinic,
  handleAdd,
  handleAdd2,
  handleAdd3,
  handledignosischange,
  handlemedchange,
  handlesurchange,
  handlefamchange,
  handlepatientInfo,
  handledateChanges,
  handlezipChange,
  handleaddress,
  handleIDCT,
  handlecellChange,
  handleCustomCode,
}) => {
  const dates = { dob: patient?.dob ? moment(patient?.dob) : undefined };
  const years = moment().diff(dates.dob, "years");

  const roleId = localStorage.getItem("role_id");
  const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;


  const treeData = [
    {
      label: "Depression",
      value: 1,
      children: Depression.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.Depression}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.Depression}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.Depression,
        };
      }),
    },
    {
      label: "Congestive Heart Failure",
      value: 2,
      children: CHF.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.CHF}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.CHF}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.CHF,
        };
      }),
    },
    {
      label: "COPD",
      value: 3,
      children: COPD.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.COPD}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.COPD}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.COPD,
        };
      }),
    },
    {
      label: "CKD",
      value: 4,
      children: CKD.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.CKD}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.CKD}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.CKD,
        };
      }),
    },
    {
      label: "Diabetes Mellitus",
      value: 5,
      children: DiabetesMellitus.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.DM}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.DM}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.DM,
        };
      }),
    },
    {
      label: "Hypertension",
      value: 6,
      children: hypertension.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.hypertension}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.hypertension}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.hypertension,
        };
      }),
    },
    {
      label: "obesity",
      value: 7,
      children: obesity.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.obesity}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.obesity}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.obesity,
        };
      }),
    },
    {
      label: "Hypercholesterolemia",
      value: 8,
      children: Hypercholesterolemia.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.hypercholestro}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.hypercholestro}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.hypercholestro,
        };
      }),
    },
    {
      label: "Anemia",
      value: 9,
      children: Anemia.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.anemia}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.anemia}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.anemia,
        };
      }),
    },
    {
      label: "Hypothyroidism",
      value: 10,
      children: HYPOTHYROIDISM.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.HYPOTHYROIDISM}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.HYPOTHYROIDISM}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.HYPOTHYROIDISM,
        };
      }),
    },
    {
      label: "Asthma",
      value: 11,
      children: Asthma.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.Asthma}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.Asthma}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.Asthma,
        };
      }),
    },
    {
      label: "Others",
      value: 12,
      children: others.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.Others}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.Others}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.Others,
        };
      }),
    },
  ];

  return (
    <Modal
      width={800}
      closable
      maskClosable={false}
      title={title}
      open={isOpen}
      onCancel={() => handleCloseModel()}
      style={{ zIndex: "1050" }}
      footer={false}
      destroyOnClose
    >
      <form onSubmit={(e) => handleSubmit(e)}>
        <Row>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                First Name
              </label>

              <Input
                type="text"
                className="float-right text-uppercase"
                autoComplete="none"
                placeholder="First Name"
                maxLength={60}
                required
                name="first_name"
                value={patient.first_name}
                style={{ textTransform: "uppercase" }}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Last Name
              </label>
              <Input
                type="text"
                className="float-right text-uppercase"
                autoComplete="none"
                placeholder="Last Name"
                maxLength={60}
                required
                name="last_name"
                value={patient.last_name}
                style={{ textTransform: "uppercase" }}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="">Middle Name</label>
              <Input
                type="text"
                className="float-right text-uppercase"
                autoComplete="none"
                placeholder="Middle Name"
                maxLength={60}
                name="mid_name"
                value={patient.mid_name}
                style={{ textTransform: "uppercase" }}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                DOB
              </label>

              <DatePicker
                onChange={(e, dateString) =>
                  handledateChanges("dob", dateString)
                }
                className="form-control"
                style={{ height: "32px" }}
                value={dates.dob}
                format={"MM/DD/YYYY"}
                placeholder={"MM/DD/YYYY"}
                name="urine_microalbumin_date"
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="">Age</label>
              <Input
                type="text"
                placeholder="Age"
                maxLength={60}
                name="age"
                disabled
                value={years}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Gender
              </label>
              <select
                className="form-control form-control-sm text-uppercase"
                style={{ height: "32px" }}
                name="gender"
                required
                value={patient.gender}
                onChange={(e: any) => handleChange(e)}
              >
                <option value="" selected disabled className="text-uppercase">
                  Select
                </option>
                <option value="MALE" className="text-uppercase">
                  Male
                </option>
                <option value="FEMALE" className="text-uppercase">
                  Female
                </option>
              </select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col col={12}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Address Line 1
              </label>
              <Input
                type="text"
                className="text-uppercase"
                autoComplete="none"
                placeholder="Address Line 1"
                maxLength={60}
                name="address"
                required
                value={patient.address}
                onChange={(e: any) => handleaddress(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col col={12}>
            <Form.Item>
              <label htmlFor="" className="">
                Address Line 2
              </label>
              <Input
                className="text-uppercase"
                type="text"
                autoComplete="none"
                placeholder="Address Line 2"
                maxLength={60}
                name="address_2"
                value={patient.address_2}
                onChange={(e: any) => handleaddress(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                City
              </label>
              <Input
                type="text"
                className="text-uppercase"
                autoComplete="none"
                placeholder="City"
                maxLength={60}
                name="city"
                value={patient.city}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                State
              </label>
              <Input
                type="text"
                className=" text-uppercase"
                autoComplete="none"
                maxLength={2}
                placeholder="State (2 alpha characters only)"
                name="state"
                required
                value={patient.state}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Zip Code
              </label>
              <Input
                type="tel"
                autoComplete="none"
                name="zipCode"
                maxLength={5}
                pattern="[0-9]{5}"
                placeholder="Five digit zip code"
                required
                value={patient.zipCode}
                onChange={(e: any) => handlezipChange(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Phone
              </label>
              <Input
                type="tel"
                autoComplete="none"
                maxLength={12}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="301-123-4567"
                required
                name="contact_no"
                value={patient.contact_no}
                onChange={(e: any) => handlecellChange(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="">Cell</label>
              <Input
                type="tel"
                placeholder="301-123-4567"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                autoComplete="none"
                maxLength={12}
                name="cell"
                value={patient.cell}
                onChange={(e: any) => handlecellChange(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="">Email</label>
              <Input
                type="email"
                autoComplete="none"
                placeholder="Email"
                maxLength={60}
                name="email"
                className="text-uppercase"
                value={patient?.email}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          {roleId === "1" && (
            <Col col={4}>
              <Form.Item>
                <label htmlFor="" className="required-field">
                  Clinic
                </label>
                <select
                  style={{ width: "100%" }}
                  name="clinic_id"
                  className="form-control"
                  value={patient?.clinic_id}
                  required
                  onChange={(e) => handleClinicChange(e)}
                >
                  <option value="" selected disabled>
                    Select
                  </option>
                  {clinicList?.map((key: { id: any; name: any }) => (
                    <option value={key.id} key={key.id}>
                      {key.name}
                    </option>
                  ))}
                </select>
              </Form.Item>
            </Col>
          )}
          {roleId === "1" ? (
            <Col col={4}>
              <Form.Item>
                <label htmlFor="" className="required-field">
                  Primary Care Physician
                </label>
                <Spin spinning={loadingClc} indicator={antIcon}>
                  <select
                    style={{ width: "100%" }}
                    name="doctor_id"
                    required
                    className="form-control text-uppercase"
                    value={patient.doctor_id}
                    onChange={(e: any) => handleChange(e)}
                  >
                    <option value="" disabled selected className="text-uppercase">
                      Select
                    </option>
                    {doctorsClinic?.map((doctor: Doctors) => {
                      return (
                        <option
                          value={doctor.id}
                          key={doctor.id}
                          className="text-uppercase"
                        >
                          {doctor.name}
                        </option>
                      );
                    })}
                  </select>
                </Spin>

              </Form.Item>
            </Col>
          ) : (
            <Col col={4}>
              <Form.Item>
                <label htmlFor="" className="required-field">
                  Primary Care Physician
                </label>
                <select
                  style={{ width: "100%" }}
                  name="doctor_id"
                  required
                  className="form-control text-uppercase"
                  value={patient.doctor_id}
                  onChange={(e: any) => handleChange(e)}
                >
                  <option value="" disabled selected className="text-uppercase">
                    Select
                  </option>
                  {doctors?.map((doctor: Doctors) => {
                    return (
                      <option
                        value={doctor.id}
                        key={doctor.id}
                        className="text-uppercase"
                      >
                        {doctor.name}
                      </option>
                    );
                  })}
                </select>
              </Form.Item>
            </Col>
          )}
          {roleId === "1" ? (<Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Insurance
              </label>
              <Spin spinning={loadingClc} indicator={antIcon}>

              <select
                style={{ width: "100%" }}
                name="insurance_id"
                required
                className="form-control text-uppercase"
                value={patient.insurance_id}
                onChange={(e: any) => handleChange(e)}
              >
                <option value="" disabled selected className="text-uppercase">
                  Select
                </option>
                {insurancesCLinic?.map((items: any) => (
                  <option value={items.id} key={items} className="text-uppercase">
                    {items.name}
                  </option>
                ))}
              </select>
              </Spin>
            </Form.Item>
          </Col>) : (<Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Insurance
              </label>
              <select
                style={{ width: "100%" }}
                name="insurance_id"
                required
                className="form-control text-uppercase"
                value={patient.insurance_id}
                onChange={(e: any) => handleChange(e)}
              >
                <option value="" disabled selected className="text-uppercase">
                  Select
                </option>
                {Object.keys(insurances).map((key, i) => (
                  <option value={key} key={i} className="text-uppercase">
                    {insurances[key]}
                  </option>
                ))}
              </select>
            </Form.Item>
          </Col>)}

        </Row>

        <Row>
          <Col col={12}>
            <span>
              <b>Condition / Diagnosis</b>
            </span>
            <button
              onClick={handleAdd}
              className="btn btn-info float-right text-uppercase"
              style={{ fontSize: "11px", marginBottom: "6px" }}
            >
              Add a row
            </button>
            <table className="table">
              <thead>
                <tr>
                  <th>Dignoses</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dignoses.map((items: any, index: any) => (
                  <>
                    <tr key={index}>
                      <td>
                        {items.inputType === "selection" ? (
                          <Input
                            name="condition"
                            className="text-uppercase"
                            onChange={(e) => handledignosischange(e, index)}
                          />
                        ) : (
                          <Cascader
                            options={treeData}
                            className="text-dark"
                            style={{ width: "100%" }}
                            size="middle"
                            showSearch
                            value={items.condition ? items.condition : IDCT}
                            onChange={(e: any, option: any) =>
                              handleIDCT(e, option, index)
                            }
                            placeholder="Please select"
                          />
                        )}
                      </td>
                      <td>
                        <Input
                          value={
                            items?.description ? items.description : description
                          }
                          name="description"
                          className="text-uppercase"
                          onChange={(e) => handledignosischange(e, index)}
                        />
                      </td>
                      <td>
                        <select
                          id="input"
                          className="form-control form-control-sm text-uppercase"
                          style={{ height: "32px" }}
                          value={items?.status}
                          name="status"
                          onChange={(e) => handledignosischange(e, index)}
                        >
                          <option value="" selected className="text-uppercase">
                            Select
                          </option>

                          <option value="ACTIVE" className="text-uppercase">
                            active
                          </option>
                          <option value="RESOLVED" className="text-uppercase">
                            resolved
                          </option>
                        </select>
                      </td>
                      <td className="text-center" style={{ width: "140px" }}>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleCustomCode(index)}
                        >
                          {items.inputType === "selection"
                            ? "Add selective code"
                            : "Add custom code"}
                        </Button>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col col={12}>
            <span>
              <b>Surgical History</b>
            </span>
            <button
              onClick={handleAdd2}
              className="btn btn-info float-right text-uppercase"
              style={{ fontSize: "11px", marginBottom: "6px" }}
            >
              Add a row
            </button>
            <table className="table">
              <thead>
                <tr>
                  <th>Procedure</th>
                  <th>Reason for procedure</th>
                  <th>Surgeon or facility</th>
                  <th>date</th>
                </tr>
              </thead>
              <tbody>
                {surgical.map((items: any, index: any) => (
                  <tr key={index}>
                    <td>
                      <Input
                        value={items?.procedure}
                        name="procedure"
                        className="text-uppercase"
                        onChange={(e) => handlesurchange(e, index)}
                      />
                    </td>
                    <td>
                      <Input
                        value={items?.reason}
                        name="reason"
                        className="text-uppercase"
                        onChange={(e) => handlesurchange(e, index)}
                      />
                    </td>

                    <td>
                      <Input
                        name="surgeon"
                        className="text-uppercase"
                        onChange={(e) => handlesurchange(e, index)}
                        value={items?.surgeon}
                      />
                    </td>
                    <td>
                      <Input
                        type="date"
                        name="date"
                        onChange={(e) => handlesurchange(e, index)}
                        value={items?.date}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col col={12}>
            <span>
              <b>Medication</b>
            </span>
            <button
              onClick={handleAdd3}
              className="btn btn-info float-right text-uppercase"
              style={{ fontSize: "11px", marginBottom: "6px" }}
            >
              Add a row
            </button>
            <table className="table">
              <thead>
                <tr>
                  <th>Name of medication </th>
                  <th>Dose / Frequency </th>
                  <th>Conditions being treated </th>
                </tr>
              </thead>
              <tbody>
                {medical.map((items: any, index: any) => (
                  <tr key={index}>
                    <td>
                      <Input
                        value={items?.name}
                        name="name"
                        className="text-uppercase"
                        onChange={(e) => handlemedchange(e, index)}
                      />
                    </td>
                    <td>
                      <Input
                        value={items?.dose}
                        name="dose"
                        className="text-uppercase"
                        onChange={(e) => handlemedchange(e, index)}
                      />
                    </td>
                    <td>
                      <Input
                        value={items?.condition}
                        name="condition"
                        className="text-uppercase"
                        onChange={(e) => handlemedchange(e, index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
        <Row>
          <Col col={12}>
            <table className="table responsive text-dark">
              <thead>
                <tr>
                  <th>Family History</th>
                  <th className="text-center">Father</th>
                  <th className="text-center">Mother</th>
                  <th className="text-center">Children</th>
                  <th className="text-center">Siblings</th>
                  <th className="text-center">Grandparents</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cancer</td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="cancer_father"
                      value="yes"
                      checked={Boolean(family_history?.cancer_father === "yes")}
                      onChange={(e) => {
                        handlefamchange(e);
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      id="cancer_mother"
                      name="cancer_mother"
                      value="yes"
                      checked={Boolean(family_history?.cancer_mother === "yes")}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      id="cancer_children"
                      name="cancer_children"
                      value="yes"
                      checked={Boolean(family_history?.cancer_children)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      id="cancer_siblings"
                      name="cancer_siblings"
                      value="yes"
                      checked={Boolean(family_history?.cancer_siblings)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      id="cancer_grandparents"
                      name="cancer_grandparents"
                      value="yes"
                      checked={Boolean(family_history?.cancer_grandparents)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Diabetes</td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="diabetes_father"
                      value="yes"
                      checked={Boolean(family_history?.diabetes_father)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="diabetes_mother"
                      value="yes"
                      checked={Boolean(family_history?.diabetes_mother)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="diabetes_children"
                      value="yes"
                      checked={Boolean(family_history?.diabetes_children)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="diabetes_siblings"
                      value="yes"
                      checked={Boolean(family_history?.diabetes_siblings)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="diabetes_grandparents"
                      value="yes"
                      checked={Boolean(family_history?.diabetes_grandparents)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Heart disease</td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="heart_disease_father"
                      value="yes"
                      checked={Boolean(family_history?.heart_disease_father)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="heart_disease_mother"
                      value="yes"
                      checked={Boolean(family_history?.heart_disease_mother)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="heart_disease_children"
                      value="yes"
                      checked={Boolean(family_history?.heart_disease_children)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="heart_disease_siblings"
                      value="yes"
                      checked={Boolean(family_history?.heart_disease_siblings)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="heart_disease_grandparents"
                      value="yes"
                      checked={Boolean(
                        family_history?.heart_disease_grandparents
                      )}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Hypertension</td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="hypertension_father"
                      value="yes"
                      checked={Boolean(family_history?.hypertension_father)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="hypertension_mother"
                      value="yes"
                      checked={Boolean(family_history?.hypertension_mother)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="hypertension_children"
                      value="yes"
                      checked={Boolean(family_history?.hypertension_children)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="hypertension_siblings"
                      value="yes"
                      checked={Boolean(family_history?.hypertension_siblings)}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                  <td className="text-center">
                    <Input
                      type="checkbox"
                      name="hypertension_grandparents"
                      value="yes"
                      checked={Boolean(
                        family_history?.hypertension_grandparents
                      )}
                      onChange={(e) => handlefamchange(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="rounded-pill float-right text-uppercase"
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
      </form>
    </Modal>
  );
};
export default PatientForm;
