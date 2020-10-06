/*
 * Constantes 
 */
/*const TIPO_INSTRUCCION = require('./instrucciones').TIPO_INSTRUCCION;
const TIPO_OPERACION = require('./instrucciones').TIPO_OPERACION;
const TIPO_VALOR = require('./instrucciones').TIPO_VALOR;
const instruccionesAPI = require('./instrucciones').instruccionesAPI;
const TIPO_OPCION_SWITCH = require('./instrucciones').TIPO_OPCION_SWITCH;*/

/*
 *Tabla de simbolos
 */
/*const TIPO_DATO = require('./tabla_simbolos').TIPO_DATO;
const TS = require('./tabla_simbolos').TS;*/


//var parser = require(['./gramatica']);

import { TS } from './tabla_simbolos';

function ejecutar() {

    let ast;
    try {
        const entrada = document.getElementById("txtEditor").value;
        // invocamos a nuestro parser con el contendio del archivo de entradas
        ast = parser.parse(entrada.toString());

        // imrimimos en un archivo el contendio del AST en formato JSON
        //fs.writeFileSync('./ast.json', JSON.stringify(ast, null, 2));
        setConsola(ast);
    } catch (e) {
        console.error(e);
        return;
    }
}

const tsGlobal = new TS([]);

/*procesarBloque(ast, tsGlobal);
requirejs(["./instrucciones"], function(instrucciones) {

});*/

function procesarBloque(instrucciones, tablaDeSimbolos) {
    instrucciones.forEach(instruccion => {

        if (instruccion.tipo === TIPO_INSTRUCCION.LOG) {
            // Procesando Instrucción Imprimir
            procesarImprimir(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION) {
            // Procesando Instrucción Declaración
            procesarDeclaracion(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.ASIGNACION) {
            // Procesando Instrucción Asignación
            procesarAsignacion(instruccion, tablaDeSimbolos);
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

function procesarExpresionNumerica(expresion, tablaDeSimbolos) {
    if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
        // Es un valor negado.
        // En este caso necesitamos procesar el valor del operando para poder negar su valor.
        // Para esto invocamos (recursivamente) esta función para sesolver el valor del operando.
        const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor; // resolvemos el operando

        // Retornamos el valor negado.
        const res = valor * -1;
        return { valor: res, tipo: TIPO_DATO.NUMERO };
    } else if (expresion.tipo === TIPO_OPERACION.SUMA ||
        expresion.tipo === TIPO_OPERACION.RESTA ||
        expresion.tipo === TIPO_OPERACION.MULTIPLICACION ||
        expresion.tipo === TIPO_OPERACION.DIVISION) {
        // Es una operación aritmética.
        // En este caso necesitamos procesar los operandos antes de realizar la operación.
        // Para esto incovacmos (recursivamente) esta función para resolver los valores de los operandos.
        let valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos); // resolvemos el operando izquierdo.
        let valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos); // resolvemos el operando derecho.
        if (valorIzq.tipo !== TIPO_DATO.NUMERO || valorDer.tipo !== TIPO_DATO.NUMERO) {
            throw 'ERROR: se esperaban expresiones numericas para ejecutar la: ' + expresion.tipo;
        } else {
            valorIzq = valorIzq.valor;
            valorDer = valorDer.valor;
        }
        if (expresion.tipo === TIPO_OPERACION.SUMA) {
            const res = valorIzq + valorDer;
            return { valor: res, tipo: TIPO_DATO.NUMERO };
        }
        if (expresion.tipo === TIPO_OPERACION.RESTA) {
            const res = valorIzq - valorDer;
            return { valor: res, tipo: TIPO_DATO.NUMERO };
        }
        if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const res = valorIzq * valorDer;
            return { valor: res, tipo: TIPO_DATO.NUMERO };
        }
        if (expresion.tipo === TIPO_OPERACION.DIVISION) {
            if (valorDer === 0) {
                throw 'ERROR: la division entre 0 da como resultado: ' + valorIzq / valorDer;
            } else {
                const res = valorIzq / valorDer;
                return { valor: res, tipo: TIPO_DATO.NUMERO };
            }
        };

    } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
        // Es un valor numérico.
        // En este caso únicamente retornamos el valor obtenido por el parser directamente.
        return { valor: expresion.valor, tipo: TIPO_DATO.NUMERO };
    } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
        // Es un identificador.
        // Obtenemos el valor de la tabla de simbolos
        const sym = tablaDeSimbolos.obtener(expresion.valor);
        return { valor: sym.valor, tipo: sym.tipo };
    } else {
        throw 'ERROR: expresión numérica no válida: ' + expresion;
    }
}

/**
 * De acuerdo con nuestra gramática, aqui, expresión puede ser una operacion CONCATENACION, CADENA o una expresión numérica
 * @param {*} expresion 
 * @param {TS} tablaDeSimbolos
 * Evaluamos cada caso para resolver a un valor tipo cadena de acuerdo al tipo de operación.
 */
function procesarExpresionCadena(expresion, tablaDeSimbolos) {
    if (expresion.tipo === TIPO_OPERACION.CONCATENACION) {
        // Es una operación de concatenación.
        // En este caso necesitamos procesar los operandos antes de realizar la concatenación.
        // Para esto invocamos (recursivamente) esta función para resolver los valores de los operandos.
        const cadIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos).valor; // resolvemos el operando izquierdo.
        const cadDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos).valor; // resolvemos el operando derecho.
        // Retornamos el resultado de la operación de concatenación.
        const res = cadIzq + cadDer;
        return { valor: res, tipo: TIPO_DATO.STRING };

    } else if (expresion.tipo === TIPO_VALOR.CADENA) {
        // Es una cadena.
        // En este caso únicamente retornamos el valor obtenido por el parser directamente.
        return { valor: expresion.valor, tipo: TIPO_DATO.STRING };
    } else {
        // Es una epresión numérica.
        // En este caso invocamos la función que se encarga de procesar las expresiones numéricas
        // y retornamos su valor en cadena.
        return procesarExpresionNumerica(expresion, tablaDeSimbolos);
    }
}

/**
 * De acuerdo con nuestra gramática, aqui, expresión puede ser una operación relacional MAYOR QUE, MENOR QUE, MAYOR IGUAL QUE, MENOR IGUAL QUE, IGUAL QUE o NO IGUAL QUE
 * @param {*} expresion 
 * @param {TS} tablaDeSimbolos
 * Evaluamos cada caso para resolver a un valor tipo booleando de acuerdo al tipo de operación.
 */
function procesarExpresionRelacional(expresion, tablaDeSimbolos) {
    // En este caso necesitamos procesar los operandos antes de realizar la comparación.
    let valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos); // resolvemos el operando izquierdo.
    let valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos); // resolvemos el operando derecho.
    if (valorIzq.tipo !== TIPO_DATO.NUMERO || valorDer.tipo !== TIPO_DATO.NUMERO) {
        throw 'ERROR: se esperaban expresiones numericas para ejecutar la: ' + expresion.tipo;
    } else {
        valorIzq = valorIzq.valor;
        valorDer = valorDer.valor;
    }

    if (expresion.tipo === TIPO_OPERACION.MAYOR_QUE) return valorIzq > valorDer;
    if (expresion.tipo === TIPO_OPERACION.MENOR_QUE) return valorIzq < valorDer;
    if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) return valorIzq >= valorDer;
    if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) return valorIzq <= valorDer;
    if (expresion.tipo === TIPO_OPERACION.DOBLE_IGUAL) return valorIzq === valorDer;
    if (expresion.tipo === TIPO_OPERACION.NO_IGUAL) return valorIzq !== valorDer;
}

/**
 * De acuerdo con nuestra gramática, aqui, expresión puede ser una operación lógica AND, OR o NOT
 * @param {*} expresion 
 * @param {TS} tablaDeSimbolos
 * Evaluamos cada caso para resolver a un valor tipo booleando de acuerdo al tipo de operación.
 */
function procesarExpresionLogica(expresion, tablaDeSimbolos) {

    if (expresion.tipo === TIPO_OPERACION.AND) {
        // En este caso necesitamos procesar los operandos para &&.
        const valorIzq = procesarExpresionRelacional(expresion.operandoIzq, tablaDeSimbolos); // resolvemos el operando izquierdo.
        const valorDer = procesarExpresionRelacional(expresion.operandoDer, tablaDeSimbolos); // resolvemos el operando derecho.
        return valorIzq && valorDer;
    }
    if (expresion.tipo === TIPO_OPERACION.OR) {
        // En este caso necesitamos procesar los operandos para ||.
        const valorIzq = procesarExpresionRelacional(expresion.operandoIzq, tablaDeSimbolos); // resolvemos el operando izquierdo.
        const valorDer = procesarExpresionRelacional(expresion.operandoDer, tablaDeSimbolos); // resolvemos el operando derecho.
        return valorIzq || valorDer;
    }
    if (expresion.tipo === TIPO_OPERACION.NOT) {
        // En este caso necesitamos procesar solamente un operando para !.
        const valor = procesarExpresionRelacional(expresion.operandoIzq, tablaDeSimbolos); // resolvemos el operando izquierdo.
        return !valor;
    }
    return procesarExpresionRelacional(expresion, tablaDeSimbolos);
}


function setConsola(texto) {
    document.getElementById("txtConsola").value = texto;
}