<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Ruta al archivo de base de datos SQLite
$databasePath = 'database.sqlite';

// Crear conexión a la base de datos SQLite
$conn = new PDO("sqlite:$databasePath");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Manejar las solicitudes GET, POST, PUT y DELETE
switch ($method) {
    case 'GET':
        handleGet($conn);
        break;
    case 'POST':
        handlePost($conn);
        break;
    case 'PUT':
        handlePut($conn);
        break;
    case 'DELETE':
        handleDelete($conn);
        break;
    default:
        echo json_encode(['message' => 'Método no soportado']);
        break;
}

function handleGet($conn) {
    $sql = "SELECT id, name FROM items";
    $stmt = $conn->query($sql);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['items' => $items]);
}

function handlePost($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'];

    $stmt = $conn->prepare("INSERT INTO items (name) VALUES (:name)");
    $stmt->bindParam(':name', $name);
    $stmt->execute();

    $id = $conn->lastInsertId();
    echo json_encode(['id' => $id, 'name' => $name]);
}

function handlePut($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $name = $data['name'];

    $stmt = $conn->prepare("UPDATE items SET name = :name WHERE id = :id");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    echo json_encode(['id' => $id, 'name' => $name]);
}

function handleDelete($conn) {
    $id = $_GET['id'];

    $stmt = $conn->prepare("DELETE FROM items WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    echo json_encode(['id' => $id]);
}
?>
