import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import "./Layout.css";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

function Layout() {
  const navigate = useNavigate();
  const permissions = localStorage.getItem("permissions");
  const location = useLocation();

  useEffect(() => {
    if (!permissions) {
      navigate("/login");
    }
  }, [permissions, navigate]);

  const isDirectorPath = location.pathname === '/director' || "/expense";

  return (
    <div className="layout">

      <div className="layout_left">
        <Sidebar />
      </div>

      <div className="layout_right">
        <Header />
        <main style={{
          background: isDirectorPath
            ? 'linear-gradient(135deg, #eff6ff, #e0e7ff)'
            : '#fff',
          padding: isDirectorPath ? "5px 5px 5px 5px" : "15px"
        }} className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
