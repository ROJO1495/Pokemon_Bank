// Datos especificos para historial (version simplificada de sample-data.js)
const historialData = {
    user: {
        name: "Ash Ketchum",
        accountNumber: "1234-5678-9012",
        balance: 25750.00
    },
    transactions: [
        {
            id: 1,
            date: "2025-09-18",
            time: "14:30",
            type: "deposit",
            description: "Depósito en efectivo",
            location: "Sucursal Centro",
            amount: +1500.00,
            balance: 25750.00
        },
        // ... mas transacciones
    ]
};

// Funciones esenciales para historial
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-SV', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-SV');
}

function getFilteredTransactions(filters = {}) {
    let transactions = [...historialData.transactions];

    if (filters.type && filters.type !== 'all') {
        transactions = transactions.filter(t => t.type === filters.type);
    }

    if (filters.dateFrom) {
        transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    }

    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function calculateStats(transactions) {
    const stats = {
        total: transactions.length,
        deposits: 0,
        withdrawals: 0,
        payments: 0,
        depositAmount: 0,
        withdrawalAmount: 0,
        paymentAmount: 0
    };

    transactions.forEach(t => {
        const amount = Math.abs(t.amount);
        switch (t.type) {
            case 'deposit':
                stats.deposits++;
                stats.depositAmount += amount;
                break;
            case 'withdrawal':
                stats.withdrawals++;
                stats.withdrawalAmount += amount;
                break;
            case 'payment':
                stats.payments++;
                stats.paymentAmount += amount;
                break;
        }
    });

    return stats;
}

// Renderizar historial (llamar desde historial.html)
function renderHistorial() {
    const transactions = getFilteredTransactions();
    const stats = calculateStats(transactions);
}