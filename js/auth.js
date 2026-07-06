$(document).ready(function() {
    // Definir un usuario de prueba en el sistema
    const usuarioDemo = {
        email: "test@wallet.com",
        password: "123",
        nombre: "Juan Pérez",
        saldoInicial: 150500
    };

    // Inicializar datos globales en el navegador si no existen
    if (!localStorage.getItem("userSession")) {
        if (!localStorage.getItem("currentBalance")) {
            localStorage.setItem("currentBalance", usuarioDemo.saldoInicial);
        }
        if (!localStorage.getItem("transactionHistory")) {
            localStorage.setItem("transactionHistory", JSON.stringify([]));
        }
    }

    // Manejo del evento de Login al presionar ingresar
    $("#loginForm").on("submit", function(event) {
        event.preventDefault(); // Evita recargar la página

        const inputEmail = $("#email").val().trim();
        const inputPassword = $("#password").val();

        if (inputEmail === usuarioDemo.email && inputPassword === usuarioDemo.password) {
            $("#loginError").addClass("d-none");

            // Guardar sesión activa temporalmente
            const sessionData = {
                nombre: usuarioDemo.nombre,
                email: usuarioDemo.email
            };
            localStorage.setItem("userSession", JSON.stringify(sessionData));

            // Redirigir al Menú Principal
            window.location.href = "dashboard.html";
        } else {
            // Mostrar error si las credenciales fallan
            $("#loginError").removeClass("d-none");
        }
    });
});
