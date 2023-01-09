import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "assets/css/profile.css";
import { Button, Dropdown } from "react-bootstrap";

import { PatientType } from "@/Types/PatientType";
import { useAppDispatch } from "../../../hooks/hooks";
import {
  addPatientProfileData,
  setAllQuestion,
  setDateofService,
  setdiagnosis,
  setProgramId,
  setQuestionId,
} from "../../../store/reducer/QuestionairesReducer";
import MedicalInfo from "./MedicalInfo/Medicalinfo";
import {
  encounters,
  getprogram,
} from "../../../actions/Patients/PatientActions";
import { OpenNotification } from "./../../../Utilties/Utilties";
import { Modal, Spin, Tabs } from "antd";
import moment from "moment";
import Profiledata from "./Profiledata/Profiledata";
import { LoadingOutlined } from "@ant-design/icons";
import EncounterCareplan from "./encounter/EncounterCareplan";

function Profile({ Patient }: { Patient: PatientType }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>([]);

  const handleProgramSelection = (programmId: string, patient: PatientType) => {
    setLoading(true);
    const obj = { program_id: programmId, patient_id: patient.id };
    getprogram(obj).then(({ data: response }) => {
      setLoading(false);
      dispatch(setdiagnosis(response.diagnosis));
      if (response.success === false) {
        OpenNotification("error", response.errors);
      } else {
        setLoading(false);
        const data = { programmId, patient };

        localStorage.setItem("gender", data.patient.gender);

        dispatch(addPatientProfileData(data));
        if (programmId === "1" && response.ccm_id === "") {
          dispatch(setAllQuestion(response.awv_data));
          dispatch(setDateofService(""));

          navigate("/questionaires/create", {
            state: {
              data: patient,
              age: patient.age,
              name: patient.name,
              dob: patient.dob,
              gender: patient.gender,
              insurance_name: patient.insurance_name,
            },
          });
        }
        if (programmId === "2" && response.ccm_id === "") {
          dispatch(setAllQuestion(response.awv_data));
          dispatch(setDateofService(""));
          navigate("/questionaires/create", {
            state: {
              data: patient,
              age: patient.age,
              diagnosis: response.diagnosis,
              name: patient.name,
              dob: patient.dob,
              gender: patient.gender,
            },
          });
        }
        if (programmId === "2" && response.ccm_id !== "") {
          navigate(`/questionaire/edit/${response.ccm_id}`, {
            state: {
              id: response.ccm_id,
              data: patient,
              age: patient.age,
              name: patient.name,
              dob: patient.dob,
              gender: patient.gender,
              diagnosis: response.diagnosis,
            },
          });
        }
      }
    });
  };
  const handleModal = () => {
    setLoading(true);
    encounters(Patient.id).then(({ data: response }) => {
      setLoading(false);
      setData(response.data);
    });
    setOpen(true);
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const handleOpenEncounter = (id: any, programmId: any) => {
    dispatch(setQuestionId(id));
    dispatch(setProgramId(programmId));
    if (programmId === 2) {
      navigate(`/ccm-general-careplan/${id}`, {
        state: { questionid: id },
      });
    } else if (programmId === 1) {
      navigate(`/awvcareplan/${id}`, {
        state: { questionid: id },
      });
    }
  };

  return (
    <>
      <Modal
        title="Recent Encounters"
        open={open}
        onCancel={() => setOpen(false)}
        width={1000}
        footer={false}
        maskClosable={false}
      >
        <Spin spinning={loading} indicator={antIcon}>
          <Tabs
            defaultActiveKey="0"
            id="tabs_id"
            tabPosition={"left"}
            style={{ height: 400 }}
            items={data?.map((i: any) => {
              return {
                label: [
                  <>
                    <p className="p-0 m-0" style={{ fontSize: "12px" }}>
                      {i.program_id === 1 ? "AWV Encounter" : "CCM Encounter"}{" "}
                      {i.signed_date ? (
                        <i className="fa fa-lock" aria-hidden="true"></i>
                      ) : (
                        ""
                      )}
                    </p>
                    <small>{i.date_of_service}</small>
                  </>,
                ],
                key: i.id,
                children: (
                  <div style={{ height: 400, overflow: "scroll" }}>
                    <Button
                      size="sm"
                      onClick={() => handleOpenEncounter(i.id, i.program_id)}
                    >
                      Open this encounter
                    </Button>
                    <EncounterCareplan questionId={i.id} />
                  </div>
                ),
              };
            })}
          />
        </Spin>
      </Modal>
      <ul className="nav nav-bar" id="navId">
        <li className="nav-item mt-2">
          <h3 className="m-0 mr-5">
            <i className="fa fa-user-circle fa-2x  " aria-hidden="true" />
          </h3>
        </li>
        <li className="nav-item">
          <p className="nav-link text-dark text-uppercase   mt-3">
            <b>{Patient.name}</b>
          </p>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase  m-0 ">
            Serial No:
            {Patient.identity}
          </span>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase m-0">
            Phone:
            {Patient.contact_no}
          </span>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase m-0">
            Date of Birth:
            {moment(Patient.dob).format("MM/DD/YYYY")}
          </span>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase m-0">
            Gender:
            {Patient.gender}
          </span>
        </li>
        <li className="nav-item mt-3">
          <span
            className="nav-link text-dark text-uppercase m-0"
            style={{ cursor: "pointer" }}
            onClick={handleModal}
          >
            <i className="fa fa-history" aria-hidden="true"></i>
          </span>
        </li>
        <li className="nav-item mt-3 ml-3">
          <Dropdown>
            <Spin spinning={loading} indicator={antIcon} className="text-info">
              <Dropdown.Toggle variant="info" size="sm" id="dropdown-basic">
                Actions
              </Dropdown.Toggle>
            </Spin>
            <Dropdown.Menu>
              <Dropdown.Item
                className="mr-3 cursor-pointer"
                onClick={() => handleProgramSelection("1", Patient)}
              >
                AWV Program
              </Dropdown.Item>
              <Dropdown.Item
                className="mr-3 cursor-pointer"
                onClick={() => handleProgramSelection("2", Patient)}
              >
                CCM Program
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>

      <div className="container-fluid">
        <div className="row">
          <div className=" col-lg-12 col-xl-12">
            <div className="card-container">
              <Tabs size="large" type="line" tabBarGutter={300}>
                <Tabs.TabPane tab="Medical Information" key="item-1" active>
                  <MedicalInfo patient={Patient} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Care Gap" key="item-2">
                  Content 2
                </Tabs.TabPane>
                <Tabs.TabPane tab="Utilization" key="item-3">
                  Content 3
                </Tabs.TabPane>
                <Tabs.TabPane tab="Profile" key="item-4" active>
                  <Profiledata patient={Patient} />
                </Tabs.TabPane>
              </Tabs>
            </div>
            {/* <Tabs defaultActiveKey="home" className="mb-3 text-info" justify>
              <Tab eventKey="home" title="Medical Informantion">
                <MedicalInfo patient={Patient} />
              </Tab>
              <Tab eventKey="profile" title="Care Gap">
                <h3>hello 2</h3>
              </Tab>
              <Tab eventKey="contact" title="Utilization">
                <h3>hello 3</h3>
              </Tab>
            </Tabs> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
