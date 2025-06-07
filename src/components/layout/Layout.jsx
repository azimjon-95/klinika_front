import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import "./Layout.css";
import { menuItems } from "../../utils/SidebarMenu";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

function Layout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const location = useLocation();

  useEffect(() => {
    if (!role || !menuItems[role]) {
      navigate("/login");
    }
  }, [role, navigate]);

  const isDirectorPath = location.pathname === '/director';

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
