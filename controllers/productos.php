<?php
include_once '../config/conexion.php'; 

header('Content-Type: application/json');

// Detectar la acción desde $_POST, JSON o $_GET
$input = json_decode(file_get_contents("php://input"), true);
$action = $_POST['action'] ?? ($input['action'] ?? ($_GET['action'] ?? null));

if (!$action) {
    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
    exit();
}

// 🔹 Registrar producto
if ($action === "registroProducto") {
    if (!isset($input['nombreProducto']) || !isset($input['descripcionProducto']) || !isset($input['precioProducto']) || !isset($input['stockProducto'])) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos del producto']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO producto (Nombre, Descripcion, Precio, Stock) VALUES(:Nombre, :Descripcion, :Precio, :Stock)");
        $stmt->execute([
            ':Nombre' => htmlspecialchars($input['nombreProducto']),
            ':Descripcion' => htmlspecialchars($input['descripcionProducto']),
            ':Precio' => htmlspecialchars($input['precioProducto']),
            ':Stock' => htmlspecialchars($input['stockProducto'])
        ]);

        echo json_encode(['success' => true, 'message' => 'Producto registrado con éxito']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al registrar: ' . $e->getMessage()]);
    }
    exit();
}

// 🔹 Obtener productos
if ($action === 'obtenerProductos') {
    try {
        $stmt = $pdo->query("SELECT IdProducto, Nombre, Descripcion, Precio, Stock FROM producto");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al obtener productos: ' . $e->getMessage()]);
    }
    exit();
}

// 🔹 Editar producto
if ($action === "editarProducto") {
    if (!isset($input['IdProducto']) || !isset($input['nombreProducto']) || !isset($input['descripcionProducto']) || !isset($input['precioProducto']) || !isset($input['stockProducto'])) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos para editar el producto']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE producto SET Nombre = :Nombre, Descripcion = :Descripcion, Precio = :Precio, Stock = :Stock WHERE IdProducto = :Id");
        $stmt->execute([
            ':Id' => $input['IdProducto'],
            ':Nombre' => htmlspecialchars($input['nombreProducto']),
            ':Descripcion' => htmlspecialchars($input['descripcionProducto']),
            ':Precio' => htmlspecialchars($input['precioProducto']),
            ':Stock' => htmlspecialchars($input['stockProducto'])
        ]);

        echo json_encode(['success' => true, 'message' => 'Producto actualizado con éxito']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar: ' . $e->getMessage()]);
    }
    exit();
}

// 🔹 Eliminar producto
if ($action === "eliminarProducto") {
    if (!isset($input['IdProducto'])) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos para eliminar el producto']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM producto WHERE IdProducto = :Id");
        $stmt->bindParam(':Id', $input['IdProducto']);
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'Producto eliminado con éxito']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar: ' . $e->getMessage()]);
    }
    exit();
}

// Si no se especifica una acción válida
echo json_encode([
    'success' => false,
    'message' => 'Acción no válida'
]);
exit();
?>