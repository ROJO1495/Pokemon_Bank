// =========================================
// GESTOR DE ALMACENAMIENTO Y ESTADO GLOBAL
// =========================================

class StorageManager {
    constructor() {
        this.userKey = 'pokemonBankUser';
        this.historyKey = 'pokemonBankHistory';
        this.initializeData();
    }

    // Inicializar datos si no existen
    initializeData() {
        if (!this.getUserData()) {
            const initialUserData = {
                name: "Ash Ketchum",
                accountNumber: "1234-5678-9012",
                balance: 25750.00,
                lastUpdate: new Date().toISOString()
            };
            this.setUserData(initialUserData);
        }

        if (!this.getTransactionHistory()) {
            const initialHistory = [
                {
                    id: this.generateId(),
                    date: "2025-09-18",
                    time: "14:30",
                    type: "deposit",
                    description: "Depósito en efectivo",
                    location: "Sucursal Centro Pokémon",
                    reference: "DEP-20250918-001",
                    amount: +1500.00,
                    balance: 25750.00,
                    status: "completed"
                },
                {
                    id: this.generateId(),
                    date: "2025-09-17",
                    time: "10:15",
                    type: "withdrawal",
                    description: "Retiro de efectivo",
                    location: "ATM Plaza Kanto",
                    reference: "WTH-20250917-002",
                    amount: -800.00,
                    balance: 24250.00,
                    status: "completed"
                },
                {
                    id: this.generateId(),
                    date: "2025-09-16",
                    time: "16:45",
                    type: "payment",
                    description: "Pago Energía Eléctrica",
                    location: "ATM Centro Johto",
                    reference: "PAY-ELEC-789456123",
                    amount: -165.75,
                    balance: 25050.00,
                    status: "completed"
                }
            ];
            this.setTransactionHistory(initialHistory);
        }
    }

    // Generar ID único
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Obtener datos del usuario
    getUserData() {
        try {
            const data = localStorage.getItem(this.userKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            return null;
        }
    }

    // Guardar datos del usuario
    setUserData(userData) {
        try {
            userData.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.userKey, JSON.stringify(userData));
            this.updateUIElements();
            return true;
        } catch (error) {
            console.error('Error al guardar datos del usuario:', error);
            return false;
        }
    }

    // Obtener historial de transacciones
    getTransactionHistory() {
        try {
            const data = localStorage.getItem(this.historyKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al obtener historial:', error);
            return [];
        }
    }

    // Guardar historial de transacciones
    setTransactionHistory(history) {
        try {
            localStorage.setItem(this.historyKey, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Error al guardar historial:', error);
            return false;
        }
    }

    // Agregar nueva transacción
    addTransaction(transaction) {
        try {
            const history = this.getTransactionHistory();
            const userData = this.getUserData();
            
            // Actualizar saldo del usuario
            userData.balance += transaction.amount;
            this.setUserData(userData);

            // Agregar transacción al historial
            transaction.id = this.generateId();
            transaction.balance = userData.balance;
            transaction.date = new Date().toISOString().split('T')[0];
            transaction.time = new Date().toLocaleTimeString('es-SV', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            history.unshift(transaction);
            this.setTransactionHistory(history);

            return true;
        } catch (error) {
            console.error('Error al agregar transacción:', error);
            return false;
        }
    }

    // Actualizar elementos de la UI
    updateUIElements() {
        const userData = this.getUserData();
        if (!userData) return;

        // Actualizar elementos de saldo
        const balanceElements = document.querySelectorAll('.saldo, .account-balance, .stat-value');
        balanceElements.forEach(element => {
            if (element.textContent.includes('$') || element.classList.contains('account-balance')) {
                element.textContent = this.formatCurrency(userData.balance);
            }
        });

        // Actualizar información del usuario
        const userInfoElements = document.querySelectorAll('#user-info');
        userInfoElements.forEach(element => {
            element.textContent = `${userData.name} • Cuenta: ${userData.accountNumber} • Saldo: ${this.formatCurrency(userData.balance)}`;
        });

        // Actualizar estadísticas en reportes
        this.updateReports();
    }

    // Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-SV', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Actualizar reportes y gráficos
    updateReports() {
        if (typeof updateCharts === 'function') {
            updateCharts();
        }
    }

    // Realizar depósito
    async makeDeposit(amount, description = "Depósito en efectivo", location = "ATM Pokémon Bank") {
        if (amount <= 0) {
            throw new Error('El monto debe ser mayor a cero');
        }

        const transaction = {
            type: "deposit",
            description: description,
            location: location,
            reference: `DEP-${Date.now().toString().slice(-8)}`,
            amount: +amount,
            status: "completed"
        };

        return this.addTransaction(transaction);
    }

    // Realizar retiro
    async makeWithdrawal(amount, description = "Retiro de efectivo", location = "ATM Pokémon Bank") {
        const userData = this.getUserData();
        
        if (amount <= 0) {
            throw new Error('El monto debe ser mayor a cero');
        }

        if (userData.balance < amount) {
            throw new Error('Saldo insuficiente');
        }

        const transaction = {
            type: "withdrawal",
            description: description,
            location: location,
            reference: `WTH-${Date.now().toString().slice(-8)}`,
            amount: -amount,
            status: "completed"
        };

        return this.addTransaction(transaction);
    }

    // Realizar pago de servicio
    async makePayment(amount, service, provider, accountNumber, fee = 0) {
        const userData = this.getUserData();
        const total = amount + fee;

        if (userData.balance < total) {
            throw new Error('Saldo insuficiente para realizar el pago');
        }

        const transaction = {
            type: "payment",
            description: `Pago de ${service} - ${provider}`,
            location: "Pago en Línea",
            reference: `PAY-${provider.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-8)}`,
            amount: -total,
            details: {
                service: service,
                provider: provider,
                accountNumber: accountNumber,
                serviceAmount: amount,
                fee: fee
            },
            status: "completed"
        };

        return this.addTransaction(transaction);
    }

    // Obtener estadísticas para reportes
    getStats() {
        const history = this.getTransactionHistory();
        const userData = this.getUserData();

        const stats = {
            totalTransactions: history.length,
            deposits: history.filter(t => t.type === 'deposit').length,
            withdrawals: history.filter(t => t.type === 'withdrawal').length,
            payments: history.filter(t => t.type === 'payment').length,
            inquiries: history.filter(t => t.type === 'inquiry').length,
            totalDeposits: history.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
            totalWithdrawals: Math.abs(history.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0)),
            totalPayments: Math.abs(history.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0)),
            currentBalance: userData.balance
        };

        return stats;
    }
}

// Instancia global del gestor de almacenamiento
const storageManager = new StorageManager();

// =========================================
// FUNCIONES DE INICIALIZACIÓN PARA CADA PÁGINA
// =========================================

// Inicializar página de depósito
function initializeDepositPage() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const amountInput = document.getElementById('montoDeposito');
            const amount = parseFloat(amountInput.value);

            if (!amount || amount <= 0) {
                alert('Por favor ingrese un monto válido');
                return;
            }

            try {
                await storageManager.makeDeposit(amount);
                alert(`Depósito de ${storageManager.formatCurrency(amount)} realizado exitosamente`);
                amountInput.value = '';
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'PantallaAcciones.html';
                }, 2000);
                
            } catch (error) {
                alert('Error al realizar el depósito: ' + error.message);
            }
        });
    }

    // Actualizar saldo al cargar la página
    storageManager.updateUIElements();
}

// Inicializar página de retiro
function initializeWithdrawalPage() {
    let currentAmount = 0;

    // Elementos de la UI
    const amountDisplay = document.getElementById('amountDisplay');
    const quickAmounts = document.querySelectorAll('.quick-amount');
    const numpadBtns = document.querySelectorAll('.numpad-btn:not(.btn-clear)');
    const clearBtn = document.querySelector('.btn-clear');
    const confirmBtn = document.querySelector('.btn-confirm');

    // Botones de cantidad rápida
    quickAmounts.forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = parseFloat(this.getAttribute('data-amount'));
            currentAmount = amount;
            updateDisplay();
        });
    });

    // Teclado numérico
    numpadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.textContent;
            
            if (value === '.') {
                if (!currentAmount.toString().includes('.')) {
                    currentAmount = currentAmount.toString() + '.';
                }
            } else {
                if (currentAmount === 0) {
                    currentAmount = value;
                } else {
                    currentAmount = currentAmount.toString() + value;
                }
            }
            
            currentAmount = parseFloat(currentAmount) || 0;
            updateDisplay();
        });
    });

    // Botón limpiar
    clearBtn.addEventListener('click', function() {
        currentAmount = 0;
        updateDisplay();
    });

    // Botón confirmar
    confirmBtn.addEventListener('click', async function() {
        if (currentAmount <= 0) {
            alert('Por favor ingrese un monto válido');
            return;
        }

        try {
            await storageManager.makeWithdrawal(currentAmount);
            alert(`Retiro de ${storageManager.formatCurrency(currentAmount)} realizado exitosamente`);
            currentAmount = 0;
            updateDisplay();
            
            setTimeout(() => {
                window.location.href = 'PantallaAcciones.html';
            }, 2000);
            
        } catch (error) {
            alert('Error al realizar el retiro: ' + error.message);
        }
    });

    function updateDisplay() {
        amountDisplay.textContent = storageManager.formatCurrency(currentAmount);
    }

    storageManager.updateUIElements();
}

// Inicializar página de pagos de servicios
function initializeServicesPage() {
    // Esta función se integra con el código existente de pago-servicios.html
    const originalProcessPayment = window.processPayment;
    
    window.processPayment = async function() {
        if (!validateForm()) return;
        
        const amount = parseFloat(document.getElementById('paymentAmount').value);
        const fee = currentProvider.fee;
        const accountNumber = document.getElementById('accountNumber').value;
        
        try {
            await storageManager.makePayment(
                amount, 
                servicesData[currentService].title, 
                currentProvider.name, 
                accountNumber, 
                fee
            );
            
            // Mostrar mensaje de éxito
            Swal.fire({
                title: '¡Pago Exitoso!',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                resetForm();
                window.location.href = 'PantallaAcciones.html';
            });
            
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    storageManager.updateUIElements();
}

// Inicializar página de historial
function initializeHistoryPage() {
    // Reemplazar la fuente de datos del historial
    window.historialData = {
        user: storageManager.getUserData(),
        transactions: storageManager.getTransactionHistory()
    };

    storageManager.updateUIElements();
}

// Inicializar página de reportes
function initializeReportsPage() {
    function updateCharts() {
        const stats = storageManager.getStats();
        
        // Actualizar gráfico de pastel
        if (window.pieChart) {
            const total = stats.deposits + stats.withdrawals + stats.payments + stats.inquiries;
            const depositsPercent = total > 0 ? (stats.deposits / total) * 100 : 0;
            const withdrawalsPercent = total > 0 ? (stats.withdrawals / total) * 100 : 0;
            const paymentsPercent = total > 0 ? (stats.payments / total) * 100 : 0;
            const inquiriesPercent = total > 0 ? (stats.inquiries / total) * 100 : 0;

            window.pieChart.data.datasets[0].data = [
                depositsPercent,
                withdrawalsPercent, 
                paymentsPercent,
                inquiriesPercent
            ];
            window.pieChart.update();
        }

        // Actualizar leyenda
        const legendItems = document.querySelectorAll('.legend-item span');
        if (legendItems.length >= 4) {
            legendItems[0].textContent = `Depósitos ${Math.round(depositsPercent)}%`;
            legendItems[1].textContent = `Retiros ${Math.round(withdrawalsPercent)}%`;
            legendItems[2].textContent = `Pagos ${Math.round(paymentsPercent)}%`;
            legendItems[3].textContent = `Consultas ${Math.round(inquiriesPercent)}%`;
        }
    }

    window.updateCharts = updateCharts;
    storageManager.updateUIElements();
    updateCharts();
}

// Inicializar página de consulta de saldo
function initializeBalancePage() {
    storageManager.updateUIElements();
}

// =========================================
// DETECCIÓN AUTOMÁTICA DE PÁGINA
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || '';

    if (page.includes('deposito')) {
        initializeDepositPage();
    } else if (page.includes('retiro') || page.includes('retiros')) {
        initializeWithdrawalPage();
    } else if (page.includes('pago-servicios')) {
        initializeServicesPage();
    } else if (page.includes('historial')) {
        initializeHistoryPage();
    } else if (page.includes('reportes')) {
        initializeReportsPage();
    } else if (page.includes('consultaDeSaldo')) {
        initializeBalancePage();
    } else {
        // Página principal o otras páginas
        storageManager.updateUIElements();
    }
});

// =========================================
// FUNCIONES UTILITARIAS GLOBALES
// =========================================

// Función para formatear fecha
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-SV', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Función para formatear moneda (alias)
function formatCurrency(amount) {
    return storageManager.formatCurrency(amount);
}