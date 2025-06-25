import { NavLink } from "react-router-dom";

import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { IoIosTimer } from "react-icons/io";
import { FaChalkboardTeacher, FaBookReader, FaUsers } from "react-icons/fa";

export const generalMenu = [
  { menu: "Dashboard", nav: "/dashboard", icon: <RxDashboard size={20} /> },
  { menu: "Profile", nav: "/profile", icon: <CgProfile size={20} /> },
  { menu: "Presensi", nav: "/presensi", icon: <IoIosTimer size={20} /> },
];

export const adminMenu = [
  { menu: "Data Pegawai", nav: "/data-pegawai", icon: <FaUsers size={20} /> },
];

export const dosenMenu = [
  {
    menu: "Perkuliahan",
    nav: "/perkuliahan",
    icon: <FaChalkboardTeacher size={20} />,
  },
  {
    menu: "Riwayat Presensi Mahasiswa",
    nav: "/riwayat-presensi-mahasiswa",
    icon: <FaBookReader size={20} />,
  },
];

const activeLinkStyle = {
  backgroundColor: "#4752b3",
  color: "white",
};

export const GenerateMenu = (menu, nav, icon) => {
  return (
    <li>
      <NavLink
        to={nav}
        className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-primary-hover"
        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
        {icon}
        <span>{menu}</span>
      </NavLink>
    </li>
  );
};
