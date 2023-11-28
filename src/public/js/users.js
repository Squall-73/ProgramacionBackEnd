document.addEventListener('DOMContentLoaded', function () {
    const backButton = document.getElementById('go-back');
    const modifyUserButtons = document.querySelectorAll('.modify-user');
    const deleteUserButtons = document.querySelectorAll('.delete-user');
    document.getElementById("go-back").addEventListener("click", function () {
      history.back();
    });
    modifyUserButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const userId = this.dataset.userid;
        try {
            const response = await fetch(`/api/users/${userId}/changerole`, {
                method: "POST",
                
            });

            if (response.ok) {
                window.location.reload(); 
            } else {
                
                console.error("Error al cambiar el rol del usuario");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    
      });
});

deleteUserButtons.forEach(button => {
    button.addEventListener("click", async function () {
        const userId = this.dataset.userid;
    try {
        const response = await fetch(`/api/users/${userId}/delete`, {
            method: "DELETE",
            
        });

        if (response.ok) {
            window.location.reload(); 
        } else {
            
            console.error("Error al eliminar usuario");
        }
    } catch (error) {
        console.error("Error de red:", error);
    }

  });
});
});