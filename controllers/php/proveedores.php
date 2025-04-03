<?php
include_once '../../config/conexion.php'; 

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? ($input['action'] ?? null);

if (!$action) {
    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
    exit();
}

// 🔹 Registrar proveedor
if ($action === "registroProveedor") {
    if (!isset($input['NombreProveedor']) || !isset($input['TelefonoProveedor']) || !isset($input['EmailProveedor']) || !isset($input['DireccionProveedor'])) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos del proveedor']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO proveedor (Nombre, Telefono, Email, Direccion) 
                               VALUES(:Nombre, :Telefono, :Email, :Direccion)");
        $stmt->execute([
            ':Nombre' => htmlspecialchars($input['NombreProveedor']),
            ':Telefono' => htmlspecialchars($input['TelefonoProveedor']),
            ':Email' => htmlspecialchars($input['EmailProveedor']),
            ':Direccion' => htmlspecialchars($input['DireccionProveedor'])
        ]);

        echo json_encode(['success' => true, 'message' => 'Proveedor registrado con éxito']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al registrar: ' . $e->getMessage()]);
    }
    exit();
}

// 🔹 Obtener proveedores
if ($action === "obtenerProveedores") {
    try {
        $stmt = $pdo->query("SELECT IdProveedor, Nombre, Telefono, Email, Direccion FROM proveedor");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al obtener proveedores: ' . $e->getMessage()]);
    }
    exit();
}

// 🔹 Editar proveedor
if ($action === "editarProveedor") {
    try {
        $stmt = $pdo->prepare("UPDATE proveedor SET Nombre = :Nombre, Telefono = :Telefono, Email = :Email, Direccion = :Direccion WHERE IdProveedor = :Id");
        $stmt->execute([
            ':Id' => $input['IdProveedor'],
            ':Nombre' => htmlspecialchars($input['NombreProveedor']),
            ':Telefono' => htmlspecialchars($input['TelefonoProveedor']),
            ':Email' => htmlspecialchars($input['EmailProveedor']),
            ':Direccion' => htmlspecialchars($input['DireccionProveedor'])
        ]);

        echo json_encode(['success' => true, 'message' => 'Proveedor actualizado con éxito']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar: ' . $e->getMessage()]);
    }
    exit();
}


// 🔹 Eliminar proveedor
if ($action === "eliminarProveedor") {
    try {
        $stmt = $pdo->prepare("DELETE FROM proveedor WHERE IdProveedor = :Id");
        $stmt->execute([':Id' => $input['IdProveedor']]);

        echo json_encode(['success' => true, 'message' => 'Proveedor eliminado con éxito']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar: ' . $e->getMessage()]);
    }
    exit();
}

echo json_encode(['success' => false, 'message' => 'Acción desconocida']);
exit();
