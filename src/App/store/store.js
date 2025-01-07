//https://sizaebuilder-backend.onrender.com
import { create } from 'zustand';

const useStore = create((set) => ({
  mode: 'elements',
  setMode: (mode) => set({ mode }),

  droppedElements: [],
  setDroppedElements: (elements) => set({ droppedElements: elements }),

  selectedElement: null,
  setSelectedElement: (element) => set({ selectedElement: element }),

  imgSelected: '',
  setImgSelected: (img) => set({ imgSelected: img }),

  projectData: {},
  setProjectData: (data) => set({ projectData: data }),

  blocklyCode: null,
  setBlockyCode: (code) => set({ blocklyCode: code }), 
    
  workspaceState: '', // Estado del workspace de blockly
  setWorkspaceState: (state) => set({ workspaceState: state }),

  selectedPage: "index",
  setSelectedPage: (page) => set({ selectedPage: page }),

  url: 'https://sizaebuilder-backend.onrender.com', // Puedes configurar esto desde el inicio

  draggingElement: null,
  setDraggingElement: (element) => set({ draggingElement: element }),
}));

export default useStore;
