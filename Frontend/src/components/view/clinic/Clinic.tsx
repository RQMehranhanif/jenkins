import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Popconfirm, Table, Pagination, Input } from "antd";
import {
  getClinicList,
  addNewClinic,
  updateClinic,
  editClinic,
  deleteClinic,
  searchclinics,
} from "../../../actions/Clinics/ClinicActions";
import ClinicForm from "./ClinicForm/ClinicForm";
import { OpenNotification } from "../../../Utilties/Utilties";
import { LoadingOutlined } from "@ant-design/icons";

function Clinic() {
  const [clinic, setClinic] = useState({
    id: "",
    first_name: "",
    mid_name: "",
    last_name: "",
    contact_no: "",
    role: "",
    role_id: "",
    clinic_id: "",
    gender: "",
    email: "",
    short_name: "",
    city: "",
    state: "",
    address: "",
    zip_code: "",
    address_2: "",
    phone: "",
    name: "",
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [update, setUpdate] = React.useState<any[]>([]);
  const [loading, settLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { Search } = Input;

  const handleChange = (e: any) => {
    const { value } = e.target;
    setClinic({
      ...clinic,
      [e.target.name]: value,
    });
  };
  const handleContact = (e: any) => {
    const x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : +x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    const value = e.target.value;
    setClinic({
      ...clinic,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    settLoading(true);
    getClinicList(currentPage)
      .then(({ data: response }) => {
        settLoading(false);
        if (response.success) {
          setData(response.data);
          setTotalRecords(response.total_records);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        console.log("error is ", err);
        settLoading(false);
      });
  }, [currentPage, update]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    settLoading(true);
    e.preventDefault();
    if (clinic.id) {
      updateClinic(clinic.id, clinic)
        .then(({ data: response }) => {
          settLoading(false);

          setUpdate([...data, response.data]);
          if (response.success) {
            OpenNotification("success", response.message);

            setIsOpen(false);
          } else {
            OpenNotification("error", 'Fill all the required fields');
          }
        })
        .catch((err) => {
          OpenNotification("error", err.message);
        });
    } else {
      addNewClinic(clinic).then(({ data: response }) => {
        settLoading(false);

        if (response.success) {
          setData([...data, response.data]);
          setIsOpen(false);
          OpenNotification("success", response.message);
        } else {
          OpenNotification("error", 'Fill all the required fields');
        }
      });
    }
  };

  const deleteClinicRecord = (id: any) => {
    settLoading(true);

    deleteClinic(id)
      .then(({ data: response }) => {
        settLoading(false);

        if (response.success) {
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
              onConfirm={() => deleteClinicRecord(record.id)}
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
    setClinic({
      id: "",
      first_name: "",
      mid_name: "",
      last_name: "",
      contact_no: "",
      role: "",
      role_id: "",
      clinic_id: "",
      gender: "",
      email: "",
      short_name: "",
      city: "",
      state: "",
      address: "",
      zip_code: "",
      address_2: "",
      phone: "",
      name: "",
    });
    setTitle("Add Clinic");
    setIsOpen(true);
  };

  const handleEdit = (id: any) => {
    const id1 = id.id;
    editClinic(id1).then(({ data: response }) => {
      const { data } = response;
      setClinic(data);
      setTitle("Update Clinic");
      setIsOpen(true);
    });
  };

  const onSearch = (value: any) => {
    settLoading(true);
    searchclinics(value).then(({ data: response }) => {
      settLoading(false);

      setData(response.data);
      setTotalRecords(response.total_records);
    });
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

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
              <h2>Clinics</h2>
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
            loading={{ spinning: loading, indicator: antIcon }}
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
      <ClinicForm
        isOpen={isOpen}
        handleCloseModel={handleCloseModel}
        handleContact={handleContact}
        title={title}
        loading={loading}
        clinic={clinic}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Clinic;
