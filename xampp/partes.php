<?php
header('Content-Type: application/json');

try {
    // Asegúrate de que la ruta a la base de datos SQLite sea correcta
    $db = new PDO('sqlite:./database.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Crear la tabla si no existe
    $db->exec("CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )");

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            $stmt = $db->query('SELECT * FROM items');
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['items' => $items]);
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            $name = $input['name'];
            $stmt = $db->prepare('INSERT INTO items (name) VALUES (:name)');
            $stmt->bindParam(':name', $name);
            $stmt->execute();
            $id = $db->lastInsertId();
            echo json_encode(['id' => $id, 'name' => $name]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
