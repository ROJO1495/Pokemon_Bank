
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM cargado, inicializando reportes...");
    
    // Verificar que Chart.js esté disponible
    if (typeof Chart === 'undefined') {
        console.error("❌ Chart.js no está cargado!");
        alert("Error: Chart.js no se cargó correctamente. Verifica tu conexión a internet.");
        return;
    }
    console.log("✅ Chart.js está disponible");

    // Verificar que los canvas existan
    const canvas1 = document.getElementById("graficoDistribucion");
    const canvas2 = document.getElementById("graficoMensual");
    const canvas3 = document.getElementById("graficoSaldo");
    
    console.log("Canvas encontrados:", {
        distribucion: !!canvas1,
        mensual: !!canvas2,
        saldo: !!canvas3
    });

    if (!canvas1 || !canvas2 || !canvas3) {
        console.error("❌ No se encontraron todos los canvas");
        return;
    }

    // Intentar cargar datos reales del usuario desde pokemonBankTransactions
    let transacciones = [];
    
    try {
        console.log("🔍 Buscando transacciones en localStorage...");
        
        // Método 1: Buscar en pokemonBankTransactions (tu estructura real)
        const pokemonTransactions = localStorage.getItem('pokemonBankTransactions');
        if (pokemonTransactions) {
            const data = JSON.parse(pokemonTransactions);
            console.log("📦 Datos encontrados en pokemonBankTransactions:", data);
            
            if (Array.isArray(data) && data.length > 0) {
                // Convertir al formato esperado por los gráficos
                transacciones = data.map(t => {
                    // Determinar el tipo basado en la descripción o tipo
                    let type = 'deposit';
                    const tipoLower = (t.tipo || '').toLowerCase();
                    const descLower = (t.descripcion || '').toLowerCase();
                    
                    console.log(`Analizando transacción: tipo="${t.tipo}", desc="${t.descripcion}", monto=${t.monto}`);
                    
                    // Detectar retiros
                    if (tipoLower.includes('retiro') || 
                        descLower.includes('retiro') || 
                        tipoLower === 'withdrawal') {
                        type = 'withdrawal';
                    } 
                    // Detectar pagos (múltiples variaciones)
                    else if (tipoLower.includes('pago') || 
                             descLower.includes('pago') ||
                             tipoLower.includes('payment') ||
                             descLower.includes('payment') ||
                             tipoLower.includes('servicio') ||
                             descLower.includes('servicio') ||
                             tipoLower.includes('factura') ||
                             descLower.includes('factura') ||
                             tipoLower.includes('tarjeta') ||
                             descLower.includes('tarjeta')) {
                        type = 'payment';
                    } 
                    // Detectar depósitos
                    else if (tipoLower.includes('deposito') || 
                             tipoLower.includes('depósito') || 
                             descLower.includes('deposito') ||
                             descLower.includes('depósito') ||
                             tipoLower === 'deposit' ||
                             t.monto > 0) {
                        type = 'deposit';
                    }
                    // Si el monto es negativo y no es retiro, probablemente sea pago
                    else if (t.monto < 0) {
                        type = 'payment';
                    }
                    
                    console.log(`  → Tipo detectado: ${type}`);
                    
                    return {
                        type: type,
                        amount: Math.abs(t.monto || 0),
                        date: t.fecha || new Date().toISOString(),
                        description: t.descripcion || '',
                        id: t.id
                    };
                });
                console.log("✅ Transacciones convertidas:", transacciones);
            }
        }
        
        // Método 2: Buscar en currentUser como respaldo
        if (transacciones.length === 0) {
            const currentUser = localStorage.getItem('pokemonBankUser');
            if (currentUser) {
                const userData = JSON.parse(currentUser);
                console.log("👤 Datos del usuario:", userData);
                
                if (userData.transactions && Array.isArray(userData.transactions)) {
                    transacciones = userData.transactions.map(t => ({
                        type: t.type || t.tipo || 'deposit',
                        amount: Math.abs(t.amount || t.monto || 0),
                        date: t.date || t.fecha || new Date().toISOString(),
                        description: t.description || t.descripcion || ''
                    }));
                    console.log("✅ Transacciones encontradas en userData:", transacciones.length);
                }
            }
        }
        
        // Verificar que las transacciones tengan el formato correcto
        if (transacciones.length > 0) {
            console.log("📊 Total de transacciones cargadas:", transacciones.length);
            console.log("📋 Muestra de transacciones:", transacciones.slice(0, 3));
        }
        
    } catch (error) {
        console.error("❌ Error al cargar datos del usuario:", error);
    }

    // Si no hay transacciones, usar datos de ejemplo
    if (!transacciones || transacciones.length === 0) {
        console.warn("⚠️ No hay transacciones reales. Usando datos de ejemplo...");
        transacciones = [
            { type: 'deposit', amount: 1000, date: '2024-01-15', description: 'Depósito inicial' },
            { type: 'withdrawal', amount: -200, date: '2024-01-20', description: 'Retiro ATM' },
            { type: 'payment', amount: -150, date: '2024-02-10', description: 'Pago de servicio' },
            { type: 'deposit', amount: 500, date: '2024-02-15', description: 'Depósito mensual' },
            { type: 'withdrawal', amount: -300, date: '2024-03-05', description: 'Retiro' },
            { type: 'deposit', amount: 800, date: '2024-03-20', description: 'Depósito' },
            { type: 'payment', amount: -100, date: '2024-04-12', description: 'Pago tarjeta' }
        ];
    }

    // Inicializar gráficos
    console.log("📊 Iniciando renderizado de gráficos...");
    renderGraficos(transacciones);
});

function renderGraficos(transacciones) {
    console.log("🎨 Renderizando gráficos con", transacciones.length, "transacciones");

    // === Agrupar datos por tipo ===
    const tipos = { deposit: 0, withdrawal: 0, payment: 0 };

    transacciones.forEach(t => {
        const amount = Math.abs(t.amount); 
        
        // Contar por tipo
        if (t.type === 'deposit') {
            tipos.deposit += amount;
        } else if (t.type === 'withdrawal') {
            tipos.withdrawal += amount;
        } else if (t.type === 'payment') {
            tipos.payment += amount;
        }
    });

    console.log("📊 Tipos agrupados:", tipos);

    // Verificar que haya datos para mostrar
    const totalMovimientos = tipos.deposit + tipos.withdrawal + tipos.payment;
    if (totalMovimientos === 0) {
        console.warn("⚠️ No hay movimientos para mostrar en el gráfico de distribución");
    }

    // === GRÁFICO 1: Distribución general (Doughnut) ===
    try {
        const ctxDistribucion = document.getElementById("graficoDistribucion");
        if (ctxDistribucion) {
            console.log("🎨 Creando gráfico de distribución...");
            
            new Chart(ctxDistribucion, {
                type: "doughnut",
                data: {
                    labels: ["Depósitos", "Retiros", "Pagos"],
                    datasets: [{
                        data: [tipos.deposit, tipos.withdrawal, tipos.payment],
                        backgroundColor: [
                            "#36A2EB",
                            "#FF6384", 
                            "#FFCE56"
                        ],
                        borderWidth: 2,
                        borderColor: "#fff"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { 
                            position: "bottom",
                            labels: {
                                padding: 15,
                                font: { size: 12 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    return `${label}: $${value.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });
            console.log("✅ Gráfico de distribución creado");
        }
    } catch (error) {
        console.error("❌ Error al crear gráfico de distribución:", error);
    }

    
    try {
        const movimientosPorMes = {};
        transacciones.forEach(t => {
            const fecha = new Date(t.date);
            const mes = fecha.toLocaleString("es-SV", { month: "short", year: "numeric" });
            movimientosPorMes[mes] = (movimientosPorMes[mes] || 0) + Math.abs(t.amount);
        });

        console.log("📊 Movimientos por mes:", movimientosPorMes);

        const ctxMovimientos = document.getElementById("graficoMensual");
        if (ctxMovimientos) {
            console.log("🎨 Creando gráfico mensual...");
            
            new Chart(ctxMovimientos, {
                type: "bar",
                data: {
                    labels: Object.keys(movimientosPorMes),
                    datasets: [{
                        label: "Movimientos por mes ($)",
                        data: Object.values(movimientosPorMes),
                        backgroundColor: "#4bc0c0",
                        borderColor: "#36a2a2",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { 
                        y: { 
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toFixed(0);
                                }
                            }
                        }
                    },
                    plugins: { 
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Movimientos: $${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });
            console.log("✅ Gráfico mensual creado");
        }
    } catch (error) {
        console.error("❌ Error al crear gráfico mensual:", error);
    }

    
    try {
    
        let saldoActual = 0;
        const userData = localStorage.getItem('pokemonBankUser');
        if (userData) {
            const user = JSON.parse(userData);
            saldoActual = user.saldoInicial || 500;
            console.log("💰 Saldo inicial:", saldoActual);
        }
        
        const saldoEvolucion = [{ fecha: null, saldo: saldoActual }];

        
        const transaccionesOrdenadas = [...transacciones].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );

        transaccionesOrdenadas.forEach(t => {
            if (t.type === 'deposit') {
                saldoActual += t.amount;
            } else if (t.type === 'withdrawal' || t.type === 'payment') {
                saldoActual -= t.amount;
            }
            
            saldoEvolucion.push({ 
                fecha: t.date, 
                saldo: saldoActual 
            });
        });

        console.log("📊 Evolución del saldo:", saldoEvolucion);

        const ctxEvolucion = document.getElementById("graficoSaldo");
        if (ctxEvolucion) {
            console.log("🎨 Creando gráfico de evolución...");
            
            new Chart(ctxEvolucion, {
                type: "line",
                data: {
                    labels: saldoEvolucion.map((e, index) => {
                        if (index === 0 && !e.fecha) {
                            return 'Inicio';
                        }
                        const fecha = new Date(e.fecha);
                        return fecha.toLocaleDateString("es-SV", { 
                            day: '2-digit', 
                            month: 'short',
                            year: '2-digit'
                        });
                    }),
                    datasets: [{
                        label: "Saldo ($)",
                        data: saldoEvolucion.map(e => e.saldo.toFixed(2)),
                        borderColor: "#9966FF",
                        backgroundColor: "rgba(153, 102, 255, 0.1)",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { 
                        y: { 
                            beginAtZero: false,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toFixed(0);
                                }
                            }
                        }
                    },
                    plugins: { 
                        legend: { 
                            position: "bottom",
                            labels: {
                                padding: 15,
                                font: { size: 12 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Saldo: $${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });
            console.log("✅ Gráfico de evolución creado");
        }
    } catch (error) {
        console.error("❌ Error al crear gráfico de evolución:", error);
    }

    console.log("🎉 Todos los gráficos han sido renderizados exitosamente");
}

// === Función global para actualizar reportes desde otras páginas ===
window.actualizarReportes = function() {
    console.log("🔄 Actualizando reportes...");
    location.reload();
}