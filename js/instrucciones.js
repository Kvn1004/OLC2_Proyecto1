const TIPO_VALOR = {
    NUMERO: 'VAL_NUMERO',
    IDENTIFICADOR: 'VAL_IDENTIFICADOR',
    CADENA: 'VAL_CADENA',
};

const TIPO_OPERACION = {
    SUMA: 'OP_SUMA',
    RESTA: 'OP_RESTA',
    MULTIPLICACION: 'OP_MULTIPLICACION',
    DIVISION: 'OP_DIVISION',
    NEGATIVO: 'OP_NEGATIVO',
    MODULO: 'OP_MODULO',
    POTENCIA: 'OP_POTENCIA',
    MAYOR_QUE: 'OP_MAYOR_QUE',
    MENOR_QUE: 'OP_MENOR_QUE',
    MAYOR_IGUAL: 'OP_MAYOR_IGUAL',
    MENOR_IGUAL: 'OP_MENOR_IGUAL',
    DOBLE_IGUAL: 'OP_DOBLE_IGUAL',
    NO_IGUAL: 'OP_NO_IGUAL',

    AND: 'OP_AND',
    OR: 'OP_OR',
    NOT: 'OP_NOT',

    CONCATENACION: 'OP_CONCATENACION',

    TRUE: 'OP_TRUE',
    FALSE: 'OP_FALSE',
    NULL: 'OP_NULL',
    UNDEFINED: 'OP_UNDEFINED'
};

const TIPO_INSTRUCCION = {
    LOG: 'INSTR_LOG',
    WHILE: 'INSTR_WHILE',
    DECLARACION: 'INSTR_DECLARACION',
    ASIGNACION: 'INSTR_ASIGANCION',
    IF: 'INSTR_IF',
    IF_ELSE: 'INSTR_ELSE',
    FOR: 'INST_FOR',
    SWITCH: 'SWITCH',
    SWITCH_OP: 'SWITCH_OP',
    SWITCH_DEF: 'SWITCH_DEF',
};

const TIPO_OPCION_SWITCH = {
    CASO: 'CASO',
    DEFECTO: 'DEFECTO'
};

function nuevaOperacion(operandoIzq, operandoDer, tipo) {
    return {
        operandoIzq: operandoIzq,
        operandoDer: operandoDer,
        tipo: tipo
    }
}

const instruccionesAPI = {
        nuevoOperacionBinaria: function(operandoIzq, operandoDer, tipo) {
            return nuevaOperacion(operandoIzq, operandoDer, tipo);
        },

        nuevoOperacionUnaria: function(operando, tipo) {
            return nuevaOperacion(operando, undefined, tipo);
        },

        nuevoValor: function(valor, tipo) {
            return {
                tipo: tipo,
                valor: valor
            }
        },

        nuevaLlamadaFuncion: function(id, parametros) {
            if (id == "console.log") {
                console.log("looog");
            } else {
                return {

                }
            }
        },

        nuevoLog: function(expresionCadena) {
            return {
                tipo: TIPO_INSTRUCCION.LOG,
                expresionCadena: expresionCadena
            };
        },

        nuevoWhile: function(expresionLogica, instrucciones) {
            return {
                tipo: TIPO_INSTRUCCION.WHILE,
                expresionLogica: expresionLogica,
                instrucciones: instrucciones
            };
        },

        nuevoFor: function(variable, valorVariable, expresionLogica, aumento, instrucciones) {
            return {
                tipo: TIPO_INSTRUCCION.FOR,
                expresionLogica: expresionLogica,
                instrucciones: instrucciones,
                aumento: aumento,
                variable: variable,
                valorVariable: valorVariable
            }
        },

        nuevoDeclaracion: function(identificador, tipo) {
            return {
                tipo: TIPO_INSTRUCCION.DECLARACION,
                identificador: identificador,
                tipo_dato: tipo
            }
        },

        nuevoAsignacion: function(identificador, expresionNumerica) {
            return {
                tipo: TIPO_INSTRUCCION.ASIGNACION,
                identificador: identificador,
                expresionNumerica: expresionNumerica
            }
        },

        nuevoIf: function(expresionLogica, instrucciones) {
            return {
                tipo: TIPO_INSTRUCCION.IF,
                expresionLogica: expresionLogica,
                instrucciones: instrucciones
            }
        },

        nuevoIfElse: function(expresionLogica, instruccionesIfVerdadero, instruccionesIfFalso) {
            return {
                tipo: TIPO_INSTRUCCION.IF_ELSE,
                expresionLogica: expresionLogica,
                instruccionesIfVerdadero: instruccionesIfVerdadero,
                instruccionesIfFalso: instruccionesIfFalso
            }
        },

        nuevoSwitch: function(expresionNumerica, casos) {
            return {
                tipo: TIPO_INSTRUCCION.SWITCH,
                expresionNumerica: expresionNumerica,
                casos: casos
            }
        },

        nuevoListaCasos: function(caso) {
            var casos = [];
            casos.push(caso);
            return casos;
        },

        nuevoCaso: function(expresionNumerica, instrucciones) {
            return {
                tipo: TIPO_OPCION_SWITCH.CASO,
                expresionNumerica: expresionNumerica,
                instrucciones: instrucciones
            }
        },

        nuevoCasoDef: function(instrucciones) {
            return {
                tipo: TIPO_OPCION_SWITCH.DEFECTO,
                instrucciones: instrucciones
            }
        },

        nuevoOperador: function(operador) {
            return operador
        },
    }
    /*module.exports.TIPO_OPERACION = TIPO_OPERACION;
    module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
    module.exports.TIPO_VALOR = TIPO_VALOR;
    module.exports.instruccionesAPI = instruccionesAPI;
    module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;*/