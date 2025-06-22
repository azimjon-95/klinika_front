import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import "./Layout.css";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

function Layout() {
  const navigate = useNavigate();
  const permissions = localStorage.getItem("permissions");
  const location = useLocation();

  // useEffect(() => {
  //   if (!permissions) {
  //     navigate("/login");
  //   }
  // }, [permissions, navigate]);

  let backgroundStyle = "";
  let paddingStyle = "";

  if (location.pathname === "/director") {
    backgroundStyle = "linear-gradient(135deg, #eff6ff, #e0e7ff)";
    paddingStyle = "5px";
  } else if (location.pathname === "/history") {
    backgroundStyle = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    paddingStyle = "5px";
  } else if (location.pathname === "/medical-calculators") {
    backgroundStyle = "inear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    paddingStyle = "0px";
  } else {
    backgroundStyle = "#fff";
    paddingStyle = "15px";
  }
  return (
    <div className="layout">
      <div className="layout_left">
        <Sidebar />
      </div>

      <div className="layout_right">
        <Header />
        <main
          style={{
            background: backgroundStyle,
            padding: paddingStyle,
          }}
          className="main-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
