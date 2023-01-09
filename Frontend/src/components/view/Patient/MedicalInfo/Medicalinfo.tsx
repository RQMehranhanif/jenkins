/* eslint-disable react/jsx-key */
/* eslint-disable array-callback-return */

// import { Container } from './styles';
import moment from "moment";
import React, { useState } from "react";
import { Cascader, Modal, Tooltip } from "antd";
import { Button } from "antd";
import { Form } from "antd";

import {
  Depression,
  CHF,
  CKD,
  obesity,
  COPD,
  DiabetesMellitus,
  hypertension,
  Hypercholesterolemia,
  Anemia,
  HYPOTHYROIDISM,
  Asthma,
  others,
} from "./../../../../Constant/constant";
import {
  addDiagnosis,
  addMedication,
  addSurgical_history,
} from "../../../../actions/Patients/PatientActions";
const MedicalInfo = ({ patient }: { patient: any }) => {
  const [diagnosis, setdiagnosis] = useState({} as any);
  const [medication, setMedication] = useState({} as any);
  const [surgicalHistory, setSurghistory] = useState({} as any);
  const [diagnosismodal, setDiagnosismodal] = useState(false);
  const [loading, setloading] = useState(false);
  const [medicalmodal, setMedicalmodal] = useState(false);
  const [customCode, setCustomcode] = useState(false);
  const [cascade, setCascade] = useState(true);
  const [surghistorymodal, setSurghistorymodal] = useState(false);
  const [datadiag, setdatadiag] = useState<any>(patient.diagnosis);
  const [datamed, setDatamed] = useState<any>(patient.medication);
  const [dataSurg, setDataSurg] = useState<any>(patient.surgical_history);
  const [description, setDescription] = useState<any>("");
  const handleOk = () => {
    setDiagnosismodal(false);
    /* setMedicalmodal(false);
    setSurghistorymodal(false); */
  };

  const handleCancel = () => {
    setDiagnosismodal(false);
    setMedicalmodal(false);
    setSurghistorymodal(false);
  };

  const handledngModal = () => {
    setDiagnosismodal(true);
    setDescription("");
  };
  const handleMedModal = () => {
    setMedicalmodal(true);
  };
  const handleSurhisModal = () => {
    setSurghistorymodal(true);
  };
  const handleIDCT = (e: any, options: any) => {
    setDescription(options[1].key);
    const desc = options[1].key;
    setdiagnosis({
      ...diagnosis,
      condition: e[1],
      description: desc,
    });
  };
  const handleDiachnage = (e: any) => {
    const value = e.target.value.toUpperCase();
    setdiagnosis({
      ...diagnosis,
      [e.target.name]: value,
    });
  };
  const handlemedchange = (e: any) => {
    const value = e.target.value.toUpperCase();
    setMedication({
      ...medication,
      [e.target.name]: value,
    });
  };
  const handleSurChange = (e: any) => {
    const value = e.target.value.toUpperCase();
    setSurghistory({
      ...surgicalHistory,
      [e.target.name]: value,
    });
  };

  const handleDiagnosissubmit = () => {
    setloading(true);
    const row = { ...diagnosis, patient_id: patient.id };
    addDiagnosis(row).then((response: any) => {
      setloading(false);
      setDiagnosismodal(false);
      setdatadiag(response.data.data);
      setDescription("");
    });
  };
  const handlemediaction = () => {
    setloading(true);
    const row = { ...medication, patient_id: patient.id };
    addMedication(row).then((response: any) => {
      setloading(false);
      setMedicalmodal(false);
      setDatamed(response.data.data);
    });
  };
  const handleSurgHistory = () => {
    setloading(true);
    const row = { ...surgicalHistory, patient_id: patient.id };
    addSurgical_history(row).then((response: any) => {
      setloading(false);
      setSurghistorymodal(false);
      setDataSurg(response.data.data);
    });
  };

  const handleCustomCode = (e: any) => {
    console.log(e.detail);
    setCustomcode(!customCode);
    setCascade(!cascade);
    setDescription("");
  };

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

                    <small className="text-danger">{items.Raf_score}</small>
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
                    {items.hypercholestro}(
                    <small className="text-danger"> {items.Raf_score}</small>)
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
    <>
      <div className="container-fluid">
        <div className="row">
          <div className=" col-md-12 col-lg-6">
            <div className="card border-info">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-8">
                    <h5 className="card-title text-right text-uppercase mb-2">
                      Diagnosis
                    </h5>
                  </div>
                  <div className="col-lg-4  text-right">
                    <a onClick={() => handledngModal()}>
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>

                <table className="table text-uppercase">
                  <thead>
                    <tr>
                      <th>IDC10 Code</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  {datadiag?.map((items: any) => {
                    return (
                      <tbody>
                        <tr className="text-dark" style={{ fontSize: "12px" }}>
                          <td>{items.condition}</td>
                          <td>{items.description}</td>
                          <td>{items.status}</td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
          <div className=" col-md-12 col-lg-6">
            <div className="card border-info">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-8">
                    <h5 className="card-title text-right text-uppercase mb-2">
                      Medication
                    </h5>
                  </div>
                  <div className="col-lg-4  text-right">
                    <a onClick={() => handleMedModal()}>
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
                <table className="table text-uppercase">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Dose</th>
                      <th>Condition</th>
                    </tr>
                  </thead>
                  {datamed?.map((items: any) => {
                    return (
                      <tbody>
                        <tr className="text-dark" style={{ fontSize: "12px" }}>
                          <td>{items.name}</td>
                          <td>{items.dose}</td>
                          <td>{items.condition}</td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
          <div className=" col-md-12 col-lg-6">
            <div className="card border-info">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-8">
                    <h5 className="card-title text-right text-uppercase mb-2">
                      Surgical History
                    </h5>
                  </div>
                  <div className="col-lg-4  text-right">
                    <a onClick={() => handleSurhisModal()}>
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
                <table className="table text-uppercase">
                  <thead>
                    <tr>
                      <th>Procedure</th>
                      <th>Reason</th>
                      <th>Surgeon</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  {dataSurg?.map((items: any) => {
                    return (
                      <tbody>
                        <tr className="text-dark " style={{ fontSize: "12px" }}>
                          <td>{items.procedure}</td>
                          <td>{items.reason}</td>
                          <td>{items.surgeon}</td>
                          <td>{moment(items.date).format("MM/DD/YYYY")}</td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* modals */}

      <Modal
        title="Add Diagnosis"
        open={diagnosismodal}
        footer={false}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form onFinish={handleDiagnosissubmit}>
          <div className="form-group">
            <div className="row">
              <div className="col-lg-12">
                <Button
                  type="primary"
                  size="small"
                  onClick={(e) => handleCustomCode(e)}
                  className="float-right"
                >
                  {cascade === true ? "Add custom code" : "Add selective code"}
                </Button>
                <label htmlFor="">
                  <small className="font-weight-bold">IDC10 CODE</small>
                </label>

                {customCode && (
                  <input
                    type="text"
                    className="form-control text-uppercase mb-3"
                    name="condition"
                    onChange={(e) => handleDiachnage(e)}
                  />
                )}

                {cascade && (
                  <Cascader
                    className=" text-dark"
                    style={{ width: "100%" }}
                    size="middle"
                    showSearch
                    options={treeData}
                    onChange={(e, options) => handleIDCT(e, options)}
                    placeholder="Please select"
                  />
                )}

                {/*  <TreeSelect
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={treeData}
                  placeholder="Please Search IDC10 Code"
                  showSearch={true}
                  onSearch={(e) => handleSearch(e)}
                  onChange={(e: any, label: any, key: any) =>
                    handleIDCT(e, label, key)
                  }
                /> */}
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">DESCRIPTION</small>
                </label>
                {cascade && (
                  <input
                    type="text"
                    className="form-control text-uppercase mb-3"
                    name="description"
                    value={description}
                    disabled
                  />
                )}
                {customCode && (
                  <input
                    type="text"
                    className="form-control text-uppercase mb-3"
                    name="description"
                    onChange={(e) => handleDiachnage(e)}
                  />
                )}
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">STATUS</small>
                </label>

                <select
                  id="input"
                  className="form-control text-uppercase text-uppercase mb-4"
                  name="status"
                  onChange={(e) => handleDiachnage(e)}
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
              </div>
              <div className="col-lg-12 ">
                <Button htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Add Medical"
        open={medicalmodal}
        footer={false}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form onFinish={() => handlemediaction()}>
          <div className="form-group">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">NAME</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="name"
                  onChange={(e) => handlemedchange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">DESCRIPTION</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="dose"
                  onChange={(e) => handlemedchange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">CONDITION</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="condition"
                  onChange={(e) => handlemedchange(e)}
                />
              </div>
              <div className="col-lg-12">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Add Surgical History"
        open={surghistorymodal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        destroyOnClose={true}
      >
        <Form onFinish={() => handleSurgHistory()}>
          <div className="form-group">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">PROCEDURE</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="procedure"
                  onChange={(e) => handleSurChange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">REASON</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="reason"
                  onChange={(e) => handleSurChange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">SURGEON</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="surgeon"
                  onChange={(e) => handleSurChange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">DATE</small>
                </label>
                <input
                  type="date"
                  className="form-control text-uppercase mb-3"
                  name="date"
                  onChange={(e) => handleSurChange(e)}
                />
              </div>
              <div className="col-lg-12">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default MedicalInfo;
