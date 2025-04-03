<?php
include_once '../../config/conexion.php';
session_start();

$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input['action'])) {
    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
    exit();
}

$action = $input['action'];

if ($action == "registro") {
    if (!isset($input['NuevoNombre']) || !isset($input['NuevoApellido']) || !isset($input['NuevoCorreo']) || !isset($input['NuevoTelefono']) || !isset($input['NuevoRol']) || !isset($input['NuevaPass'])) {
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        exit();
    }

    $NuevoNombre = htmlspecialchars($input['NuevoNombre']);
    $NuevoApellido = htmlspecialchars($input['NuevoApellido']);
    $NuevoCorreo = htmlspecialchars($input['NuevoCorreo']);
    $NuevoTelefono = htmlspecialchars($input['NuevoTelefono']);
    $NuevoRol = htmlspecialchars($input['NuevoRol']);
    $NuevaPass = htmlspecialchars($input['NuevaPass']);

    $NuevaPassHash = password_hash($NuevaPass, PASSWORD_BCRYPT); // Para encriptar la contraseña

    try {
        $stmt = $pdo->prepare("INSERT INTO usuarios (Nombre, Apellido, Email, Telefono, Rol, pass) VALUES(:Nombre, :Apellido, :Email, :Telefono, :Rol, :pass)");
        $stmt->bindParam(':Nombre', $NuevoNombre);
        $stmt->bindParam(':Apellido', $NuevoApellido);
        $stmt->bindParam(':Email', $NuevoCorreo);
        $stmt->bindParam(':Telefono', $NuevoTelefono);
        $stmt->bindParam(':Rol', $NuevoRol);
        $stmt->bindParam(':pass', $NuevaPassHash);
        $stmt->execute();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(['success' => false, 'message' => 'El Nombre o correo ya está registrado']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar: ' . $e->getMessage()]);
        }
    }
} elseif ($action == "login") {
    if (!isset($input['Nombre']) || !isset($input['pass'])) {
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        exit();
    }

    $Nombre = htmlspecialchars($input['Nombre']);
    $pass = htmlspecialchars($input['pass']);

    try {
        $stmt = $pdo->prepare("SELECT IdUsuario, Nombre, pass, Rol FROM usuarios WHERE Nombre = :Nombre");
        $stmt->bindParam(':Nombre', $Nombre);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $storedpass = $user['pass'];

            if (password_verify($pass, $storedpass)) {
                $_SESSION['user_id'] = $user['IdUsuario'];
                $_SESSION['Nombre'] = $user['Nombre'];
                $_SESSION['Rol'] = $user['Rol'];

                echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso', 'rol' => $user['Rol']]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Nombre o contraseña incorrectos']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Nombre no encontrado']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al iniciar sesión: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}
?>