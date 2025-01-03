import React, { useState } from "react";
import { FaSearch, FaBox, FaRegSquare } from "react-icons/fa";
import { MdOutlineTextFields, MdOutlineInsertEmoticon } from "react-icons/md";
import { RxInput } from "react-icons/rx";
import { FaImage } from "react-icons/fa6";
import ElementList from "./ElementList";
import ImageUploader from "./ImageUploader";
import useStore from "../store/store";

const LeftPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener estados y setters desde el store
  const {
    mode,
    droppedElements,
    setSelectedElement,
    imgSelected,
    setImgSelected,
    url,
  } = useStore();

  const elements = [
    { id: 1, name: "Container", icon: <FaBox className="text-4xl text-[#4F4F4F]" /> },
    { id: 2, name: "Text", icon: <MdOutlineTextFields className="text-4xl text-[#4F4F4F]" /> },
    { id: 3, name: "Image", icon: <FaImage className="text-4xl text-[#4F4F4F]" /> },
    { id: 4, name: "Input", icon: <RxInput className="text-4xl text-[#4F4F4F]" /> },
    { id: 5, name: "Button", icon: <FaRegSquare className="text-4xl text-[#4F4F4F]" /> },
    { id: 6, name: "Icon", icon: <MdOutlineInsertEmoticon className="text-4xl text-[#4F4F4F]" /> },
  ];

  const filteredElements = elements.filter((element) =>
    element.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (e, element) => {
    e.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ id: element.id, name: element.name })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-full h-full col-span-1 bg-[#333333] flex flex-col p-4">
      {mode === "elements" && (
        <>
          <h2 className="text-[#F5F5F5] text-xl font-medium">Add Element</h2>
          <div className="w-full h-9 mt-3 rounded-full border border-[#ffffff] overflow-hidden flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-9/12 h-full outline-none pl-3 text-[#ffffff] bg-[#333333] font-semibold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="w-3/12 h-full overflow-hidden bg-[#333333] flex items-center justify-center">
              <FaSearch className="h-full text-[#ffffff]" />
            </div>
          </div>
          <div className="w-full h-auto grid grid-cols-3 mt-4">
            {filteredElements.length > 0 ? (
              filteredElements.map((element) => (
                <div
                  key={element.id}
                  className="w-full h-24 flex flex-col gap-2 items-center justify-center text-white text-base border border-[#4F4F4F] cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, element)}
                >
                  {element.icon}
                  <p className="text-sm font-extrabold text-[#4F4F4F]">{element.name}</p>
                </div>
              ))
            ) : (
              <p className="text-[#F5F5F5] text-center col-span-3 mt-4">No elements found</p>
            )}
          </div>
        </>
      )}
      {mode === "capas" && (
        <ElementList elements={droppedElements} setSelectedElement={setSelectedElement} />
      )}
      {mode === "files" && (
        <ImageUploader imgSelected={imgSelected} setImgSelected={setImgSelected} url={url} />
      )}
    </div>
  );
};

export default LeftPanel;
