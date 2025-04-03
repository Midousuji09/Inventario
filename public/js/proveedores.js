function registrarProveedor() { 
    const action = "registroProveedor";
    const NombreProveedor = document.getElementById("NombreProveedor").value;
    const TelefonoProveedor = document.getElementById("TelefonoProveedor").value;
    const EmailProveedor = document.getElementById("EmailProveedor").value;
    const DireccionProveedor = document.getElementById("DireccionProveedor").value;
    
    fetch("../../controllers/php/proveedores.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, NombreProveedor, TelefonoProveedor, EmailProveedor, DireccionProveedor })
    })
    
    .then(response => response.json())
    .then(data => {
        let mensajeRegistro = document.getElementById("mensajeRegistro");
        mensajeRegistro.style.color = data.success ? "green" : "red";
        mensajeRegistro.textContent = data.success ? "Proveedor registrado con éxito" : "Error: " + data.message;
        mensajeRegistro.style.display = "block"; 

        if (data.success) {
            setTimeout(() => window.location.href = "../html/Vista_Proveedor.html", 2000);
        }
    })
    .catch(error => console.error("Error en fetch:", error));
}

function cargarProveedores() {
    fetch("../../controllers/php/proveedores.php?action=obtenerProveedores")
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tabla = document.querySelector("#tablaProveedores");
            tabla.innerHTML = ""; // Limpiar antes de insertar nuevos datos

            data.data.forEach(proveedor => {
                let fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${proveedor.IdProveedor}</td>
                    <td contenteditable="false">${proveedor.Nombre}</td>
                    <td contenteditable="false">${proveedor.Telefono}</td>
                    <td contenteditable="false">${proveedor.Email}</td>
                    <td contenteditable="false">${proveedor.Direccion}</td>
                    <td>
                        <button onclick="editarProveedor(${proveedor.IdProveedor}, this)">✏️ Editar</button>
                        <button onclick="eliminarProveedor(${proveedor.IdProveedor})" style="color: red;">🗑️ Eliminar</button>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        } else {
            console.error("Error al obtener proveedores:", data.message);
        }
    })
    .catch(error => console.error("Error en fetch:", error));
}

function editarProveedor(id, boton) {
    let fila = boton.parentNode.parentNode;
    let Nombre = fila.cells[1];
    let Telefono = fila.cells[2];
    let Email = fila.cells[3];
    let Direccion = fila.cells[4];

    if (boton.textContent === "✏️ Editar") {
        Nombre.contentEditable = Telefono.contentEditable = Email.contentEditable = Direccion.contentEditable = true;
        boton.textContent = "💾 Guardar";
        boton.classList.remove("btn-editar");
        boton.classList.add("btn-guardar");
    } else {
        let NombreProveedor = Nombre.textContent.trim();
        let TelefonoProveedor = Telefono.textContent.trim();
        let EmailProveedor = Email.textContent.trim();
        let DireccionProveedor = Direccion.textContent.trim();

        fetch("../../controllers/php/proveedores.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "editarProveedor", IdProveedor: id, NombreProveedor, TelefonoProveedor, EmailProveedor, DireccionProveedor })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Proveedor actualizado con éxito");
                Nombre.contentEditable = Telefono.contentEditable = Email.contentEditable = Direccion.contentEditable = false;
                boton.textContent = "✏️ Editar";
                boton.classList.remove("btn-guardar");
                boton.classList.add("btn-editar");
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error en fetch:", error));
    }
}

function eliminarProveedor(id) {
    if (!confirm("¿Estás seguro de eliminar este proveedor?")) return;

    fetch("../../controllers/php/proveedores.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "eliminarProveedor", IdProveedor: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Proveedor eliminado con éxito");
            cargarProveedores(); // Recargar lista después de eliminar
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => console.error("Error en fetch:", error));
}
// Cargar proveedores cuando se carga la página
document.addEventListener("DOMContentLoaded", cargarProveedores);
