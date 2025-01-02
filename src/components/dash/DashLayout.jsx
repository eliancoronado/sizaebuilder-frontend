import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";

const DashLayout = ({url}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUserOpen, setIsModalUserOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");

  const navigate = useNavigate();

  const handleContextMenu = (e, upId) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      projectId: upId,
    });
  };

  const handleMenuClick = (e, action) => {
    if (action === "open") {
      navigate(`/project/${contextMenu.projectId}`);
    } else if (action === "delete") {
      deleteProject(e, contextMenu.projectId);
    } else if (action === "rename") {
      openModal(e, contextMenu.projectId);
    } else if (action === "openleft") {
      navigate(`/project/left/${contextMenu.projectId}`);
    } else if (action === "opencentral") {
      navigate(`/project/central/${contextMenu.projectId}`);
    }
    setContextMenu(null); // Ocultar el menú después de la acción
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

  const closeContextMenu = () => {
    setContextMenu(null); // Ocultar el menú si se hace clic fuera de él
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleUserProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://${url}/projects/${user._id}`
        );
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
    if (user){
      handleUserProjects();
    }
  }, [user]);

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
        `http://${url}/update-project/${projectId}`,
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
      const response = await axios.delete(
        `http://${url}/delete-project/${projectId}`
      );
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
      const response = await axios.post(
        `http://${url}/new-project`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
    <div
      className="flex-1 h-screen max-h-screen thin-scroll flex flex-col bg-gray-50 text-gray-900"
      onClick={closeContextMenu}
    >
      {/* Header */}
      <header className="w-full h-[12vh] flex items-center justify-between px-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-1.5 shadow-sm">
            <input
              type="text"
              placeholder="Search projects..."
              className="bg-transparent outline-none text-sm flex-1"
            />
            <FaSearch className="text-gray-500 text-sm" />
          </div>
          {/* User Menu */}
          <div className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsModalUserOpen(true)}
          >
            <MdAccountCircle className="text-3xl" />
            <p className="text-sm items-center gap-1 hidden sm:flex">
            {user ? user.username : "Loading..."} <FaChevronDown />
            </p>
          </div>
          <FaBars className="text-3xl sm:hidden block" />
        </div>
      </header>

      {/* Sub-header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
        <p className="text-sm font-medium">
          All projects you have ({userProjects.length})
        </p>
        <button
          onClick={toggleDropdown}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 text-sm font-semibold flex items-center gap-2 transition"
        >
          <GoPlus /> Create a new App
        </button>
        {isDropdownVisible && (
          <div className="absolute right-8 top-[22vh] bg-white shadow-lg rounded-md z-10 w-48">
            <ul className="py-2">
              <li
                onClick={(e) => {
                  createNewProject(e);
                  setDropdownVisible(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                <IoPhonePortraitOutline />
                Create Mobile App
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Other option
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4 overflow-y-auto">
        {userProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userProjects.map((up) => (
              <div
                key={up._id}
                onContextMenu={(e) => handleContextMenu(e, up._id)}
                onClick={() => navigate(`/project/${up._id}`)}
                className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer flex flex-col"
              >
                {/* Card Image */}
                <div className="h-36 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={`http://localhost:4000/images/${up._id}.png`}
                    alt="Preview"
                    className="w-1/2 h-full object-cover scale-125"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      const fallbackText =
                        e.target.parentElement.querySelector("p.text-gray-500");
                      if (fallbackText) fallbackText.style.display = "block";
                    }}
                  />
                  <p className="text-sm text-gray-500 hidden">
                    No preview available
                  </p>
                </div>
                {/* Card Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{up.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(up.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No projects found. Start by creating a new one!
          </p>
        )}
      </main>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="absolute bg-white shadow-md rounded-md p-2 z-50"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <button
            onClick={(e) => handleMenuClick(e, "open")}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Open
          </button>
          <button
            onClick={(e) => handleMenuClick(e, "openleft")}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Open in Left
          </button>
          <button
            onClick={(e) => handleMenuClick(e, "opencentral")}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Open in Central
          </button>
          <button
            onClick={(e) => handleMenuClick(e, "rename")}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Rename
          </button>
          <button
            onClick={(e) => handleMenuClick(e, "delete")}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Edit Project Name</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new project name"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  updateProjectName(e, editingProjectId);
                  closeModal();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalUserOpen && (
        <div className="absolute top-[12vh] right-2 z-50 bg-white shadow-md rounded-md p-2"
        onMouseLeave={() => setIsModalUserOpen(false)}
        >
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default DashLayout;
