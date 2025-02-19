import React from "react";
import logo from "/Subtract.png";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoHelpCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { LuLayers } from "react-icons/lu";
import { FaCode } from "react-icons/fa6";
import { FaRegImages } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";

const SidebarB = () => {
  const { setMode } = useStore();

  const navigate = useNavigate();

  return (
    <div className="w-[80px] h-full bg-[#5A4A78] hidden md:flex md:flex-col md:items-center md:py-2 lg:py-4 md:justify-between">
      <div className="w-full flex flex-col items-center">
        <img
          src={logo}
          className="w-10 h-auto cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div
          className="w-full py-4 cursor-pointer hover:bg-[rgba(255,255,255,0.3)] flex items-center justify-center mt-8"
          onClick={() => setMode("elements")}
        >
          <IoMdAddCircleOutline className="text-3xl text-[#FFD966]" />
        </div>
        <div
          className="w-full py-4 cursor-pointer hover:bg-[rgba(255,255,255,0.3)] flex items-center justify-center"
          onClick={() => setMode("capas")}
        >
          <LuLayers className="text-2xl text-[#FFD966]" />
        </div>
        <div
          className="w-full py-4 cursor-pointer hover:bg-[rgba(255,255,255,0.3)] flex items-center justify-center"
          onClick={() => setMode("files")}
        >
          <FaRegImages className="text-2xl text-[#FFD966]" />
        </div>
        <div
          className="w-full py-4 cursor-pointer hover:bg-[rgba(255,255,255,0.3)] flex items-center justify-center"
          onClick={() => setMode("code")}
        >
          <FaCode className="text-2xl text-[#FFD966]" />
        </div>
      </div>
    </div>
  );
};

export default SidebarB;
