var fs = require('fs');
var parser = require('./gramatica');

/*
 * Constantes 
 */
const TIPO_INSTRUCCION = require('./instrucciones').TIPO_INSTRUCCION;
const TIPO_OPERACION = require('./instrucciones').TIPO_OPERACION;
const TIPO_VALOR = require('./instrucciones').TIPO_VALOR;
const instruccionesAPI = require('./instrucciones').instruccionesAPI;
const TIPO_OPCION_SWITCH = require('./instrucciones').TIPO_OPCION_SWITCH;

/*
 *Tabla de simbolos
 */
const TIPO_DATO = require('./tabla_simbolos').TIPO_DATO;
const TS = require('./tabla_simbolos').TS;

let ast;
try {
    const entrada = document.getElementById("txtEditor").value;
    // invocamos a nuestro parser con el contendio del archivo de entradas
    ast = parser.parse(entrada.toString());

    // imrimimos en un archivo el contendio del AST en formato JSON
    fs.writeFileSync('./ast.json', JSON.stringify(ast, null, 2));
    setConsola(ast);
} catch (e) {
    console.error(e);
    return;
}

const tsGlobal = new TS([]);

procesarBloque(ast, tsGlobal);

function procesarBloque(instrucciones, tablaDeSimbolos) {
    instrucciones.forEach(instruccion => {

        if (instruccion.tipo === TIPO_INSTRUCCION.LOG) {
            // Procesando Instrucción Imprimir
            procesarImprimir(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.WHILE) {
            // Procesando Instrucción Mientras
            procesarMientras(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo == TIPO_INSTRUCCION.FOR) {
            // Procesando Instrucción Para
            procesarPara(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION) {
            // Procesando Instrucción Declaración
            procesarDeclaracion(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.ASIGNACION) {
            // Procesando Instrucción Asignación
            procesarAsignacion(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.IF) {
            // Procesando Instrucción If
            procesarIf(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.IF_ELSE) {
            // Procesando Instrucción If Else
            procesarIfElse(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.SWITCH) {
            // Procesando Instrucción Switch  
            procesarSwitch(instruccion, tablaDeSimbolos);
        } else {
            throw 'ERROR: tipo de instrucción no válido: ' + instruccion;
        }
    });
}

function procesarImprimir(instruccion, tablaDeSimbolos) {
    const cadena = procesarExpresionCadena(instruccion.expresionCadena, tablaDeSimbolos).valor;
    console.log('> ' + cadena);
    document.getElementById("txtConsola").value = cadena;
}

function setConsola(texto) {
    document.getElementById("txtConsola").value = texto;
}