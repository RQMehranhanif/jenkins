import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "components/Sidebar/Sidebar";
import Navbar from "components/Navbar/Navbar";

interface Props {
  children: any;
}
const Layout: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");
  const path = window.location.pathname;
  if (token === null || (token === "" && path !== "/login")) {
    window.location.href = "/login";
  }

  const location = useLocation();
  const mainPanel = useRef<HTMLDivElement>(document.createElement("div"));
  const color = "black";

  useEffect(() => {
    mainPanel.current.scrollTop = 0;
  }, [location]);

  return (
    <div className="wrapper">
      <Sidebar color={color} />
      <div className="main-panel " ref={mainPanel}>
        <Navbar />
        {children}
      </div>
    </div>
  );
};
export default Layout;
