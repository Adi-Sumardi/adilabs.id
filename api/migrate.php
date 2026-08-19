<?php
// One-off CLI migration: php api/migrate.php
// Brings an existing (already-seeded) database up to date with schema.sql
// changes that plain `CREATE TABLE IF NOT EXISTS` can't apply retroactively —
// i.e. new columns on tables that already exist. Safe to run multiple times.

if (file_exists(__DIR__ . '/env.php')) require __DIR__ . '/env.php';

$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_NAME = getenv('DB_NAME') ?: 'adilabs_hero';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';

$pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

function column_exists(PDO $pdo, string $table, string $column): bool {
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?'
    );
    $stmt->execute([$table, $column]);
    return (int)$stmt->fetchColumn() > 0;
}

// Make sure any table added since the last deploy exists at all (harmless
// no-op if it's already there).
$pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));

if (!column_exists($pdo, 'portfolio_items', 'tech_stack')) {
    $pdo->exec("ALTER TABLE portfolio_items ADD COLUMN tech_stack VARCHAR(500) DEFAULT '' AFTER product_url");
    echo "Added portfolio_items.tech_stack\n";
} else {
    echo "portfolio_items.tech_stack already present\n";
}

if (!column_exists($pdo, 'portfolio_images', 'kind')) {
    $pdo->exec("ALTER TABLE portfolio_images ADD COLUMN kind ENUM('screenshot','diagram') NOT NULL DEFAULT 'screenshot' AFTER image_path");
    echo "Added portfolio_images.kind (existing rows default to 'screenshot')\n";
} else {
    echo "portfolio_images.kind already present\n";
}

echo "Migration complete.\n";
