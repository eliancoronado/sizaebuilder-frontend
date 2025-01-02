import React, { useState, useEffect } from "react";

const useAppManager = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [droppedElements, setDroppedElements] = useState([]);
  const [imgSelected, setImgSelected] = useState("");


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
    setDroppedElements((prevElements) => updateStylesRecursively(prevElements));
    setSelectedElement((prev) => ({
      ...prev,
      styles: { ...prev.styles, [styleName]: value },
    }));
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
    setDroppedElements((prevElements) => updateTextRecursively(prevElements));
    setSelectedElement((prev) => ({ ...prev, text: newText }));
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
    setDroppedElements((prevElements) => updatePlaceholderRecursively(prevElements));
    setSelectedElement((prev) => ({ ...prev, placeholder: newPlace }));
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
    setDroppedElements((prevElements) => updateClassRecursively(prevElements));
    setSelectedElement((prev) => ({ ...prev, iconClass: newClass }));
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
    setImgSelected,
  };
};

export default useAppManager;
