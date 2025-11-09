// Datos del usuario
        const usuario = {
            nombre: "Ash Ketchum",
            pin: "1234",
            cuenta: "0987654321",
            saldo: 500.00
        };

        // Función para verificar todas las credenciales
        function verificarCredenciales() {
            const nameInput = document.getElementById('nameInput');
            const pinInput = document.getElementById('pinInput');
            const accountInput = document.getElementById('accountInput');
            const errorMessage = document.getElementById('loginErrorMessage');
            
            const nombre = nameInput.value.trim();
            const pin = pinInput.value;
            const cuenta = accountInput.value.trim();

            // Verificar todas las credenciales
            if (nombre.toLowerCase() === usuario.nombre.toLowerCase() && 
                pin === usuario.pin && 
                cuenta === usuario.cuenta) {
                
                // Credenciales correctas - Usar SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: '¡Acceso concedido!',
                    text: `Bienvenido ${usuario.nombre}`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    // Guardar en localStorage
                    localStorage.setItem('usuario', JSON.stringify(usuario));
                    localStorage.setItem('logueado', 'true');
                    localStorage.setItem('ultimoAcceso', new Date().toISOString());
                    
                    //Pagina principal del cajero
                    window.location.href = 'PantallaAcciones.html';
                });
                
                errorMessage.classList.add('hidden');
            } else {
                // Credenciales incorrectas
                Swal.fire({
                    icon: 'error',
                    title: 'Credenciales incorrectas',
                    text: 'Por favor, verifique sus datos',
                    timer: 3000,
                    showConfirmButton: false
                });
                
                errorMessage.classList.remove('hidden');
                limpiarFormularioLogin();
                nameInput.focus();
            }
        }

        // Función para limpiar el formulario de login
        function limpiarFormularioLogin() {
            document.getElementById('nameInput').value = '';
            document.getElementById('pinInput').value = '';
            document.getElementById('accountInput').value = '';
        }

        // Permitir enviar con Enter en el formulario de login
        document.getElementById('nameInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('pinInput').focus();
            }
        });

        document.getElementById('pinInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('accountInput').focus();
            }
        });

        document.getElementById('accountInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verificarCredenciales();
            }
        });

        // Verificar si ya está logueado al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            const logueado = localStorage.getItem('logueado');
            if (logueado === 'true') {
                // Si ya está logueado, redirigir a la página principal
                window.location.href = 'index.html';
            }
        });
