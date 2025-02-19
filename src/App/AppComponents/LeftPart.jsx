import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaChevronDown, FaBox, FaRegSquare } from "react-icons/fa";
import { MdOutlineTextFields, MdOutlineInsertEmoticon } from "react-icons/md";
import { PiSelectionAllBold, PiSelectionAllDuotone } from "react-icons/pi";
import { RxInput } from "react-icons/rx";
import { FaImage } from "react-icons/fa6";
import html2canvas from "html2canvas";
import { useNavigate, useParams } from "react-router-dom";
import ElementList from "./ElementList";
import ImageUploader from "./ImageUploader";
import CentralPart from "./CentralPart";
import useStore from "../store/store";
import io from "socket.io-client";

const socket = io("https://sizaebuilder-backend.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const LeftPart = ({ mode, id, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    droppedElements,
    setSelectedElement,
    imgSelected,
    setImgSelected,
    selectedElement,
    url,
    draggingElement,
    setDraggingElement,
  } = useStore();

  // Lista de elementos a mostrar
  const elements = [
    {
      id: 1,
      name: "Container",
      icon: <FaBox className="text-4xl text-[#4F4F4F]" />,
    },
    {
      id: 2,
      name: "Text",
      icon: <MdOutlineTextFields className="text-4xl text-[#4F4F4F]" />,
    },
    {
      id: 3,
      name: "Image",
      icon: <FaImage className="text-4xl text-[#4F4F4F]" />,
    },
    {
      id: 4,
      name: "Input",
      icon: <RxInput className="text-4xl text-[#4F4F4F]" />,
    },
    {
      id: 5,
      name: "Button",
      icon: <FaRegSquare className="text-4xl text-[#4F4F4F]" />,
    },
    {
      id: 6,
      name: "Icon",
      icon: <MdOutlineInsertEmoticon className="text-4xl text-[#4F4F4F]" />,
    },
    {
      id: 7,
      name: "Select",
      icon: <PiSelectionAllBold className="text-4xl text-[#4F4F4F]" />,
    },
    {
      id: 8,
      name: "Option",
      icon: <PiSelectionAllDuotone className="text-4xl text-[#4F4F4F]" />,
    },
  ];

  // Filtrar elementos según el término de búsqueda
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
    console.log("Iniciando arrastre con el toque:", element);
    if (draggingElement) {
      console.log("Ya hay un elemento arrastrándose:", draggingElement);
      setDraggingElement(null);
    }else{
      setDraggingElement({ id: element.id, name: element.name });
      console.log("Estado de draggingElement después de setDraggingElement:", draggingElement);
    }
  
    // Emitir el evento
    socket.emit("draggingElementStarted", {
      id,
      draggingElement: { id: element.id, name: element.name },
    });
  
    // Asegúrate de que se actualizó el estado
    setTimeout(() => {
      console.log("Estado actualizado en setTimeout:", draggingElement);
    }, 0);
  };
  

  useEffect(() => {
    console.log("draggingElement:", draggingElement);
  },[draggingElement]);

  function handleSave() {
    const saveId = id;
    const divToSave = document.querySelector("#central");

    html2canvas(divToSave).then((canvas) => {
      const imageData = canvas.toDataURL("image/png"); // Convertir el div en base64

      // Enviar la imagen y el id al backend
      fetch(`${url}/save-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData, id: saveId }), // Envía la imagen y el id
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Imagen guardada:", data);
        })
        .catch((error) => {
          console.error("Error al guardar la imagen:", error);
        });
    });
    onUpdate();
  }

  return (
    <div className="w-full h-full col-span-1 bg-[#333333] flex flex-col p-4">
      {mode === "elements" && (
        <>
          <div className="w-full h-1/2">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-[#F5F5F5] text-xl font-medium">
                Añadir Elementos
              </h2>
              <div
                className="bg-[#9A4DFF] px-3 py-2 cursor-pointer rounded text-base text-[#2D2D2D] font-semibold"
                onClick={handleSave}
              >
                Guardar
              </div>
            </div>
            <div className="w-full h-auto">
              <div className="w-full py-3 mt-1 text-white font-semibold text-base pl-4">
                Elementos
              </div>
              <div className="w-full h-auto grid grid-cols-3">
                {filteredElements.length > 0 ? (
                  filteredElements.map((element) => (
                    <div
                      key={element.id}
                      className="w-full h-24 flex flex-col gap-2 items-center justify-center text-white text-base border border-[#4F4F4F] cursor-pointer"
                      draggable
                      onDragStart={(e) => handleDragStart(e, element)}
                      onTouchStart={(e) => handleTouchStart(e, element)}
                      onClick={(e) => handleTouchStart(e, element)}
                    >
                      {element.icon}
                      <p className="text-sm font-extrabold text-[#4F4F4F]">
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
            </div>
          </div>
          <div className="w-full h-1/2">
            <CentralPart
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              imgSelected={imgSelected}
              modeOfPart="leftPart"
            />
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

export default LeftPart;
