import {
  FaStethoscope,
  FaClipboardList,
  FaUserMd,
  FaHospitalUser,
  FaCog,
  FaNotesMedical,
  FaHistory,
  FaBed,
  FaCalendarCheck,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";

export const menuItems = [
  {
    icon: <FaStethoscope size={20} />,
    // path: "/doctor",
    path: "/",
    label: "Shifokor Qabuli",
  },
  {
    icon: <FaHospitalUser size={20} />,
    path: "/reception",
    label: "Ro'yxatga olish",
  },
  {
    icon: <FaMoneyBillWave />,
    path: "/expense",
    label: "Harajatlar",
  },
  {
    icon: <FaHistory size={20} />, // Changed to FaHistory for medical history
    path: "/history",
    label: "Tarix",
  },
  {
    icon: <FaBed size={20} />, // Changed to FaBed for treatment/cabins
    path: "/cabins",
    label: "Davolanish",
  },
  {
    icon: <FaCalendarCheck size={20} />, // Changed to FaCalendarCheck for attendance
    path: "/attendance",
    label: "Davomat",
  },
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
  // {
  //   icon: <FaClipboardList size={20} />,
  //   path: "/reception",
  //   label: "Ro'yxatdan o'tkazish",
  // },
  // {
  //   icon: <FaMoneyBillWave />,
  //   path: "/expense",
  //   label: "Harajatlar",
  // },
  // {
  //   icon: <FaHistory size={20} />, // Changed to FaHistory for history
  //   path: "/history",
  //   label: "Tarix",
  // },
  // {
  //   icon: <FaBed size={20} />, // Changed to FaBed for treatment/cabins
  //   path: "/cabins",
  //   label: "Davolanish",
  // },
  // {
  //   icon: <FaCalendarCheck size={20} />, // Changed to FaCalendarCheck for attendance
  //   path: "/attendance",
  //   label: "Davomat",
  // },
  {
    icon: <FaStethoscope size={20} />,
    path: "/doctor",
    label: "Qabul sahifasi",
  },
];
