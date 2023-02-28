import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Popconfirm, Table, Pagination, Input } from "antd";
import { OpenNotification } from "../../../Utilties/Utilties";
import ScheduleTypes, { PatientType } from "../../../Types/ScheduleTypes";
import {
  getScheduleList,
  addNewSchedule,
  updateSchedule,
  deleteSchedule,
  searchschedules,
} from "../../../actions/Schedule/ScheduleActions";
import ScheduledForm from "./scheduledForm/ScheduledForm";
import { LoadingOutlined } from "@ant-design/icons";

export const Scheduled = () => {
  const defaultData = {
    id: "",
    patient_id: null,
    status: "",
    scheduled_date: "",
    scheduled_time: "",
  };
  const [scheduled, setScheduled] = useState<ScheduleTypes>(defaultData);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, settLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [disablePatientSelection, setDisablePatientSelection] =
    useState<boolean>(false);
  const [patientData, setPatientData] = React.useState<PatientType[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { Search } = Input;
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const handleChange = (e: any) => {
    setScheduled({
      ...scheduled,
      [e.target.name]: e.target.value,
    });
  };
  const handledateChange = (name: string, value: string) => {
    setScheduled({
      ...scheduled,
      [name]: name === "patient_id" ? Number(value) : value,
    });
  };

  useEffect(() => {
    settLoading(true);
    getScheduleList(currentPage)
      .then(({ data: response }) => {
        settLoading(false);

        if (response.success) {
          setData(response.data);
          setPatientData(response.patients_data);
          setTotalRecords(response.total_records);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        settLoading(false);
        OpenNotification("error", err?.message);
      });
  }, [currentPage]);

  const handleSubmit = () => {
    settLoading(true);
    if (scheduled.id !== "") {
      updateSchedule(scheduled.id, scheduled)
        .then(({ data: response }) => {
          settLoading(false);
          const newdata = [...data];
          const index = data.findIndex((item) => item.id === scheduled.id);
          newdata[index] = response.data;
          setData(newdata);
          if (response.success) {
            OpenNotification("success", response.message);
            setIsOpen(false);
            setScheduled(defaultData);
          } else {
            OpenNotification("error", 'Fill all the required fields');
          }
        })
        .catch((err) => {
          settLoading(false);
          OpenNotification("error", err?.message);
        });
    } else {
      addNewSchedule(scheduled)
        .then(({ data: response }) => {
          settLoading(false);
          if (response.success) {
            setData([...data, response.data]);
            setIsOpen(false);
            OpenNotification("success", response.message);
            setScheduled(defaultData);
          } else {
            OpenNotification("error", 'Fill all the required fields');
          }
        })
        .catch((err) => {
          settLoading(false);
          OpenNotification("error", err?.message);
        });
    }
  };

  const deleteUserRecord = (id: any) => {
    settLoading(true);
    deleteSchedule(id)
      .then(({ data: response }) => {
        if (response.success) {
          settLoading(false);
          const list = data.filter((item) => item.id !== id);
          setData(list);
          OpenNotification("success", response.message);
        } else {
          settLoading(false);
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        settLoading(false);
        OpenNotification("error", err?.message);
      });
  };

  const columns = [
    {
      title: "Sr",
      dataIndex: "index",
      render: (text: string, record: any, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Name",
      dataIndex: "patient_name",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Date",
      dataIndex: "scheduled_date",
    },
    {
      title: "Time",
      dataIndex: "scheduled_time",
    },
    {
      title: "Action",
      dataIndex: "btn",
      render: (_: any, record: { id: React.SetStateAction<null> }) =>
        data.length >= 1 ? (
          <>
            <div
              className="mr-3 btn btn-info btn-sm cursor-pointer"
              onClick={() => handleEdit(record)}
            >
              Edit
            </div>
            <Popconfirm
              title="Sure to delete?"
              className="btn btn-danger btn-sm"
              onConfirm={() => deleteUserRecord(record.id)}
            >
              Delete
            </Popconfirm>
          </>
        ) : null,
    },
  ];

  const handleCloseModel = () => {
    setIsOpen(false);
    setScheduled(defaultData);
  };

  const handleFormOpen = () => {
    setDisablePatientSelection(false);

    setTitle("Add Schedule");
    setIsOpen(true);
  };

  const handleEdit = (data: any) => {
    setDisablePatientSelection(true);
    setScheduled(data);

    setTitle("Update Schedule");
    setIsOpen(true);
  };
  const onSearch = (value: any) => {
    settLoading(true);

    searchschedules(value).then(({ data: response }) => {
      settLoading(false);

      setData(response.data);
      setTotalRecords(response.total_records);
    });
  };

  return (
    <>
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
              <h2>Schedule</h2>
            </div>
            <div className="col-6 sm-12 ">
              <button
                className="btn btn-info float-right "
                style={{ fontSize: "12px" }}
                onClick={() => handleFormOpen()}
              >
                Add New
              </button>
              <Search
                placeholder="Search"
                className="float-right mr-2"
                onSearch={onSearch}
                enterButton
                style={{ width: "auto" }}
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
            onChange={(page: number) => setCurrentPage(page)}
            hideOnSinglePage
          />
        </div>
      </div>
      <ScheduledForm
        isOpen={isOpen}
        title={title}
        handleCloseModel={handleCloseModel}
        scheduled={scheduled}
        loading={loading}
        patientData={patientData}
        disablePatientSelection={disablePatientSelection}
        handleChange={handleChange}
        handledateChange={handledateChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Scheduled;
