const loginForm = document.getElementById("login-form");
  
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    login(username, password)});

    async function login(username, password) {
      const response = await fetch("/api/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
    
      const data = await response.json();


      if(data.status === "OK"){
        const cartId = data.cartId;
        setTimeout(()=>{
           window.location.href = `http://localhost:8080/api/products/?cartId=${cartId}`
         },200)
    }else{
        alert("Usuario no válido")
    }
    }