// =========================================
// GESTOR DE ALMACENAMIENTO Y ESTADO GLOBAL
// =========================================

class StorageManager {
    constructor() {
        this.userKey = 'pokemonBankUser';
        this.transactionsKey = 'pokemonBankTransactions';
        this.initializeData();
    }

    // Inicializar datos del usuario si no existen
    initializeData() {
        if (!this.getUserData()) {
            const initialUserData = {
                nombre: "Ash Ketchum",
                pin: "1234",
                cuenta: "0987654321",
                saldoInicial: 500.00,
                saldoActual: 500.00,
                fechaCreacion: new Date().toISOString(),
                ultimoAcceso: null
            };
            this.setUserData(initialUserData);
        }

        if (!this.getTransactions()) {
            this.setTransactions([]);
        }
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
            localStorage.setItem(this.userKey, JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Error al guardar datos del usuario:', error);
            return false;
        }
    }

    // Obtener historial de transacciones
    getTransactions() {
        try {
            const data = localStorage.getItem(this.transactionsKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al obtener transacciones:', error);
            return [];
        }
    }

    // Guardar transacciones
    setTransactions(transactions) {
        try {
            localStorage.setItem(this.transactionsKey, JSON.stringify(transactions));
            return true;
        } catch (error) {
            console.error('Error al guardar transacciones:', error);
            return false;
        }
    }

    // Registrar nueva transacción
    recordTransaction(tipo, descripcion, monto, saldoResultante) {
        try {
            const transactions = this.getTransactions();
            const newTransaction = {
                id: Date.now(),
                fecha: new Date().toISOString(),
                tipo: tipo,
                descripcion: descripcion,
                monto: monto,
                saldoResultante: saldoResultante,
                estado: 'completada'
            };
            transactions.push(newTransaction);
            this.setTransactions(transactions);
            return newTransaction;
        } catch (error) {
            console.error('Error al registrar transacción:', error);
            return null;
        }
    }

    // Actualizar saldo del usuario
    updateBalance(nuevoSaldo) {
        try {
            const userData = this.getUserData();
            userData.saldoActual = nuevoSaldo;
            return this.setUserData(userData);
        } catch (error) {
            console.error('Error al actualizar saldo:', error);
            return false;
        }
    }

    // Validar PIN
    validatePin(pin) {
        const userData = this.getUserData();
        return userData && userData.pin === pin;
    }

    // Actualizar último acceso
    updateLastAccess() {
        const userData = this.getUserData();
        userData.ultimoAcceso = new Date().toISOString();
        this.setUserData(userData);
    }

    // Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-SV', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}

// Instancia global del gestor de almacenamiento
const storageManager = new StorageManager();