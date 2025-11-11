// Variables globales
        let pinDigits = ['', '', '', ''];
        let currentPosition = 0;
        
        // Obtener elementos del DOM
        const digitInputs = document.querySelectorAll('.pin-digit');
        const numpadButtons = document.querySelectorAll('.numpad-btn[data-value]');
        const clearButton = document.getElementById('btn-clear');
        const backspaceButton = document.getElementById('btn-backspace');
        const loginButton = document.getElementById('btn-login');
        
        // Función para agregar un dígito al PIN
        function addDigit(digit) {
            if (currentPosition < 4) {
                pinDigits[currentPosition] = digit;
                digitInputs[currentPosition].value = digit;
                currentPosition++;
            }
        }
        
        // Función para borrar el último dígito
        function deleteDigit() {
            if (currentPosition > 0) {
                currentPosition--;
                pinDigits[currentPosition] = '';
                digitInputs[currentPosition].value = '';
            }
        }
        
        // Función para limpiar todo el PIN
        function clearPin() {
            pinDigits = ['', '', '', ''];
            currentPosition = 0;
            
            for (let i = 0; i < 4; i++) {
                digitInputs[i].value = '';
            }
        }
        
        // Función para verificar el PIN
        function checkPin() {
            const enteredPin = pinDigits.join('');
            
            // PIN correcto 
            const correctPin = "1234";
            
            if (enteredPin === correctPin) {
                
                // Usar SweetAlert para éxito
        Swal.fire({
            title: '¡Acceso concedido!',
            text: 'Redirigiendo al banco...',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 4000,
            timerProgressBar: true
        }).then(() => {
               window.location.href = "PantallaAcciones.html"; // Redirigir a la página del banco
        });
            } else {
                         // Usar SweetAlert para error
        Swal.fire({
            title: '¡Acceso denegado!',
            text: 'vuelva a intentarlo',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            timer: 4000,
            timerProgressBar: true
        }).then(() => {
                clearPin(); // Limpiar el PIN para reintentar
        });
        
            }
        }
        
        // Asignar eventos a los botones numéricos
        for (let button of numpadButtons) {
            button.addEventListener('click', function() {
                addDigit(this.getAttribute('data-value'));
            });
        }
        
        // Asignar evento al botón de borrar
        backspaceButton.addEventListener('click', deleteDigit);
        
        // Asignar evento al botón de limpiar
        clearButton.addEventListener('click', clearPin);
        
        // Asignar evento al botón de login
        loginButton.addEventListener('click', checkPin);
