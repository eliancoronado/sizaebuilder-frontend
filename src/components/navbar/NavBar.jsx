import React from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

const user = JSON.parse(localStorage.getItem("user"));

const NavBar = () => {
  return (
    <div className="w-full h-[12vh] border-b border-[#D9D9D9] flex items-center px-4 justify-between">
      <h1 className="text-black font-bold text-2xl">Projects</h1>
      <div className="flex items-center h-full gap-4">
          <div className="w-52 h-1/2 rounded-full border border-[#BDBDBD] relative overflow-hidden flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-9/12 h-full border-none outline-none pl-3 text-black"
            />
            <div className="w-3/12 h-full flex items-center justify-center">
              <FaSearch className="h-full text-[#BDBDBD]" />
            </div>
          </div>
          <div className="flex px-2 items-center text-black gap-3 cursor-pointer">
            <MdAccountCircle className="text-3xl" />
            <p className="flex items-center gap-3">
              {user.username} <FaChevronDown />
            </p>
          </div>
      </div>
    </div>
  );
};

export default NavBar;
