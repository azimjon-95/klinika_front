import React from "react";
import Checkin from "../pages/doctors/checkin/Checkin";
import Registration from "../pages/reseption/register/Main";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import Workers from "../pages/admin/workers/Workers";
import ClinicManagements from "../pages/admin/setting/Setting";
import History from "../pages/reseption/history/Historys";
import Cabins from "../pages/reseption/Cabins/Cabins";
import Room from "../pages/reseption/Cabins/room/Room";
import PatientAddRoomForm from "../pages/reseption/Cabins/patientAddRoom/PatientAddRoomForm";

export const routes = [
  {
    path: "/doctor",
    element: <Checkin />,
    role: ["doctor", "director"],
    private: true,
  },
  {
    path: "/reception",
    element: <Registration />,
    role: ["reception", "director"],
    private: true,
  },
  {
    path: "/director",
    element: <Dashboard />,
    role: ["director"],
    private: true,
  },
  {
    path: "/workers",
    element: <Workers />,
    role: ["director"],
    private: true,
  },
  {
    path: "/setting",
    element: <ClinicManagements />,
    role: ["director"],
    private: true,
  },
  {
    path: "/history",
    element: <History />,
    role: ["reception", "director"],
    private: true,
  },
  {
    path: "/cabins",
    element: <Cabins />,
    role: ["reception", "director"],
    private: true,
  },
  {
    path: "/room/:id",
    element: <Room />,
    role: ["reception", "director"],
    private: true,
  },
  {
    path: "/addpatient/:id",
    element: <PatientAddRoomForm />,
    role: ["reception", "director"],
    private: true,
  }
];