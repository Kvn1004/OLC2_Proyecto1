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

"+"                 return 'MAS';
"-"                 return 'MENOS';
"*"                 return 'MUL';
"/"                 return 'DIV';
"**"                return 'POT';
"%"                 return 'MOD';
"="                 return 'IGUAL';
"("                 return 'LPAR';
")"                 return 'RPAR';
"["                 return 'LCOR';
"]"                 return 'RCOR';
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
      declaracion {$$ = $1;}
    | error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
    ;

declaracion : 
      tipo_var ID IGUAL expresion PUNTOCOMA { $$ = "sucess";}
    | tipo_var ID DOSPUNTOS tipo_dato IGUAL expresion PUNTOCOMA { $$ = "sucess2";}
    ;

tipo_var : 
      RLET
    | RCONS
    ;

tipo_dato :
      RNUMBER
    | RSTRING
    | RBOOLEAN
    | RVOID
    | ID
    ;

expresion :
      expresion TERNARIO expresion DOSPUNTOS expresion
    | expresion AND expresion
    | expresion OR expresion
    | NOT expresion %prec NOT
    | expresion DIGUAL expresion
    | expresion NOIGUAL expresion
    | expresion MAYOR expresion
    | expresion MAYORIGUAL expresion
    | expresion MENOR expresion
    | expresion MENORIGUAL expresion
    | expresion MOD expresion
    | expresion POT expresion
    | expresion MUL expresion
    | expresion DIV expresion
    | expresion MAS expresion
    | expresion MENOS expresion
    | MENOS expresion %prec UMENOS
    | LPAR expresion RPAR
    | DECIMAL
    | ENTERO
    | CADENA
    | RTRUE
    | RFALSE
    | RNULL
    | RUNDEFINED
    | ID
    ;
      