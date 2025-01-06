import React, { useState, useEffect } from "react";
import useStore from "../store/store";

const useAppManager = () => {
  const [contextMenu, setContextMenu] = useState(null); // Estado para el menú contextual

  const {
    selectedElement,
    imgSelected,
    setImgSelected,
    setSelectedElement,
    droppedElements,
    setDroppedElements,
  } = useStore(); // Usamos los métodos del store para actualizar el estado

  const handleStyleChange = (styleName, value) => {
    const updateStylesRecursively = (elements) =>
      elements.map((el) => {
        if (el.id === selectedElement.id) {
          return {
            ...el,
            styles: { ...el.styles, [styleName]: value },
          };
        }
        if (el.children) {
          return {
            ...el,
            children: updateStylesRecursively(el.children),
          };
        }
        return el;
      });
    // Actualizamos los elementos con los nuevos estilos
    const updatedElements = updateStylesRecursively(droppedElements);

    // Actualizamos el estado global con los elementos modificados
    setDroppedElements(updatedElements);

    // Actualizamos también el estado del selectedElement
    setSelectedElement({
      ...selectedElement, // Copia las propiedades anteriores del selectedElement
      styles: {
        ...selectedElement.styles, // Mantén los estilos anteriores
        [styleName]: value, // Agrega o actualiza el estilo específico
      },
    });
  };

  const handleTextChange = (newText) => {
    const updateTextRecursively = (elements) =>
      elements.map((el) => {
        if (el.id === selectedElement.id) {
          return {
            ...el,
            text: newText,
          };
        }
        if (el.children) {
          return {
            ...el,
            children: updateTextRecursively(el.children),
          };
        }
        return el;
      });
    const updateTextElement = updateTextRecursively(droppedElements);
    setDroppedElements(updateTextElement);
    setSelectedElement({
      ...selectedElement,
      text: newText,
    });
  };

  const handlePlaceholderChange = (newPlace) => {
    const updatePlaceholderRecursively = (elements) =>
      elements.map((el) => {
        if (el.id === selectedElement.id) {
          return {
            ...el,
            placeholder: newPlace,
          };
        }
        if (el.children) {
          return {
            ...el,
            children: updatePlaceholderRecursively(el.children),
          };
        }
        return el;
      });
    const updatePlaceholderElement =
      updatePlaceholderRecursively(droppedElements);
    setDroppedElements(updatePlaceholderElement);
    setSelectedElement({
      ...selectedElement,
      placeholder: newPlace,
    });
  };

  const handleTypeInputChange = (newType) => {
    const updateTypeInputRecursively = (elements) =>
      elements.map((el) => {
        if (el.id === selectedElement.id) {
          return {
            ...el,
            type: newType,
          };
        }
        if (el.children) {
          return {
            ...el,
            children: updateTypeInputRecursively(el.children),
          };
        }
        return el;
      });
    const updateTypeInputElement = updateTypeInputRecursively(droppedElements);
    setDroppedElements(updateTypeInputElement);
    setSelectedElement({
      ...selectedElement,
      type: newType,
    });
  };

  const handleClassChange = (newClass) => {
    const updateClassRecursively = (elements) =>
      elements.map((el) => {
        if (el.id === selectedElement.id) {
          return {
            ...el,
            iconClass: newClass,
          };
        }
        if (el.children) {
          return {
            ...el,
            children: updateClassRecursively(el.children),
          };
        }
        return el;
      });
    const updateClassElement = updateClassRecursively(droppedElements);
    setDroppedElements(updateClassElement);
    setSelectedElement({
      ...selectedElement,
      iconClass: newClass,
    });
  };

  // Permitir arrastrar sobre el contenedor
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

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
            onDragOver={handleDragOver}
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
            onDragOver={handleDragOver}
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

  return {
    handleStyleChange,
    handleTextChange,
    handlePlaceholderChange,
    handleClassChange,
    handleTypeInputChange,
    selectedElement,
    setSelectedElement,
    setDroppedElements,
    droppedElements,
    imgSelected,
    contextMenu,
    setContextMenu,
    renderElement,
    setImgSelected,
  };
};

export default useAppManager;
