%lex

%options case-insensitive

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

"cons"              return 'RCONS';
"let"               return 'RLET';
"var"               return 'RVAR';
"boolean"           return 'RBOOLEAN';
"number"            return 'RNUMBER';        
"string"            return 'RSTRING';
"void"              return 'RVOID';
"true"              return 'RTRUE';
"false"             return 'RFALSE';
"null"              return 'RNULL';
"undefined"         return 'RUNDEFINED';
"function"          return 'RFUNCTION';
"console.log"       return 'RLOG';

"+"                 return 'MAS';
"-"                 return 'MENOS';
"**"                return 'POT';
"*"                 return 'MUL';
"/"                 return 'DIV';
"%"                 return 'MOD';
"("                 return 'LPAR';
")"                 return 'RPAR';
"["                 return 'LCOR';
"]"                 return 'RCOR';
","                 return 'COMA';
";"                 return 'PUNTOCOMA';
":"                 return 'DOSPUNTOS';
"&&"                return 'AND';
"||"                return 'OR';
"!"                 return 'NOT';
"<"                 return 'MENOR';
"<="                return 'MENORIGUAL';
">"                 return 'MAYOR';
">="                return 'MAYORIGUAL';
"=="                return 'DIGUAL';
"!="                return 'NOIGUAL';
"="                 return 'IGUAL';
"?"                 return 'TERNARIO';

(\"[^\"]*\")|(\'[^\']*\')|(\`[^\`]*\`)        { yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
[0-9]+("."[0-9]+)?\b        return 'DECIMAL';
[0-9]+\b                    return 'ENTERO';
([a-zA-Z_$])[a-zA-Z0-9_$]*  return 'ID';

[ \r\t]+            {}
\n                  {}

<<EOF>>                 return 'EOF';

.                       { console.error('Error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

/lex

%right 'IGUAL'
%right 'TERNARIO' 'DOSPUNTOS'
%left 'OR'
%left 'AND'
%left 'DIGUAL' 'NOIGUAL'
%nonassoc 'MENOR' 'MAYOR' 'MENORIGUAL' 'MAYORIGUAL'
%left 'MAS' 'MENOS' 'MOD'
%left 'MUL' 'DIV'
%left 'POT'
%left UMENOS 'NOT'
%left 'LCOR' 'RCOR'

%start ini

%%

ini :
      sentencias EOF { return $1; }
    ;

sentencias :
      sentencias sentencia { $1.push($2); $$ = $1; }
    | sentencia { $$ = [$1]; }
    ;

sentencia :
      asignacion {$$ = $1;}
    | declaracion {$$ = $1; }
    | funcion {$$ = $1;}
    | llamada_funcion {$$ = $1; }
    | error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
    ;

funcion :
      RFUNCTION ID LPAR RPAR LCOR sentencias RCOR
    ;
      
llamada_funcion :
      ID LPAR args RPAR PUNTOCOMA {$$ = "funcion"; }
    | ID LPAR RPAR PUNTOCOMA {$$ = "funcion"; }
    | RLOG LPAR expresion RPAR PUNTOCOMA { $$ = instruccionesAPI.nuevoLog($3); }
    ;

args :
      args COMA expresion
    | expresion
    ;

declaracion :
      tipo_var ID PUNTOCOMA { $$ = instruccionesAPI.noevoDeclaracion($2, "undefined");}
    | tipo_var ID DOSPUNTOS tipo_dato PUNTOCOMA  { $$ = instruccionesAPI.noevoDeclaracion($2, $4);}
    ;

asignacion : 
      tipo_var ID IGUAL expresion PUNTOCOMA { $$ = instruccionesAPI.nuevoAsignacion($2, "undefined", $4);}
    | tipo_var ID DOSPUNTOS tipo_dato IGUAL expresion PUNTOCOMA { $$ = instruccionesAPI.nuevoAsignacion($2, $4, $6);}
    ;

tipo_var : 
      RLET
    | RCONS
    ;

tipo_dato :
      RNUMBER { $$ = "NUMERO"; }
    | RSTRING { $$ = "STRING"; }
    | RBOOLEAN { $$ = "BOOLEAN"; }
    | RVOID { $$ = "VOID"; }
    | ID { $$ = "TYPE"; }
    ;

expresion :
      expresion TERNARIO expresion DOSPUNTOS expresion
    | expresion AND expresion                           { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.AND); }
    | expresion OR expresion                            { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.OR); }
    | NOT expresion %prec NOT                           { $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_OPERACION.NOT); }
    | expresion DIGUAL expresion                        { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DOBLE_IGUAL); }
    | expresion NOIGUAL expresion                       { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.NO_IGUAL)}
    | expresion MAYOR expresion                         { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_QUE); }
    | expresion MAYORIGUAL expresion                    { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_IGUAL); }
    | expresion MENOR expresion                         { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_QUE); }
    | expresion MENORIGUAL expresion                    { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_IGUAL); }
    | expresion MOD expresion                           { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MODULO); }         
    | expresion POT expresion                           { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.POTENCIA); }
    | expresion MUL expresion                           { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MULTIPLICACION); }
    | expresion DIV expresion                           { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DIVISION); }
    | expresion MAS expresion                           { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.SUMA); }
    | expresion MENOS expresion                         { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.RESTA); }
    | MENOS expresion %prec UMENOS                      { $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_OPERACION.NEGATIVO); }
    | LPAR expresion RPAR                               { $$ = $2; }
    | DECIMAL                                           { $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.NUMERO); }
    | ENTERO                                            { $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.NUMERO); }
    | CADENA                                            { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA); }
    | RTRUE                                             { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOLEAN); }
    | RFALSE                                            { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOLEAN); }
    | RNULL                                             { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.NULL); }
    | RUNDEFINED                                        { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.UNDEFINED); }
    | ID                                                { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR); }
    ;
      