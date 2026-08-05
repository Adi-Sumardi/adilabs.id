<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = json_input();
$email = trim($body['email'] ?? '');
$password = (string)($body['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Email dan password wajib diisi']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Email atau password salah']);
    exit;
}

session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['user_email'] = $user['email'];

echo json_encode([
    'id' => $user['id'],
    'name' => $user['name'],
    'email' => $user['email'],
]);
