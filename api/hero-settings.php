<?php
require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT heading_prefix FROM hero_settings WHERE id = 1');
    $row = $stmt->fetch();
    echo json_encode(['heading_prefix' => $row['heading_prefix'] ?? 'We Build']);
    exit;
}

if ($method === 'PUT') {
    require_auth();
    $body = json_input();
    $prefix = trim($body['heading_prefix'] ?? '');
    if ($prefix === '') {
        http_response_code(422);
        echo json_encode(['error' => 'Teks heading wajib diisi']);
        exit;
    }
    $pdo->prepare('INSERT INTO hero_settings (id, heading_prefix) VALUES (1, ?) ON DUPLICATE KEY UPDATE heading_prefix = ?')
        ->execute([$prefix, $prefix]);
    echo json_encode(['heading_prefix' => $prefix]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
