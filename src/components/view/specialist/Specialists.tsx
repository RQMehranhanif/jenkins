import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Popconfirm, Table, Pagination, Input } from "antd";

import SpecialistForm from "./SpecialistForm/SpecialistForm";
import {
  deleteSpecialist,
  getSpecialistList,
  updateSpecialist,
  addNewSpecialist,
  searchspecialist,
} from "../../../actions/Specialist/SpecialistActions";
import SpecialistType from "@/Types/Specialist";
import { OpenNotification } from "../../../Utilties/Utilties";
import { LoadingOutlined } from "@ant-design/icons";

function Specialists() {
  const [specialist, setSpecialist] = useState<SpecialistType>(
    {} as SpecialistType
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, settLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { Search } = Input;
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const handleChange = (e: any) => {
    const { value } = e.target;
    setSpecialist({
      ...specialist,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    settLoading(true);
    getSpecialistList()
      .then(({ data: response }) => {
        settLoading(false);
        if (response.success) {
          setData(response.data);
          setTotalRecords(response.total);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        settLoading(false);
        console.log("error", err);
      });
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    settLoading(true);
    if (specialist.id) {
      updateSpecialist(specialist.id, specialist)
        .then(({ data: response }) => {
          settLoading(false);

          const newdata = [...data];
          const index = data.findIndex((item) => item.id === specialist.id);
          newdata[index] = response.data;
          setData(newdata);
          if (response.success) {
            setIsOpen(false);
            OpenNotification("success", response.message);
          } else {
            OpenNotification("error", response.message);

            alert("Please fill all input data");
          }
        })
        .catch((err) => {
          OpenNotification("error", err.message);
        });
    } else {
      addNewSpecialist(specialist).then(({ data: response }) => {
        settLoading(false);

        if (response.success) {
          setIsOpen(false);
          setData([...data, response.data]);
          OpenNotification("success", response.message);
        } else {
          OpenNotification("error", response.message);
          alert("Please fill all input data");
        }
      });
    }
  };

  const deleteSpecialistRecord = (id: any) => {
    settLoading(true);
    deleteSpecialist(id)
      .then(({ data: response }) => {
        if (response.success) {
          settLoading(false);
          const list = data.filter((item) => item.id !== id);
          setData(list);
          OpenNotification("success", response.message);
        } else {
          settLoading(false);
          OpenNotification("error", response.message);

          alert("error deleting record");
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const columns = [
    {
      title: "Sr",
      render: (text: string, record: any, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Short Name",
      dataIndex: "short_name",
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
              onConfirm={() => deleteSpecialistRecord(record.id)}
            >
              Delete
            </Popconfirm>
          </>
        ) : null,
    },
  ];

  const handleCloseModel = () => {
    setIsOpen(false);
  };

  const handleFormOpen = () => {
    setSpecialist({
      id: "",
      name: "",
      short_name: "",
    });
    setTitle("Add Specialist");
    setIsOpen(true);
  };

  const handleEdit = (data: any) => {
    data = { ...data };
    setSpecialist(data);
    setTitle("Update Specialist");
    setIsOpen(true);
  };
  const onSearch = (value: any) => {
    settLoading(true);
    searchspecialist(value).then(({ data: response }) => {
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
              <h2>Specialist</h2>
            </div>
            <div className="col-6 sm-12 ">
              <button
                className="btn btn-info float-right"
                style={{ fontSize: "12px" }}
                onClick={() => handleFormOpen()}
              >
                Add New
              </button>
              <Search
                placeholder="Search"
                className="float-right mr-2 btn-info"
                onSearch={onSearch}
                enterButton
                style={{ width: "auto" }}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            loading={{ spinning: loading, indicator: antIcon }}
            bordered
            pagination={false}
          />
          <br />
          <Pagination
            total={totalRecords}
            current={currentPage}
            pageSize={10}
            onChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      </div>
      <SpecialistForm
        specialist={specialist}
        isOpen={isOpen}
        loading={loading}
        handleCloseModel={handleCloseModel}
        title={title}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Specialists;
