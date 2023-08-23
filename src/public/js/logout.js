async function logout() {
    const response = await fetch("/api/session/logout", {
      method: "POST",
    });
  
    const result = await response.json();
    return result;
  }
  
  const logoutButton = document.getElementById("logout-button");
  
  logoutButton.addEventListener("click", async () => {
    const response = await logout();
    if (response.respuesta === "ok") {
      window.location.href = "http://localhost:8080/"; 
    }
  });