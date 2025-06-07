import {
  FaStethoscope,
  FaClipboardList,
  FaUserMd,
  FaHospitalUser,
  FaCog,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoPulse } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";

export const menuItems = {
  doctor: [
    {
      icon: <FaStethoscope size={20} />,
      path: "/doctor",
      label: "Shifokor Qabuli", // Yoki "Qabul"
    },
  ],
  reception: [
    {
      icon: <FaHospitalUser size={20} />,
      path: "/reception",
      label: "Ro'yxatga olish", // Reception ma'nosi
    },
    {
      icon: <FaHospitalUser size={20} />,
      path: "/history",
      label: "Tarix", // Reception ma'nosi
    },
    {
      icon: <FaHospitalUser size={20} />,
      path: "/cabins",
      label: "Davolanish", // Reception ma'nosi
    },
  ],
  director: [
    {
      icon: <MdDashboard size={20} />,
      path: "/director",
      label: "Boshqaruv paneli",
    },
    {
      icon: <BsPeopleFill size={20} />,
      path: "/workers",
      label: "Xodimlar",
    },
    {
      icon: <FaCog size={20} />,
      path: "/setting",
      label: "Sozlamalar",
    },
    {
      icon: <FaHospitalUser size={20} />,
      label: "Qabul bo‘limi",
      children: [
        {
          icon: <FaClipboardList size={20} />,
          path: "/reception",
          label: "Ro'yxatdan o'tkazish",
        },
        {
          icon: <FaHospitalUser size={20} />,
          path: "/history",
          label: "Tarix", // Reception ma'nosi
        },
        {
          icon: <FaHospitalUser size={20} />,
          path: "/cabins",
          label: "Davolanish", // Reception ma'nosi
        }

      ],
    },
    {
      icon: <FaUserMd size={20} />,
      label: "Shifokorlar",
      children: [
        {
          icon: <FaStethoscope size={20} />,
          path: "/doctor",
          label: "Qabul sahifasi",
        },
      ],
    },
  ],
};
