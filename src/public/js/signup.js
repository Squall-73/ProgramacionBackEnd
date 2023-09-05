async function postSignup(first_name, last_name, age, username, password) {
    const data = {
      first_name,
      last_name,
      age,
      email: username,
      password,

    };
  
    console.log("all  the data", data);
    const response = await fetch("/api/session/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    const datos = await response.json();
    if (datos.status === "OK") {
      const cartId = datos.cartId;
       setTimeout(()=>{
         const redirectUrl = `http://localhost:8080/api/products/?cartId=${cartId}`;
         window.location.replace(redirectUrl);
        },200)
    }
    
  }
  
  const signupForm = document.getElementById("signup-form");
  
  signupForm.addEventListener("submit", function (event) {
    console.log("tracking");
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const age = document.getElementById("age").value;
  
    postSignup(first_name, last_name, age, username, password);

  });