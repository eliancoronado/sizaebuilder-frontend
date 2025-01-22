import React, { useState } from "react";
import { FaSearch, FaBox, FaRegSquare } from "react-icons/fa";
import { MdOutlineTextFields, MdOutlineInsertEmoticon } from "react-icons/md";
import { PiSelectionAllBold, PiSelectionAllDuotone } from "react-icons/pi";
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
    setDraggingElement,
  } = useStore();

  const elements = [
    {
      id: 1,
      name: "Container",
      icon: <FaBox className="lg:text-4xl text-xl text-[#FFC700]" />,
    },
    {
      id: 2,
      name: "Text",
      icon: <MdOutlineTextFields className="lg:text-4xl text-xl text-[#FFC700]" />,
    },
    {
      id: 3,
      name: "Image",
      icon: <FaImage className="lg:text-4xl text-xl text-[#FFC700]" />,
    },
    {
      id: 4,
      name: "Input",
      icon: <RxInput className="lg:text-4xl text-xl text-[#FFC700]" />,
    },
    {
      id: 5,
      name: "Button",
      icon: <FaRegSquare className="lg:text-4xl text-xl text-[#FFC700]" />,
    },
    {
      id: 6,
      name: "Icon",
      icon: <MdOutlineInsertEmoticon className="lg:text-4xl text-xl text-[#FFC700]" />,
    },
    {
      id: 7,
      name: "Select",
      icon: <PiSelectionAllBold className="lg:text-4xl text-xl text-[#FFC700]" />,
    },
    {
      id: 8,
      name: "Option",
      icon: <PiSelectionAllDuotone className="lg:text-4xl text-xl text-[#FFC700]" />,
    },
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

  const handleTouchStart = (e, element) => {
    setDraggingElement({ id: element.id, name: element.name });
  };

  return (
    <div className="w-full h-full col-span-1 bg-[#2B2B44] flex flex-col p-1.5 lg:p-4">
      {mode === "elements" && (
        <>
          <h2 className="text-[#FFC700] text-base lg:text-xl font-medium">
            Añadir Elementos
          </h2>
          <div className="w-full h-9 mt-3 rounded-full border border-[#C5A200] overflow-hidden flex items-center">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-9/12 h-full outline-none pl-3 text-[#C5A200] placeholder:text-[#C5A200] bg-[#3A3A55] font-semibold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="w-3/12 h-full overflow-hidden bg-[#3A3A55] flex items-center justify-center">
              <FaSearch className="h-full text-[#C5A200]" />
            </div>
          </div>
          <div className="w-full h-auto grid grid-cols-3 mt-4">
            {filteredElements.length > 0 ? (
              filteredElements.map((element) => (
                <div
                  key={element.id}
                  className="w-full aspect-square flex flex-col items-center justify-center py-1.5 sm:gap-2 gap-1 text-white border border-[#FFC700] cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, element)}
                  onTouchStart={(e) => handleTouchStart(e, element)}
                >
                  <div>{element.icon}</div>
                  <p className="font-extrabold text-[#FFC700] truncate text-xs">
                    {element.name}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[#F5F5F5] text-center col-span-3 mt-4">
                No elements found
              </p>
            )}
          </div>
        </>
      )}
      {mode === "capas" && (
        <ElementList
          elements={droppedElements}
          setSelectedElement={setSelectedElement}
        />
      )}
      {mode === "files" && (
        <ImageUploader
          imgSelected={imgSelected}
          setImgSelected={setImgSelected}
          url={url}
        />
      )}
    </div>
  );
};

export default LeftPanel;
