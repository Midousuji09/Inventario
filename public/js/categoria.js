function guardarCategoria() {
    const action = "registroCategoria";
    const nombreCategoria = document.getElementById("nombreCategoria").value;
    const descripcionCategoria = document.getElementById("descripcionCategoria").value;

    fetch("../../controllers/php/categoria.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, nombreCategoria, descripcionCategoria })
    })
    .then(response => response.json())
    .then(data => {
        const mensajeCategoria = document.getElementById("mensajeCategoria");
        mensajeCategoria.style.color = data.success ? "green" : "red";
        mensajeCategoria.textContent = data.success ? "Categoría registrada con éxito" : "Error: " + data.message;
    })
    .catch(error => console.error("Error en fetch:", error));
}
function cargarCategoria() {
    fetch("../../controllers/php/categoria.php?action=obtenerCategoria")
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tabla = document.querySelector("#tablaCategoria");
            tabla.innerHTML = ""; // Limpiar antes de insertar nuevos datos

            data.data.forEach(categoria => {
                let fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${categoria.IdCategoria}</td>
                    <td contenteditable="false">${categoria.Nombre}</td>
                    <td contenteditable="false">${categoria.Descripcion}</td>
                    <td>
                        <button onclick="editarCategoria(${categoria.IdCategoria}, this)">✏️ Editar</button>
                        <button onclick="eliminarCategoria(${categoria.IdCategoria})" style="color: red;">🗑️ Eliminar</button>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        } else {
            console.error("Error al obtener Categoria:", data.message);
        }
    })
    .catch(error => console.error("Error en fetch:", error));
}

function editarCategoria(id, boton) {
    let fila = boton.parentNode.parentNode;
    let Nombre = fila.cells[1];
    let Descripcion = fila.cells[2];

    if (boton.textContent === "✏️ Editar") {
        Nombre.contentEditable = Descripcion.contentEditable = true;
        boton.textContent = "💾 Guardar";
        boton.classList.remove("btn-editar");
        boton.classList.add("btn-guardar");
    } else {
        let nombreCategoria = Nombre.textContent.trim();
        let descripcionCategoria = Descripcion.textContent.trim();

        fetch("../../controllers/php/categoria.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "editarCategoria", IdCategoria: id, nombreCategoria, descripcionCategoria })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Categoria actualizado con éxito");
                Nombre.contentEditable = Descripcion.contentEditable = false;
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

function eliminarCategoria(id) {
    if (!confirm("¿Estás seguro de eliminar este categoria?")) return;

    
    fetch("../../controllers/php/categoria.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "eliminarCategoria", IdCategoria: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Categoria eliminado con éxito");
            cargarCategoria(); // Recargar lista después de eliminar
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => console.error("Error en fetch:", error));
}
// Cargar Categoria cuando se carga la página
document.addEventListener("DOMContentLoaded", cargarCategoria);
