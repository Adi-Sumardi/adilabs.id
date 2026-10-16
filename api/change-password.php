<?php
require __DIR__ . '/config.php';

// Harus login
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Belum login']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = json_input();
$current  = (string)($body['current_password'] ?? '');
$new_pass = (string)($body['new_password'] ?? '');

if ($current === '' || $new_pass === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Password lama dan baru wajib diisi']);
    exit;
}

if (strlen($new_pass) < 8) {
    http_response_code(422);
    echo json_encode(['error' => 'Password baru minimal 8 karakter']);
    exit;
}

// Ambil hash password saat ini dari DB
$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user || !password_verify($current, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Password lama tidak sesuai']);
    exit;
}

// Update password baru
$new_hash = password_hash($new_pass, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
$stmt->execute([$new_hash, $_SESSION['user_id']]);

echo json_encode(['message' => 'Password berhasil diubah']);
