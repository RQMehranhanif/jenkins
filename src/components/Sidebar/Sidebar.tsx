import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import "../../assets/css/scrollbar.css";
import { Nav } from "react-bootstrap";
import {
  ContainerFilled,
  HomeFilled,
  ReconciliationFilled,
} from "@ant-design/icons";

interface Props {
  color: string;
}

const Sidebar: React.FC<Props> = ({ color }) => (
  <div
    className="sidebar"
    style={{ backgroundColor: "#272727" }}
    data-color={color}
  >
    <div className="sidebar-wrapper ">
      <div className="p-0 logo d-flex align-items-center justify-content-center  border-0">
        <Link to={"/"}>
          <img src={logo} className="mt-2" alt="logo" width={70} height={70} />
        </Link>
      </div>
      <Nav>
        <li className="text-center mt-5">
          <NavLink to="/" className="text-decoration-none">
            <h4>
              <HomeFilled className="text-light mb-1" />
              <br />
              <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                Home
              </h6>
            </h4>
          </NavLink>
        </li>
        <li className="text-center mt-4">
          <NavLink to="/patients" className="text-decoration-none">
            <h4>
              <ReconciliationFilled className="text-light mb-1" />
              <br />
              <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                Patients
              </h6>
            </h4>
          </NavLink>
        </li>
        <li className="text-center mt-4">
          <NavLink to="/Questionnaires" className="text-decoration-none">
            <h4>
              <ContainerFilled className="text-light mb-1" />
              <br />
              <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                Questionnaire
              </h6>
            </h4>
          </NavLink>
        </li>
      </Nav>
    </div>
  </div>
);

export default Sidebar;
