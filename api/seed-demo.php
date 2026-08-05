<?php
// One-off CLI seeder: php api/seed-demo.php
// Populates sample Portfolio items and Articles so the dashboard/landing
// page isn't empty during development or a demo. Safe to re-run — it skips
// seeding whichever table already has rows.

$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_NAME = getenv('DB_NAME') ?: 'adilabs_hero';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';

$pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));

$admin = $pdo->query("SELECT id FROM users ORDER BY id ASC LIMIT 1")->fetch();
if (!$admin) {
    fwrite(STDERR, "No user found — run `php api/seed.php` first to create the admin user.\n");
    exit(1);
}
$authorId = (int)$admin['id'];

function placeholder_image(string $dir, string $urlBase, string $label, string $hex): string {
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    [$r, $g, $b] = sscanf($hex, "%02x%02x%02x");

    $w = 800; $h = 500;
    $img = imagecreatetruecolor($w, $h);
    imagefilledrectangle($img, 0, 0, $w, $h, imagecolorallocate($img, $r, $g, $b));

    $textColor = imagecolorallocate($img, 255, 255, 255);
    $font = 5; // built-in GD font, no external .ttf needed
    $text = $label;
    $textWidth = imagefontwidth($font) * strlen($text);
    imagestring($img, $font, (int)(($w - $textWidth) / 2), (int)($h / 2) - 8, $text, $textColor);

    $filename = bin2hex(random_bytes(8)) . '.png';
    imagepng($img, $dir . '/' . $filename);
    return $urlBase . '/' . $filename;
}

$portfolioCount = (int)$pdo->query('SELECT COUNT(*) FROM portfolio_items')->fetchColumn();
if ($portfolioCount === 0) {
    $uploadDir = __DIR__ . '/uploads/portfolio';
    $urlBase = '/api/uploads/portfolio';

    $products = [
        ['Scan PDF Rekening Koran AI', 'Ekstraksi otomatis data mutasi rekening dari PDF bank menggunakan AI.', '0096c7'],
        ['Sistem Budget Manajemen', 'Approval berjenjang dan laporan anggaran real-time untuk enterprise.', '1565c0'],
        ['Sistem Aset Manajemen', 'Pelacakan aset, depresiasi otomatis, dan label QR Code per unit.', '0d47a1'],
        ['WhatsApp Gateway + AI', 'Notifikasi WhatsApp otomatis terintegrasi dengan AI automation.', '00838f'],
    ];

    $insertItem = $pdo->prepare('INSERT INTO portfolio_items (title, description, product_url, image_path, author_id) VALUES (?, ?, ?, ?, ?)');
    $insertImage = $pdo->prepare('INSERT INTO portfolio_images (portfolio_item_id, image_path, sort_order) VALUES (?, ?, ?)');

    foreach ($products as [$title, $desc, $color]) {
        $cover = placeholder_image($uploadDir, $urlBase, $title, $color);
        $insertItem->execute([$title, $desc, '', $cover, $authorId]);
        $itemId = (int)$pdo->lastInsertId();

        // A couple of extra gallery shots per product, for the carousel.
        foreach (['Tampilan Dashboard', 'Tampilan Laporan'] as $i => $shotLabel) {
            $shot = placeholder_image($uploadDir, $urlBase, $shotLabel, $color);
            $insertImage->execute([$itemId, $shot, $i]);
        }
    }
    echo "Seeded " . count($products) . " portfolio items (with gallery images).\n";
} else {
    echo "portfolio_items already has {$portfolioCount} rows, skipping.\n";
}

$articleCount = (int)$pdo->query('SELECT COUNT(*) FROM articles')->fetchColumn();
if ($articleCount === 0) {
    $coverDir = __DIR__ . '/uploads/articles';
    $coverUrlBase = '/api/uploads/articles';

    $articles = [
        [
            'Peluncuran Dashboard Konten Baru',
            'AdilLabs merilis dashboard CRUD untuk mengelola artikel, portofolio, dan teks landing page.',
            "Kami dengan senang hati mengumumkan peluncuran dashboard konten terbaru AdilLabs. Dashboard ini memungkinkan tim untuk mengelola artikel, portofolio produk, running text, dan teks hero landing page tanpa perlu menyentuh kode sama sekali.\n\nFitur utama meliputi editor artikel dengan status draft/terbit, upload multi-gambar untuk galeri produk, dan pengaturan teks berjalan yang bisa diurutkan ulang kapan saja.",
            'published', '0096c7',
        ],
        [
            'Tips Memilih Stack Teknologi untuk Startup',
            'Panduan singkat memilih arsitektur yang tepat sesuai tahap pertumbuhan startup Anda.',
            "Memilih stack teknologi di fase awal startup seringkali menjadi keputusan yang menentukan kecepatan iterasi produk. Berikut beberapa pertimbangan yang kami pakai saat membantu klien: mulai dari kebutuhan skalabilitas, biaya hosting, hingga ketersediaan talent di pasar.\n\nUntuk MVP, kami umumnya merekomendasikan stack yang cepat dikembangkan dan mudah di-deploy ke shared hosting maupun cloud.",
            'published', '1565c0',
        ],
        [
            'Draft: Rencana Fitur AI Automation Q3',
            'Catatan internal — belum untuk publikasi.',
            "Draft catatan rencana pengembangan fitur AI automation untuk kuartal berikutnya. Masih dalam tahap riset dan belum final.",
            'draft', '455a64',
        ],
    ];

    $insertArticle = $pdo->prepare('INSERT INTO articles (title, slug, excerpt, content, status, cover_image, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)');

    foreach ($articles as [$title, $excerpt, $content, $status, $color]) {
        $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $title), '-'));
        $cover = placeholder_image($coverDir, $coverUrlBase, $title, $color);
        $insertArticle->execute([$title, $slug, $excerpt, $content, $status, $cover, $authorId]);
    }
    echo "Seeded " . count($articles) . " articles.\n";
} else {
    echo "articles already has {$articleCount} rows, skipping.\n";
}
