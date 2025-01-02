import SidebarB from "./AppComponents/Sidebar";
import LeftPanel from "./AppComponents/LeftPanel";
import RightPanel from "./AppComponents/RightPanel";
import CentralPanel from "./AppComponents/CentralPanel";
import useAppManager from "./hooks/useAppManager";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BlocklyComponent from "./blockly/BlocklyComponent";
import io from "socket.io-client";
import CentralPart from "./AppComponents/CentralPart";
import LeftPart from "./AppComponents/LeftPart";

const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Conectado a socket io");
});

const AppB = ({ modeScreen, url }) => {
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const { id } = useParams();
  const [selectedPage, setSelectedPage] = useState("index");
  const [project, setProject] = useState(null);
  const [mode, setMode] = useState("elements");
  const [blocklyCode, setBlockyCode] = useState(null);
  const [workspaceState, setWorkspaceState] = useState("");

  const {
    handleStyleChange,
    handleTextChange,
    handlePlaceholderChange,
    handleClassChange,
    droppedElements,
    selectedElement,
    setSelectedElement,
    setDroppedElements,
    imgSelected,
    setImgSelected,
  } = useAppManager();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://${url}/project/${id}`); // Solicitud GET usando el id
        const project = response.data; // Proyecto completo

        setProjectData(project); // Guardar los datos completos del proyecto en el estado

        // Buscar la página seleccionada en el arreglo de páginas
        const selectedPageData =
          project.pages.find((page) => page.name === selectedPage) ||
          project.pages.find((page) => page.name === "index");

        if (selectedPageData) {
          // Cargar los elementos de la página seleccionada (o la página 'index' si no está seleccionada)
          const elements = selectedPageData.elements || [];
          setDroppedElements(elements); // Actualizar el estado con los elementos de la página

          // Cargar el código y el estado si están disponibles, de lo contrario, mantener el valor actual
          setBlockyCode(selectedPageData.code || null); // Si 'code' no existe, se mantendrá como null
          const state = selectedPageData.state;
          if (state && typeof state === "object") {
            setWorkspaceState(JSON.stringify(state)); // Convertir a string si es un objeto
          } else {
            setWorkspaceState(state || ""); // Mantener el valor por defecto
          }
        } else {
          console.warn("No se encontró una página seleccionada o 'index'.");
          setDroppedElements([]); // Asegurar que no haya elementos si no existe la página seleccionada
          setBlockyCode(null); // Mantener el valor inicial
          setWorkspaceState("");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el proyecto", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, selectedPage]); // Asegúrate de que el 'selectedPage' esté incluido en las dependencias

  useEffect(() => {
    const handleProjectUpdate = (updatedProject) => {
      console.log("Proyecto actualizado en tiempo real:", updatedProject);

      // Obtener los elementos actualizados
      const updatedElements = updatedProject.pages[0].elements || [];
      const updatedCode = updatedProject.pages[0].state || [];
      const updateCodeJs = updatedProject.pages[0].code; // Guardar el código generado

      // Solo actualizar si los elementos son diferentes
      if (JSON.stringify(updatedElements) !== JSON.stringify(droppedElements)) {
        setDroppedElements(updatedElements);
        setWorkspaceState(updatedCode);
        setBlockyCode(updateCodeJs);
      }

      // Actualizar projectData
      setProjectData(updatedProject);
    };

    // Escuchar el evento de actualización
    socket.on("project-updated", handleProjectUpdate);

    // Limpiar la suscripción
    return () => {
      socket.off("project-updated", handleProjectUpdate);
    };
  }, []); // Esto garantiza que solo se ejecuta si droppedElements cambia

  useEffect(() => {
    const handlePageChange = ({ projectId, selectedPage: newSelectedPage }) => {
      if (projectId === id) {
        setSelectedPage(newSelectedPage);
      }
    };
  
    // Escuchar cambios de página seleccionada desde otros dispositivos
    socket.on("selectedPageChanged", handlePageChange);
  
    // Emitir cambio de página localmente
    if (selectedPage) {
      socket.emit("changeSelectedPage", { projectId: id, selectedPage });
    }
  
    return () => {
      socket.off("selectedPageChanged", handlePageChange);
    };
  }, [id, selectedPage]);
  

  const handleUpdateProject = async () => {
    try {
      setLoading(true);

      /*
      console.log("projectData:", projectData);
      console.log("selectedPage:", selectedPage);
      console.log("Estado de droppedElements al llamar a onUpdate:", droppedElements);
      console.log("blocklyCode:", blocklyCode);
      console.log("workspaceState:", workspaceState);
      */

      // Crear una copia del proyecto
      const updatedProject = { ...projectData };

      //console.log("updatedProject.pages:", updatedProject.pages);

      // Encontrar la página seleccionada
      const selectedPageIndex = updatedProject.pages.findIndex(
        (page) => page.name === selectedPage
      );

      //console.log("selectedPageIndex:", selectedPageIndex);

      if (selectedPageIndex !== -1) {
        // Actualizar los elementos y los nuevos campos (code y state)
        updatedProject.pages[selectedPageIndex].elements = droppedElements;
        updatedProject.pages[selectedPageIndex].code = blocklyCode; // Guardar el código generado
        updatedProject.pages[selectedPageIndex].state = workspaceState; // Guardar el estado de los bloques (parsing del JSON)
      } else {
        console.error("La página seleccionada no se encuentra en el proyecto.");
        setLoading(false);
        return;
      }

      //console.log("Datos enviados al backend:", updatedProject);

      // Solicitud PUT
      const response = await axios.put(
        `http://${url}/projects/${id}`,
        updatedProject
      );
      console.log("Proyecto actualizado:", response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!selectedPage) {
      alert("Por favor, asegúrate de haber seleccionado una página.");
      return;
    }

    try {
      const response = await axios.post(`http://${url}/generate`, {
        droppedElement: droppedElements,
        selectedPage,
        jscode: blocklyCode,
        id: id,
      });
      console.log("Página actualizada:", response.data);
    } catch (error) {
      console.error("Error al generar la vista previa:", error);
      alert("Hubo un error al generar la vista previa.");
    }
  };

  const handleGenerateCode = (code, state) => {
    console.log("Código generado:", code);
    console.log("Estado del espacio de trabajo:", state);
    setBlockyCode(code);
    setWorkspaceState(state);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://${url}/download-zip/${id}`);

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      const blob = await response.blob(); // Convertir la respuesta en un archivo binario
      const urli = window.URL.createObjectURL(blob); // Crear un URL para el archivo
      const a = document.createElement("a");
      a.href = urli;
      a.download = `${id}.zip`; // Nombre del archivo descargado
      a.click();
      window.URL.revokeObjectURL(urli); // Limpiar el URL creado
    } catch (error) {
      console.error("Error durante la descarga:", error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center relative">
      {loading && (
        <div className="z-10 w-full h-full top-0 left-0 absolute flex items-center justify-center bg-opacity-10 backdrop-blur-sm bg-black">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {modeScreen === "complete" && (
        <>
          <SidebarB setMode={setMode} />
          {mode === "code" ? (
            <BlocklyComponent
              elements={droppedElements}
              onGenerateCode={handleGenerateCode}
              code={workspaceState}
            />
          ) : (
            <div className="w-full h-full grid grid-cols-4">
              <LeftPanel
                setMode={setMode}
                mode={mode}
                droppedElements={droppedElements}
                setSelectedElement={setSelectedElement}
                imgSelected={imgSelected}
                setImgSelected={setImgSelected}
                url={url}
              />
              <CentralPanel
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                droppedElements={droppedElements}
                setDroppedElements={setDroppedElements}
                onUpdate={handleUpdateProject}
                onPreview={handlePreview}
                id={id}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                project={projectData}
                setProject={setProject}
                imgSelected={imgSelected}
                setImgSelected={setImgSelected}
                onDownload={handleDownload}
                url={url}
              />
              <RightPanel
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                setDroppedElements={setDroppedElements}
                handleStyleChange={handleStyleChange}
                handleTextChange={handleTextChange}
                handlePlaceholderChange={handlePlaceholderChange}
                projectId={id}
                setSelectedPage={setSelectedPage}
                selectedPage={selectedPage}
                project={projectData}
                setProject={setProject}
                handleClassChange={handleClassChange}
                url={url}
              />
            </div>
          )}
        </>
      )}
      {modeScreen === "partLeft" && (
        <LeftPart
          mode={mode}
          droppedElements={droppedElements}
          setSelectedElement={setSelectedElement}
          imgSelected={imgSelected}
          setImgSelected={setImgSelected}
          selectedElement={selectedElement}
          setDroppedElements={setDroppedElements}
          id={id}
          onUpdate={handleUpdateProject}
          url={url}
        />
      )}
      {modeScreen === "partCentral" && (
        <CentralPart
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          droppedElements={droppedElements}
          setDroppedElements={setDroppedElements}
          imgSelected={imgSelected}
          modeOfPart="completepart"
        />
      )}
    </div>
  );
};

export default AppB;