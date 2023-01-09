import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/questions_answers.css";
import { differenceInYears, parse } from "date-fns";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";

import { Table, Pagination, Input } from "antd";
import { Dropdown } from "react-bootstrap";
import {
  PatientType,
  dignosisprops,
  Doctors,
  familyprops,
  medicalprops,
  surgicalprops,
} from "@/Types/PatientType";
import {
  getPatientList,
  addNewPatient,
  updatePatient,
  deletePatient,
  searchPatient,
  roleFilter,
} from "../../../actions/Patients/PatientActions";
import PatientForm from "./PatientForm";
import { OpenNotification } from "../../../Utilties/Utilties";
import { Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Patients({ openTab }: { openTab: any }) {
  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, settLoading] = useState<boolean>(false);

  const [Newdata, setNewdata] = React.useState<any[]>([]);
  const [insurances, setInsurances] = React.useState<any>([]);
  const [insurancesCLinic, setInsurancesClinic] = React.useState<any>([]);
  const [doctors, setDoctors] = React.useState<Doctors[]>([]);
  const [doctorsClinic, setDoctorsClinic] = React.useState<Doctors[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [description, setDescription] = useState<any>("");
  const [IDCT, setIDCT] = useState<any>("");
  const [loadingClc, setloadingclc] = useState<any>(false);
  const [clinics, setClinics] = useState<any>([]);

  const [dignoses, setDignosis] = useState<dignosisprops[]>([
    {
      description: "",
      condition: "",
      status: "",
      inputType: "selection",
    },
  ]);
  const [family_history, setFamily_history] = useState<familyprops[]>([]);
  const [surgical, setSurgical] = useState<surgicalprops[]>([
    {
      procedure: "",
      reason: "",
      date: "",
      surgeon: "",
    },
  ]);
  const [medical, setMedical] = useState<medicalprops[]>([
    {
      name: "",
      dose: "",
      condition: "",
    },
  ]);
  const { Search } = Input;
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  useEffect(() => {
    settLoading(true);
    fetchAllPatients();
  }, [currentPage, Newdata]);

  const fetchAllPatients = () => {
    getPatientList(search, currentPage)
      .then(({ data: response }) => {
        settLoading(false);
        if (response.success) {
          setData(response.data);
          setInsurances(response.insurances);
          setDoctors(response.doctors);
          setTotalRecords(response.total_records);
          setClinics(response.clinic_list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        console.log("error is ", err);
        settLoading(false);
      });
  };

  const handleChange = (e: any) => {
    const value = e.target.value.toUpperCase();

    setPatient({
      ...patient,
      [e.target.name]: value,
    });
  };
  const handleClinicChange = (e: any) => {
    const value = e.target.value.toUpperCase();
    setloadingclc(true)
    roleFilter(value).then(({ data: response }) => {
      setloadingclc(false)
      setDoctorsClinic(response.doctors)
      setInsurancesClinic(response.insurances)
      setPatient({
        ...patient,
        [e.target.name]: value,
      });
    })


  };
  const handlecellChange = (e: any) => {
    const x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : +x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    const value = e.target.value;
    setPatient({
      ...patient,
      [e.target.name]: value,
    });
  };
  const handlepatientInfo = (e: any) => {
    const value = e.target.value.toUpperCase();
    const re = /^[A-Za-z ]+$/;
    if (value === "" || re.test(value)) {
      setPatient({
        ...patient,
        [e.target.name]: value,
      });
    }
  };
  const handlezipChange = (e: any) => {
    const value = e.target.value;
    const re = /^[0-9 ]+$/;
    if (value === "" || re.test(value)) {
      setPatient({
        ...patient,
        [e.target.name]: value,
      });
    }
  };
  const handleaddress = (e: any) => {
    const value = e.target.value.toUpperCase();
    const re = /^[A-Za-z0-9 ]+$/;
    if (value === "" || re.test(value)) {
      setPatient({
        ...patient,
        [e.target.name]: value,
      });
    }
  };
  const handleChanges = (e: any) => {
    const value = e.target.value;

    const date = parse(e.target.value, "yyyy-MM-dd", new Date());
    const age = differenceInYears(new Date(), date);
    setAge(age);

    setPatient({
      ...patient,
      [e.target.name]: value,
      age,
    });
  };
  const handleAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newdignoses: dignosisprops = {
      description: "",
      condition: "",
      status: "",
    };
    setDescription("");
    setIDCT("");
    const data = [...dignoses, newdignoses];
    setDignosis(data);
  };
  const handleAdd2 = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newSurgical: surgicalprops = {
      procedure: "",
      reason: "",
      date: "",
      surgeon: "",
    };
    const data = [...surgical, newSurgical];
    setSurgical(data);
  };
  const handleAdd3 = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newMedical: medicalprops = {
      name: "",
      dose: "",
      condition: "",
    };
    const data = [...medical, newMedical];
    setMedical(data);
  };

  const handleIDCT = (e: any, option: any, index: any) => {
    const value = e;
    const desc = option[1].key;
    const dignosislist = [...dignoses];
    let item = dignoses[index];
    item = { ...item, condition: value[1], description: desc };

    dignosislist[index] = item;

    setDignosis(dignosislist);
  };

  const handledignosischange = (e: any, index: number) => {
    const re = /^[A-Za-z ]+$/;
    const value = e.target.value;
    if (value === "" || re.test(value)) {
      const dignosislist = [...dignoses];
      let item = dignoses[index];
      item = { ...item, [e.target.name]: value };

      dignosislist[index] = item;
      setDignosis(dignosislist);
    }
  };

  const handlesurchange = (e: any, index: number) => {
    const surgicalList = [...surgical];
    let item = surgical[index];
    item = { ...item, [e.target.name]: e.target.value };
    surgicalList[index] = item;
    setSurgical(surgicalList);
  };
  const handlemedchange = (e: any, index: number) => {
    const medicalList = [...medical];
    let item = medical[index];
    item = { ...item, [e.target.name]: e.target.value };
    medicalList[index] = item;
    setMedical(medicalList);
  };
  const handlefamchange = (e: any) => {
    const val = e.target.checked === true ? e.target.value : "";
    setFamily_history({ ...family_history, [e.target.name]: val });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    settLoading(true);

    e.preventDefault();
    if (patient.id) {
      const row = {
        ...patient,
        diagnosis: dignoses,
        medication: medical,
        surgical_history: surgical,
        family_history,
      };
      settLoading(true);

      updatePatient(patient.id, row)
        .then(({ data: response }) => {
          settLoading(false);
          const newdata = [...data];
          const index = data.findIndex((item) => item.id === patient.id);

          newdata[index] = response.data;
          setNewdata(newdata);

          if (response.success) {
            OpenNotification("success", response.message);

            setIsOpen(false);
            setDescription("");
            setIDCT("");
            setFamily_history([]);
          } else {
            settLoading(false);
            OpenNotification("error", 'Please fill all the required fields');

            alert("Please fill all input data");
          }
        })
        .catch((err) => {
          OpenNotification("error", err.message);
        });
    } else {
      const row = {
        ...patient,
        diagnosis: dignoses,
        medication: medical,
        surgical_history: surgical,
        family_history,
      };

      addNewPatient(row).then(({ data: response }) => {
        settLoading(false);

        if (response.success) {
          setNewdata([...data, response.data]);
          setIsOpen(false);
          OpenNotification("success", response.message);
          setDescription("");
          setIDCT("");
          setFamily_history([]);
        } else {
          OpenNotification("error", "Please fill all the required fields");
          alert("Please fill all input data");
        }
      });
    }
  };

  const deletepatientRecord = (id: any) => {
    settLoading(true);
    deletePatient(id)
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
  const error = (id: any) => {
    Modal.error({
      title: "Are you sure to delete",
      closable: true,
      okText: "Yes",
      onOk() {
        deletepatientRecord(id);
      },
    });
  };
  const handleCustomCode = (index: number) => {
    const newDiagnosis = [...dignoses];
    const item = newDiagnosis[index];
    item.inputType = item.inputType === "text" ? "selection" : "text";
    newDiagnosis[index] = item;
    setDignosis(newDiagnosis);
  };

  const columns = [
    {
      title: "Id",
      key: "index",
      render: (text: string, record: any, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Account",
      dataIndex: "identity",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, record: any) => (
        <>
          <a onClick={() => openTab(record)}>
            {" "}
            <span className="text-uppercase">{record.name}</span>
          </a>
        </>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact_no",
    },

    {
      title: "DOB",
      dataIndex: "dob",
      render: (text: any, record: any) =>
        moment(record.dob).format("MM/DD/YYYY"),
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Insurance",
      dataIndex: "insurance_name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Action",
      dataIndex: "btn",
      render: (_: any, record: { id: React.SetStateAction<null> }) =>
        data.length >= 1 ? (
          <Dropdown>
            <Dropdown.Toggle variant="info" size="sm" id="dropdown-basic">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ margin: 0 }}>
              {/*  <Dropdown.Item>
                <Popconfirm
                  title="Sure to delete?"

                  onConfirm={() => deletepatientRecord(record.id)}
                >
                  Delete
                </Popconfirm>
              </Dropdown.Item> */}
              <Dropdown.Item
                className="m-0"
                onClick={
                  () =>
                    error(record.id) /* () => deletepatientRecord(record.id) */
                }
              >
                Delete
              </Dropdown.Item>
              <Dropdown.Item
                className="mr-3 cursor-pointer"
                onClick={() => handleEdit(record.id, record)}
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="mr-3 cursor-pointer"
                onClick={() => openTab(record)}
              >
                Open Profile
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : null,
    },
  ];

  const handleCloseModel = () => {
    setIsOpen(false);
    setDescription("");
    setIDCT("");
    setFamily_history([]);
  };

  const handleFormOpen = () => {
    setTitle("Add patient");
    setIsOpen(true);
    setPatient({} as PatientType);
    setDignosis([
      {
        description: "",
        condition: "",
        status: "",
      },
    ]);
    setMedical([
      {
        name: "",
        dose: "",
        condition: "",
      },
    ]);
    setSurgical([
      {
        procedure: "",
        reason: "",
        date: "",
        surgeon: "",
      },
    ]);
  };

  const handleEdit = (id: any, data: any) => {
    const insurance = Object.keys(insurances).find(
      (key) => insurances[key] === data.insurance_name
    );
    setTitle("Update patient");
    setIsOpen(true);
    data = { ...data, insurance };

    setPatient(data);
    setDignosis(data.diagnosis);
    setMedical(data.medication);
    setSurgical(data.surgical_history);
    setFamily_history(data.family_history);
  };
  const onChange = (name: any, value: any) => {
    const years = moment().diff(value, "years");
    setPatient({
      ...patient,
      [name]: value,
      age: years,
    });
  };

  const onSearch = (value: any) => {
    settLoading(true);
    setSearch(value);

    searchPatient(value).then(({ data: response }) => {
      settLoading(false);

      setData(response.data);
      setTotalRecords(response.total_records);
    });
  };

  return (
    <>
      <div
        className="container "
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
              <h2>Patients</h2>
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
      <PatientForm
        isOpen={isOpen}
        handleCloseModel={handleCloseModel}
        title={title}
        patient={patient}
        age={age}
        handleIDCT={handleIDCT}
        medical={medical}
        surgical={surgical}
        dignoses={dignoses}
        loading={loading}
        IDCT={IDCT}
        description={description}
        doctors={doctors}
        handlepatientInfo={handlepatientInfo}
        handledateChanges={onChange}
        family_history={family_history}
        handleAdd={handleAdd}
        handleCustomCode={handleCustomCode}
        handleAdd2={handleAdd2}
        handleAdd3={handleAdd3}
        handlecellChange={handlecellChange}
        handleaddress={handleaddress}
        handlezipChange={handlezipChange}
        handledignosischange={handledignosischange}
        handlesurchange={handlesurchange}
        handleChanges={handleChanges}
        handlemedchange={handlemedchange}
        handlefamchange={handlefamchange}
        insurances={insurances}
        doctorsClinic={doctorsClinic}
        insurancesCLinic={insurancesCLinic}
        handleChange={handleChange}
        handleClinicChange={handleClinicChange}
        handleSubmit={handleSubmit}
        clinicList={clinics}
        loadingClc={loadingClc}
      />
    </>
  );
}

export default Patients;
