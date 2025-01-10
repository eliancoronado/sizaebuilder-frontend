import {
  RxText,
  RxSpaceEvenlyHorizontally,
  RxBorderWidth,
} from "react-icons/rx";
import {
  LuAlignLeft,
  LuAlignJustify,
  LuAlignRight,
  LuAlignStartHorizontal,
  LuAlignCenterHorizontal,
  LuAlignEndHorizontal,
  LuAlignStartVertical,
  LuAlignCenterVertical,
  LuAlignEndVertical,
  LuAlignHorizontalSpaceAround,
  LuAlignHorizontalSpaceBetween,
} from "react-icons/lu";
import {
  TbBoxAlignTopFilled,
  TbBoxAlignBottomFilled,
  TbBoxAlignLeftFilled,
  TbBoxAlignRightFilled,
  TbBoxAlignTopLeftFilled,
  TbBoxAlignTopRightFilled,
  TbBoxAlignBottomLeftFilled,
  TbBoxAlignBottomRightFilled,
} from "react-icons/tb";
import {
  MdBorderTop,
  MdOutlineBorderBottom,
  MdBorderLeft,
  MdBorderRight,
} from "react-icons/md";
import useStore from "../store/store";

const RightPanel = ({
  handleStyleChange,
  handleTextChange,
  handlePlaceholderChange,
  handleClassChange,
  handleTypeInputChange,
}) => {
  const {
    projectData: project,
    selectedPage,
    setSelectedPage,
    selectedElement,
  } = useStore(); // Usamos los métodos del store para actualizar el estado

  const handlePageSelect = (event) => {
    setSelectedPage(event.target.value);
  };

  if (!project || !project.pages) {
    return <p>Loading...</p>; // Mostrar mensaje de carga mientras se obtienen los datos
  }

  if (!selectedElement) {
    return (
      <div className="w-full h-full col-span-1 bg-[#333333] p-4">
        <h2 className="text-[#F5F5F5] text-xl font-medium">Propiedades</h2>
        {/* Select dropdown for pages */}
        <h3 className="text-[#F5F5F5] text-base font-medium mt-3">Página</h3>
        <select
          className="w-full h-8 rounded border mt-4 border-[#828282] bg-transparent text-[#E0E0E0] pl-2 outline-none"
          value={selectedPage}
          onChange={handlePageSelect}
        >
          {project.pages.map((page) => (
            <option key={page._id} value={page.name}>
              {page.name}
            </option>
          ))}
        </select>
        <p className="text-white mt-4">
          Selecciona un elemento para editar sus propiedades.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full col-span-1 bg-[#333333] p-1.5 lg:p-4 no-scroll overflow-y-auto">
      <h2 className="text-[#F5F5F5] text-xl font-medium">Propiedades</h2>
      <h3 className="text-[#BDBDBD] text-lg font-medium mt-4">
        Id: {selectedElement.id}
      </h3>
      <div className="w-full h-auto flex flex-col gap-3 mt-5">
        <h3 className="text-[#F5F5F5] text-base font-medium">Página</h3>
        <select
          className="w-full h-8 rounded border mt-2 border-[#828282] bg-transparent text-[#E0E0E0] pl-2 outline-none"
          value={selectedPage}
          onChange={handlePageSelect}
        >
          {project.pages.map((page) => (
            <option key={page._id} value={page.name}>
              {page.name}
            </option>
          ))}
        </select>

        {selectedElement && (
          <>
            {selectedElement.placeholder && (
              <div className="mt-3 flex flex-col gap-2">
                <h3 className="text-sm text-[#BDBDBD] font-semibold">
                  Placeholder
                </h3>
                <input
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2"
                  value={selectedElement.placeholder}
                  onChange={(e) => handlePlaceholderChange(e.target.value)}
                />
              </div>
            )}
            {selectedElement.iconClass && (
              <div className="mt-3 flex flex-col gap-2">
                <h3 className="text-sm text-[#BDBDBD] font-semibold">
                  Icono ID
                </h3>
                <input
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2"
                  value={selectedElement.iconClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                />
              </div>
            )}
            {selectedElement.type && (
              <div className="w-full">
                <h3 className="text-sm text-[#BDBDBD] font-semibold">
                  Tipo de Input
                </h3>
                <select
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2 outline-none mt-2"
                  value={selectedElement.type}
                  onChange={(e) => handleTypeInputChange(e.target.value)}
                >
                  <option value="text">Texto</option>
                  <option value="text">Número</option>
                  <option value="password">Contraseña</option>
                  <option value="email">Correo</option>
                  <option value="date">Fecha</option>
                  <option value="time">Hora</option>
                  <option value="checkbox">Casilla</option>
                  <option value="radio">Opcion</option>
                  <option value="range">Rango</option>
                  <option value="file">Archivo</option>
                  <option value="color">Color</option>
                  <option value="submit">Subir</option>
                </select>
              </div>
            )}

            <div className="w-full h-auto gap-3 border border-l-0 border-r-0 border-b-0 pt-3 border-[#4F4F4F]">
              <h3
                className="text-[#ffffff] text-sm font-medium mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Tipografía
              </h3>
            </div>

            <div className="w-full h-auto grid grid-cols-2 grid-rows-4 gap-2 ">
              <div className="mt-2 flex flex-col gap-2 col-span-2">
                <select
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2 outline-none"
                  value={selectedElement.styles.fontFamily}
                  onChange={(e) =>
                    handleStyleChange("fontFamily", e.target.value)
                  }
                >
                  <option value="Oswald, serif">Oswald</option>
                  <option value="Space Mono, serif">Space Mono</option>
                  <option value="Poppins, serif">Poppins</option>
                  <option value="Roboto, serif">Roboto</option>
                  <option value="Inter, serif">Inter</option>
                  <option value="Open Sans, serif">Open Sans</option>
                </select>
              </div>
              <div className="mt-2 flex flex-col gap-2 row-start-2">
                <select
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2 outline-none"
                  value={selectedElement.styles.fontWeight}
                  onChange={(e) =>
                    handleStyleChange("fontWeight", e.target.value)
                  }
                >
                  <option value="100">Light</option>
                  <option value="200">Regular</option>
                  <option value="400">Retina</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="800">Bold</option>
                </select>
              </div>
              <div className="mt-2 flex flex-col gap-2 row-start-2 bg-[#555555]">
                <input
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2 outline-none"
                  value={selectedElement.styles.fontSize}
                  onChange={(e) =>
                    handleStyleChange("fontSize", e.target.value)
                  }
                />
              </div>
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] col-span-2 mt-2">
                <RxText className="text-base text-[#BDBDBD]" />
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.text}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              </div>
              <div className="mt-2 grid row-start-4 grid-cols-3 h-8 bg-[#555555] rounded-md">
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.textAlign === "left"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() => handleStyleChange("textAlign", "left")}
                >
                  <LuAlignLeft className="text-xl text-[#C3C3C3]" />
                </div>
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.textAlign === "center"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() => handleStyleChange("textAlign", "center")}
                >
                  <LuAlignJustify className="text-xl text-[#C3C3C3]" />
                </div>
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.textAlign === "right"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() => handleStyleChange("textAlign", "right")}
                >
                  <LuAlignRight className="text-xl text-[#C3C3C3]" />
                </div>
              </div>
              <div className="gap-2 col-span-2 row-start-5 h-8">
                <input
                  type="color"
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] outline-none"
                  value={selectedElement.styles.color}
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                />
              </div>
            </div>

            <div className="w-full h-auto gap-3 border border-l-0 border-r-0 border-b-0 pt-3 border-[#4F4F4F]">
              <h3
                className="text-[#ffffff] text-sm font-medium mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Disposición
              </h3>
            </div>

            <div className="w-full h-auto grid grid-cols-2 grid-rows-3 gap-2">
              <div className="mt-2 flex flex-col gap-2 col-span-2">
                <select
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2 outline-none"
                  value={selectedElement.styles.display}
                  onChange={(e) => handleStyleChange("display", e.target.value)}
                >
                  <option value="block">Bloque</option>
                  <option value="inline-block">Enlinea-Bloque</option>
                  <option value="flex">Flexible</option>
                  <option value="grid">Grilla</option>
                </select>
              </div>
              <div className="mt-2 grid row-start-2 grid-cols-3 h-8 bg-[#555555] rounded-md">
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.alignItems === "start"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() => handleStyleChange("alignItems", "start")}
                >
                  <LuAlignStartHorizontal className="text-xl text-[#C3C3C3]" />
                </div>
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.alignItems === "center"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() => handleStyleChange("alignItems", "center")}
                >
                  <LuAlignCenterHorizontal className="text-xl text-[#C3C3C3]" />
                </div>
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.alignItems === "end"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() => handleStyleChange("alignItems", "end")}
                >
                  <LuAlignEndHorizontal className="text-xl text-[#C3C3C3]" />
                </div>
              </div>
              <div className="mt-2 grid row-start-2 grid-cols-3 h-8 bg-[#555555] rounded-md">
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.justifyContent === "start"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() => handleStyleChange("justifyContent", "start")}
                >
                  <LuAlignStartVertical className="text-xl text-[#C3C3C3]" />
                </div>
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.justifyContent === "center"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() => handleStyleChange("justifyContent", "center")}
                >
                  <LuAlignCenterVertical className="text-xl text-[#C3C3C3]" />
                </div>
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.justifyContent === "end"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() => handleStyleChange("justifyContent", "end")}
                >
                  <LuAlignEndVertical className="text-xl text-[#C3C3C3]" />
                </div>
              </div>
              <div className="mt-2 grid row-start-3 grid-cols-3 h-8 bg-[#555555] rounded-md">
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.justifyContent === "space-around"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() =>
                    handleStyleChange("justifyContent", "space-around")
                  }
                >
                  <LuAlignHorizontalSpaceAround className="text-xl text-[#C3C3C3]" />
                </div>
                <div className="h-8 flex items-center justify-center rounded-md cursor-pointer">
                  <RxSpaceEvenlyHorizontally className="text-xl text-[#C3C3C3]" />
                </div>
                <div
                  className={`h-8 flex items-center justify-center rounded-md cursor-pointer ${
                    selectedElement.styles.justifyContent === "space-between"
                      ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                      : ""
                  }`}
                  onClick={() =>
                    handleStyleChange("justifyContent", "space-between")
                  }
                >
                  <LuAlignHorizontalSpaceBetween className="text-xl text-[#C3C3C3]" />
                </div>
              </div>
              <div className="mt-2 row-start-3">
                {selectedElement.styles.display === "flex" && (
                  <select
                    className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] text-base pl-2 outline-none"
                    value={selectedElement.styles.flexDirection}
                    onChange={(e) =>
                      handleStyleChange("flexDirection", e.target.value)
                    }
                  >
                    <option value="">Dirección</option>
                    <option value="row">Fila</option>
                    <option value="column">Columna</option>
                    <option value="column-reverse">Columna invertida</option>
                    <option value="row-reverse">Fila invertida</option>
                  </select>
                )}
              </div>
            </div>

            <div className="w-full h-auto gap-3 border border-l-0 border-r-0 border-b-0 pt-3 border-[#4F4F4F]">
              <h3
                className="text-[#ffffff] text-sm font-medium mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Relleno
              </h3>
            </div>
            <div className="w-full h-8">
              <input
                type="color"
                className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] outline-none"
                value={selectedElement.styles.backgroundColor}
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
              />
            </div>

            <div className="w-full h-auto gap-3 border border-l-0 border-r-0 border-b-0 pt-3 border-[#4F4F4F]">
              <h3
                className="text-[#ffffff] text-sm font-medium mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Tamaños
              </h3>
            </div>

            <div className="w-full h-auto grid grid-cols-2 gap-3">
              <div className="gap-2 border border-[#555555] flex items-center h-10 rounded px-2 bg-[#555555]">
                <h3 className="text-sm text-[#BDBDBD] font-semibold">W</h3>
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.width}
                  onChange={(e) => handleStyleChange("width", e.target.value)}
                />
              </div>
              <div className="gap-2 border border-[#555555] flex items-center h-10 rounded px-2 bg-[#555555]">
                <h3 className="text-sm text-[#BDBDBD] font-semibold">H</h3>
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.height}
                  onChange={(e) => handleStyleChange("height", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm text-[#BDBDBD] font-semibold">Gap</h3>
                <input
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2"
                  value={selectedElement.styles.gap || ""}
                  onChange={(e) => handleStyleChange("gap", e.target.value)}
                />
              </div>
            </div>

            <div className="w-full h-auto gap-3 border border-l-0 border-r-0 border-b-0 pt-3 border-[#4F4F4F]">
              <h3
                className="text-[#ffffff] text-sm font-medium mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Posición
              </h3>
            </div>

            <div
              className={`w-full h-auto grid grid-cols-2 ${
                selectedElement.styles.position === "absolute"
                  ? "grid-rows-4"
                  : "grid-rows-1"
              }  gap-2`}
            >
              <div className="flex flex-col col-span-2">
                <select
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2 outline-none"
                  value={selectedElement.styles.position}
                  onChange={(e) =>
                    handleStyleChange("position", e.target.value)
                  }
                >
                  <option value="static">Estatica</option>
                  <option value="absolute">Absoluta</option>
                  <option value="relative">Relativa</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              {selectedElement.styles.position === "absolute" && (
                <>
                  <div className="w-full grid grid-cols-2 gap-2 col-span-2 row-start-2 h-8">
                    <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                      <MdBorderTop className="text-xl text-[#BDBDBD]" />
                      <input
                        className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                        value={selectedElement.styles.top}
                        onChange={(e) =>
                          handleStyleChange("top", e.target.value)
                        }
                      />
                    </div>
                    <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                      <MdOutlineBorderBottom className="text-xl text-[#BDBDBD]" />
                      <input
                        className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                        value={selectedElement.styles.bottom}
                        onChange={(e) =>
                          handleStyleChange("bottom", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-2 col-span-2 row-start-3 h-8">
                    <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                      <MdBorderLeft className="text-xl text-[#BDBDBD]" />
                      <input
                        className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                        value={selectedElement.styles.left}
                        onChange={(e) =>
                          handleStyleChange("left", e.target.value)
                        }
                      />
                    </div>
                    <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                      <MdBorderRight className="text-xl text-[#BDBDBD]" />
                      <input
                        className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                        value={selectedElement.styles.right}
                        onChange={(e) =>
                          handleStyleChange("right", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={`mt-2 text-base gap-2 text-[#C3C3C3] h-8 flex items-center justify-center rounded-md col-span-2 row-start-4 cursor-pointer bg-[#555555] ${
                      selectedElement.styles.transform ===
                      "translate(-50%, -50%)"
                        ? "bg-[#2C2C2C] border-[2px] border-[#444444]"
                        : ""
                    }`}
                    onClick={() =>
                      handleStyleChange("transform", "translate(-50%, -50%)")
                    }
                  >
                    <LuAlignCenterVertical className="text-xl text-[#C3C3C3]" />{" "}
                    Centrar
                  </div>
                </>
              )}
            </div>

            <div className="w-full h-auto gap-3 border border-l-0 border-r-0 border-b-0 pt-3 border-[#4F4F4F]">
              <h3
                className="text-[#ffffff] text-sm font-medium mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Margenes
              </h3>
            </div>

            <div className="w-full h-auto grid grid-cols-2 grid-rows-2 gap-2">
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                <TbBoxAlignTopFilled className="text-xl text-[#BDBDBD]" />
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.marginTop}
                  onChange={(e) => {
                    handleStyleChange("marginTop", e.target.value);
                  }}
                />
              </div>
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                <TbBoxAlignBottomFilled className="text-xl text-[#BDBDBD]" />
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.marginBottom}
                  onChange={(e) => {
                    handleStyleChange("marginBottom", e.target.value);
                  }}
                />
              </div>
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                <TbBoxAlignLeftFilled className="text-xl text-[#BDBDBD]" />
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.marginLeft}
                  onChange={(e) => {
                    handleStyleChange("marginLeft", e.target.value);
                  }}
                />
              </div>
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                <TbBoxAlignRightFilled className="text-xl text-[#BDBDBD]" />
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.marginRight}
                  onChange={(e) => {
                    handleStyleChange("marginRight", e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="w-full h-auto gap-3 border border-l-0 border-r-0 border-b-0 pt-3 border-[#4F4F4F]">
              <h3
                className="text-[#ffffff] text-sm font-medium mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Paddings
              </h3>
            </div>
            <div className="w-full h-auto grid grid-cols-2 grid-rows-2 gap-2">
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                <TbBoxAlignTopFilled className="text-xl text-[#BDBDBD]" />
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.paddingTop}
                  onChange={(e) =>
                    handleStyleChange("paddingTop", e.target.value)
                  }
                />
              </div>
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                <TbBoxAlignBottomFilled className="text-xl text-[#BDBDBD]" />
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.paddingBottom}
                  onChange={(e) =>
                    handleStyleChange("paddingBottom", e.target.value)
                  }
                />
              </div>
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                <TbBoxAlignLeftFilled className="text-xl text-[#BDBDBD]" />
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.paddingLeft}
                  onChange={(e) =>
                    handleStyleChange("paddingLeft", e.target.value)
                  }
                />
              </div>
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                <TbBoxAlignRightFilled className="text-xl text-[#BDBDBD]" />
                <input
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.paddingRight}
                  onChange={(e) =>
                    handleStyleChange("paddingRight", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="w-full h-auto gap-3 border border-l-0 border-r-0 border-b-0 pt-3 border-[#4F4F4F]">
              <h3
                className="text-[#ffffff] text-sm font-medium mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Bordes
              </h3>
            </div>
            <div className="w-full h-auto grid grid-cols-2 grid-rows-5 gap-2 ">
              <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2 col-span-2">
                <RxBorderWidth className="text-xl text-[#BDBDBD]" />
                <input
                  type="text"
                  className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                  value={selectedElement.styles.borderWidth}
                  onChange={(e) =>
                    handleStyleChange("borderWidth", e.target.value)
                  }
                />
              </div>
              <div className="gap-2 h-8 rounded mt-2 col-span-2 row-start-2">
                <input
                  type="color"
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] outline-none"
                  value={selectedElement.styles.borderColor}
                  onChange={(e) =>
                    handleStyleChange("borderColor", e.target.value)
                  }
                />
              </div>
              <div className="mt-2 flex flex-col gap-2 col-span-2 h-8 row-start-3">
                <select
                  className="w-full h-8 rounded border border-[#828282] bg-transparent text-[#E0E0E0] pl-2 outline-none"
                  value={selectedElement.styles.borderStyle}
                  onChange={(e) =>
                    handleStyleChange("borderStyle", e.target.value)
                  }
                >
                  <option value="solid">Sólida</option>
                  <option value="dashed">Rayas</option>
                  <option value="dotted">Puntos</option>
                  <option value="none">Ninguno</option>
                </select>
              </div>
              <div className="w-full grid grid-cols-2 gap-2 col-span-2 row-start-4 h-8">
                <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                  <TbBoxAlignTopLeftFilled className="text-xl text-[#BDBDBD]" />
                  <input
                    className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                    value={selectedElement.styles.borderTopLeftRadius}
                    onChange={(e) =>
                      handleStyleChange("borderTopLeftRadius", e.target.value)
                    }
                  />
                </div>
                <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                  <TbBoxAlignTopRightFilled className="text-xl text-[#BDBDBD]" />
                  <input
                    className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                    value={selectedElement.styles.borderTopRightRadius}
                    onChange={(e) =>
                      handleStyleChange("borderTopRightRadius", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-2 col-span-2 row-start-5 h-8">
                <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                  <TbBoxAlignBottomLeftFilled className="text-xl text-[#BDBDBD]" />
                  <input
                    className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                    value={selectedElement.styles.borderBottomLeftRadius}
                    onChange={(e) =>
                      handleStyleChange(
                        "borderBottomLeftRadius",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="gap-2 border border-[#555555] flex items-center h-8 rounded px-2 bg-[#555555] mt-2">
                  <TbBoxAlignBottomRightFilled className="text-xl text-[#BDBDBD]" />
                  <input
                    className="w-full h-8 rounded bg-transparent text-[#E0E0E0] pl-1 outline-none"
                    value={selectedElement.styles.borderBottomRightRadius}
                    onChange={(e) =>
                      handleStyleChange(
                        "borderBottomRightRadius",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
