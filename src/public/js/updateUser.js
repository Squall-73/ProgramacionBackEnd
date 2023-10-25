document.getElementById("update-user").addEventListener("click", async function () {
    let user = document.getElementById("user").value;
    
    console.log(user)
    try {
        let response = await fetch("/api/session/updateUser/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user }),
        });
        if(response.ok){
            history.back();  
        }
} catch (error) {
    // Maneja errores de red u otros errores
    console.error("Error de red:", error);
}
});

document.getElementById("go-back").addEventListener("click", function () {
    history.back();
});