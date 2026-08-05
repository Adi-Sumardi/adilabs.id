<?php
// One-off CLI seeder: php api/seed-content.php
// Populates hero_settings + content_lists with the site's original defaults,
// so the dashboard-editable content starts out matching what's already live.

if (file_exists(__DIR__ . '/env.php')) require __DIR__ . '/env.php';

$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_NAME = getenv('DB_NAME') ?: 'adilabs_hero';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';

$pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));

$pdo->exec("INSERT IGNORE INTO hero_settings (id, heading_prefix) VALUES (1, 'We Build')");

$rotatingWords = ['Mobile Apps', 'Website', 'Landing Page', 'Mail Engine', 'WhatsApp Gateway'];
$marqueeItems = [
    'AI Custom',
    'Scan PDF Rekening Koran AI',
    'Dashboard Kolaborasi',
    'Sistem Budget Manajemen + Approval + Report Budget',
    'Sistem Aset Manajemen + Aset Depreciation + Aset QRCode',
    'Sistem Activity Mahasiswa',
    'Sistem Mail Engine untuk notifikasi email',
    'Sistem WhatsApp Gateway untuk notifikasi WhatsApp + AI Automation',
    'Sistem Notulensi Rapat + Followup + Undangan Digital',
];

$count = $pdo->query("SELECT COUNT(*) FROM content_lists WHERE list_type = 'rotating_word'")->fetchColumn();
if ($count == 0) {
    $stmt = $pdo->prepare('INSERT INTO content_lists (list_type, text, sort_order) VALUES (?, ?, ?)');
    foreach ($rotatingWords as $i => $word) {
        $stmt->execute(['rotating_word', $word, $i]);
    }
    echo "Seeded " . count($rotatingWords) . " rotating words.\n";
} else {
    echo "rotating_word list already has {$count} rows, skipping.\n";
}

$count = $pdo->query("SELECT COUNT(*) FROM content_lists WHERE list_type = 'marquee_item'")->fetchColumn();
if ($count == 0) {
    $stmt = $pdo->prepare('INSERT INTO content_lists (list_type, text, sort_order) VALUES (?, ?, ?)');
    foreach ($marqueeItems as $i => $item) {
        $stmt->execute(['marquee_item', $item, $i]);
    }
    echo "Seeded " . count($marqueeItems) . " marquee items.\n";
} else {
    echo "marquee_item list already has {$count} rows, skipping.\n";
}
