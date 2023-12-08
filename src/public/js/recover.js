document.getElementById("changePasswordButton").addEventListener("click", async function () {
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const token = document.getElementById("token").innerText; 
    
    if (password !== password2) {
        alert("Las contraseñas no coinciden");
        return window.location.href = `${window.location.origin}/api/session/reset-password/${token}`;
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
            console.log("Contraseña restablecida con éxito");
            alert("Contraseña actualizada")
            window.location.href = `${window.location.origin}`;
        } else {
            // Maneja el caso en el que la solicitud no fue exitosa
            alert("La contraseña no puede ser igual a la anterior");
            return window.location.href = `${window.location.origin}/api/session/reset-password/${token}`;
        }
    } catch (error) {
        // Maneja errores de red u otros errores
        console.error("Error de red:", error);
    }
});
