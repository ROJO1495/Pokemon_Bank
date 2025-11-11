import { UserDataManager } from './LoginScript.js';

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const userManager = new UserDataManager();
    const datos = userManager.getUserData();

    if (datos) {
        // DATOS PARA OTRAS PÁGINAS
        document.getElementById('nombre').textContent = datos.nombre;
        document.getElementById('cuenta').textContent = datos.cuenta;
        document.getElementById('saldo').textContent = "$ " + datos.saldoActual;
    } else {
        console.error('No se encontraron datos del usuario');
    }
});