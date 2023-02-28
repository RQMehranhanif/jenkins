/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { setFilterData } from "../../store/reducer/DashboardReducer";
import "../../assets/css/index.css";
import { useAppDispatch } from "../../hooks/hooks";
import { DashboardData } from "../../actions/Dashboard/Dashboard";
import { Dropdown, Menu, message, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { SubmitLogout } from "../../actions/Login/LoginActions";
import { OpenNotification } from "./../../Utilties/Utilties";

function Header() {
  const [doctor, setDoctor] = useState([] as any);
  const [clinic, setClinic] = useState([] as any);
  const [insurance, setInsurance] = useState([] as any);
  const [program, setProgram] = useState([] as any);
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useAppDispatch();
  const key = "updatable";

  function logoutfunction() {
    messageApi.open({
      key,
      type: "loading",
      content: "Logging out..",
      duration: 0,
      style: { marginTop: "40px" },
    });
    SubmitLogout().then(({ data: response }) => {
      if (response.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("role_id");
        OpenNotification("success", response.message);
        window.location.href = "/login";
      }
    });
  }

  const menu = (
    <Menu>
      {doctor?.map((items: any, index: any) => {
        return (
          <Menu.Item
            onClick={() =>
              dispatch(setFilterData({ key: "doctor_id", value: items.id }))
            }
            key={index}
          >
            {items.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  const menu2 = (
    <Menu>
      {clinic?.map((items: any, index: any) => {
        return (
          <Menu.Item
            onClick={() =>
              dispatch(setFilterData({ key: "clinic_id", value: items.id }))
            }
            key={index}
          >
            {items.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  const menu3 = (
    <Menu>
      {insurance?.map((items: any, index: any) => {
        return (
          <Menu.Item
            onClick={() =>
              dispatch(setFilterData({ key: "insurance_id", value: items.id }))
            }
            key={index}
          >
            {items.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  const menu4 = (
    <Menu>
      {program?.map((items: any, index: any) => {
        return (
          <Menu.Item
            onClick={() =>
              dispatch(setFilterData({ key: "program_id", value: items.id }))
            }
            key={index}
          >
            {items.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  const menu5 = (
    <Menu>
      <Menu.Item key={1}>
        <Link style={{ fontSize: "0.75rem" }} to="/users">
          Users
        </Link>
      </Menu.Item>
      <Menu.Item key={2}>
        <Link style={{ fontSize: "0.75rem" }} to="/specialists">
          Specialists
        </Link>
      </Menu.Item>
      <Menu.Item key={3}>
        <Link style={{ fontSize: "0.75rem" }} to="/insurances">
          Insurances
        </Link>
      </Menu.Item>
      <Menu.Item key={4}>
        <Link style={{ fontSize: "0.75rem" }} to="/program">
          Programs
        </Link>
      </Menu.Item>
      <Menu.Item key={5}>
        <Link style={{ fontSize: "0.75rem" }} to="/physician">
          Physician
        </Link>
      </Menu.Item>
      <Menu.Item key={6}>
        <Link style={{ fontSize: "0.75rem" }} to="/Clinic">
          Clinic
        </Link>
      </Menu.Item>
      <Menu.Item key={7}>
        <Link style={{ fontSize: "0.75rem" }} to="/ClinicAdmin">
          Clinic Users
        </Link>
      </Menu.Item>
      <Menu.Item key={8}>
        <Link style={{ fontSize: "0.75rem" }} to="/scheduled">
          Scheduled
        </Link>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    DashboardData().then(({ data: response }) => {
      const doctor = response.doctor_data;
      const clinic = response.clinic_data;
      const insurance = response.insurance_data;
      const program = response.program_data;
      setDoctor(doctor);
      setClinic(clinic);
      setInsurance(insurance);
      setProgram(program);
    });
  }, []);
  const roleId = localStorage.getItem("role_id");

  return (
    <>
      <nav
        className="navbar navbar-expand-md    sticky-top m-0 p-0"
        style={{ borderBottom: "1px solid grey", backgroundColor: "#343434" }}
      >
        <div className="navbar-toggler-right">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        <div className="collapse navbar-collapse flex-column " id="navbar">
          <ul className="navbar-nav  w-100 justify-content-end px-3 ">
            <Space>
              <li className="nav-item">
                <Dropdown
                  overlay={menu}
                  trigger={["click"]}
                  overlayStyle={{ overflowY: "scroll", maxHeight: "400px" }}
                >
                  <a
                    onClick={(e) => e.preventDefault()}
                    style={{ fontSize: "12px", color: "#888888" }}
                  >
                    <Space>
                      Doctors
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </li>
              <div className="vr text-white" style={{ height: "64px" }} />
              {(roleId === "11" || roleId === "1") && (
                  <>
                    <li className="nav-item dropdown text-secondary">
                      <Dropdown
                        overlay={menu2}
                        trigger={["click"]}
                        overlayStyle={{
                          overflowY: "scroll",
                          maxHeight: "400px",
                        }}
                      >
                        <a
                          onClick={(e) => e.preventDefault()}
                          style={{ fontSize: "12px", color: "#888888" }}
                        >
                          <Space>
                            Clinic
                            <DownOutlined />
                          </Space>
                        </a>
                      </Dropdown>
                    </li>
                    <div className="vr text-white" style={{ height: "64px" }} />
                    <li className="nav-item dropdown text-secondary ">
                      <Dropdown
                        overlay={menu3}
                        trigger={["click"]}
                        overlayStyle={{
                          overflowY: "scroll",
                          maxHeight: "400px",
                        }}
                      >
                        <a
                          onClick={(e) => e.preventDefault()}
                          style={{ fontSize: "12px", color: "#888888" }}
                        >
                          <Space>
                            Insurance
                            <DownOutlined />
                          </Space>
                        </a>
                      </Dropdown>
                    </li>
                    <div className="vr text-white" style={{ height: "64px" }} />
                    <li className="nav-item dropdown text-secondary ">
                      <Dropdown
                        overlay={menu4}
                        trigger={["click"]}
                        overlayStyle={{
                          overflowY: "scroll",
                          maxHeight: "400px",
                        }}
                      >
                        <a
                          onClick={(e) => e.preventDefault()}
                          style={{ fontSize: "12px", color: "#888888" }}
                        >
                          <Space>
                            Program
                            <DownOutlined />
                          </Space>
                        </a>
                      </Dropdown>
                    </li>
                    <li className="nav-item dropdown text-secondary">
                      <Dropdown overlay={menu5} trigger={["click"]}>
                        <a
                          onClick={(e) => e.preventDefault()}
                          style={{ fontSize: "12px", color: "#888888" }}
                        >
                          <Space>
                            Settings
                            <DownOutlined />
                          </Space>
                        </a>
                      </Dropdown>
                    </li>
                  </>
                )}
            </Space>
            <div className="vr text-white" style={{ height: "64px" }} />

            <li className="nav-item dropdown">
              <a
                className=" nav-link mt-3"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={logoutfunction}
              >
                <small style={{ fontSize: "0.75rem" }}>Log out</small>
              </a>
            </li>
            <div className="vr text-white" style={{ height: "64px" }} />
          </ul>
        </div>
      </nav>
      {contextHolder}
    </>
  );
}

export default Header;
