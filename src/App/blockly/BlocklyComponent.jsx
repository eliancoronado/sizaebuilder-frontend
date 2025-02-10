import React, { useRef, useEffect } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks"; // Esto incluye los bloques básicos
import { javascriptGenerator, Order } from "blockly/javascript";
import useStore from "../store/store";
import { bloques } from "./bloques";

const BlocklyComponent = ({ onGenerateCode }) => {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const { droppedElements: elements, workspaceState: code } = useStore();

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
              <block type="fetch_request_block"></block>
              <block type="parse_json_block"></block>
              <block type="async_function_block"></block>
              <block type="call_async_function_block"></block>
              <block type="go_to_screen"></block>
              <block type="json_stringify_variables"></block>
              <block type="json_variable"></block>
              <block type="append_child_block"></block>
              <block type="change_inner_html"></block>
              <block type="create_image_block"></block>
              <block type="console_log_block"></block>
              <block type="const_declare"></block>
              <block type="var_declare"></block>
              <block type="const_use"></block>
              <block type="var_change"></block>
              <block type="var_plus"></block>
              <block type="var_minus"></block>
              <block type="custom_text"></block>
              <block type="custom_number"></block>
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
    Blockly.defineBlocksWithJsonArray(bloques);

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

  javascriptGenerator.forBlock["change_inner_html"] = function (block) {
    const elementId = block.getFieldValue("DAY") || "NONE";
    const value =
      javascriptGenerator.valueToCode(block, "VALUE", Order.ASSIGNMENT) || "''"; // Si no hay valor, usa una cadena vacía

    if (elementId === "NONE") {
      return "// No element selected.\n";
    }

    return `document.getElementById("${elementId}").innerHTML = ${value};\n`;
  };

  javascriptGenerator.forBlock["append_child_block"] = function (block) {
    const elementId = block.getFieldValue("DAY"); // Obtener el ID del elemento donde se va a agregar el hijo
    const childElement =
      javascriptGenerator.valueToCode(block, "ELEMENT", Order.ATOMIC) || "null"; // Obtener el bloque o valor para el hijo

    if (elementId === "NONE") {
      return "// No element selected.\n";
    }

    return `document.getElementById("${elementId}").appendChild(${childElement});\n`;
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
    const left =
      javascriptGenerator.valueToCode(block, "LEFT", Order.ATOMIC) || "null";
    const right =
      javascriptGenerator.valueToCode(block, "RIGHT", Order.ATOMIC) || "null";

    // Generar el código de comparación
    const code = `${left} === ${right}`;

    // Retornar el código generado
    return [code, Order.EQUALITY];
  };

  javascriptGenerator.forBlock["fetch_request_block"] = function (block) {
    const varName = block.getFieldValue("VAR_NAME") || "response"; // Nombre de la variable
    const url = block.getFieldValue("URL"); // URL ingresada
    const method = block.getFieldValue("METHOD"); // Método (GET o POST)
    const headersType = block.getFieldValue("HEADERS"); // Tipo de header
    const body =
      javascriptGenerator.valueToCode(block, "BODY", Order.NONE) || "null"; // Body del request

    // Construcción del objeto de opciones para fetch
    let fetchOptions = `{
        method: "${method}",
        headers: {
            "Content-Type": "${headersType}"
        }`;

    if (method === "POST") {
      fetchOptions += `,
        body: ${body}`;
    }

    fetchOptions += `\n    }`;

    // Generar código final de fetch sin console.log ni data
    return `const ${varName} = await fetch("${url}", ${fetchOptions});\n`;
  };

  javascriptGenerator.forBlock["console_log_block"] = function (block) {
    const value =
      javascriptGenerator.valueToCode(
        block,
        "VALUE",
        javascriptGenerator.ORDER_ATOMIC
      ) || "''"; // Si no hay valor, usa una cadena vacía
    return `console.log(${value});\n`;
  };

  javascriptGenerator.forBlock["create_image_block"] = function (block) {
    const srcValue =
      javascriptGenerator.valueToCode(block, "SRC", Order.ATOMIC) || "''";

    // Crear una función autoejecutable para devolver el elemento
    const code = `(function() {
      const imgElement = document.createElement("img");
      imgElement.src = ${srcValue};
      return imgElement;
    })()`;

    return [code, Order.NONE]; // Devolver una tupla válida
  };

  javascriptGenerator.forBlock["parse_json_block"] = function (block) {
    const dataVar = block.getFieldValue("DATA_VAR") || "data"; // Nombre de la variable para guardar el JSON
    const responseVar = block.getFieldValue("RESPONSE_VAR") || "response"; // Nombre de la variable de la respuesta

    return `const ${dataVar} = await ${responseVar}.json();\n`;
  };

  javascriptGenerator.forBlock["call_async_function_block"] = function (block) {
    const funcName = block.getFieldValue("FUNC_NAME"); // Obtiene el nombre de la función

    // Devuelve el código para llamar a la función async
    return `${funcName}();\n`;
  };

  javascriptGenerator.forBlock["async_function_block"] = function (block) {
    const funcName = block.getFieldValue("FUNC_NAME"); // Obtiene el nombre de la función
    const code = javascriptGenerator.statementToCode(block, "CODE"); // Obtiene el código dentro de la función

    // Devuelve el código JavaScript para crear la función async
    return `async function ${funcName}() {\n${code}\n}\n`;
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

  javascriptGenerator.forBlock["custom_number"] = function (block) {
    const text = block.getFieldValue("TEXT"); // Obtener el texto ingresado
    return [`${text}`, Order.ATOMIC]; // Generar el código con el texto entre comillas
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
  javascriptGenerator.forBlock["var_declare"] = function (block) {
    const variableName = block.getFieldValue("VAR");

    // Obtener el valor del bloque de texto conectado al campo "VALUE"
    const value = javascriptGenerator.valueToCode(
      block,
      "VALUE",
      Order.ASSIGNMENT
    );

    // Si el bloque no está conectado o no tiene un valor, usar "undefined"
    if (!value) {
      return `var ${variableName} = "";\n`;
    }

    // Si el bloque tiene un valor, se genera el código de la constante
    return `var ${variableName} = ${value};\n`;
  };
  javascriptGenerator.forBlock["var_change"] = function (block) {
    const variableName = block.getFieldValue("VAR");

    // Obtener el valor del bloque de texto conectado al campo "VALUE"
    const value = javascriptGenerator.valueToCode(
      block,
      "VALUE",
      Order.ASSIGNMENT
    );

    // Si el bloque no está conectado o no tiene un valor, usar "undefined"
    if (!value) {
      return `${variableName} = "";\n`;
    }

    // Si el bloque tiene un valor, se genera el código de la constante
    return `${variableName} = ${value};\n`;
  };
  javascriptGenerator.forBlock["var_plus"] = function (block) {
    const variableName = block.getFieldValue("VAR");

    // Obtener el valor del bloque de texto conectado al campo "VALUE"
    const value = javascriptGenerator.valueToCode(
      block,
      "VALUE",
      Order.ASSIGNMENT
    );

    // Si el bloque no está conectado o no tiene un valor, usar "undefined"
    if (!value) {
      return `${variableName} += "";\n`;
    }

    // Si el bloque tiene un valor, se genera el código de la constante
    return `${variableName} += ${value};\n`;
  };
  javascriptGenerator.forBlock["var_minus"] = function (block) {
    const variableName = block.getFieldValue("VAR");

    // Obtener el valor del bloque de texto conectado al campo "VALUE"
    const value = javascriptGenerator.valueToCode(
      block,
      "VALUE",
      Order.ASSIGNMENT
    );

    // Si el bloque no está conectado o no tiene un valor, usar "undefined"
    if (!value) {
      return `${variableName} -= "";\n`;
    }

    // Si el bloque tiene un valor, se genera el código de la constante
    return `${variableName} -= ${value};\n`;
  };

  javascriptGenerator.forBlock["show_alert"] = function (block) {
    const value = javascriptGenerator.valueToCode(
      block,
      "VALUE",
      Order.ASSIGNMENT
    );
    return `alert(${value});\n`;
  };

  javascriptGenerator.forBlock["json_stringify_variables"] = function (block) {
    const variables = javascriptGenerator
      .statementToCode(block, "VARIABLES")
      .trim();

    return [`JSON.stringify({ ${variables} })`, Order.NONE];
  };

  javascriptGenerator.forBlock["json_variable"] = function (block) {
    const variableName = block.getFieldValue("VAR").trim();
    return `${variableName},\n`;
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
      <div ref={blocklyDiv} className="w-full h-full text-black"></div>
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
