/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { Checkbox, Input, Button, Spin, Tag, Tooltip } from "antd";
import {
  fetchData,
  addCodes,
  deleteCode,
  deleteDxCode,
  updateStatus,
} from "../../actions/SuperBill/SuperBillActions";
import { OpenNotification } from "../../Utilties/Utilties";
import { useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const SuperBill = ({ questionid }: { questionid: any }) => {
  const location = useLocation();
  const id = location.state?.id;
  const [patient, setPatient] = React.useState();
  const [doctor, setDoctor] = React.useState();
  const [dob, setDob] = React.useState();
  const [fetching, isFetching] = React.useState<boolean>(false);
  const [dos, setDos] = React.useState();
  const [newCode, setAddCode] = React.useState<any>("");
  const [dx_code, setAddDxCode] = React.useState<any>("");
  const [dxCodes, setDxCodes] = React.useState([]);
  const [newCodes, setNewCodes] = React.useState<any>([]);
  const [insurance, setInsurance] = React.useState();
  const [loading, settLoading] = React.useState<boolean>(false);
  const [bill, setBill] = React.useState<any>({});

  const navigate = useNavigate();

  useEffect(() => {
    settLoading(true);
    if (id ?? questionid) {
      fetchData(id ?? questionid)
        .then(({ data: response }) => {
          settLoading(false);
          setBill(false);
          if (response.success) {
            setBill(response.data.codes);
            setDoctor(response.data.doctor);
            setPatient(response.data.patient_name);
            setDob(response.data.dob);
            setDos(response.data.date_of_service);
            setDxCodes(response.data.dxcodes);
            setNewCodes(response.data.new_codes);
            setInsurance(response.data.insurance);
          } else {
            settLoading(false);
            OpenNotification("error", response.message);
          }
        })
        .catch((err) => {
          console.log("error is ", err);
          settLoading(false);
        });
    }
  }, [fetching]);

  const isCodeExist = (code: any) => {
    let isExist = false;
    isExist = bill[code] ?? false;
    return isExist;
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    const codes = { ...bill };
    Object.assign(codes, { [e.target.name]: e.target.checked });

    const code = e.target.name;
    const condition = e.target.checked === true ? "true" : "false";

    const data = {
      question_id: id ?? questionid,
      code: code,
      status: condition,
    };

    updateStatus(data)
      .then(({ data: response }) => {
        if (response.success) {
          console.log(response);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        console.log("error is ", err);
        settLoading(false);
      });
    setBill(codes);
  };

  const addNewCode = (e: any) => {
    e.preventDefault();
    settLoading(true);

    const data = { question_id: id ?? questionid, code: newCode };

    addCodes(data)
      .then(({ data: response }) => {
        const code = response.data;
        const codes = { ...newCodes };
        Object.assign(codes, { [code]: true });

        setNewCodes(codes);

        if (response.success) {
          settLoading(false);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        console.log("error is ", err);
        settLoading(false);
      });
  };

  const addNewDxCode = (e: any) => {
    e.preventDefault();
    settLoading(true);

    const data = { question_id: id ?? questionid, dx_codes: dx_code };

    addCodes(data)
      .then(({ data: response }) => {
        console.log(response);

        const code = response.data;
        const codes = { ...dxCodes };
        Object.assign(codes, { [code]: true });

        setDxCodes(codes);
        if (response.success) {
          settLoading(false);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        console.log("error is ", err);
        settLoading(false);
      });
  };

  const handleClose = (e: any) => {
    settLoading(true);
    const deletedCode = e;

    const data = { question_id: id ?? questionid, code: deletedCode };

    deleteCode(data)
      .then((response: any) => {
        setNewCodes(response.data.data);
        settLoading(false);
        // isFetching(true);
      })
      .catch((err: any) => {
        OpenNotification("error", err);
        settLoading(false);
        // isFetching(false);
      });
  };
  const handleDxClose = (e: any) => {
    settLoading(true);
    const deletedCode = e;

    const data = { question_id: id ?? questionid, dx_codes: deletedCode };

    deleteDxCode(data)
      .then((response: any) => {
        setDxCodes(response.data.data);
        settLoading(false);
        // isFetching(true);
      })
      .catch((err: any) => {
        OpenNotification("error", err);
        settLoading(false);
        // isFetching(false);
      });
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
  const handleclose = () => {
    navigate("/Questionnaires");
  };
  return (
    <>
      <Spin spinning={loading} indicator={antIcon}>
        <div className="container">
          <div style={{ color: "black", textAlign: "center" }}>
            <b>
              <u>
                ***PLEASE RETURN THIS TO THE RECEPTIONIST ON YOUR WAY OUT***
              </u>
            </b>
          </div>

          <div className="row mb-2">
            <div className="col-12">
              <Tooltip placement="topLeft" title={"Finish"}>
                <Button
                  size="small"
                  className=" round-pill float-right ml-2"
                  style={{ lineHeight: "15px" }}
                  onClick={handleclose}
                  type="primary"
                >
                  Close
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              {/* Patient Details */}
              <div className="mb-3">
                <table
                  style={{
                    width: "100%",
                    border: "2px #000 solid",
                    color: "black",
                  }}
                >
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td>{patient}</td>
                    </tr>
                    <tr>
                      <th>DOB </th>
                      <td>
                        <>{moment(dob).format("MM/DD/YYYY")}</>
                      </td>
                    </tr>
                    <tr>
                      <th>DOS</th>
                      <td>
                        <>{moment(dos).format("MM/DD/YYYY")}</>{" "}
                      </td>
                    </tr>
                    <tr>
                      <th>Insurance</th>
                      <td>{insurance}</td>
                    </tr>
                    <tr>
                      <th>PCP</th>
                      <td>{doctor}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* <div className="row">
                <div className="col-6 text-center">
                  <h6 className="mb-0">INCIDENT TO</h6>
                </div>
                <div className="col-6 text-center">
                  <h6 className="mb-0">TelePhone Visit</h6>
                </div>
              </div>
              <table style={{ width: "100%", border: "2px solid", color: "black" }} >
                <tbody>
                  <tr>
                    <td>F/U Phy</td>
                    <td>99122 [away ]</td>
                    <td>
                      99213
                      <Checkbox
                      style={{paddingLeft:"5px"}}
                        name="99213"
                        value="99213"
                        checked={isCodeExist("99213")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      99441
                      <Checkbox
                      style={{paddingLeft:"5px"}}
                        name="99441"
                        checked={isCodeExist("99441")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                    <td>
                      99442
                      <Checkbox
                      style={{paddingLeft:"5px"}}
                        name="99442"
                        checked={isCodeExist("99442")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      99214
                      <Checkbox
                      style={{paddingLeft:"5px"}}
                        name="99214"
                        checked={isCodeExist("99214")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                    <td>
                      99443
                      <Checkbox
                      style={{paddingLeft:"5px"}}
                        name="99443"
                        checked={isCodeExist("99443")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="row">
                <div className="col-12 text-center">
                  <h6 className="mb-0">WELL WOMAN EXAM</h6>
                </div>
              </div>
              <table style={{ width: "100%", border: "2px solid", color: "black" }} >
                <tbody>
                  <tr>
                    <th>Mark both codes</th>
                    <td>Exams &</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th></th>
                    <td></td>
                    <td>G0101</td>
                    <td width="10%">
                      <Checkbox
                      style={{paddingLeft:"5px"}}
                        name="G0101"
                        checked={isCodeExist("G0101")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th></th>
                    <td>PAP</td>
                    <td>Q0091</td>
                    <td width="10%">
                      <Checkbox
                      style={{paddingLeft:"5px"}}
                        name="Q0091"
                        checked={isCodeExist("Q0091")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table> */}

              <div className="row">
                <div className="col-6 text-center">
                  <h6 className="mb-0">
                    {" "}
                    <b> ANNUAL WELLNESS VISIT </b>
                  </h6>
                </div>
                <div className="col-6 text-center">
                  <h6 className="mb-0">
                    {" "}
                    <b> ANNUAL MCR SCREENS </b>
                  </h6>
                </div>
              </div>
              <table
                style={{ width: "100%", border: "2px solid", color: "black" }}
              >
                <tbody>
                  <tr>
                    <th>Initial</th>
                    <th>Periodic</th>
                  </tr>
                  <tr>
                    <td>
                      <label>99385</label>
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="99385"
                        checked={isCodeExist("99385")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>

                    <td>
                      99395
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="99395"
                        checked={isCodeExist("99395")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "2px solid #000" }}>
                    <td>
                      99386
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="99386"
                        checked={isCodeExist("99386")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                    <td>
                      99396
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="99396"
                        checked={isCodeExist("99396")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="80%">Cardiovascular</td>
                    <td>G0446</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="G0446"
                        checked={isCodeExist("G0446")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="80%">Alcohol Scr</td>
                    <td>G0442</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="G0442"
                        checked={isCodeExist("G0442")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="80%">Advance Care</td>
                    <td>99497(33)</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="99497(33)"
                        checked={isCodeExist("99497(33)")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="80%">Depression Screen</td>
                    <td>G0444</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="G0444"
                        checked={isCodeExist("G0444")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td width="80%">WELCOME TO MCR</td>
                    <td>G0402</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="G0402"
                        checked={isCodeExist("G0402")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="80%">ANNUAL MCR: INITIAL</td>
                    <td>G0438</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="G0438"
                        checked={isCodeExist("G0438")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="80%">Subsequent</td>
                    <td>G0439</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="G0439"
                        checked={isCodeExist("G0439")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="80%">Humana PAF</td>
                    <td>99160</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="99160"
                        checked={isCodeExist("99160")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="80%">Comp Eval w/Exam (Humana)</td>
                    <td>99397</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="99397"
                        checked={isCodeExist("99397")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="80%">Humana AWV</td>
                    <td>96160</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="96160"
                        checked={isCodeExist("96160")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div className="row">
                <div className="col-12 text-center">
                  <h6 className="mb-0">SMOKING CESSATION COUNSELING</h6>
                </div>
              </div>
              <table
                style={{ width: "100%", border: "2px solid", color: "black" }}
              >
                <tbody>
                  <tr>
                    <td width="50%"></td>
                    <td width="30%"> upto 10 MIN </td>
                    <td width="10%">99406</td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="99406"
                        checked={isCodeExist("99406")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="50%"></td>
                    <td width="30%"> {">"} 10 MIN </td>
                    <td width="10%">99407 </td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="99407"
                        checked={isCodeExist("99407")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "2px solid", color: "black" }}>
                    <td width="50%">LDCT Counseling</td>
                    <td width="30%"></td>
                    <td width="10%">G0296 </td>
                    <td width="10%">
                      <Checkbox
                        style={{ paddingLeft: "5px" }}
                        name="G0296"
                        checked={isCodeExist("G0296")}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="row">
                <div className="col-12 text-center">
                  <h6 className="mb-2 mt-2">Add New Code</h6>
                </div>
              </div>
              <div style={{ display: "flex", width: "100%" }}>
                <form
                  className="mb-3"
                  style={{ width: "45%", border: "2px solid", color: "black" }}
                >
                  <div className="row">
                    <div className="col-7">
                      <Input
                        type="text"
                        placeholder="Enter Code"
                        minLength={5}
                        maxLength={5}
                        name="code"
                        value={newCode}
                        onChange={(e) => {
                          setAddCode(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-2">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="ml-2"
                        onClick={(e) => {
                          addNewCode(e), setAddCode("");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </form>
                <form
                  className="mb-3 ml-5"
                  style={{ width: "45%", border: "2px solid", color: "black" }}
                >
                  <div className="row">
                    <div className="col-7">
                      <Input
                        type="text"
                        placeholder="Enter Dx Code"
                        minLength={3}
                        maxLength={7}
                        name="dxcode"
                        value={dx_code}
                        onChange={(e) => {
                          setAddDxCode(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-2">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="ml-2"
                        onClick={(e) => {
                          addNewDxCode(e), setAddDxCode("");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </form>
              </div>

              <div style={{ display: "flex" }}>
                <table
                  style={{
                    width: "45%",
                    marginTop: "10px",
                    border: "2px solid",
                    color: "black",
                  }}
                  className="table table-bordered"
                >
                  <tbody>
                    <tr style={{ marginLeft: "30px" }} className="col">
                      <th
                        className="text-center"
                        style={{
                          color: "black",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        CPT Codes:
                      </th>
                    </tr>

                    <tr style={{ width: "100%" }}>
                      <td>
                        {Object.keys(newCodes).map((code) => {
                          return (
                            <span key={code}>
                              <Tag
                                key={code}
                                closable
                                defaultValue={code}
                                onClose={(e) => {
                                  e.preventDefault(), handleClose(code);
                                }}
                              >
                                {code}
                              </Tag>
                            </span>
                          );
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  style={{
                    width: "45%",
                    marginTop: "10px",
                    border: "2px solid #000",
                    color: "black",
                  }}
                  className="ml-5 table table-bordered"
                >
                  <tbody>
                    <tr style={{ marginLeft: "30px" }} className="col">
                      <th
                        className="text-center"
                        style={{
                          color: "black",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        Dx Codes:
                      </th>
                    </tr>
                    <tr style={{ width: "100%" }}>
                      <td>
                        {Object.keys(dxCodes).map((code) => {
                          return (
                            <span key={code}>
                              <Tag
                                key={code}
                                closable
                                defaultValue={code}
                                onClose={(e) => {
                                  e.preventDefault(), handleDxClose(code);
                                }}
                              >
                                {code}
                              </Tag>
                            </span>
                          );
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-5" style={{ display: "flex" }}>
                <div className="col-6">
                  <div className="mt-5">
                    <u>
                      <span>_______________________</span>
                    </u>
                  </div>
                  <label>Next Followup</label>
                </div>
                <div className="col-6">
                  <div className="mt-5">
                    <u>
                      <span>_______________________</span>
                    </u>
                  </div>
                  <label>Provider Signature</label>
                </div>
              </div>
            </div>

            <div className="col-6">
              <table style={{ width: "100%", border: "2px #000 solid" }}>
                {/* BMI */}
                <tr style={{ border: "2px solid" }}>
                  <th
                    style={{ border: "2px #000 solid", color: "black" }}
                    className="text-center"
                  >
                    BMl ( &gt; 18.5 and &lt; 25g/m2)
                  </th>
                  <td style={{ border: "2px solid", color: "black" }}>
                    If you are below normal must have f/u plan
                  </td>
                  <td
                    width="50%"
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td>Normal:</td>
                          <td>G8420</td>
                          <td>
                            <Checkbox
                              name="G8420"
                              checked={isCodeExist("G8420")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Above:</td>
                          <td>G8417</td>
                          <td>
                            <Checkbox
                              name="G8417"
                              checked={isCodeExist("G8417")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Below:</td>
                          <td>G8418</td>
                          <td>
                            <Checkbox
                              name="G8418"
                              checked={isCodeExist("G8418")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Refused:</td>
                          <td>G8422</td>
                          <td>
                            <Checkbox
                              name="G8422"
                              checked={isCodeExist("G8422")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                {/* <!-- HTN --> */}
                <tr style={{ borderBottom: "2px solid" }}>
                  <th
                    rowSpan={1}
                    style={{ border: "2px solid", color: "black" }}
                    className="text-center"
                  >
                    HTN
                  </th>
                  <td
                    colSpan={2}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td>Systolic Bp &lt; 140mm/Hg</td>
                          <td>G8752</td>
                          <td width="10%">
                            <Checkbox
                              name="G8752"
                              checked={isCodeExist("G8752")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Daistolic Bp &lt; 90mm/Hg</td>
                          <td>G8754</td>
                          <td width="10%">
                            <Checkbox
                              name="G8754"
                              checked={isCodeExist("G8754")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                {/* <!-- Tobacco --> */}
                <tr>
                  <th
                    rowSpan={2}
                    style={{
                      border: "2px solid",
                      borderBottom: "2px solid",
                      color: "black",
                    }}
                    className="text-center"
                  >
                    Tobacco
                  </th>
                  <td
                    colSpan={2}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">Tobacco user and consulting given</td>
                          <td>4004F</td>
                          <td width="10%">
                            <Checkbox
                              name="4004F"
                              checked={isCodeExist("4004F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr style={{ borderBottom: "2px solid" }}>
                  <td
                    colSpan={2}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">Current Non-User</td>
                          <td>1036F</td>
                          <td width="10%">
                            <Checkbox
                              name="1036F"
                              checked={isCodeExist("1036F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                {/* <!-- Depression --> */}
                <tr>
                  <th
                    rowSpan={1}
                    style={{ border: "2px solid", color: "black" }}
                    className="text-center"
                  >
                    Depression
                  </th>
                  <td
                    colSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">PHQ-9 &lt; 9</td>
                          <td>G8510</td>
                          <td width="10%">
                            <Checkbox
                              name="G8510"
                              checked={isCodeExist("G8510")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">PHQ-9 &gt; 9 w/f/u plan doc.</td>
                          <td>G8431</td>
                          <td width="10%">
                            <Checkbox
                              name="G8431"
                              checked={isCodeExist("G8431")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">
                            PHQ-9, Excep: Depression/Bipolar Disorder
                          </td>
                          <td>G9717</td>
                          <td width="10%">
                            <Checkbox
                              name="G9717"
                              checked={isCodeExist("G9717")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                {/* <!-- Fall Screening --> */}
                <tr>
                  <th
                    rowSpan={1}
                    style={{
                      border: "2px solid",
                      borderBottom: "2px solid",
                      color: "black",
                    }}
                    className="text-center"
                  >
                    Fall Screening
                  </th>
                  <td
                    colSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">
                            2+ falls or any fall w/injury(Mark both)
                          </td>
                          <td>1100F</td>
                          <td width="10%">
                            <Checkbox
                              name="1100F"
                              checked={isCodeExist("1100F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">
                            Assess w/in 12mo of documented fall
                          </td>
                          <td>3288F</td>
                          <td width="10%">
                            <Checkbox
                              name="3288F"
                              checked={isCodeExist("3288F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">PNo falls or 1 fall w/out injury</td>
                          <td>1101F</td>
                          <td width="10%">
                            <Checkbox
                              name="1101F"
                              checked={isCodeExist("1101F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* <!-- Vaccines --> */}
                <tr style={{ borderBottom: "2px solid" }}>
                  <th
                    rowSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                    className="text-center"
                  >
                    Vaccines
                  </th>
                  <td
                    colSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <th>Pneumo revd</th>
                        </tr>
                        <tr>
                          <td width="71%">
                            Document year rcvd and type if known
                          </td>
                          <td>4040</td>
                          <td>
                            <Checkbox
                              name="4040"
                              checked={isCodeExist("4040")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">Flu Vaccine</td>
                          <td>G8482</td>
                          <td width="10%">
                            <Checkbox
                              name="G8482"
                              checked={isCodeExist("G8482")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr style={{ borderBottom: "2px solid" }}>
                  <td
                    colSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tr>
                        <th>Flu Not Eligible:</th>
                      </tr>
                      <tr>
                        <td width="70%">
                          Pt. refuses, allergy, vaccine not available
                        </td>
                        <td>G8483</td>
                        <td width="10%">
                          <Checkbox
                            name="G8483"
                            checked={isCodeExist("G8483")}
                            onChange={(e) => handleChange(e)}
                          />
                        </td>
                      </tr>
                      <tbody></tbody>
                    </table>
                  </td>
                </tr>

                {/* <!-- CA Screening --> */}
                <tr>
                  <th
                    rowSpan={2}
                    style={{
                      border: "2px solid",
                      borderBottom: "2px solid",
                      color: "black",
                    }}
                    className="text-center"
                  >
                    CA Screening
                  </th>
                  <td
                    colSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">Colo CA Screening (Report Viewed)</td>
                          <td>3017F</td>
                          <td width="10%">
                            <Checkbox
                              name="3017F"
                              checked={isCodeExist("3017F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">Hx of colectomy or Colon CA</td>
                          <td>G9711</td>
                          <td width="10%">
                            <Checkbox
                              name="G9711"
                              checked={isCodeExist("G9711")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">Mammo Docu. In last 27 mo.</td>
                          <td>G9899</td>
                          <td width="10%">
                            <Checkbox
                              name="G9899"
                              checked={isCodeExist("G9899")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">Hx of bi/unilateral mastectomy</td>
                          <td>G9708</td>
                          <td width="10%">
                            <Checkbox
                              name="G9708"
                              checked={isCodeExist("G9708")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <th
                    rowSpan={3}
                    style={{
                      border: "2px solid",
                      borderBottom: "2px solid",
                      color: "black",
                    }}
                    className="text-center"
                  >
                    DM
                  </th>
                  <td
                    colSpan={2}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">A1c &lt; 7%</td>
                          <td>3044F</td>
                          <td width="10%">
                            <Checkbox
                              name="3044F"
                              checked={isCodeExist("3044F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">A1c &gt; 9%</td>
                          <td>3046F</td>
                          <td width="10%">
                            <Checkbox
                              name="3046F"
                              checked={isCodeExist("3046F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">A1c 7% - 8%</td>
                          <td>3051F</td>
                          <td width="10%">
                            <Checkbox
                              name="3051F"
                              checked={isCodeExist("3051F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">A1c 8% - 9%</td>
                          <td>3052F</td>
                          <td width="10%">
                            <Checkbox
                              name="3052F"
                              checked={isCodeExist("3052F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">In Office 7 field photos</td>
                          <td>2024F</td>
                          <td width="10%">
                            <Checkbox
                              name="2024F"
                              checked={isCodeExist("2024F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">No Retinopathy(2018 - 2019) </td>
                          <td>3072F</td>
                          <td width="10%">
                            <Checkbox
                              name="3072F"
                              checked={isCodeExist("3072F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">Dilated Eye Exam (Report Viewed) </td>
                          <td>2022F</td>
                          <td width="10%">
                            <Checkbox
                              name="2022F"
                              checked={isCodeExist("2022F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">Microalbumin(+ve)</td>
                          <td>3060F</td>
                          <td width="10%">
                            <Checkbox
                              name="3060F"
                              checked={isCodeExist("3060F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">Microalbumin(-ve)</td>
                          <td>3061F</td>
                          <td width="10%">
                            <Checkbox
                              name="3061F"
                              checked={isCodeExist("3061F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">CKD stage 4/5</td>
                          <td>3066F</td>
                          <td width="10%">
                            <Checkbox
                              name="3066F"
                              checked={isCodeExist("3066F")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">On ACE or ARB</td>
                          <td>G8506</td>
                          <td width="10%">
                            <Checkbox
                              name="G8506"
                              checked={isCodeExist("G8506")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <th
                    rowSpan={1}
                    style={{
                      border: "2px solid",
                      borderBottom: "2px solid",
                      color: "black",
                    }}
                    className="text-center"
                  >
                    ASCVD
                  </th>
                  <td
                    colSpan={2}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">Aspirin or other Antiplatelet</td>
                          <td>G8598</td>
                          <td width="10%">
                            <Checkbox
                              name="G8598"
                              checked={isCodeExist("G8598")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">Anticoagulants</td>
                          <td>G9724</td>
                          <td width="10%">
                            <Checkbox
                              name="G9724"
                              checked={isCodeExist("G9724")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <th
                    rowSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                    className="text-center"
                  >
                    ASCVD Statin Therapy
                  </th>
                  <td
                    colSpan={3}
                    style={{ border: "2px solid", color: "black" }}
                  >
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="70%">
                            LDL-C &gt; 190mg/dL, LDL-C 70-189 mg/dL (id DM) or
                            ASCVD
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">On Statin/rcvd Rx for Statin</td>
                          <td>G9664</td>
                          <td width="10%">
                            <Checkbox
                              name="G9664"
                              checked={isCodeExist("G9664")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td width="70%">
                            Intolerance or energy to statin or active liver
                            disease
                          </td>
                          <td>G9781</td>
                          <td width="10%">
                            <Checkbox
                              name="G9781"
                              checked={isCodeExist("G9781")}
                              onChange={(e) => handleChange(e)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className="row mt-2 ml-0 mr-0">
            <div
              className="col-12"
              style={{
                borderTop: "2px #000 solid",
                borderBottom: "2px solid",
                color: "black",
              }}
            ></div>
          </div>
        </div>
      </Spin>
    </>
  );
};
export default SuperBill;
