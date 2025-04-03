<?php
include_once '../config/conexion.php';
session_start();

// Recibir y decodificar los datos JSON
$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input['action'])) {
    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
    exit();
}

$action = $input['action'];

// Manejo de registro de usuario
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

    $NuevaPassHash = password_hash($NuevaPass, PASSWORD_BCRYPT); 

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
} 
// Manejo de inicio de sesión
elseif ($action == "login") {
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
} 
// Obtener datos del perfil
elseif ($action == "getPerfil") {
    // Verificar si el usuario está autenticado
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
        exit;
    }
    
    $userId = $_SESSION['user_id'];
    
    try {
        // Obtener los datos del usuario desde la base de datos
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE IdUsuario = :id");
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo json_encode([
                'success' => true, 
                'nombre' => $user['Nombre'],
                'apellido' => $user['Apellido'],
                'email' => $user['Email'],
                'telefono' => $user['Telefono'],
                'rol' => $user['Rol']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al obtener los datos del perfil: ' . $e->getMessage()]);
    }
}
// Modificar perfil
elseif ($action == "modificar") {
    // Verificar si el usuario está autenticado
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
        exit;
    }

    if (!isset($input['nombre']) || !isset($input['apellido']) || !isset($input['email']) || !isset($input['telefono']) || !isset($input['rol'])) {
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        exit;
    }
    
    $nombre = htmlspecialchars($input['nombre']);
    $apellido = htmlspecialchars($input['apellido']);
    $email = htmlspecialchars($input['email']);
    $telefono = htmlspecialchars($input['telefono']);
    $rol = htmlspecialchars($input['rol']);
    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("UPDATE usuarios SET Nombre = :nombre, Apellido = :apellido, Email = :email, Telefono = :telefono, Rol = :rol WHERE IdUsuario = :id");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':apellido', $apellido);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':telefono', $telefono);
        $stmt->bindParam(':rol', $rol);
        $stmt->bindParam(':id', $userId);
        $stmt->execute();

        // Actualizar datos de sesión
        $_SESSION['Nombre'] = $nombre;
        $_SESSION['Rol'] = $rol;

        echo json_encode(['success' => true, 'message' => 'Usuario modificado exitosamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al modificar el usuario: ' . $e->getMessage()]);
    }
} 
// Cerrar sesión
elseif ($action == "cerrarSesion") {
    // Destruir la sesión
    session_unset();
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Sesión cerrada correctamente']);
} 
// Acción no válida
else {
    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}
?>