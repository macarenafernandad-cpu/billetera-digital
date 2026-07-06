$(document).ready(function() {
    // SEGURIDAD: Si no hay sesión iniciada, devuelve al login
    const session = localStorage.getItem("userSession");
    if (!session) {
        window.location.href = "index.html";
        return;
    }

    const usuarioActivo = JSON.parse(session);

    // Mostrar nombre del usuario en pantalla
    if ($("#userNameDisplay").length) {
        $("#userNameDisplay").text(`Bienvenido, ${usuarioActivo.nombre}`);
    }

    // Formatear números a moneda ($150.500)
    function formatearMoneda(monto) {
        return '$' + parseFloat(monto).toLocaleString('es-CL');
    }

    // Actualizar el saldo visible
    function actualizarVistaSaldo() {
        if ($("#balanceDisplay").length) {
            const saldoActual = localStorage.getItem("currentBalance") || 0;
            $("#balanceDisplay").text(formatearMoneda(saldoActual));
        }
    }
    actualizarVistaSaldo();

    // FORMULARIO DE DEPÓSITO
    $("#depositForm").on("submit", function(e) {
        e.preventDefault();
        const monto = parseFloat($("#depositAmount").val());
        
        if (monto > 0) {
            const saldoActual = parseFloat(localStorage.getItem("currentBalance")) || 0;
            localStorage.setItem("currentBalance", saldoActual + monto);
            registrarTransaccion("Depósito", "Carga de fondos", monto, "ingreso");
            alert("¡Depósito realizado con éxito!");
            window.location.href = "dashboard.html";
        }
    });

    // FORMULARIO DE ENVÍO
    $("#sendForm").on("submit", function(e) {
        e.preventDefault();
        const destinatario = $("#recipientEmail").val().trim();
        const monto = parseFloat($("#sendAmount").val());
        const saldoActual = parseFloat(localStorage.getItem("currentBalance")) || 0;

        if (monto > saldoActual) {
            alert("Fondos insuficientes.");
            return;
        }

        if (monto > 0) {
            localStorage.setItem("currentBalance", saldoActual - monto);
            registrarTransaccion("Envío", `Transferencia a: ${destinatario}`, monto, "egreso");
            alert("¡Envío realizado con éxito!");
            window.location.href = "dashboard.html";
        }
    });

    // SISTEMA DE HISTORIAL
    function registrarTransaccion(tipo, detalle, monto, categoria) {
        const historial = JSON.parse(localStorage.getItem("transactionHistory")) || [];
        historial.unshift({
            fecha: new Date().toLocaleString('es-CL'),
            tipo: tipo,
            detalle: detalle,
            monto: monto,
            categoria: categoria
        });
        localStorage.setItem("transactionHistory", JSON.stringify(historial));
    }

    // Renderizar la tabla en historial.html
    if ($("#transactionTableBody").length) {
        const historial = JSON.parse(localStorage.getItem("transactionHistory")) || [];
        if (historial.length > 0) {
            $("#transactionTableBody").empty();
            historial.forEach(function(tx) {
                const clase = tx.categoria === "ingreso" ? "text-success fw-bold" : "text-danger fw-bold";
                const signo = tx.categoria === "ingreso" ? "+" : "-";
                $("#transactionTableBody").append(`
                    <tr>
                        <td>${tx.fecha}</td>
                        <td><span class="badge ${tx.categoria === 'ingreso' ? 'bg-success' : 'bg-danger'}">${tx.tipo}</span></td>
                        <td>${tx.detalle}</td>
                        <td class="text-end ${clase}">${signo} ${formatearMoneda(tx.monto)}</td>
                    </tr>
                `);
            });
        }
    }

    // CERRAR SESIÓN
    $("#logoutBtn").on("click", function() {
        localStorage.removeItem("userSession");
        window.location.href = "index.html";
    });
});
