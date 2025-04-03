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

    fetch("../controllers/Usuario1.php", {
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
                    window.location.href = "../vistas/Vista_Comprador.html"; 
                } else {
                    window.location.href = "../vistas/Inventario.html"; 
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

    fetch("../controllers/Usuario1.php", {
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
// Existing function to fetch and display profile data
function mostrarPerfil() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("perfilModal").style.display = "block";
    const action = "getPerfil";
    
    fetch("../controllers/Usuario1.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("nombre_usuario_perfil").value = data.nombre;
            document.getElementById("apellido_usuario_perfil").value = data.apellido;
            document.getElementById("email_usuario_perfil").value = data.email;
            document.getElementById("telefono_usuario_perfil").value = data.telefono;
            document.getElementById("rol_usuario_perfil").value = data.rol;
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al obtener los datos del perfil.");
    });
}

function cerrarPerfil() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('perfilModal').style.display = 'none';
}

function habilitar() {
    document.getElementById("nombre_usuario_perfil").disabled = false;
    document.getElementById("apellido_usuario_perfil").disabled = false;
    document.getElementById("email_usuario_perfil").disabled = false;
    document.getElementById("telefono_usuario_perfil").disabled = false;
    document.getElementById("rol_usuario_perfil").disabled = false;
}

function modificarPerfil() {
    const action = "modificar";
    const nombre = document.getElementById("nombre_usuario_perfil").value;
    const apellido = document.getElementById("apellido_usuario_perfil").value;
    const email = document.getElementById("email_usuario_perfil").value;
    const telefono = document.getElementById("telefono_usuario_perfil").value;
    const rol = document.getElementById("rol_usuario_perfil").value;

    fetch("../controllers/Usuario1.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action, nombre, apellido, email, telefono, rol })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Se modificaron los datos del usuario con éxito");
            // Disable form fields
            document.getElementById("nombre_usuario_perfil").disabled = true;
            document.getElementById("apellido_usuario_perfil").disabled = true;
            document.getElementById("email_usuario_perfil").disabled = true;
            document.getElementById("telefono_usuario_perfil").disabled = true;
            document.getElementById("rol_usuario_perfil").disabled = true;
            
            // Refresh profile data to ensure all information is displayed correctly
            refreshProfileData();
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error al modificar el perfil:", error);
        alert("Error al modificar el perfil. Por favor, inténtalo de nuevo más tarde.");
    });
}

// New function to refresh profile data after changes
function refreshProfileData() {
    const action = "getPerfil";
    
    fetch("../controllers/Usuario1.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("nombre_usuario_perfil").value = data.nombre;
            document.getElementById("apellido_usuario_perfil").value = data.apellido;
            document.getElementById("email_usuario_perfil").value = data.email;
            document.getElementById("telefono_usuario_perfil").value = data.telefono;
            document.getElementById("rol_usuario_perfil").value = data.rol;
        } else {
            console.error("Error refreshing profile data:", data.message);
        }
    })
    .catch(error => {
        console.error("Error refreshing profile data:", error);
    });
}
function cerrarSesion() {
    const action = "cerrarSesion";
    fetch('../controllers/Usuario1.php', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Sesión cerrada correctamente');
            window.location.href = '../vistas/IS.html'; // Redirigir al login
        } else {
            alert('Error al cerrar sesión: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cerrar sesión');
    });
}