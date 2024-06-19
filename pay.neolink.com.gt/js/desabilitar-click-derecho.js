// Deshabilitar inspeccionar y Opciones de texto
document.onkeydown = desabilitar; // Teclas Presionadas
document.onselectstart = selecionar; //Anular la Selecion de Texto
document.oncontextmenu = selecionar; //Anular el Boton Derrecho del Mouse
function selecionar() {
    return false;
}

function desabilitar() {
    if (event.ctrlKey) {
        switch (window.event.keyCode) {
            case 67: //Ctrl-C -- Copiar ---
            case 85: //Ctrl-U -- Codigo Fuente ---
            case 86: //Ctrl-V -- Pegar ---
                event.keyCode = 0;
                return false;
            default:
                break;
        }
    }
}