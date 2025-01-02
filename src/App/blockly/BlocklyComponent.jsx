import React, { useRef, useEffect } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks"; // Esto incluye los bloques básicos
import { javascriptGenerator, Order } from "blockly/javascript";

const BlocklyComponent = ({ elements, onGenerateCode, code }) => {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    // Initialize Blockly only once
    if (!workspaceRef.current) {
      try {
        workspaceRef.current = Blockly.inject(blocklyDiv.current, {
          toolbox: `
          <xml xmlns="https://developers.google.com/blockly/xml">
            <category name="Funciones" colour="#9A5CA6">
              <block type="dynamic_dropdown"></block>
              <block type="show_alert"></block>
              <block type="go_to_screen"></block>
              <block type="const_declare"></block>
              <block type="const_use"></block>
              <block type="custom_text"></block>
              <block type="dynamic_dropdown_text_content"></block>
              <block type="dynamic_style_change"></block>
              <block type="if_else_block"></block>
              <block type="equality_block"></block>
              <block type="get_text_input_value"></block>
            </category>
          </xml>
          `,
          scrollbars: true,
          trashcan: true,
        });
      } catch (error) {
        console.error("Error al inyectar Blockly:", error);
      }
    }

    function collectElementIds(elements) {
      let ids = [];

      elements.forEach((el) => {
        // Agregar el ID del elemento actual
        ids.push(el.id.toString());

        // Si el elemento tiene hijos, llamamos recursivamente
        if (el.children && el.children.length > 0) {
          ids = ids.concat(collectElementIds(el.children));
        }
      });

      return ids;
    }

    function collectElementStyles(elements) {
      if (elements.length > 0 && elements[0].styles) {
        return Object.keys(elements[0].styles); // Extraer las claves de estilos del primer elemento
      }
      return [];
    }

    // Register the dynamic_menu_extension only once
    Blockly.Extensions.register("dynamic_menu_extension", function () {
      this.getInput("INPUT").appendField(
        new Blockly.FieldDropdown(function () {
          const options = collectElementIds(elements).map((id) => [id, id]);

          return options;
        }),
        "DAY"
      );
    });

    Blockly.Extensions.register("dynamic_style_menu", function () {
      this.getInput("STYLE_NAME").appendField(
        new Blockly.FieldDropdown(function () {
          const options = collectElementStyles(elements).map((style) => [
            style,
            style,
          ]);
          return options;
        }),
        "STYLE"
      );
    });

    // Define Blockly blocks
    Blockly.defineBlocksWithJsonArray([
      {
        type: "dynamic_dropdown",
        message0: "cuando %1 al hacer click hacer %2",
        args0: [
          {
            type: "input_dummy",
            name: "INPUT",
          },
          {
            type: "input_statement",
            name: "DO",
          },
        ],
        extensions: ["dynamic_menu_extension"],
      },
      {
        type: "get_text_input_value",
        message0: "campo %1 valor",
        args0: [
          {
            type: "input_dummy",
            name: "INPUT",
            options: [["Seleccionar ID", "default"]], // Opciones iniciales, se actualizan dinámicamente
          },
        ],
        output: null, // Esto permite conectar el bloque a bocas por la izquierda
        colour: 160, // Color del bloque
        tooltip: "Obtiene el valor del campo de texto por su ID.",
        helpUrl: "",
        extensions: ["dynamic_menu_extension"], // Extensión para obtener los IDs dinámicamente
      },
      {
        type: "equality_block",
        message0: "%1 = %2", // Representación lineal
        args0: [
          {
            type: "input_value", // Entrada izquierda
            name: "LEFT",
            check: null, // Acepta cualquier tipo de dato
          },
          {
            type: "input_value", // Entrada derecha
            name: "RIGHT",
            check: null, // Acepta cualquier tipo de dato
          },
        ],
        inputsInline: true, // Esto asegura que el bloque sea horizontal
        output: "Boolean", // Retorna un valor booleano
        colour: 230, // Color del bloque
        tooltip: "Verifica si dos valores son iguales.",
        helpUrl: "",
      },
      {
        type: "if_else_block",
        message0: "si %1 entonces %2 si no %3",
        args0: [
          {
            type: "input_value",
            name: "CONDITION", // Entrada para la condición
          },
          {
            type: "input_statement",
            name: "IF_BODY", // Cuerpo del `if`
          },
          {
            type: "input_statement",
            name: "ELSE_BODY", // Cuerpo del `else`
          },
        ],
        previousStatement: null, // Permite conectarse a otros bloques arriba
        nextStatement: null, // Permite conectarse a otros bloques abajo
        colour: 210, // Color del bloque
        tooltip:
          "Si la condición es verdadera, ejecuta el bloque dentro de 'entonces'. Si no, ejecuta el bloque dentro de 'si no'.",
        helpUrl: "",
      },
      {
        type: "dynamic_style_change",
        message0: "A %1 cambiar el estilo %2 a %3",
        args0: [
          {
            type: "input_dummy",
            name: "INPUT", // Campo para el id del elemento
          },
          {
            type: "input_dummy",
            name: "STYLE_NAME", // Campo para el nombre del estilo
          },
          {
            type: "input_value",
            name: "VALUE", // Campo para conectar el valor
          },
        ],
        previousStatement: "Action",
        extensions: ["dynamic_menu_extension", "dynamic_style_menu"],
      },
      {
        type: "dynamic_dropdown_text_content",
        message0: "%1 cambiar texto a %2",
        args0: [
          {
            type: "input_dummy", // No conecta nada a la izquierda, solo la selección del ID
            name: "INPUT",
          },
          {
            type: "input_value", // Conecta un valor a la derecha
            name: "VALUE",
            check: "String", // Asegúrate de que sea un valor de tipo String
          },
        ],
        previousStatement: "Action",
        extensions: ["dynamic_menu_extension"], // Para cargar los elementos dinámicamente
      },
      {
        type: "show_alert",
        message0: "mostrar alerta con mensaje %1",
        args0: [
          {
            type: "input_value",
            name: "VALUE",
          },
        ],
        colour: 160,
        tooltip: "Muestra una alerta con el mensaje proporcionado",
        helpUrl: "",
        previousStatement: null, // Permite que no tenga bloques anteriores (no conecta hacia atrás)
        nextStatement: null, // Permite que se conecten otros bloques después de este
        inputsInline: true, // Hace que los campos de entrada estén en línea
      },
      {
        type: "custom_text",
        message0: "%1",
        args0: [
          {
            type: "field_input",
            name: "TEXT",
            text: "Escribe algo aquí",
          },
        ],
        output: "String", // Este bloque puede ser usado para conectar con otros bloques como "const_declare" y "show_alert"
        colour: 160,
        tooltip: "Un bloque para ingresar texto",
        helpUrl: "",
      },
      {
        type: "const_declare",
        message0: "const %1 = %2",
        args0: [
          {
            type: "field_input",
            name: "VAR",
            text: "nombreVariable",
          },
          {
            type: "input_value",
            name: "VALUE",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: "Declara una constante con un valor.",
        helpUrl: "",
      },
      {
        type: "go_to_screen",
        message0: "Ir a la pantalla %1",
        args0: [
          {
            type: "field_input",
            name: "SCREEN_URL",
            text: "index", // Valor por defecto
          },
        ],
        colour: 160,
        tooltip: "Este bloque redirige a la URL especificada.",
        helpUrl: "",
        previousStatement: "Action",
        nextStatement: "Action",
      },
      {
        type: "const_use",
        message0: "%1",
        args0: [
          {
            type: "field_input",
            name: "VAR",
            text: "nombreVariable",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        output: "String",
        colour: 230,
        tooltip: "Usa una constante declarada previamente.",
        helpUrl: "",
      },
    ]);

    // Cargar bloques desde JSON
    if (code) {
      try {
        const state = JSON.parse(code); // Convertir el texto JSON en un objeto
        Blockly.serialization.workspaces.load(state, workspaceRef.current);
      } catch (error) {
        console.error("Error al cargar bloques desde JSON:", error);
      }
    }

    return () => {
      // Cleanup function to unregister the extension when the component unmounts
      Blockly.Extensions.unregister("dynamic_menu_extension");
      Blockly.Extensions.unregister("dynamic_style_menu");
    };
  }, [elements, code]); // Dependency on elements to update dropdown options

  // Define JavaScript code generation for the block
  javascriptGenerator.forBlock["dynamic_dropdown"] = function (block) {
    const elementId = block.getFieldValue("DAY");
    const statementsDo = javascriptGenerator.statementToCode(block, "DO");

    console.log("Element ID:", elementId, "Statements:", statementsDo); // Debug
    if (elementId === "NONE") {
      return "// No element selected.\n";
    }

    return `document.getElementById("${elementId}").addEventListener("click", () => {\n${statementsDo}});\n`;
  };

  javascriptGenerator.forBlock["get_text_input_value"] = function (block) {
    // Obtener el valor del campo desplegable (ID seleccionado)
    const id = block.getFieldValue("DAY") || "default";
  
    // Generar el código JavaScript
    const code = `document.getElementById("${id}").value`;
  
    // Retornar el código
    return [code, Order.ATOMIC];
  };

  javascriptGenerator.forBlock["equality_block"] = function (block) {
    // Obtener los valores conectados a las entradas
    const left = javascriptGenerator.valueToCode(block, "LEFT", Order.ATOMIC) || "null";
    const right = javascriptGenerator.valueToCode(block, "RIGHT", Order.ATOMIC) || "null";
  
    // Generar el código de comparación
    const code = `${left} === ${right}`;
  
    // Retornar el código generado
    return [code, Order.EQUALITY];
  };
  

  javascriptGenerator.forBlock["if_else_block"] = function (block) {
    // Obtener el código de la condición
    const condition =
      javascriptGenerator.valueToCode(block, "CONDITION", Order.NONE) ||
      "false";

    // Obtener los bloques dentro del `if`
    const ifBody = javascriptGenerator.statementToCode(block, "IF_BODY") || "";

    // Obtener los bloques dentro del `else`
    const elseBody =
      javascriptGenerator.statementToCode(block, "ELSE_BODY") || "";

    // Generar el código JavaScript del bloque
    const code = `
  if (${condition}) {
    ${ifBody}
  } else {
    ${elseBody}
  }
  `;
    return code;
  };

  javascriptGenerator.forBlock["go_to_screen"] = function (block) {
    const screenUrl = block.getFieldValue("SCREEN_URL"); // Obtener el valor de la URL ingresada en el campo de texto
    return `location.href = "${screenUrl}.html";\n`; // Generar el código JavaScript para redirigir
  };

  javascriptGenerator.forBlock["custom_text"] = function (block) {
    const text = block.getFieldValue("TEXT"); // Obtener el texto ingresado
    return [`"${text}"`, Order.ATOMIC]; // Generar el código con el texto entre comillas
  };

  javascriptGenerator.forBlock["dynamic_style_change"] = function (block) {
    const elementId = block.getFieldValue("DAY"); // El id seleccionado
    const styleName = block.getFieldValue("STYLE"); // El estilo seleccionado
    const value = javascriptGenerator.valueToCode(
      block,
      "VALUE",
      Order.ASSIGNMENT
    ); // El valor conectado

    return `document.getElementById("${elementId}").style.${styleName} = ${value};\n`;
  };

  javascriptGenerator.forBlock["const_declare"] = function (block) {
    const variableName = block.getFieldValue("VAR");

    // Obtener el valor del bloque de texto conectado al campo "VALUE"
    const value = javascriptGenerator.valueToCode(
      block,
      "VALUE",
      Order.ASSIGNMENT
    );

    // Si el bloque no está conectado o no tiene un valor, usar "undefined"
    if (!value) {
      return `const ${variableName} = undefined;\n`;
    }

    // Si el bloque tiene un valor, se genera el código de la constante
    return `const ${variableName} = ${value};\n`;
  };

  javascriptGenerator.forBlock["show_alert"] = function (block) {
    const value = javascriptGenerator.valueToCode(
      block,
      "VALUE",
      Order.ASSIGNMENT
    );
    return `alert(${value});\n`;
  };

  javascriptGenerator.forBlock["const_use"] = function (block) {
    const variableName = block.getFieldValue("VAR");
    return [variableName, Order.ATOMIC]; // Retorna el nombre de la constante
  };

  javascriptGenerator.forBlock["dynamic_dropdown_text_content"] = function (
    block
  ) {
    const elementId = block.getFieldValue("DAY"); // El ID seleccionado
    const value = javascriptGenerator.valueToCode(
      block,
      "VALUE",
      Order.ASSIGNMENT
    ); // El valor que se asignará

    return `document.getElementById("${elementId}").textContent = ${value};\n`;
  };

  // Function to generate code from Blockly blocks
  const generateCode = () => {
    if (!workspaceRef.current) {
      console.error("Workspace not initialized");
      return;
    }

    try {
      const blocklyCode = javascriptGenerator.workspaceToCode(
        workspaceRef.current
      );
      // Serializar el estado del espacio de trabajo a JSON
      const state = Blockly.serialization.workspaces.save(workspaceRef.current);
      const jsonText = JSON.stringify(state);

      onGenerateCode(blocklyCode, jsonText); // Envía ambos al callback
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={blocklyDiv} className="w-full h-full"></div>
      <button
        onClick={generateCode}
        className="absolute top-2 right-2 px-4 py-2 bg-blue-400 text-white rounded-3xl"
      >
        Guardar Código
      </button>
    </div>
  );
};

export default BlocklyComponent;
