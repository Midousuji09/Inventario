function crearProducto() {
    const nombreProducto = document.getElementById("nombreProducto").value;
    const descripcionProducto = document.getElementById("descripcionProducto").value;
    const precioProducto = document.getElementById("precioProducto").value;
    const stockProducto = document.getElementById("stockProducto").value;

    // Validar que los campos no estén vacíos
    if (!nombreProducto || !descripcionProducto || !precioProducto || !stockProducto) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Enviar los datos al servidor
    fetch("../controllers/productos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "registroProducto",
            nombreProducto,
            descripcionProducto,
            precioProducto,
            stockProducto
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Producto registrado con éxito.");
            // Opcional: Cerrar el modal después de registrar
            const modal = bootstrap.Modal.getInstance(document.getElementById("FormProduc"));
            modal.hide();
            // Recargar la lista de productos
            cargarProductos();
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error al registrar el producto:", error);
        alert("Ocurrió un error al registrar el producto.");
    });
}

function cargarProductos() {
    fetch("../controllers/productos.php?action=obtenerProductos")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tabla = document.querySelector("#listaProductos");
                tabla.innerHTML = ""; // Limpiar antes de insertar nuevos datos

                data.data.forEach(producto => {
                    let fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${producto.IdProducto}</td>
                        <td>${producto.Nombre}</td>
                        <td>${producto.Descripcion}</td>
                        <td>${producto.Precio}</td>
                        <td>${producto.Stock}</td>
                        <td>${producto.Categoria || 'Sin categoría'}</td>
                        <td>${producto.Proveedor || 'Sin proveedor'}</td>
                        <td>
                            <button onclick="editarProducto(${producto.IdProducto}, this)" class="btn btn-warning btn-sm">✏️ Editar</button>
                            <button onclick="eliminarProducto(${producto.IdProducto})" class="btn btn-danger btn-sm">🗑️ Eliminar</button>
                        </td>
                    `;
                    tabla.appendChild(fila);
                });
            } else {
                console.error("Error al obtener productos:", data.message);
            }
        })
        .catch(error => console.error("Error en fetch:", error));
}

// Cargar productos cuando se carga la página
// Cargar productos cuando se carga la página
document.addEventListener("DOMContentLoaded", cargarProductos);

function editarProducto(id, boton) {
    let fila = boton.parentNode.parentNode; // Obtener la fila del producto
    let Nombre = fila.cells[1];
    let Descripcion = fila.cells[2];
    let Precio = fila.cells[3];
    let Stock = fila.cells[4];

    if (boton.textContent === "✏️ Editar") {
        // Habilitar la edición
        Nombre.contentEditable = Descripcion.contentEditable = Precio.contentEditable = Stock.contentEditable = true;
        boton.textContent = "💾 Guardar";
        boton.classList.remove("btn-editar");
        boton.classList.add("btn-guardar");
    } else {
        // Guardar los cambios
        let nombreProducto = Nombre.textContent.trim();
        let descripcionProducto = Descripcion.textContent.trim();
        let precioProducto = Precio.textContent.trim();
        let stockProducto = Stock.textContent.trim();

        fetch("../controllers/productos.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "editarProducto",
                IdProducto: id,
                nombreProducto,
                descripcionProducto,
                precioProducto,
                stockProducto
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Producto actualizado con éxito");
                // Deshabilitar la edición
                Nombre.contentEditable = Descripcion.contentEditable = Precio.contentEditable = Stock.contentEditable = false;
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


function eliminarProducto(id) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    fetch("../controllers/productos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "eliminarProducto", IdProducto: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Producto eliminado con éxito");
            cargarProductos(); // Recargar la lista después de eliminar
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => console.error("Error en fetch:", error));
}