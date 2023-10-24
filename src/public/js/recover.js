document.getElementById("changePasswordButton").addEventListener("click", async function () {
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const token = document.getElementById("token").innerText; 
    
    if (password !== password2) {
        console.error("Las contraseñas no coinciden");
        return;
    }

    try {
        const response = await fetch("/api/session/reset-password/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password, password2 }),
        });

        if (response.ok) {
            // La solicitud fue exitosa, realiza acciones necesarias (redirigir, mostrar un mensaje, etc.)
            console.log("Contraseña restablecida con éxito");
            alert("Contraseña actualizada")
            window.location.href = 'http://localhost:8080';
        } else {
            // Maneja el caso en el que la solicitud no fue exitosa
            console.error("Error al restablecer la contraseña");
        }
    } catch (error) {
        // Maneja errores de red u otros errores
        console.error("Error de red:", error);
    }
});
