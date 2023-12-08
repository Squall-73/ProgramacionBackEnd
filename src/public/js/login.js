let loginForm = document.getElementById("login-form");
  
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    login(username, password)});
    let urlParams = new URLSearchParams(window.location.search);
    let mailSent = urlParams.get('mailSent');
    if (mailSent === 'true') {
      
      alert('¡Correo enviado con éxito! Revise su correo electrónico para restablecer su contraseña.')};
  
    async function login(username, password) {
      let response = await fetch("/api/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
    
      let data = await response.json();


      if(data.status === "OK"){
        let cartId = data.cartId;
        setTimeout(()=>{
          window.location.href = `${window.location.origin}/api/products/?cartId=${cartId}`;
         },200)
    }else{
        alert("Usuario no válido")
    }
    }