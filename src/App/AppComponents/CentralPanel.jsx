import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import axios from "axios";
import useStore from "../store/store";

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
      setSelectedPage("New Page");
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

  // Manejar la acción de soltar un elemento
  const handleDrop = (e, parentId = null) => {
    e.preventDefault();
    e.stopPropagation();
    const data = JSON.parse(e.dataTransfer.getData("application/reactflow"));

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
        textAlign: "left",
        width: "100%",
        height: "auto",
        display: "inline-block",
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

  return (
    //Lo que este aqui deberia estar en un canvas para usar html canvas to png
    <div
      className="w-full h-screen max-h-screen min-h-screen overflow-hidden col-span-2 relative flex items-center justify-center"
      style={{ backgroundColor: backgroundColor }}
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
        Add Page
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
        Save
      </div>

      <div className="" style={{ transform: "scale(1.5)" }} id="central">
        <div
          className="relative overflow-auto"
          onDrop={(e) => handleDrop(e)}
          onTouchEnd={(e) => handleDrop(e)}
          onDragOver={handleDragOver}
          onTouchMove={handleDragOver}
          style={{
            width: "430px", // Resolución original del iPhone 14 Pro Max
            height: "932px",
            transform: "scale(0.33)",
            borderRadius: "20px", // Bordes redondeados para simular el aspecto de un teléfono
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Sombra para dar un efecto más realista
            backgroundColor: "#fff", // Color de fondo blanco
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
          <button className="text-blue-500 hover:bg-blue-100 w-full px-4 py-2 rounded">
            Funcionalidad
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">New Page Name</h2>
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new page name"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  addNewPage();
                  setModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CentralPanel;
