//Script para SweetAlert
document.getElementById("btnSalir").addEventListener("click", () => {
  Swal.fire({
    title: "¿Desea cerrar la sesión?",
    text: "Si cierra sesión tendrá que ingresar de nuevo con su PIN.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Sesión cerrada",
        text: "Ha cerrado su sesión correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        window.location.href = "login.html";
      });
    }
  });
});

// Redirección a otras páginas
document.getElementById("btnDeposito").onclick = function () {
  window.location.href = "deposito.html";
};
document.getElementById("btnConsultarSaldo").onclick = function () {
  window.location.href = "consultaDeSaldo.html";
};
document.getElementById("btnRetiro").onclick = function () {
  window.location.href = "retiro.html";
};
document.getElementById("btnPagoServicios").onclick = function () {
  window.location.href = "pago-servicios.html";
};
document.getElementById("btnHistorial").onclick = function () {
  window.location.href = "historial.html";
};
document.getElementById("btnAnalisisGrafico").onclick = function () {
  window.location.href = "reportes.html";
};