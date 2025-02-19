import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, LogOut, PackagePlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DashLayout = ({ url }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUserOpen, setIsModalUserOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleMenuClick = (e, action, projectId) => {
    if (action === "open") {
      navigate(`/project/${projectId}`);
    } else if (action === "delete") {
      deleteProject(e, projectId);
    } else if (action === "rename") {
      openModal(e, projectId);
    } else if (action === "openleft") {
      navigate(`/project/left/${projectId}`);
    } else if (action === "opencentral") {
      navigate(`/project/central/${projectId}`);
    }
  };

  const openModal = (e, projectId) => {
    e.preventDefault();
    setEditingProjectId(projectId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProjectId(null);
    setNewProjectName("");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleUserProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/projects/${user._id}`);
        if (response.data && Array.isArray(response.data)) {
          setUserProjects(response.data);
          console.log(response.data);
          setLoading(false);
          setDropdownVisible(false);
        } else {
          console.error("No projects found or invalid response format");
          setUserProjects([]);
          setLoading(false);
          setDropdownVisible(false);
        }
        setDropdownVisible(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setUserProjects([]);
        setLoading(false);
        setDropdownVisible(false);
      }
    };
    if (user) {
      handleUserProjects();
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const updateProjectName = async (e, projectId) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      alert("Project name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${url}/update-project/${projectId}`,
        { name: newProjectName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setUserProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === projectId
              ? { ...project, name: response.data.name }
              : project
          )
        );
        setEditingProjectId(null);
        setNewProjectName("");
      }
    } catch (error) {
      console.error("Error updating project name:", error);
      alert("Failed to update project name");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (e, projectId) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.delete(`${url}/delete-project/${projectId}`);
      console.log(response.data);
      setLoading(false);
      setUserProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createNewProject = async (e) => {
    e.preventDefault();
    const data = { authorId: user._id };
    setLoading(true);
    try {
      const response = await axios.post(`${url}/new-project`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        console.log(response.data);
        setUserProjects((prevProjects) => [response.data, ...prevProjects]);
        setLoading(false);
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
        setLoading(false);
      } else {
        console.error("Error:", error);
      }
    }
  };

  const initials = user.username.slice(0, 2).toUpperCase();

  if (!userProjects) {
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!user) {
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="flex-1 h-screen max-h-screen thin-scroll flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="w-full h-[12vh] flex items-center justify-between px-6 bg-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Proyectos</h1>
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative hidden sm:flex items-center bg-gray-700 rounded-md px-4 py-1.5 shadow-sm">
            <input
              type="text"
              placeholder="Search projects..."
              className="bg-transparent text-gray-300 outline-none text-sm flex-1"
            />
            <FaSearch className="text-gray-300 text-sm" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-white sm:flex hidden bg-gray-700 hover:bg-gray-600"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-transparent border border-gray-600">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight text-white">
                  <span className="truncate font-semibold">
                    {user.username}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
              <DropdownMenuItem
                onClick={() => {
                  navigate("/login");
                  localStorage.removeItem("user");
                }}
                className="text-white hover:bg-gray-700"
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <FaBars
            className="text-3xl sm:hidden block text-white"
            onClick={() => setSidebarOpen(true)}
          />
        </div>
      </header>

      {/* Sub-header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800">
        <p className="text-sm font-normal text-gray-300">
          Todos tus proyectos ({userProjects.length})
        </p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={toggleDropdown}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PackagePlus /> Crear proyecto
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={createNewProject}
                className="text-white hover:bg-gray-700"
              >
                Crear proyecto mobile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-700">
                ...
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-700">
                ...
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4 overflow-y-auto bg-gray-900">
        {userProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userProjects.map((up) => (
              <ContextMenu key={up._id}>
                <ContextMenuTrigger>
                  <div
                    key={up._id}
                    onClick={() => navigate(`/project/${up._id}`)}
                    className="bg-gray-800 hover:bg-gray-700 transition duration-300 cursor-pointer flex flex-col rounded-lg shadow-lg"
                  >
                    {/* Card Image */}
                    <div className="h-48 bg-gray-700 rounded-t-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={`${url}/images/${up._id}.png`}
                        alt="Preview"
                        className="w-1/2 h-full object-cover scale-125 rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          const fallbackText =
                            e.target.parentElement.querySelector(
                              "p.text-gray-500"
                            );
                          if (fallbackText)
                            fallbackText.style.display = "block";
                        }}
                      />
                      <p className="text-sm text-gray-500 hidden pointer-events-none">
                        No preview available
                      </p>
                    </div>
                    {/* Card Content */}
                    <div className="py-3 pl-3 pb-3">
                      <h3 className="text-base font-semibold truncate text-white">
                        {up.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {formatDistanceToNow(new Date(up.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64 bg-gray-800 border-gray-700">
                  <ContextMenuItem
                    inset
                    onClick={(e) => handleMenuClick(e, "open", up._id)}
                    className="text-white hover:bg-gray-700"
                  >
                    Abrir
                  </ContextMenuItem>
                  <ContextMenuItem
                    inset
                    onClick={(e) => handleMenuClick(e, "openleft", up._id)}
                    className="text-white hover:bg-gray-700"
                  >
                    Abrir izquierdo
                  </ContextMenuItem>
                  <ContextMenuItem
                    inset
                    onClick={(e) => handleMenuClick(e, "opencentral", up._id)}
                    className="text-white hover:bg-gray-700"
                  >
                    Abrir central
                  </ContextMenuItem>

                  <ContextMenuItem
                    inset
                    onClick={(e) => {
                      handleMenuClick(e, "rename", up._id);
                    }}
                    className="text-white hover:bg-gray-700"
                  >
                    Renombrar
                  </ContextMenuItem>

                  <ContextMenuItem
                    inset
                    onClick={(e) => handleMenuClick(e, "delete", up._id)}
                    className="text-white hover:bg-gray-700"
                  >
                    Borrar
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg">
            No projects found. Start by creating a new one!
          </p>
        )}
      </main>

      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onDimmiss={closeModal}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div onClick={() => console.log("Clicked")}>
              {/* Contenido aquí */}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-gray-800 border-gray-700">
            <ContextMenuItem
              onClick={() => {
                console.log("Opening modal");
                setIsModalOpen(true);
              }}
              className="text-white hover:bg-gray-700"
            >
              Abrir Modal
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Cambiar el nombre del proyecto</DialogTitle>
            <DialogDescription className="text-gray-400">
              Escribe un nuevo nombre para el proyecto
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                placeholder="Nuevo nombre"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={(e) => {
                setIsModalOpen(false);
                closeModal();
                updateProjectName(e, editingProjectId);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {isModalUserOpen && (
        <div
          className="absolute top-[12vh] right-2 z-50 bg-gray-800 shadow-md rounded-md p-2"
          onMouseLeave={() => setIsModalUserOpen(false)}
        >
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-700"
          >
            Cerrar Sesión
          </button>
        </div>
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <DropdownMenu>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="w-72 bg-gray-800 h-full shadow-lg place-self-end px-5 py-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Sizae</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-2xl text-white"
                >
                  <FaBars className="text-3xl text-white" />
                </button>
              </div>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-white mt-5 py-6 w-full bg-gray-700 hover:bg-gray-600"
                >
                  <Avatar className="h-14 w-14 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-transparent border border-gray-600 text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight text-white">
                    <span className="truncate font-semibold text-base">
                      {user.username}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/login");
                    localStorage.removeItem("user");
                  }}
                  className="text-white hover:bg-gray-700"
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </div>
        </DropdownMenu>
      )}
    </div>
  );
};

export default DashLayout;
