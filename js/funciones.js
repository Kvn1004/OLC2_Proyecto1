function ejecutar() {
    var entrada = document.getElementById("txtEditor").value;
    var result = gramatica.parse(entrada);
    setConsola(result);
}

function setConsola(texto) {
    document.getElementById("txtConsola").value = texto;
}