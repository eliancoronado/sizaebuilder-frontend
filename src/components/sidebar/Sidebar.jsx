import React from "react";
import logo from "/logo2.png";
import { FaRegFolder } from "react-icons/fa";
import { LuLayoutTemplate } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-[237px] hidden sm:flex h-screen bg-[#2e2e47] py-2 sm:flex-col items-center">
      <img src={logo} className="w-9/12 h-auto cursor-pointer" onClick={() => navigate("/")} />

      <div className="w-full py-4 text-[#A8CFFF] font-semibold flex items-center gap-3 px-4 text-lg cursor-pointer hover:bg-[rgba(255,255,255,0.2)]">
        <FaRegFolder />
        Projects
      </div>
      <div className="w-full py-4 text-[#A8CFFF] font-semibold flex items-center gap-3 px-4 text-lg cursor-pointer hover:bg-[rgba(255,255,255,0.2)]">
        <LuLayoutTemplate />
        Templates
      </div>
    </div>
  );
};

export default Sidebar;
