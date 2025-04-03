let intentosRestantes = 3; 

function verificarLogin() {
    let action = "login";
    let Nombre = document.getElementById("NuevoNombre").value.trim();
    let pass = document.getElementById("pass").value.trim();
    let mensaje = document.getElementById("message");

    if (!Nombre || !pass) {
        mensaje.style.color = "red";
        mensaje.textContent = "Por favor, ingrese el usuario y la contraseña.";
        return;
    }

    fetch("../../controllers/php/Usuario1.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action, Nombre, pass })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mensaje.style.color = "green";
            mensaje.textContent = "Inicio de sesión exitoso.";
            
            setTimeout(() => {
                if (data.rol === "Comprador") {
                    window.location.href = "../../vistas/html/Vista_Comprador.html"; 
                } else {
                    window.location.href = "../../vistas/html/Inventario.html"; 
                }
            }, 2000);
        } else {
            intentosRestantes--;
            mensaje.style.color = "red";
            mensaje.textContent = "Error: " + data.message;

            if (intentosRestantes === 0) {
                mensaje.textContent = "Cuenta bloqueada. Inténtelo más tarde.";
                bloquearFormulario();
            }
        }
    })
    .catch(error => {
        console.error("Error en la petición:", error);
        mensaje.style.color = "red";
        mensaje.textContent = "Error al iniciar sesión. Inténtelo de nuevo.";
    });
}

function registrarUsuario() {
    const action = "registro";
    const NuevoNombre = document.getElementById("NuevoNombre").value;
    const NuevoApellido = document.getElementById("NuevoApellido").value;
    const NuevoCorreo = document.getElementById("NuevoCorreo").value;
    const NuevoTelefono = document.getElementById("NuevoTelefono").value;
    const NuevoRol = document.getElementById("NuevoRol").value;
    const NuevaPass = document.getElementById("NuevaPass").value;

    fetch("../../controllers/php/Usuario1.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action, NuevoNombre, NuevoApellido, NuevoCorreo, NuevoTelefono, NuevoRol, NuevaPass })
    })
    .then(response => response.json())
    .then(data => {
        const mensajeRegistro = document.getElementById("mensajeRegistro");
        if (data.success) {
            mensajeRegistro.style.color = "green";
            mensajeRegistro.textContent = "Registro Exitoso!";
        } else {
            mensajeRegistro.style.color = "red";
            mensajeRegistro.textContent = "Error: " + data.message;
        }
    })
    .catch(error => {
        console.error("Error en el registro:", error);
        document.getElementById("mensajeRegistro").textContent = "Error en el registro";
    });
}