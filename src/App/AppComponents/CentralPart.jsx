import React, { useState, useEffect } from "react";
import useStore from "../store/store";

const CentralPart = ({ modeOfPart }) => {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Color aplicado

  const {
    droppedElements,
    setDroppedElements,
    selectedElement,
    draggingElement,
    setDraggingElement,
  } = useStore();

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

  const handleElementClick = (element) => {
    setSelectedElement(element); // Seleccionar el elemento
  };

  const handleContextMenu = (e, element) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, id: element.id });
  };

  const renderElement = (element) => {
    switch (element.name) {
      case "Container":
        return (
          <div
            key={element.id}
            className={`${
              selectedElement?.id === element.id ? "border border-blue-500" : ""
            }`}
            onDrop={(e) => handleDrop(e, element.id)}
            onTouchEnd={(e) => {
              e.stopPropagation();
              if (draggingElement === null) {
                handleElementClick(element);
              } else {
                handleDrop(e, element.id);
              }
            }} // Maneja el soltar o el clic en táctiles
            onDragOver={handleDragOver}
            onTouchMove={handleTouchMove}
            onClick={(e) => {
              e.stopPropagation();
              if (draggingElement === null) {
                handleElementClick(element);
              }
            }} // Ejecuta clic solo si no está arrastrando
            onContextMenu={(e) => {
              e.stopPropagation();
              handleContextMenu(e, element);
            }}
            style={element.styles}
          >
            {element.text}
            {element.children.map((child) => renderElement(child))}
          </div>
        );
      case "Button":
        return (
          <button
            key={element.id}
            type="button"
            className={`${
              selectedElement?.id === element.id ? "border border-blue-500" : ""
            }`}
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              handleContextMenu(e, element);
            }}
            style={element.styles}
          >
            {element.text}
          </button>
        );
      case "Input":
        return (
          <input
            type={element.type}
            className={`text-base text-black mb-2${
              selectedElement?.id === element.id ? "border border-blue-500" : ""
            }`}
            placeholder={element.placeholder}
            key={element.id}
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              handleContextMenu(e, element);
            }}
            style={element.styles}
          />
        );
      case "Text":
        return (
          <h3
            key={element.id}
            className={`text-base text-black border border-black leading-none ${
              selectedElement?.id === element.id ? "border border-blue-500" : ""
            }`}
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              handleContextMenu(e, element);
            }}
            style={element.styles}
          >
            {element.text}
          </h3>
        );
      case "Select":
        return (
          <select
            key={element.id}
            className={`text-base text-black border border-black ${
              selectedElement?.id === element.id ? "border border-blue-500" : ""
            }`}
            onDrop={(e) => handleDrop(e, element.id)}
            onTouchEnd={(e) => {
              e.stopPropagation();
              if (draggingElement === null) {
                handleElementClick(element);
              } else {
                handleDrop(e, element.id);
              }
            }} // Maneja el soltar o el clic en táctiles
            onDragOver={handleDragOver}
            onTouchMove={handleTouchMove}
            onClick={(e) => {
              e.stopPropagation();
              if (draggingElement === null) {
                handleElementClick(element);
              }
            }} // Ejecuta clic solo si no está arrastrando
            onContextMenu={(e) => {
              e.stopPropagation();
              handleContextMenu(e, element);
            }}
            style={element.styles}
          >
            {element.children.map((child) => renderElement(child))}
          </select>
        );
      case "Option":
        return (
          <option
            key={element.id}
            className={`text-base text-black border border-black ${
              selectedElement?.id === element.id ? "border border-blue-500" : ""
            }`}
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              handleContextMenu(e, element);
            }}
            style={element.styles}
          >
            {element.text}
          </option>
        );
      case "Icon":
        return (
          <i
            key={element.id}
            className={`${element.iconClass} ${
              selectedElement?.id === element.id ? "border border-blue-500" : ""
            }`}
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              handleContextMenu(e, element);
            }}
            style={element.styles}
          ></i>
        );
      case "Image":
        return (
          <img
            key={element.id}
            src={element.src}
            alt="Placeholder"
            style={element.styles}
            className={`w-32 h-32 mb-4 ${
              selectedElement?.id === element.id ? "border border-blue-500" : ""
            }`}
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(element);
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              handleContextMenu(e, element);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {modeOfPart === "completepart" && (
        <div
          className="w-full h-screen max-h-screen min-h-screen overflow-hidden col-span-2 relative flex items-center justify-center"
          style={{ backgroundColor: backgroundColor }}
        >
          <div className="" style={{ transform: "scale(2.3)" }} id="central">
            <div
              className="relative overflow-auto"
              onDrop={(e) => handleDrop(e)}
              onDragOver={handleDragOver}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleDrop(e)} // Simular la acción de soltar en táctiles
              data-drop-target="true" // Atributo personalizado para identificar el área válida
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
        </div>
      )}
      {modeOfPart === "leftPart" && (
        <div
          className="w-full h-full overflow-hidden col-span-2 relative flex items-center justify-center rounded-md"
          style={{ backgroundColor: backgroundColor }}
        >
          <div className="" style={{ transform: "scale(1.1)" }} id="central">
            <div
              className="relative overflow-auto"
              onDrop={(e) => handleDrop(e)}
              onDragOver={handleDragOver}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleDrop(e)} // Simular la acción de soltar en táctiles
              data-drop-target="true" // Atributo personalizado para identificar el área válida
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
        </div>
      )}
    </>
  );
};

export default CentralPart;
