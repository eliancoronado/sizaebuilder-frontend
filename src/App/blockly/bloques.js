export const bloques = [
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
    type: "json_stringify_variables",
    message0: "convertir a información [ %1 ]",
    args0: [
      {
        type: "input_statement",
        name: "VARIABLES",
      },
    ],
    output: "String",
    colour: 230,
    tooltip: "Convierte variables a una cadena JSON.",
    helpUrl: "",
  },
  {
    type: "json_variable",
    message0: "usar variable %1",
    args0: [
      {
        type: "field_input",
        name: "VAR",
        text: "variable",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
    tooltip: "Añade una variable al objeto JSON.",
    helpUrl: "",
  },
  {
    type: "change_inner_html",
    message0: "cambiar contenido de %1 a %2",
    args0: [
      {
        type: "input_dummy",
        name: "INPUT",
      },
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    extensions: ["dynamic_menu_extension"], // Para seleccionar elementos dinámicamente
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Cambia el contenido HTML de un elemento.",
    helpUrl: "",
  },
  {
    type: "append_child_block",
    message0: "Agregar hijo al elemento %1 con el contenido %2",
    args0: [
      {
        type: "input_dummy",
        name: "INPUT",
      },
      {
        type: "input_value",
        name: "ELEMENT",
        check: "String",
      },
    ],
    extensions: ["dynamic_menu_extension"],
    previousStatement: "Action",
    nextStatement: "Action",
    colour: 230,
    tooltip: "Agrega un elemento hijo al elemento seleccionado por ID.",
    helpUrl: "",
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
    message0: "%1 == %2", // Representación lineal
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
        text: "texto",
      },
    ],
    output: "String", // Este bloque puede ser usado para conectar con otros bloques como "const_declare" y "show_alert"
    colour: 160,
    tooltip: "Un bloque para ingresar texto",
    helpUrl: "",
  },
  {
    type: "custom_number",
    message0: "%1",
    args0: [
      {
        type: "field_input",
        name: "TEXT",
        text: "100",
      },
    ],
    output: "String", // Este bloque puede ser usado para conectar con otros bloques como "const_declare" y "show_alert"
    colour: 160,
    tooltip: "Un bloque para ingresar texto",
    helpUrl: "",
  },
  {
    type: "const_declare",
    message0: "definir %1 = %2",
    args0: [
      {
        type: "field_input",
        name: "VAR",
        text: "constante",
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
    type: "var_declare",
    message0: "variable %1 = %2",
    args0: [
      {
        type: "field_input",
        name: "VAR",
        text: "variable",
      },
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Declara una variable con var y le asigna un valor.",
    helpUrl: "",
  },
  {
    type: "var_change",
    message0: "%1 = %2",
    args0: [
      {
        type: "field_input",
        name: "VAR",
        text: "Variable",
      },
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Declara una variable con var y le asigna un valor.",
    helpUrl: "",
  },
  {
    type: "var_plus",
    message0: "%1 + %2",
    args0: [
      {
        type: "field_input",
        name: "VAR",
        text: "Variable",
      },
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Declara una variable con var y le asigna un valor.",
    helpUrl: "",
  },
  {
    type: "var_minus",
    message0: "%1 - %2",
    args0: [
      {
        type: "field_input",
        name: "VAR",
        text: "Variable",
      },
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Declara una variable con var y le asigna un valor.",
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
    type: "fetch_request_block",
    message0: "Guardar en %1",
    args0: [
      {
        type: "field_input",
        name: "VAR_NAME",
        text: "response",
      },
    ],
    message1: "Hacer petición a %1",
    args1: [
      {
        type: "field_input",
        name: "URL",
        text: "https://example.org/post",
      },
    ],
    message2: "Con método %1",
    args2: [
      {
        type: "field_dropdown",
        name: "METHOD",
        options: [
          ["Enviar (POST)", "POST"],
          ["Recibir (GET)", "GET"],
        ],
      },
    ],
    message3: "Con tipo de información %1",
    args3: [
      {
        type: "field_dropdown",
        name: "HEADERS",
        options: [
          ["Content-Type: application/json", "application/json"],
          ["Content-Type: text/plain", "text/plain"],
        ],
      },
    ],
    message4: "Con informacion a enviar %1",
    args4: [
      {
        type: "input_value",
        name: "BODY",
        check: "String",
      },
    ],
    previousStatement: "Action",
    nextStatement: "Action",
    colour: 230,
    tooltip:
      "Realiza una petición HTTP con el método y los encabezados especificados y guarda la respuesta en una variable.",
    helpUrl: "",
  },
  {
    type: "parse_json_block",
    message0: "Guardar información obtenida en %1 desde %2",
    args0: [
      {
        type: "field_input",
        name: "DATA_VAR",
        text: "data",
      },
      {
        type: "field_input",
        name: "RESPONSE_VAR",
        text: "response",
      },
    ],
    previousStatement: "Action",
    nextStatement: "Action",
    colour: 180,
    tooltip:
      "Convierte la respuesta de la petición en JSON y la guarda en una variable.",
    helpUrl: "",
  },
  {
    type: "async_function_block",
    message0: "función asincrona %1  %2",
    args0: [
      {
        type: "field_input",
        name: "FUNC_NAME",
        text: "myFunction",
      },
      {
        type: "input_statement",
        name: "CODE",
        check: "Action",
      },
    ],
    output: "Function",
    colour: 230,
    tooltip:
      "Crea una función async con el nombre especificado y el código dentro.",
    helpUrl: "",
  },
  {
    type: "call_async_function_block",
    message0: "Ejecutar función %1",
    args0: [
      {
        type: "field_input",
        name: "FUNC_NAME",
        text: "myFunction",
      },
    ],
    output: null,
    previousStatement: "Action",
    nextStatement: "Action",
    colour: 230,
    tooltip: "Ejecuta la función async especificada.",
    helpUrl: "",
  },
  {
    type: "console_log_block",
    message0: "Mostrar por consola %1",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: "String",
      },
    ],
    previousStatement: "Action",
    nextStatement: "Action",
    colour: 160,
    tooltip: "Muestra un valor en la consola.",
    helpUrl: "",
  },
  {
    type: "create_image_block",
    message0: "Crear imagen con fuente %1",
    args0: [
      {
        type: "input_value",
        name: "SRC",
        check: "String",
      },
    ],
    previousStatement: "Action",
    nextStatement: "Action",
    output: null,
    colour: 230,
    tooltip: "Crea un elemento de imagen y asigna su fuente.",
    helpUrl: "",
  },
  {
    type: "const_use",
    message0: "%1",
    args0: [
      {
        type: "field_input",
        name: "VAR",
        text: "ValorConstante",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    output: "String",
    colour: 230,
    tooltip: "Usa una constante declarada previamente.",
    helpUrl: "",
  },
];
