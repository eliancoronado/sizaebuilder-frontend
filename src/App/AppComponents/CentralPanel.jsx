import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import axios from "axios";
import useStore from "../store/store";
import { Hand, MousePointer2  } from 'lucide-react';

const CentralPanel = ({
  onUpdate,
  onDownload,
  id,
  renderElement,
  contextMenu,
  setContextMenu,
}) => {
  const [color, setColor] = useState("ffffff"); // Estado inicial del color
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Color aplicado
  const [isModalOpen, setModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");

  const {
    projectData: project,
    setProjectData: setProject,
    imgSelected,
    setSelectedPage,
    url,
    droppedElements,
    setDroppedElements,
    draggingElement,
    setDraggingElement,
  } = useStore(); // Usamos los métodos del store para actualizar el estado

  useEffect(() => {
    if (imgSelected) {
      console.log("Imagen seleccionada:", imgSelected); // Verificar que imgSelected se ha actualizado
    } else {
      console.log("No se ha seleccionado nada");
    }
  }, [imgSelected]);

  const addNewPage = async () => {
    const newPage = {
      name: newPageName,
      elements: [], // Inicializa con un arreglo vacío de elementos
    };

    try {
      // Actualiza el estado local
      const updatedProject = { ...project, pages: [...project.pages, newPage] };
      setProject(updatedProject);

      // Enviar al backend para actualizar el proyecto
      await axios.put(`${url}/addNewPage/${id}`, {
        pages: updatedProject.pages,
      });

      // Puedes establecer la página recién creada como la seleccionada
      setSelectedPage(newPage.name);
    } catch (error) {
      console.error("Error al agregar la nueva página:", error);
    }
  };

  // Actualizar el color de fondo cuando cambia el estado "color"
  useEffect(() => {
    // Validar si el color es hexadecimal válido
    if (/^[0-9A-Fa-f]{6}$/.test(color)) {
      setBackgroundColor(`#${color}`);
    } else {
      setBackgroundColor("#ffffff"); // Volver al color blanco si es inválido
    }
  }, [color]);

  const handleColorChange = (e) => {
    setColor(e.target.value); // Actualizar el estado del color con el valor del input
  };

  // Permitir arrastrar sobre el contenedor
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado
    const touch = e.touches[0]; // Obtener la posición del primer toque

    // Detectar el elemento bajo el toque
    const targetElement = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    if (
      targetElement &&
      targetElement.getAttribute("data-drop-target") === "true"
    ) {
      // Aquí puedes realizar acciones para indicar que el área es válida
      console.log("Toque sobre un área válida para soltar");
    }
  };

  // Manejar la acción de soltar un elemento
  const handleDrop = (e, parentId = null) => {
    e.preventDefault();
    e.stopPropagation();
    const data = draggingElement
      ? draggingElement
      : JSON.parse(e.dataTransfer.getData("application/reactflow"));

    // Nuevo elemento a agregar
    const newElement = {
      id: Date.now(),
      name: data.name,
      text:
        data.name === "Container"
          ? "Div"
          : data.name === "Input"
          ? ""
          : data.name === "Icon"
          ? ""
          : data.name === "Select"
          ? ""
          : "texto",
      children: [],
      ...(data.name === "Input" && { placeholder: "Placeholder" }), // Agregar el campo placeholder si es Input
      ...(data.name === "Image" && { src: imgSelected }), // Agregar el campo placeholder si es Input
      ...(data.name === "Icon" && { iconClass: "bx bx-left-arrow-alt" }),
      ...(data.name === "Input" && { type: "text" }),
      styles: {
        color: "#000000",
        backgroundColor: "#FFFFFF00",
        borderWidth: "1px",
        borderColor: "",
        borderStyle: "solid",
        fontSize: "16px",
        fontFamily: "Oswald, sans-serif",
        fontWeight: "400",
        lineHeight: "1",
        textAlign: "left",
        width: "100%",
        height: "auto",
        display: "block",
        flexDirection: "",
        alignItems: "start", // Valor predeterminado
        justifyContent: "start", // Valor predeterminado
        gap: "",
        position: "static",
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        transform: "",
        marginTop: "0px",
        marginBottom: "16px",
        marginLeft: "0px",
        marginRight: "0px",
        paddingTop: "8px",
        paddingBottom: "8px",
        paddingLeft: "8px",
        paddingRight: "8px",
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
      }, // Estilos iniciales
    };

    // Asegurarse de que droppedElements sea un array
    // Accede al estado global de droppedElements

    console.log("Estado antes de actualizar:", droppedElements);

    // Verifica si el estado anterior es un arreglo
    if (!Array.isArray(droppedElements)) {
      console.error("El estado anterior no es un array", droppedElements);
      return;
    }

    const updatedElements =
      parentId === null
        ? [...droppedElements, newElement]
        : addChildToParent(droppedElements, parentId, newElement);

    console.log("Elementos antes de actualizar:", droppedElements);
    console.log("Elementos actualizados:", updatedElements);

    // Actualiza el estado global con el nuevo valor
    if (Array.isArray(updatedElements)) {
      setDroppedElements(updatedElements);
    } else {
      console.error("droppedElements no es un array:", updatedElements);
    }
    setDraggingElement(null); // Restablecer el estado
  };

  const addChildToParent = (elements, parentId, child) => {
    return elements.map((el) => {
      if (el.id === parentId) {
        // Agregar el hijo solo al contenedor correspondiente
        return { ...el, children: [...el.children, child] };
      }
      if (el.children.length > 0) {
        // Recursivamente buscar el contenedor correcto en los hijos
        return {
          ...el,
          children: addChildToParent(el.children, parentId, child),
        };
      }
      return el; // Si no coincide, devolver el elemento sin cambios
    });
  };

  const handleDeleteElement = (id) => {
    const deleteElementRecursive = (elements) => {
      return elements
        .map((element) => {
          if (element.id === id) {
            return null; // Marcar para eliminar
          } else if (element.children && element.children.length > 0) {
            // Procesar los hijos recursivamente
            return {
              ...element,
              children: deleteElementRecursive(element.children),
            };
          }
          return element;
        })
        .filter((el) => el !== null); // Filtrar los elementos eliminados
    };

    // Ejecutar la recursión y actualizar el estado
    const updatedElements = deleteElementRecursive(droppedElements);

    // Actualizar el estado global con los elementos modificados
    setDroppedElements(updatedElements);

    // Opcionalmente, cerrar el menú contextual
    setContextMenu(null);
  };

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

  const [scale, setScale] = useState(1.2);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: window.innerHeight / 2 - 466, // Centrado verticalmente
  });
  const [isHandTool, setIsHandTool] = useState(false); // Estado para la herramienta mano
  const containerRef = useRef(null);

  // Funciones para aumentar y disminuir la escala
  const increaseScale = () => setScale((prev) => prev + 0.1); // Incremento libre
  const decreaseScale = () =>
    setScale((prev) => (prev > 0.1 ? prev - 0.1 : prev));

  // Manejo de arrastre
  const handleMouseDown = (e) => {
    if (!isHandTool) return; // Solo permitir arrastre si la herramienta mano está activada
    setIsDragging(true);
    containerRef.current.style.cursor = "grabbing";
    containerRef.current.startX = e.clientX - position.x;
    containerRef.current.startY = e.clientY - position.y;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - containerRef.current.startX;
    const newY = e.clientY - containerRef.current.startY;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    containerRef.current.style.cursor = "default";
  };

  const handleStart = (e) => {
    if (!isHandTool) return; // Solo permitir arrastre si la herramienta mano está activada
    setIsDragging(true);
    containerRef.current.style.cursor = "grabbing";
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
    containerRef.current.startX = clientX - position.x;
    containerRef.current.startY = clientY - position.y;
  };
  
  const handleMove = (e) => {
    if (!isDragging) return;
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
    const newX = clientX - containerRef.current.startX;
    const newY = clientY - containerRef.current.startY;
  
    setPosition({ x: newX, y: newY });
  };
  
  const handleEnd = () => {
    setIsDragging(false);
    containerRef.current.style.cursor = "default";
  };
  

  // Alternar entre herramienta mano y mouse normal
  const toggleHandTool = () => setIsHandTool(true); // Activar la herramienta mano
  const toggleMouseTool = () => setIsHandTool(false); // Desactivar la herramienta mano

  return (
    //Lo que este aqui deberia estar en un canvas para usar html canvas to png
    <div
      className="w-full h-screen max-h-screen min-h-screen overflow-hidden col-span-2 relative flex items-center justify-center"
      style={{ backgroundColor: backgroundColor }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleEnd}
      onMouseLeave={handleMouseUp} // Equivalente para evitar seguir arrastrando con el mouse
    >
      {/* Input y vista previa del color */}
      <div className="absolute z-30 right-1 top-1 px-3 py-2 rounded flex items-center gap-2 bg-[#767676]">
        <div
          className="w-5 h-5"
          style={{ backgroundColor: backgroundColor }}
        ></div>
        <input
          type="text"
          placeholder="Enter color (e.g., ff5733)"
          className="pl-2 outline-none w-20 bg-transparent text-white"
          value={color}
          onChange={handleColorChange}
        />
      </div>

      <div
        className="absolute z-30 top-1 left-1 bg-[#9A4DFF] px-3 py-2 cursor-pointer rounded text-base text-[#2D2D2D] font-semibold"
        onClick={() => setModalOpen(true)}
      >
        Añadir Pagina
      </div>
      <div
        className="absolute z-30 bottom-1 right-1 bg-[#9A4DFF] px-3 py-2 cursor-pointer rounded text-base text-[#2D2D2D] font-semibold"
        onClick={() => onDownload()}
      >
        Exportar
      </div>
      <div
        className="absolute z-30 bottom-1 left-1 bg-[#9A4DFF] px-3 py-2 cursor-pointer rounded text-base text-[#2D2D2D] font-semibold"
        onClick={handleSave}
      >
        Guardar
      </div>

      {/* Botones para controlar la escala */}
      <div className="absolute z-30 top-1 left-1/2 -translate-x-1/2 h-8 flex gap-1">
        <button
          onClick={decreaseScale}
          className="bg-[#9A4DFF] w-8 z-30 flex items-center justify-center text-[#2D2D2D] text-base rounded shadow font-semibold"
        >
          -
        </button>
        <button
          onClick={increaseScale}
          className="bg-[#9A4DFF] w-8 z-30 flex items-center justify-center text-[#2D2D2D] text-base rounded shadow font-semibold"
        >
          +
        </button>
      </div>

      {/* Botones para alternar herramientas */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <button
          onClick={toggleHandTool}
          className={`p-1 ${
            isHandTool ? "bg-blue-500" : "bg-gray-500"
          } text-white rounded shadow hover:bg-blue-600 w-8 h-8`}
        >
          <Hand />
        </button>
        <button
          onClick={toggleMouseTool}
          className={`p-1 w-8 h-8 ${
            !isHandTool ? "bg-blue-500" : "bg-gray-500"
          } text-white rounded shadow hover:bg-blue-600`}
        >
          <MousePointer2 />
        </button>
      </div>

      <div
        id="central"
        ref={containerRef}
        className="absolute"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.2s ease-in-out",
          cursor: isHandTool ? "grab" : "auto", // Cambiar el cursor según la herramienta
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleStart}
      >
        <div
          className="relative overflow-auto"
          onDrop={(e) => handleDrop(e)}
          onTouchEnd={(e) => handleDrop(e)}
          onDragOver={handleDragOver}
          onTouchMove={handleTouchMove}
          style={{
            width: "430px", // Resolución original del iPhone 14 Pro Max
            height: "932px",
            transform: "scale(0.33)",
            borderRadius: "20px", // Bordes redondeados para simular el aspecto de un teléfono
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Sombra para dar un efecto más realista
            backgroundColor: "#fff", // Color de fondo blanco
            boxSizing: "border-box",
            pointerEvents: isHandTool ? "none" : "auto",
          }}
        >
          {droppedElements.map((element) => renderElement(element))}
        </div>
      </div>

      {contextMenu && (
        <div
          className="fixed bg-white shadow-md rounded flex flex-col items-center gap-2 p-2"
          style={{ top: `${contextMenu.y + 25}px`, left: `${contextMenu.x}px` }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            onClick={() => handleDeleteElement(contextMenu.id)}
            className="text-red-500 hover:bg-red-100 w-full px-4 py-2 rounded"
          >
            Borrar
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Nueva Página</h2>
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe el nombre de la nueva página"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={(e) => {
                  addNewPage();
                  setModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CentralPanel;
