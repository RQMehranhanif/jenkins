import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Popconfirm, Table, Pagination, Input } from "antd";
import {
  getInsuranceList,
  addNewInsurance,
  updateInsurance,
  deleteInsurance,
  searchinsurance,
} from "../../../actions/Insurance/InsuranceActions";
import InsuranceForm from "./InsuranceForm/InsuranceForm";
import { OpenNotification } from "../../../Utilties/Utilties";
import { LoadingOutlined } from "@ant-design/icons";

function Insurance() {
  const [insurance, setInsurance] = useState({
    id: "",
    name: "",
    short_name: "",
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [update, setUpdate] = React.useState<any[]>([]);
  const [loading, settLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const { Search } = Input;

  const handleChange = (e: any) => {
    const { value } = e.target;
    setInsurance({
      ...insurance,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    settLoading(true);
    getInsuranceList(currentPage)
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
        console.log("error", err);
        settLoading(false);
      });
  }, [currentPage, update]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    settLoading(true);

    e.preventDefault();
    if (insurance.id) {
      updateInsurance(insurance.id, insurance)
        .then(({ data: response }) => {
          settLoading(false);

          setUpdate([...data, response.data]);
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
      addNewInsurance(insurance).then(({ data: response }) => {
        settLoading(false);

        setData([...data, response.data]);
        if (response.success) {
          setIsOpen(false);
          OpenNotification("success", response.message);
        } else {
          OpenNotification("error", response.message);

          alert("Please fill all input data");
        }
      });
    }
  };

  const deleteInsuranceRecord = (id: any) => {
    settLoading(true);
    deleteInsurance(id)
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
      title: "Full Name",
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
              onConfirm={() => deleteInsuranceRecord(record.id)}
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
    setInsurance({
      id: "",
      name: "",
      short_name: "",
    });
    setTitle("Add Insurance");
    setIsOpen(true);
  };

  const handleEdit = (data: any) => {
    data = { ...data };
    setInsurance(data);
    setTitle("Update Specialist");
    setIsOpen(true);
  };
  const onSearch = (value: any) => {
    settLoading(true);
    searchinsurance(value).then(({ data: response }) => {
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
              <h2>Insurances</h2>
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
          />
        </div>
      </div>
      <InsuranceForm
        isOpen={isOpen}
        loading={loading}
        handleCloseModel={handleCloseModel}
        title={title}
        insurance={insurance}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Insurance;
