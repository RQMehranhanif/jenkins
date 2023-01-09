import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Table, Pagination, Tooltip, Modal, Input, message } from "antd";
/* import saveAs from 'file-saver';
 */
import fileDownload from "js-file-download";

import "../../../assets/css/antd.css";

import {
  getquesList,
  deleteQues,
  searchquestions,
  downloadcareplan,
  downloadsuperBill,
} from "../../../actions/Questionnaire/questionnaire";
import { useNavigate } from "react-router-dom";
import { OpenNotification } from "./../../../Utilties/Utilties";
import {
  setdiagnosis,
  setProgramId,
  setQuestionId,
} from "../../../store/reducer/QuestionairesReducer";
import { useAppDispatch } from "./../../../hooks/hooks";
import { Dropdown } from "react-bootstrap";
import Viewquestions from "../PDF/Viewquestion";
import { LoadingOutlined } from "@ant-design/icons";

const Questionaires = () => {
  const [data, setData] = React.useState<any[]>([]);

  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, settLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [opens, setOpens] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { Search } = Input;
  const key = "updatable";
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  useEffect(() => {
    settLoading(true);
    getquesList(search, currentPage)
      .then(({ data: response }) => {
        settLoading(false);
        if (response.success) {
          const data = response.data;
          setData(
            data?.map(
              (row: {
                dob: any;
                contact_no: any;
                program_name: any;
                status: any;
                patient_id: any;
                id: any;
                patient_name: any;
                serial_no: any;
                date_of_service: any;
                diagnosis: any;
                patient_age: any;
                program_id: any;
                patient_gender: any;
                insurance_name: string;
              }) => ({
                id: row.id,
                patient_name: row.patient_name.toUpperCase(),
                serial_no: row.serial_no,
                patient_age: row.patient_age,
                dob: row.dob,
                patient_gender: row.patient_gender,
                diagnosis: row.diagnosis,
                contact_no: row.contact_no,
                program_name: row.program_name,
                program_id: row.program_id,
                date_of_service: row.date_of_service,
                insurance_name: row.insurance_name,
                status: [
                  <Dropdown key={row.id}>
                    <Dropdown.Toggle
                      size="sm"
                      variant="light"
                      id="dropdown-basic"
                    >
                      <Tooltip placement="topRight" title={row.status}>
                        <small className="text-">PSP</small>
                      </Tooltip>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Tooltip placement="topRight" title="pre screen seen">
                        <Dropdown.Item href="#/action-1">seen</Dropdown.Item>
                      </Tooltip>
                      <Tooltip
                        placement="right"
                        zIndex={100}
                        title="pre screen signed"
                      >
                        <Dropdown.Item href="#/action-1">signed</Dropdown.Item>
                      </Tooltip>
                    </Dropdown.Menu>
                  </Dropdown>,
                ],
              })
            )
          );

          setTotalRecords(response.total_records);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        settLoading(false);
        console.log("error", err);
      });
  }, [currentPage, search]);

  const showcareplan = (id: string, programmId: string) => {
    dispatch(setQuestionId(id));
    dispatch(setProgramId(programmId));
    if (programmId == "2") {
      navigate(`/ccm-general-careplan/${id}`, {
        state: { questionid: id },
      });
    } else if (programmId == "1") {
      navigate(`/awvcareplan/${id}`, {
        state: { questionid: id },
      });
    }
  };
  const showQuestions = (id: string, programmId: string) => {
    dispatch(setQuestionId(id));
    dispatch(setProgramId(programmId));
    navigate(`/view_questions/${id}`, {
      state: { questionid: id },
    });
  };

  const showMonthlyCareplan = (id: string, programmId: string) => {
    dispatch(setQuestionId(id));
    dispatch(setProgramId(programmId));
    navigate(`/ccm-monthly-careplan/${id}`, { state: { questionid: id } });
  };

  const handleedit = (data: any) => {
    dispatch(setdiagnosis(data.diagnosis));

    navigate(`/questionaire/edit/${data.id}`, {
      state: {
        id: data.id,
        age: data.patient_age,
        name: data.patient_name,
        dob: data.dob,
        gender: data.patient_gender,
        insurance_name: data.insurance_name,
      },
    });
  };

  const handleBill = (id: any) => {
    navigate(`/questionaire/superbill/${id}`, {
      state: { id: id },
    });
  };

  const deleteUserRecord = (id: any) => {
    settLoading(true);
    deleteQues(id)
      .then(({ data: response }) => {
        if (response.success) {
          const list = data.filter((item) => item.id !== id);
          setData(list);
          settLoading(false);
          OpenNotification("success", response.message);
        } else {
          alert("error deleting record");
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        console.log("error", err);
        OpenNotification("error", err);
      });
  };

  const error = (id: any) => {
    Modal.error({
      title: "Are you sure to delete",
      closable: true,
      okText: "Yes",
      onOk() {
        deleteUserRecord(id);
      },
    });
  };

  const columns = [
    {
      title: "Id",
      key: "index",
      render: (text: any, record: any, index: any) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Serial No",
      dataIndex: "serial_no",
    },
    {
      title: "Name",
      dataIndex: "patient_name",
      /*       sorter: (a: any, b: any) => a.patient_name.length - b.patient_name.length,
       */
    },
    {
      title: "Age",
      dataIndex: "patient_age",
    },
    {
      title: "DOB",
      dataIndex: "dob",
    },
    {
      title: "Contact",
      dataIndex: "contact_no",
    },
    {
      title: "Program",
      dataIndex: "program_name",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Date of Service",
      dataIndex: "date_of_service",
    },
    {
      title: "Action",
      dataIndex: "btn",
      render: (_: any, record: any) =>
        data.length >= 1 ? (
          <>
            <Dropdown>
              <Dropdown.Toggle size="sm" variant="info" id="dropdown-basic">
                Actions
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleedit(record)}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item className="m-0" onClick={() => error(record.id)}>
                  Delete
                </Dropdown.Item>
                <hr className="p-0 m-0" />

                <Dropdown.Item onClick={() => handleBill(record.id)}>
                  Super Bill
                </Dropdown.Item>
                <hr className="p-0 m-0" />

                <Dropdown.Item
                  onClick={() => showcareplan(record.id, record.program_id)}
                >
                  View {record.program} Care Plan
                </Dropdown.Item>

                <Dropdown.Item onClick={() => downloadpdf(record.id)}>
                  Download Care Plan
                </Dropdown.Item>

                <Dropdown.Item onClick={() => downloadSuperBillpdf(record.id)}>
                  Download Super Bill
                </Dropdown.Item>

                {record.program_id == "2" && (
                  <Dropdown.Item
                    onClick={() =>
                      showMonthlyCareplan(record.id, record.program_id)
                    }
                  >
                    View {record.program} Monthly Care Plan
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  onClick={() => showQuestions(record.id, record.program_id)}
                >
                  View Questions
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => showQuestionPdf(record.id, record.program_id)}
                >
                  Download Questions
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : null,
    },
  ];

  const downloadpdf = (id: string) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Downloading is in progress..",
      duration: 0,
      style: { marginTop: "40px" },
    });
    downloadcareplan(id)
      .then((res) => {
        setTimeout(() => {
          messageApi.open({
            key,
            type: "success",
            content: "Downloaded Successfully!",
            duration: 2,
            style: { marginTop: "40px" },
          });
        }, 1000);
        fileDownload(res.data, "AwvCarePlan.pdf");
      })
      .catch(function (e) {
        //handle error
        console.log(e);
      });
  };

  const downloadSuperBillpdf = (id: string) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Downloading is in progress..",
      duration: 0,
      style: { marginTop: "40px" },
    });
    downloadsuperBill(id)
      .then((res) => {
        setTimeout(() => {
          messageApi.open({
            key,
            type: "success",
            content: "Downloaded Successfully!",
            duration: 2,
            style: { marginTop: "40px" },
          });
        }, 1000);
        fileDownload(res.data, "SuperBill.pdf");
      })
      .catch(function (e) {
        //handle error
        console.log(e);
      });
  };

  const showQuestionPdf = (id: string, programid: any) => {
    dispatch(setProgramId(programid));
    dispatch(setQuestionId(id));
    setOpens(true);
  };

  const onSearch = (value: any) => {
    setSearch(value);
    settLoading(true);
    searchquestions(value).then(({ data: response }) => {
      settLoading(false);
      setData(response.data);
      setTotalRecords(response.total_records);
    });
  };
  return (
    <>
      {contextHolder}
      <Modal
        open={opens}
        onCancel={() => {
          setOpens(false);
        }}
        footer={false}
        width={2000}
      >
        <Viewquestions />
      </Modal>
      <div
        className="container mt-5"
        style={{
          margin: "",
          background: "white",
          padding: "10px",
          borderRadius: "7px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div className="row">
            <div className="col-6 sm-12 ">
              <h2>Patient Questionnaires</h2>
            </div>
            <div className="col-6 sm-12 text-right">
              <Search
                placeholder="Search"
                onSearch={onSearch}
                enterButton
                style={{ width: "auto", marginLeft: "230px" }}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
            loading={{ spinning: loading, indicator: antIcon }}
          />
          <br />
          <Pagination
            total={totalRecords}
            current={currentPage}
            pageSize={10}
            showSizeChanger={false}
            onChange={(page: number) => setCurrentPage(page)}
          />
          <br />
        </div>
      </div>
    </>
  );
};
export default Questionaires;
