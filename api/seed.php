<?php
// One-off CLI seeder: php api/seed.php
// Creates the schema (if missing) and a default admin user.

if (file_exists(__DIR__ . '/env.php')) require __DIR__ . '/env.php';

$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_NAME = getenv('DB_NAME') ?: 'adilabs_hero';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';

$pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));

$email = 'adisumardi888@gmail.com';
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);

if ($stmt->fetch()) {
    echo "Admin user already exists ({$email}).\n";
} else {
    $hash = password_hash('admin123', PASSWORD_BCRYPT);
    $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
        ->execute(['Admin AdilLabs', $email, $hash]);
    echo "Seeded admin user -> email: {$email}  password: admin123\n";
    echo "Change this password after first login.\n";
}
