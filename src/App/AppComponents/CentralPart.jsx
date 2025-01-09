import React, { useState, useEffect, useRef } from "react";
import useStore from "../store/store";
import { useParams } from "react-router-dom";
import "@mediapipe/hands";
import { Hands } from "@mediapipe/hands";
import io from "socket.io-client";

const socket = io("https://sizaebuilder-backend.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const CentralPart = ({ modeOfPart }) => {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Color aplicado

  const {
    droppedElements,
    setDroppedElements,
    selectedElement,
    draggingElement,
    setDraggingElement,
  } = useStore();
  const { id } = useParams();
  const videoRef = useRef(null);
  const [dropVisible, setDropVisible] = useState(false); // Estado para la animación
  const [animationTriggered, setAnimationTriggered] = useState(false); // Evita la repetición de la animación

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

  useEffect(() => {
    const handleDraggingElementUpdated = ({
      id: projectId,
      draggingElement: dElement,
    }) => {
      if (projectId === id) {
        console.log(`Elemento arrastrado actualizado:`, dElement);
        // Actualiza el estado con el objeto correcto
        setDraggingElement(dElement);
      }
    };

    socket.on("draggingElementUpdated", handleDraggingElementUpdated);

    // Limpiar la escucha cuando el componente se desmonte
    return () => {
      socket.off("draggingElementUpdated", handleDraggingElementUpdated);
    };
  }, [id]);

  useEffect(() => {
    const initializeCamera = async () => {
      try {

        if (!draggingElement) {
          console.log("draggingElement no está disponible. Cámara no inicializada.");
          return;
        }

        console.log("draggingElement:", draggingElement);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = async () => {
          await videoRef.current.play();

          const hands = new Hands({
            locateFile: (file) =>
              `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
          });

          hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
          });

          hands.onResults((results) => {
            if (
              results.multiHandLandmarks &&
              results.multiHandLandmarks.length > 0
            ) {
              const landmarks = results.multiHandLandmarks[0]; // Usamos la primera mano detectada
              const fingersUp = countFingers(landmarks);

              console.log(`Dedos levantados: ${fingersUp}`);

              if (fingersUp === 5) {
                setDropVisible(true);
                setAnimationTriggered(true); // Asegura que la animación solo se ejecute una vez
                console.log("Soltando el elemento:", draggingElement);
                handleDrop()
                setTimeout(() => {
                  setDropVisible(false); // Desaparece la gota después de un tiempo
                }, 2000); // La animación dura 2 segundos
              }
            }
          });

          const processVideo = async () => {
            if (videoRef.current.readyState === 4) {
              await hands.send({ image: videoRef.current });
            }
            requestAnimationFrame(processVideo);
          };

          processVideo();
        };
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };

    const countFingers = (landmarks) => {
      const fingers = [0, 0, 0, 0, 0]; // Pulgar, índice, medio, anular, meñique
      const fingertipIds = [4, 8, 12, 16, 20]; // Landmarks de las puntas de los dedos
      const fingerBaseIds = [2, 5, 9, 13, 17]; // Landmarks de las bases de los dedos

      // Verifica el pulgar
      if (landmarks[4].x > landmarks[2].x) {
        fingers[0] = 1;
      }

      // Verifica los otros dedos
      for (let i = 1; i < 5; i++) {
        if (landmarks[fingertipIds[i]].y < landmarks[fingerBaseIds[i]].y) {
          fingers[i] = 1; // Dedo levantado
        }
      }

      // Contar dedos levantados
      return fingers.reduce((sum, isUp) => sum + isUp, 0);
    };

    initializeCamera();
  }, [draggingElement]);

  // Manejar la acción de soltar un elemento
  const handleDrop = (e = null, parentId = null) => {
    // Si el evento existe, previene el comportamiento predeterminado
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Maneja el origen de los datos
    let data = null;

    if (draggingElement) {
      data = draggingElement; // Si hay un elemento arrastrado, úsalo
    } else if (e && e.dataTransfer) {
      try {
        data = JSON.parse(e.dataTransfer.getData("application/reactflow"));
      } catch (err) {
        console.error(
          "Error al parsear los datos del evento de arrastre:",
          err
        );
      }
    }

    console.log("ejecutando drop");

    if (!data) {
      console.error("No hay datos disponibles para procesar el drop.");
      return;
    }

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
          <video ref={videoRef} style={{ display: "none" }} />
          {/* Animación de la gota */}
          {dropVisible && <div className="drop" />}
          <style>{`
        .drop {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(0, 0, 255, 0.5); /* Color de la gota */
          animation: dropAnimation 2s forwards;
          transform: translate(-50%, -50%);
        }

        @keyframes dropAnimation {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -60%) scale(1.5);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -70%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
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
          <video ref={videoRef} style={{ display: "none" }} />
          {/* Animación de la gota */}
          {dropVisible && <div className="drop" />}
          <style>{`
        .drop {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(0, 0, 255, 0.5); /* Color de la gota */
          animation: dropAnimation 2s forwards;
          transform: translate(-50%, -50%);
        }

        @keyframes dropAnimation {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -60%) scale(1.5);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -70%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
        </div>
      )}
    </>
  );
};

export default CentralPart;
