import React, { useState, useEffect } from "react";
import useStore from "../store/store";
import { set } from "date-fns";

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
            type="text"
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
          <p
            key={element.id}
            className={`text-base text-black border border-black unset-all ${
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
          </p>
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
