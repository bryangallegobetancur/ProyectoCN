document.addEventListener('DOMContentLoaded', () => {
    // Referencias de elementos del DOM
    const csvInput = document.getElementById('csv-input');
    const btnLoadSample = document.getElementById('btn-load-sample');
    const btnRunSimulation = document.getElementById('btn-run-simulation');
    
    const countTotal = document.getElementById('count-total');
    const countValid = document.getElementById('count-valid');
    const countAnomalies = document.getElementById('count-anomalies');
    
    const snsNotifier = document.getElementById('sns-notifier');
    const snsAlertDesc = document.getElementById('sns-alert-desc');
    
    const tabTable = document.getElementById('tab-table');
    const tabJson = document.getElementById('tab-json');
    const contentTable = document.getElementById('content-table');
    const contentJson = document.getElementById('content-json');
    
    const simulationTableBody = document.querySelector('#simulation-table tbody');
    const jsonOutput = document.getElementById('json-output');

    // Dataset de ejemplo por defecto (igual a src/sample_data.csv)
    const defaultCSV = `id_transaccion,cliente,monto,fecha
TX-1001,Juan Perez,150.50,2026-08-01
TX-1002,Maria Gomez,3200.00,2026-08-02
TX-1003,Carlos Soto,75.25,2026-08-02
,Ana Lopez,450.00,2026-08-03
TX-1005,Luis Martinez,120.00,2026-08-03
TX-1006,Sofia Rodriguez,980.10,2026-08-04
TX-1007,Diego Sanchez,-50.00,2026-08-04
TX-1008,Elena Vazquez,620.40,2026-08-05
TX-1009,Javier Diaz,110.00,05/08/2026
TX-1010,Patricia Ruiz,340.85,2026-08-06`;

    // Cargar dataset por defecto al iniciar
    csvInput.value = defaultCSV;

    // Acción: Botón cargar ejemplo
    btnLoadSample.addEventListener('click', () => {
        csvInput.value = defaultCSV;
        resetResults();
    });

    // Acción: Cambiar de pestañas (Tabs)
    tabTable.addEventListener('click', () => {
        tabTable.classList.add('active');
        tabJson.classList.remove('active');
        contentTable.style.display = 'block';
        contentJson.style.display = 'none';
    });

    tabJson.addEventListener('click', () => {
        tabJson.classList.add('active');
        tabTable.classList.remove('active');
        contentTable.style.display = 'none';
        contentJson.style.display = 'block';
    });

    // Lógica principal: Simular Ejecución del Pipeline
    btnRunSimulation.addEventListener('click', () => {
        const csvText = csvInput.value.trim();
        if (!csvText) {
            alert('Por favor, ingresa contenido CSV válido para continuar.');
            return;
        }

        // Simular efecto de procesamiento rápido (delay de 600ms)
        btnRunSimulation.disabled = true;
        btnRunSimulation.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Ejecutando Lambda...';
        
        setTimeout(() => {
            runPipeline(csvText);
            btnRunSimulation.disabled = false;
            btnRunSimulation.innerHTML = '<i class="fa-solid fa-circle-play"></i> Iniciar Simulación de Pipeline';
        }, 600);
    });

    function resetResults() {
        countTotal.textContent = '0';
        countValid.textContent = '0';
        countAnomalies.textContent = '0';
        snsNotifier.classList.remove('active');
        simulationTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted);">
                    Haz clic en "Iniciar Simulación" para ver la validación por fila.
                </td>
            </tr>`;
        jsonOutput.textContent = '// La respuesta JSON estructurada de la función Lambda aparecerá aquí una vez ejecutada la simulación.';
    }

    function parseCSV(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length === 0) return { headers: [], rows: [] };

        // Extraer cabeceras
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(',');
            const rowObject = {};
            headers.forEach((header, index) => {
                rowObject[header] = currentLine[index] !== undefined ? currentLine[index].trim() : '';
            });
            rows.push({
                fila: i + 1,
                data: rowObject
            });
        }
        return { headers, rows };
    }

    function runPipeline(csvText) {
        const { headers, rows } = parseCSV(csvText);
        
        const processed = [];
        const anomalies = [];
        const tableRowsHTML = [];

        rows.forEach(item => {
            const rowData = item.data;
            const filaIndex = item.fila;

            const id_transaccion = rowData.id_transaccion || '';
            const cliente = rowData.cliente || '';
            const montoRaw = rowData.monto || '';
            const fechaRaw = rowData.fecha || '';

            let esValido = true;
            let errorMsg = '';

            // Validación 1: ID de transacción vacío
            if (!id_transaccion) {
                esValido = false;
                errorMsg = 'ID de transacción vacío';
            }
            // Validación 2: Cliente vacío
            else if (!cliente) {
                esValido = false;
                errorMsg = 'Cliente vacío';
            }
            // Validación 3: Monto
            else {
                const monto = parseFloat(montoRaw);
                if (isNaN(monto)) {
                    esValido = false;
                    errorMsg = `Monto no numérico (${montoRaw})`;
                } else if (monto < 0) {
                    esValido = false;
                    errorMsg = `Monto negativo (${montoRaw})`;
                }
            }

            // Validación 4: Formato de Fecha (YYYY-MM-DD)
            if (esValido) {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(fechaRaw)) {
                    esValido = false;
                    errorMsg = `Formato de fecha inválido (${fechaRaw})`;
                } else {
                    const parsedDate = Date.parse(fechaRaw);
                    if (isNaN(parsedDate)) {
                        esValido = false;
                        errorMsg = `Fecha inválida (${fechaRaw})`;
                    }
                }
            }

            if (esValido) {
                processed.push({
                    id_transaccion,
                    cliente,
                    monto: parseFloat(montoRaw),
                    fecha: fechaRaw
                });
                
                tableRowsHTML.push(`
                    <tr class="row-success">
                        <td>${filaIndex}</td>
                        <td>${id_transaccion}</td>
                        <td>${cliente}</td>
                        <td>$${parseFloat(montoRaw).toFixed(2)}</td>
                        <td>${fechaRaw}</td>
                        <td style="color: var(--success); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Válido y Guardado</td>
                    </tr>
                `);
            } else {
                anomalies.push({
                    fila: filaIndex,
                    datos_originales: rowData,
                    motivo: errorMsg
                });

                tableRowsHTML.push(`
                    <tr class="row-error">
                        <td>${filaIndex}</td>
                        <td style="color: var(--danger); font-style: italic;">${id_transaccion || '[VACÍO]'}</td>
                        <td>${cliente || '[VACÍO]'}</td>
                        <td>${montoRaw}</td>
                        <td>${fechaRaw}</td>
                        <td style="color: var(--danger); font-weight: 600;"><i class="fa-solid fa-circle-xmark"></i> Anomalía: ${errorMsg}</td>
                    </tr>
                `);
            }
        });

        // Actualizar contadores en la interfaz
        animateCounter(countTotal, rows.length);
        animateCounter(countValid, processed.length);
        animateCounter(countAnomalies, anomalies.length);

        // Renderizar tabla
        simulationTableBody.innerHTML = tableRowsHTML.join('');

        // Formatear respuesta simulada de la Lambda de AWS
        const lambdaResponse = {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: {
                success: true,
                origen: "Simulación de Interfaz (Frontend)",
                resumen: {
                    total_procesados: rows.length,
                    validos: processed.length,
                    anomalias: anomalies.length
                },
                registros_validos: processed,
                anomalias_detectadas: anomalies,
                alertas_disparadas: anomalies.length > 0
            }
        };

        jsonOutput.textContent = JSON.stringify(lambdaResponse, null, 2);

        // Activar notificación de alerta SNS si hay anomalías detectadas
        if (anomalies.length > 0) {
            snsAlertDesc.textContent = `Se detectaron ${anomalies.length} anomalías críticas en el archivo CSV ingresado. Notificación SNS enviada de inmediato a los administradores.`;
            snsNotifier.classList.add('active');
        } else {
            snsNotifier.classList.remove('active');
        }
    }

    // Función auxiliar para animar números de contadores
    function animateCounter(element, targetValue) {
        let currentValue = 0;
        const duration = 400; // ms
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = targetValue / steps;

        const interval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                element.textContent = targetValue;
                clearInterval(interval);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, stepTime);
    }
});
