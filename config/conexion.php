<?php
$host = '127.0.0.1'; 
$db =  'supermercado'; 
$user = 'root';
$pass = '';  
$charset = 'utf8mb4';


$conexion = "mysql:host=$host;dbname=$db;charset=$charset"; 
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, 
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, 
];

try {
    $pdo = new PDO($conexion,$user,$pass,$options);
         //echo "Conexion exitosa a la base de datos";
} catch (PDOException $e) {
         //echo "Error en la conexión: " . $e->getMessage();
}

