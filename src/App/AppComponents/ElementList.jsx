import React from 'react';
import { FaBox, FaImage, FaCode, FaRegSquare } from 'react-icons/fa';  // Puedes agregar más iconos según los nombres de los elementos
import { MdOutlineTextFields, MdOutlineInsertEmoticon  } from "react-icons/md";
import { RxInput } from "react-icons/rx";

const getElementIcon = (name) => {
  switch (name) {
    case 'Text':
      return <MdOutlineTextFields className="text-xl text-[#4F4F4F]" />;
    case 'Container':
      return <FaBox className="text-xl text-[#4F4F4F]" />;
    case 'Image':
      return <FaImage className="text-xl text-[#4F4F4F]" />;
    case 'Input':
      return <RxInput className="text-xl text-[#4F4F4F]" />;
    case 'Button':
      return <FaRegSquare className="text-xl text-[#4F4F4F]" />;
    case 'Icon':
      return <MdOutlineInsertEmoticon className="text-xl text-[#4F4F4F]" />;
    default:
      return <FaCode className="text-xl text-[#4F4F4F]" />;
  }
};

const ElementTree = ({ element,setSelectedElement, level = 0 }) => {
  return (
    <>
      <div
        className={`flex items-center gap-2 mt-1 ml-${level * 4} py-2 px-4 rounded hover:bg-white hover:bg-opacity-50 cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedElement(element)
        }}
      >
        {getElementIcon(element.name)}
        <span className="text-sm font-semibold text-[#4F4F4F]">{element.name}</span>
      </div>
      {element.children && element.children.length > 0 && (
        <div className="pl-4">
          {element.children.map((child) => (
            <ElementTree key={child.id} element={child} setSelectedElement={setSelectedElement} level={level + 1} />
          ))}
        </div>
      )}
    </>
  );
};

const ElementList = ({ elements, setSelectedElement }) => {
  return (
    <div className="w-full h-full max-w-full overflow-x-auto overflow-y-auto">
      <h2 className="text-[#F5F5F5] text-xl mb-3 font-medium">Elementos</h2>
      {elements.map((element) => (
        <ElementTree key={element.id} element={element} setSelectedElement={setSelectedElement} />
      ))}
    </div>
  );
};

export default ElementList;
