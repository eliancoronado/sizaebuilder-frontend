import React, { useState, useEffect } from "react";

const CentralPart = ({
  droppedElements,
  setDroppedElements,
  imgSelected,
  modeOfPart,
  renderElement,
}) => {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Color aplicado

  useEffect(() => {
    if (imgSelected) {
      console.log("Imagen seleccionada:", imgSelected); // Verificar que imgSelected se ha actualizado
    } else {
      console.log("No se ha seleccionado nada");
    }
  }, [imgSelected]);

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
        display: "inline-block",
        flexDirection: "",
        alignItems: "start", // Valor predeterminado
        justifyContent: "start", // Valor predeterminado
        gap: "",
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

    // Agregar el elemento al nivel correcto
    setDroppedElements((prev) =>
      parentId === null
        ? [...prev, newElement] // Añadir al nivel raíz
        : addChildToParent(prev, parentId, newElement)
    );
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
        <div className="" style={{ transform: "scale(0.8)" }} id="central">
          <div
            className="relative overflow-auto"
            onDrop={(e) => handleDrop(e)}
            onDragOver={handleDragOver}
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
