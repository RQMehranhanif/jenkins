import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Popconfirm, Table, Pagination, Input } from "antd";
import {
  getPhysicianList,
  addNewPhysician,
  updatePhysicianlist,
  deletePhysician,
  searchphysicians,
} from "../../../actions/Physician/PhysicianActions";
import PhysicianType from "@/Types/Physician";
import PhysicianForm from "./PhysicianForm/PhysicianForm";
import { OpenNotification } from "../../../Utilties/Utilties";
import { LoadingOutlined } from "@ant-design/icons";

function Physician() {
  const [physician, setPhysician] = useState<PhysicianType>(
    {} as PhysicianType
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, settLoading] = useState<boolean>(false);
  const [specialists, setSpecialists] = React.useState<string[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { Search } = Input;
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const handleChange = (e: any) => {
    const { value } = e.target;

    setPhysician({
      ...physician,
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

    setPhysician({
      ...physician,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    settLoading(true);
    getPhysicianList()
      .then(({ data: response }) => {
        settLoading(false);
        if (response.success) {
          const { data } = response;

          setSpecialists(response.specialities);
          setData(
            data
            /*  data.map(
              (row: {
                id: any;
                first_name: any;
                last_name: any;
                contact_no: any;
                gender: any;
                speciality: any;
              }) => ({
                id: row.id,
                name: `${row.first_name} ${row.last_name}`,
                contact_no: row.contact_no,
                gender: row.gender,
                speciality: row.speciality,
              })
            ) */
          );
          setTotalRecords(response.total);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        console.log("error", err);
        settLoading(false);
      });
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    settLoading(true)
    if (physician.id) {
      updatePhysicianlist(physician.id, physician)
        .then(({ data: response }) => {
          const newdata = [...data];

          const index = data.findIndex((item) => item.id === physician.id);
          newdata[index] = response.data;
          setData(newdata);
          if (response.success) {
            OpenNotification("success", response.message);
            settLoading(false)
            setIsOpen(false);
          } else {
            OpenNotification("error", response.message);
            settLoading(false)

            alert("Please fill all input data");
          }
        })
        .catch((err) => {
          OpenNotification("error", err.message);
        });
    } else {
      addNewPhysician(physician).then(({ data: response }) => {
        
        setData([...data, response.data]);
        if (response.success) {
          setIsOpen(false);
          settLoading(false)

          OpenNotification("success", response.message);
        } else {
          OpenNotification("error", response.message);

          alert("Please fill all input data");
        }
      });
    }
  };

  const deletePhysicianRecord = (id: any) => {
    settLoading(true);
    deletePhysician(id)
      .then(({ data: response }) => {
        if (response.success) {
          settLoading(false);
          const list = data.filter((item) => item.id !== id);
          setData(list);
          OpenNotification("success", response.message);
        } else {
          settLoading(false);
          alert("error deleting record");
          OpenNotification("error", response.message);
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
      dataIndex: "first_name",
    },
    {
      title: "Contact No",
      dataIndex: "contact_no",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Speciality",
      dataIndex: "speciality",
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
              onConfirm={() => deletePhysicianRecord(record.id)}
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
    setPhysician({
      id: "",
      first_name: "",
      mid_name: "",
      last_name: "",
      role: "",
      speciality: "",
      contact_no: "",
      gender: "",
    });
    setTitle("Add Physician");
    setIsOpen(true);
  };

  const handleEdit = (data: any) => {
    data = { ...data };
    setPhysician(data);
    setTitle("Update Physician");
    setIsOpen(true);
  };

  const onSearch = (value: any) => {
    settLoading(true);
    searchphysicians(value).then(({ data: response }) => {
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
              <h2>Physicians</h2>
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
      <PhysicianForm
        physician={physician}
        isOpen={isOpen}
        loading={loading}
        handleCloseModel={handleCloseModel}
        handleContact={handleContact}
        specialists={specialists}
        title={title}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Physician;
